# Google Sheets + Apps Script Integration Guide

## Overview

The system uses **1 Google Spreadsheet** with 2 tabs and **1 Apps Script project** with 3 `.gs` files:

| Tab | Purpose |
|-----|---------|
| `guests` | Guest list — fetched at build time |
| `rsvp` | Attendance confirmations — read/written at runtime |

| Apps Script file | Contents |
|-----------------|---------|
| `Code.gs` | Entry point: `doGet`, `doPost`, helper `json()` |
| `guests.gs` | Handler `getGuests()` |
| `rsvp.gs` | Handlers `getRsvp()`, `postRsvp()` |

**Single deployment URL** — routing via query param `?sheet=` and body field `sheet:`.

---

## Part 1 — Create Spreadsheet and Tabs

### 1.1 Create the spreadsheet

1. Go to [sheets.google.com](https://sheets.google.com) → **Blank spreadsheet**
2. Name the file: `Wedding`

### 1.2 `guests` tab

1. Right-click the default `Sheet1` tab → **Rename** → type `guests`
2. Enter headers in **row 1**:

| A | B | C |
|---|---|---|
| `name` | `slug` | `image` |

3. Enter guest data from row 2 onwards:

| A (name) | B (slug) | C (image) |
|----------|----------|-----------|
| Anh Tu | anhtu | /guests/anh-tu.svg |
| Thu Ha | thuha | |
| Minh Khoa | minhkhoa | /guests/minh-khoa.jpg |
| Family Hung | giadinhhung | |

> **Slug rules**: lowercase `a–z`, digits `0–9`, hyphens `-` only. No accents, no spaces.
> The slug must match the invite URL: `https://yourdomain.com?g=<slug>`.

### 1.3 `rsvp` tab

1. Click **`+`** at the bottom tab bar → new tab appears
2. Right-click the new tab → **Rename** → type `rsvp`
3. Enter headers in **row 1**:

| A | B | C | D | E |
|---|---|---|---|---|
| `submittedAt` | `slug` | `name` | `eventDaiKhach` | `eventThanhHon` |

> No data entry needed — the script appends a row automatically when a guest submits the form.

---

## Part 2 — Create the Apps Script Project

### 2.1 Open Apps Script

From the `Wedding` spreadsheet:
1. Menu **Extensions → Apps Script**
2. A new tab opens with 1 default file: `Code.gs`

### 2.2 Create 3 files

Currently only `Code.gs` exists. Add 2 more:

1. Click **`+`** next to "Files" in the left panel → **Script**
2. Type: `guests` → Enter → `guests.gs` is created
3. Repeat → type: `rsvp` → `rsvp.gs` is created

Left panel result:
```
📄 Code.gs
📄 guests.gs
📄 rsvp.gs
```

### 2.3 `Code.gs` contents

Click `Code.gs`, **delete all** default code, paste:

```javascript
// Code.gs — Single entry point: doGet, doPost, and json() helper

function doGet(e) {
  var sheetParam = e && e.parameter && e.parameter.sheet;

  if (sheetParam === 'guests') return getGuests();
  if (sheetParam === 'rsvp')   return getRsvp(e.parameter.slug);

  return json({ status: 'error', message: 'Missing ?sheet=guests|rsvp' });
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents);

  if (data.sheet === 'rsvp') return postRsvp(data);

  return json({ status: 'error', message: 'Missing sheet: "rsvp" in body' });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### 2.4 `guests.gs` contents

Click `guests.gs`, **delete all** default code, paste:

```javascript
// guests.gs — Read guest list from 'guests' tab

var GUEST_SHEET = 'guests';

function getGuests() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(GUEST_SHEET);
  var rows = sheet.getDataRange().getValues();
  var data = rows.slice(1); // skip header row

  var guests = data
    .filter(function(row) { return row[1]; }) // skip rows without slug
    .map(function(row) {
      return {
        name:  row[0],
        slug:  String(row[1]).trim().toLowerCase(),
        image: row[2] || null,
      };
    });

  return json({ guests: guests });
}
```

### 2.5 `rsvp.gs` contents

Click `rsvp.gs`, **delete all** default code, paste:

```javascript
// rsvp.gs — Read and write RSVP data from 'rsvp' tab

var RSVP_SHEET = 'rsvp';

// GET: return the most recent RSVP for a given slug
function getRsvp(slug) {
  if (!slug) {
    return json({ status: 'error', message: 'Missing slug' });
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(RSVP_SHEET);
  var rows = sheet.getDataRange().getValues();

  // Scan from the end to get the latest submission
  var result = null;
  for (var i = rows.length - 1; i >= 1; i--) {
    if (rows[i][1] === slug) {
      result = {
        submittedAt:   rows[i][0],
        slug:          rows[i][1],
        name:          rows[i][2],
        eventDaiKhach: rows[i][3] === true || rows[i][3] === 'TRUE',
        eventThanhHon: rows[i][4] === true || rows[i][4] === 'TRUE',
      };
      break;
    }
  }

  return json({ status: 'success', data: result });
}

// POST: append a new RSVP row to the sheet
function postRsvp(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(RSVP_SHEET);

  sheet.appendRow([
    new Date().toISOString(),
    data.slug || '',
    data.name,
    data.eventDaiKhach,
    data.eventThanhHon,
  ]);

  return json({ status: 'success' });
}
```

---

## Part 3 — Deploy Apps Script

### 3.1 Deployment steps

1. Click **Deploy** (top right) → **New deployment**
2. Click the gear icon ⚙ next to "Select type" → choose **Web app**
3. Fill in the details:
   - **Description**: `Wedding App Script v1`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
4. Click **Deploy**
5. Google prompts authorization → click **Authorize access** → select your Google account → **Allow**
6. After successful deploy → **copy the URL** (format: `https://script.google.com/macros/s/.../exec`)

### 3.2 Save URL to environment

The deployment URL is a **single URL** used for both guests and RSVP. Add to `.env.local`:

```bash
NEXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/<ID>/exec
```

> ⚠️ **Do not commit `.env.local` to git.** It is already in `.gitignore`.

Add to Vercel:
- Dashboard → Project → Settings → **Environment Variables**
- Key: `NEXT_PUBLIC_APPS_SCRIPT_URL`, Value: the URL above
- Environments: Production, Preview, Development

---

## Part 4 — Test and Verify

### 4.1 Test GET guests

Open in browser:

```
https://script.google.com/macros/s/<ID>/exec?sheet=guests
```

Expected response:
```json
{"guests":[{"name":"Anh Tu","slug":"anhtu","image":"/guests/anh-tu.svg"},{"name":"Thu Ha","slug":"thuha","image":null}]}
```

### 4.2 Run fetch script

```bash
pnpm fetch-guests
# Expected: ✓ Wrote 4 guests to lib/guests-generated.json
```

Then commit:
```bash
git add lib/guests-generated.json
git commit -m "chore: update guest list from sheet"
git push
# → Vercel auto-deploys
```

### 4.3 Test GET rsvp

```
https://script.google.com/macros/s/<ID>/exec?sheet=rsvp&slug=anhtu
```

Expected (no prior submission):
```json
{"status":"success","data":null}
```

### 4.4 Test POST rsvp

```bash
curl -L -X POST \
  "https://script.google.com/macros/s/<ID>/exec" \
  -H "Content-Type: application/json" \
  -d '{"sheet":"rsvp","slug":"anhtu","name":"Anh Tu","eventDaiKhach":true,"eventThanhHon":true}'

# Expected:
{"status":"success"}
```

> After the POST, open the `rsvp` tab in the spreadsheet — a new row should appear.

Call GET again to verify pre-fill works:
```
https://script.google.com/macros/s/<ID>/exec?sheet=rsvp&slug=anhtu
```
```json
{"status":"success","data":{"submittedAt":"...","slug":"anhtu","name":"Anh Tu","eventDaiKhach":true,"eventThanhHon":true}}
```

---

## Part 5 — Update Guest List (adding new guests)

```bash
# 1. Add the guest to the 'guests' tab in the spreadsheet (name, slug, image)

# 2. Run the fetch script
pnpm fetch-guests
# → ✓ Wrote N guests to lib/guests-generated.json

# 3. (Optional) Add a personalised message in lib/guests.ts
# Find GUEST_MESSAGES and add a new entry:
# minhkhoa: 'Looking forward to seeing you!',

# 4. Commit and push
git add lib/guests-generated.json lib/guests.ts
git commit -m "chore: add new guest minhkhoa"
git push
# → Vercel auto-deploys with updated guest data
```

---

## Part 6 — Update Apps Script (after code changes)

After modifying any `.gs` file:

1. Go to the Apps Script editor
2. Click **Deploy** → **Manage deployments**
3. Find the current deployment → click **Edit** (pencil icon ✏)
4. **Version** → select **New version**
5. Click **Deploy**

> The deployment URL **does not change** — no need to update env vars.

---

## Part 7 — Final Checklist

### Spreadsheet setup
- [ ] Create spreadsheet `Wedding`
- [ ] Tab `guests`: headers `name | slug | image`, enter guest list
- [ ] Tab `rsvp`: headers `submittedAt | slug | name | eventDaiKhach | eventThanhHon`

### Apps Script
- [ ] Open Apps Script from the spreadsheet
- [ ] Create `guests.gs` and `rsvp.gs` (in addition to the default `Code.gs`)
- [ ] Paste code into all 3 files exactly as documented above
- [ ] Deploy → choose **Web app**, Execute as **Me**, Access **Anyone**
- [ ] Copy deployment URL

### Environment variables
- [ ] Set `NEXT_PUBLIC_APPS_SCRIPT_URL=<url>` in `.env.local`
- [ ] Set `NEXT_PUBLIC_APPS_SCRIPT_URL=<url>` in Vercel Environment Variables

### Verify
- [ ] `?sheet=guests` → returns JSON guest list
- [ ] `pnpm fetch-guests` → `lib/guests-generated.json` is written
- [ ] `?sheet=rsvp&slug=anhtu` → `{"status":"success","data":null}`
- [ ] Submit RSVP form on site with `?g=anhtu` → new row in `rsvp` sheet
- [ ] Reopen `/?g=anhtu` → form pre-fills correctly with name and checkboxes
