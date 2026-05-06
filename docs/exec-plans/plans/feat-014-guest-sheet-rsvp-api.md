# ExecPlan: feat-014 — Guest Sheet + RSVP API (GET/POST with Slug)

## Purpose / Big Picture

Guests are currently hard-coded in `lib/guests.ts`. This plan migrates guest data to a Google Sheet and adds a build-time Node.js script that fetches the sheet and writes `lib/guests-generated.json`. The RSVP system gains a second Apps Script (separate deployment) that stores RSVP submissions **with slug**, exposing both `GET ?slug=xxx` (fetch last RSVP for a guest) and the existing `POST` (append new row). When a guest visits `/?g=slug`, the RSVP form pre-loads their previous response (if any) so they see their own status.

User-observable behaviour after this feature:
1. A new guest is added to the `guests` sheet → run `pnpm fetch-guests` → push → Vercel redeploys with updated guest data.
2. Guest visits `/?g=anhtu` → RSVP form fetches previous response and shows it pre-filled (or empty if first visit).
3. Guest submits RSVP → stored in `rsvp` sheet with their slug, name, event selections, and timestamp.
4. Guest with no slug visits `/` → RSVP form is empty, works normally (no pre-fill attempt).

---

## Scope

### In Scope

- `scripts/fetch-guests.ts` — new build-time script: fetch `GUEST_SCRIPT_URL`, write `lib/guests-generated.json`
- `lib/guests-generated.json` — generated file, committed to repo
- `lib/guests.ts` — extend to export from `guests-generated.json` (replace hardcoded map)
- `lib/api.ts` — add `getRsvp(slug)` and update `submitRsvp` to include `slug` in payload
- `components/rsvp/rsvp-form.tsx` — accept optional `slug` prop; on mount, call `getRsvp(slug)` and pre-fill form
- `app/page.tsx` — pass `slug` (from `searchParams.g`) into `<RsvpSection>` → `<RsvpForm>`
- `components/rsvp/rsvp-section.tsx` — accept and forward `slug` prop
- `package.json` — add `"fetch-guests": "tsx scripts/fetch-guests.ts"` script
- `.env.example` — add `GUEST_SCRIPT_URL`, `NEXT_PUBLIC_RSVP_SCRIPT_URL`
- `docs/product-specs/feat-014-guest-sheet-rsvp-api.md` — Apps Script snippets + deployment guide
- `harness/features/feat-014-guest-sheet-rsvp-api.json` — new feature record
- `harness/feature_index.json` — add feat-014 entry
- `harness/progress.md` — session log update
- `docs/exec-plans/index.md` — add active plan entry

### Out of Scope

- Auth on guest list endpoint (URL-as-secret via env is sufficient)
- Automatic Vercel trigger on Google Sheet change (deferred)
- Admin UI for managing guests
- Editing/deleting past RSVP rows (append-only)
- QR code generation per guest
- Modifying the existing `NEXT_PUBLIC_APPS_SCRIPT_URL` deployment

---

## Env Vars

| Variable | Used where | Required |
|---|---|---|
| `GUEST_SCRIPT_URL` | `scripts/fetch-guests.ts` (build-time only, NOT `NEXT_PUBLIC_`) | For fetch script |
| `NEXT_PUBLIC_RSVP_SCRIPT_URL` | `lib/api.ts` runtime GET+POST | For slug-aware RSVP |
| `NEXT_PUBLIC_APPS_SCRIPT_URL` | `lib/api.ts` (existing POST fallback) | Keep existing |

---

## Google Sheets Structure

### Sheet 1: `guests`

| A | B | C |
|---|---|---|
| name | slug | image |
| Anh Tú | anhtu | /guests/anh-tu.svg |
| Thu Hà | thuha | |

### Sheet 2: `rsvp` (extended from current)

| A | B | C | D | E |
|---|---|---|---|---|
| submittedAt | slug | name | eventDaiKhach | eventThanhHon |

---

## AppScript Contracts

### AppScript 1: Guest List (GET only)

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

Deploy: Execute as **Me**, access **Anyone**. URL → `GUEST_SCRIPT_URL`.

### AppScript 2: RSVP with Slug (GET + POST)

```javascript
function doGet(e) {
  const slug = e?.parameter?.slug;
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
    data.slug ?? '',
    data.name,
    data.eventDaiKhach,
    data.eventThanhHon,
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

Deploy: Execute as **Me**, access **Anyone**. URL → `NEXT_PUBLIC_RSVP_SCRIPT_URL`.

---

## Plan of Work (Narrative)

### Step 1 — Product spec doc

Create `docs/product-specs/feat-014-guest-sheet-rsvp-api.md` with AppScript snippets, sheet layouts, deployment steps, env var table.

### Step 2 — `scripts/fetch-guests.ts`

```typescript
// scripts/fetch-guests.ts
import * as fs from 'fs'
import * as path from 'path'

type GuestRow = { name: string; slug: string; image: string | null }
type GuestScriptResponse = { guests: GuestRow[] }

async function main() {
  const url = process.env.GUEST_SCRIPT_URL
  if (!url) throw new Error('GUEST_SCRIPT_URL is not set')

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)

  const json = (await res.json()) as GuestScriptResponse

  const map: Record<string, {
    name: string
    photo?: { src: string; alt: string; width: number; height: number }
  }> = {}

  for (const g of json.guests) {
    if (!g.slug) continue
    map[g.slug.trim().toLowerCase()] = {
      name: g.name,
      ...(g.image ? {
        photo: { src: g.image, alt: `Ảnh khách mời ${g.name}`, width: 320, height: 320 }
      } : {}),
    }
  }

  const outPath = path.resolve('lib/guests-generated.json')
  fs.writeFileSync(outPath, JSON.stringify(map, null, 2) + '\n')
  console.log(`✓ Wrote ${Object.keys(map).length} guests to lib/guests-generated.json`)
}

main().catch((err) => { console.error(err); process.exit(1) })
```

> Note: `message` stays in code overrides in `lib/guests.ts`, not in sheet.

### Step 3 — `lib/guests.ts` migration

- Import `generatedGuests` from `./guests-generated.json`.
- Define `GUEST_OVERRIDES` (name overrides + message per slug) as hardcoded const.
- Merge: `GUESTS = { ...generatedGuests, ...GUEST_OVERRIDES }` with message merged per key.
- All existing exports (`GuestId`, `GuestData`, `GuestMap`, `getGuestById`) unchanged.
- Fallback: if JSON file missing → `{}` (so fresh clone builds without env).

### Step 4 — `lib/api.ts` additions

Add `getRsvp` function and `RsvpGetResponse` type. Update `submitRsvp` to accept `slug?: string` and include in payload. Falls back to `NEXT_PUBLIC_APPS_SCRIPT_URL` if `NEXT_PUBLIC_RSVP_SCRIPT_URL` unset.

### Step 5 — `components/rsvp/rsvp-form.tsx`

- Add `slug?: string` prop.
- `useEffect([slug])`: if slug defined → call `getRsvp(slug)` → if data non-null → `setForm(data)`.
- Show subtle loading state on name input during GET.
- Pass `slug` to `submitRsvp`.
- GET failure = silent (no error banner).

### Step 6 — `components/rsvp/rsvp-section.tsx`

Accept and forward `slug?: string`.

### Step 7 — `app/page.tsx`

Pass `slug` from `searchParams.g` to `<RsvpSection>`.

### Step 8 — `package.json` + deps

Add `"fetch-guests": "tsx scripts/fetch-guests.ts"`. Add `tsx` to devDependencies if not present.

### Step 9 — `.env.example`

```
GUEST_SCRIPT_URL=<apps-script-guest-get-url>
NEXT_PUBLIC_RSVP_SCRIPT_URL=<apps-script-rsvp-get-post-url>
```

### Step 10 — Harness + docs

Create feat-014 feature JSON, update feature_index.json, exec-plans/index.md, progress.md.

---

## Progress Checklist

- [ ] `docs/product-specs/feat-014-guest-sheet-rsvp-api.md`
- [ ] `scripts/fetch-guests.ts`
- [ ] `lib/guests-generated.json` (initial sample committed)
- [ ] `lib/guests.ts` migration
- [ ] `lib/api.ts` — `getRsvp` + updated `submitRsvp`
- [ ] `components/rsvp/rsvp-form.tsx` — `slug` prop + pre-fill
- [ ] `components/rsvp/rsvp-section.tsx` — forward `slug`
- [ ] `app/page.tsx` — pass `slug`
- [ ] `package.json` — `fetch-guests` script + `tsx` dep
- [ ] `.env.example` — new vars
- [ ] `harness/features/feat-014-guest-sheet-rsvp-api.json`
- [ ] `harness/feature_index.json` update
- [ ] `docs/exec-plans/index.md` update
- [ ] `pnpm lint && pnpm typecheck && pnpm build` — all pass
- [ ] `harness/progress.md` — session log

---

## Concrete Commands

```bash
# From repo root

# Add tsx if not present
pnpm add -D tsx

# Run fetch script (requires .env.local with GUEST_SCRIPT_URL)
pnpm fetch-guests
# Expected: ✓ Wrote N guests to lib/guests-generated.json

# Verify
pnpm lint
pnpm typecheck
pnpm build
./init.sh
```

---

## Validation and Acceptance

| Scenario | Expected |
|---|---|
| `/?g=anhtu` (slug has prior RSVP) | Form pre-filled name + checkboxes |
| `/?g=anhtu` (slug no prior RSVP) | Form empty, works normally |
| `/` (no slug) | Form empty, POST has no slug field |
| GET fails (network) | Form empty, no error banner |
| `pnpm fetch-guests` with valid URL | `lib/guests-generated.json` written |
| `pnpm fetch-guests` with no env var | Exit 1 with error message |
| `pnpm build` (no GUEST_SCRIPT_URL) | Build succeeds (file already committed) |

---

## Idempotence & Recovery

- `scripts/fetch-guests.ts` overwrites output file each run — safe to re-run.
- If `lib/guests-generated.json` absent, `lib/guests.ts` returns `{}` — no build error.
- RSVP GET failure caught silently — no user impact.
- Existing `NEXT_PUBLIC_APPS_SCRIPT_URL` POST continues to work if new env var not set.

---

## Decision Log

- **Keep `message` in code**: Personalised Vietnamese copy is dev-owned, not suitable for sheet cells.
- **Commit `guests-generated.json`**: Vercel uses the committed file at build; no runtime env needed for guest data at Vercel.
- **New AppScript for slug RSVP**: Avoids touching live production endpoint; existing guests unaffected.

---

## Surprises & Discoveries

_(Fill during implementation)_

---

## Outcomes & Retrospective

_(Fill after implementation)_
