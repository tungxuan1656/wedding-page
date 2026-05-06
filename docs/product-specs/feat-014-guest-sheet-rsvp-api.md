# feat-014: Guest Sheet + RSVP API (GET/POST with Slug) — Product Spec & Deployment Guide

## Overview

Guest data is fetched from a Google Sheet at build time and stored as `lib/guests-generated.json`.
A second Apps Script deployment provides slug-aware RSVP: `GET ?slug=xxx` returns the last submission for that guest; `POST` appends a new row. When a guest visits `/?g=<slug>`, the RSVP form pre-fills their previous response.

---

## Env Vars

| Variable | Scope | Purpose |
|---|---|---|
| `GUEST_SCRIPT_URL` | Build-time only (no `NEXT_PUBLIC_` prefix) | Guest list AppScript GET URL |
| `NEXT_PUBLIC_RSVP_SCRIPT_URL` | Runtime (client) | Slug-aware RSVP AppScript GET+POST URL |
| `NEXT_PUBLIC_APPS_SCRIPT_URL` | Runtime (client, existing) | Fallback POST-only RSVP URL |

---

## Google Sheets Structure

### Sheet 1: `guests`

| A | B | C |
|---|---|---|
| name | slug | image |
| Anh Tú | anhtu | /guests/anh-tu.svg |
| Thu Hà | thuha | |

Row 1 = header. Script skips header row.

### Sheet 2: `rsvp` (slug-aware)

| A | B | C | D | E |
|---|---|---|---|---|
| submittedAt | slug | name | eventDaiKhach | eventThanhHon |

Row 1 = header. Append-only. GET returns last row matching `slug`.

---

## Apps Script 1: Guest List (GET only)

Create a new Apps Script project attached to the `guests` sheet.

```javascript
function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const rows = sheet.getDataRange().getValues();
  const [, ...data] = rows; // skip header row

  const guests = data.map((row) => ({
    name: row[0],
    slug: row[1],
    image: row[2] || null,
  }));

  return ContentService
    .createTextOutput(JSON.stringify({ guests }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### Deployment

1. Open the `guests` Google Sheet.
2. **Extensions → Apps Script**.
3. Replace default code with the snippet above.
4. **Deploy → New deployment → Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the deployment URL.
6. Set `GUEST_SCRIPT_URL=<deployment-url>` in `.env.local` (never commit this value).

---

## Apps Script 2: Slug-Aware RSVP (GET + POST)

Create a new Apps Script project attached to the `rsvp` sheet.

```javascript
function doGet(e) {
  const slug = e && e.parameter && e.parameter.slug;
  if (!slug) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: 'Missing slug' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const rows = sheet.getDataRange().getValues();

  let result = null;
  for (let i = rows.length - 1; i >= 1; i--) {
    if (rows[i][1] === slug) {
      result = {
        submittedAt: rows[i][0],
        slug: rows[i][1],
        name: rows[i][2],
        eventDaiKhach: rows[i][3] === true || rows[i][3] === 'true',
        eventThanhHon: rows[i][4] === true || rows[i][4] === 'true',
      };
      break;
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'success', data: result }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date().toISOString(),
    data.slug || '',
    data.name,
    data.eventDaiKhach,
    data.eventThanhHon,
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### Deployment

1. Open the `rsvp` Google Sheet.
2. **Extensions → Apps Script**.
3. Replace default code with the snippet above.
4. **Deploy → New deployment → Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the deployment URL.
6. Set `NEXT_PUBLIC_RSVP_SCRIPT_URL=<deployment-url>` in Vercel env vars and `.env.local`.

> **Note**: The existing `NEXT_PUBLIC_APPS_SCRIPT_URL` deployment (POST-only, no slug) continues to work as a fallback. No changes needed to that deployment.

---

## Build-Time Guest Fetch Workflow

```bash
# 1. Ensure .env.local has GUEST_SCRIPT_URL set
# 2. Run fetch script
pnpm fetch-guests
# Expected: ✓ Wrote N guests to lib/guests-generated.json

# 3. Commit the generated file
git add lib/guests-generated.json
git commit -m "chore: update guest list"

# 4. Push → Vercel auto-deploys
git push
```

When a new guest is added to the sheet: repeat steps 2–4.

---

## Acceptance Verification

```bash
pnpm lint
pnpm typecheck
pnpm build
./init.sh
```

Manual checks:
1. `/?g=<slug>` → RSVP form pre-filled if prior submission exists.
2. `/?g=<slug>` (no prior submission) → form empty, submits normally.
3. `/` (no slug) → form empty, POST has no slug.
4. `pnpm fetch-guests` with valid URL → `lib/guests-generated.json` written.
5. `pnpm fetch-guests` with missing `GUEST_SCRIPT_URL` → exits with error message.
