# ExecPlan: feat-017 — Add to Calendar Button

## Title

Add a "Thêm vào lịch" button in `EventDetailsSection` that opens a Google Calendar deeplink pre-filled with the wedding event.

---

## Purpose / Big Picture

Guests viewing the event details section will see a "Thêm vào lịch" (Add to Calendar) button below the calendar widget.  
Clicking it opens a new browser tab directly to the Google Calendar "Create Event" form, with the event title, start/end time, and Google Maps venue link pre-filled.  
No form is shown to the guest — the deeplink does all the work client-side.

**Event data (fixed):**
- Title: `Đám cưới Xuân Tùng & Vân Anh`
- Start: `2026-06-08T17:00:00` (UTC+7 → UTC: `2026-06-08T10:00:00Z`)
- End: `2026-06-09T11:45:00` (UTC+7 → UTC: `2026-06-09T04:45:00Z`)
- Location: `https://maps.app.goo.gl/xBVg6Gs3JPenCaC89`

---

## Scope

**In scope:**
- `lib/calendar.ts` — new util returning the Google Calendar deeplink URL
- `components/event/event-details-section.tsx` — add button below the `<Calendar />` widget
- `lib/i18n/vi.json` — add `events.addToCalendar` i18n key

**Out of scope:**
- iCal / `.ics` file download
- Apple Calendar or Outlook integrations
- Any state management or API calls
- Persisting user calendar choices

---

## Non-negotiable Requirements

- The plan is self-contained — all commands and context are included.
- No library added; plain URL construction only.
- Behavior is purely client-side; no network call is made by the app.
- All user-visible text goes through `lib/i18n/vi.json`.
- Matches Framer Motion animation style of the rest of the section.
- Must pass `pnpm lint`, `pnpm typecheck`, and `pnpm build`.

---

## Context and Orientation

| File | Role |
|---|---|
| `components/event/event-details-section.tsx` | Renders the "Save The Date" section with the calendar grid and event columns |
| `lib/i18n/vi.json` | All Vietnamese UI strings — `events.*` namespace is the relevant one |
| `lib/i18n/index.ts` | Exports `strings` object from `vi.json` |
| `lib/calendar.ts` | **[NEW]** Pure utility that builds the Google Calendar create-event URL |

---

## Plan of Work (Narrative)

### Step 1 — Create `lib/calendar.ts`

Add a single exported function `buildGoogleCalendarUrl()`:

```ts
export function buildGoogleCalendarUrl(): string {
  // Google Calendar format: YYYYMMDDTHHmmssZ (UTC)
  const start = '20260608T100000Z' // 17:00 ICT = 10:00 UTC
  const end   = '20260609T044500Z' // 11:45 ICT = 04:45 UTC
  const title = encodeURIComponent('Đám cưới Xuân Tùng & Vân Anh')
  const location = encodeURIComponent('https://maps.app.goo.gl/xBVg6Gs3JPenCaC89')

  return (
    `https://calendar.google.com/calendar/render` +
    `?action=TEMPLATE` +
    `&text=${title}` +
    `&dates=${start}/${end}` +
    `&location=${location}`
  )
}
```

- No parameters needed — event data is fixed.
- No external dependencies.
- Pure function, trivially testable and idempotent.

### Step 2 — Add i18n key in `lib/i18n/vi.json`

Inside the `events` object, after `"calendarDays"` add:

```json
"addToCalendar": "Thêm vào lịch"
```

### Step 3 — Add button in `event-details-section.tsx`

1. Import `buildGoogleCalendarUrl` from `@/lib/calendar`.
2. Inside the `<Calendar />` container div (the center column `order-1 lg:order-2`), render an `<a>` tag below `<Calendar />`:

```tsx
<a
  aria-label={s.addToCalendar}
  className="mt-4 inline-flex items-center gap-2 rounded-full border border-wine/30 bg-white/70 px-5 py-2 text-sm font-medium text-wine shadow-sm backdrop-blur-sm transition-colors hover:bg-wine hover:text-cream"
  href={buildGoogleCalendarUrl()}
  rel="noopener noreferrer"
  target="_blank"
>
  {/* Calendar icon (inline SVG, no extra dep) */}
  <svg aria-hidden="true" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
  {s.addToCalendar}
</a>
```

Layout note: the center column already has `flex justify-center`. Wrap both `<Calendar />` and the button in a `flex flex-col items-center gap-4` div so they stack centrally.

---

## Standards Enforcement

### Applied References

| Reference | Constraint applied |
|---|---|
| `docs/references/frontend/component-structure-pattern.md` | Keep `EventDetailsSection` as the feature orchestrator; no new sub-component needed for a simple link |
| `docs/references/frontend/naming-and-conventions-pattern.md` | Utility named `buildGoogleCalendarUrl` (verb + noun, camelCase); file `calendar.ts` (kebab-case) |
| `docs/references/frontend/project-folder-structure.md` | Pure client utility goes in `lib/`, not `components/` |

### Coding Constraints

1. **No `useState` / `useEffect`**: the URL is built once at render time (pure computation).
2. **`target="_blank"` always paired with `rel="noopener noreferrer"`** (security).
3. **Inline SVG only**: no icon library import to keep bundle lean.
4. **All copy via i18n**: `s.addToCalendar` not a hardcoded string.
5. **Tailwind classes only**: no `style={}` props.
6. **`aria-label`** on the `<a>` tag for screen readers (feat-009 accessibility standard).

---

## Concrete Steps (Commands)

Run from repo root:

```bash
# 1. Verify baseline
./init.sh

# 2. Implement (see Plan of Work above)

# 3. Verify after changes
pnpm lint
pnpm typecheck
pnpm build
```

Expected output after implementation:

```
✓ No lint errors
✓ No type errors
✓ Build succeeded
```

---

## Validation and Acceptance

### Happy path

1. Open `http://localhost:3000` in browser (run `pnpm dev`).
2. Scroll to the "Save The Date" section.
3. Below the calendar grid, a button "Thêm vào lịch" is visible.
4. Click it → a new tab opens to `https://calendar.google.com/calendar/render?action=TEMPLATE&...` with:
   - Title: `Đám cưới Xuân Tùng & Vân Anh`
   - Start: 8 June 2026, 17:00 (ICT / UTC+7)
   - End: 9 June 2026, 11:45 (ICT / UTC+7)
   - Location prefilled with the Google Maps link
5. The home tab is unchanged (no navigation away).

### Regression checks

- All existing event details (times, dates, location links) still render correctly.
- No console errors or TypeScript errors.
- `pnpm build` exits 0.

---

## Idempotence & Recovery

- All changes are additive (new file + new JSON key + new JSX node).
- Re-running the implementation steps is safe; no data migration, no destructive ops.
- Rollback: delete `lib/calendar.ts`, remove the `addToCalendar` key from `vi.json`, remove the `<a>` block from the component.

---

## Harness Integration

After implementation, update:

### `harness/feature_index.json`

Add entry:

```json
{
  "id": "feat-017",
  "name": "Add to Calendar Button",
  "description": "Google Calendar deeplink button in EventDetailsSection that pre-fills the wedding event (08/06/2026 17:00 – 09/06/2026 11:45 ICT, venue location).",
  "dependencies": ["feat-001", "feat-015"],
  "status": "done",
  "evidence": "lib/calendar.ts buildGoogleCalendarUrl util, events.addToCalendar i18n key, and <a> button in event-details-section.tsx. Verified with pnpm lint, typecheck, build."
}
```

### `harness/features/feat-017.json`

Create file:

```json
{
  "id": "feat-017",
  "name": "Add to Calendar Button",
  "description": "Google Calendar deeplink button in EventDetailsSection.",
  "dependencies": ["feat-001", "feat-015"],
  "status": "done",
  "evidence": "lib/calendar.ts, vi.json#events.addToCalendar, event-details-section.tsx button. Verified: pnpm lint + typecheck + build passing.",
  "updated_at": "2026-05-07"
}
```

### `harness/progress.md`

Prepend a new entry:

```
## 2026-05-07 — feat-017: Add to Calendar Button
- Added `lib/calendar.ts` with `buildGoogleCalendarUrl()`.
- Added `events.addToCalendar` key to `vi.json`.
- Added deeplink `<a>` button below calendar grid in `EventDetailsSection`.
- Verified: pnpm lint ✓, pnpm typecheck ✓, pnpm build ✓.
```

### `docs/exec-plans/index.md`

Move this plan under **Completed** after finishing.

---

## Progress

- [ ] Step 1: Create `lib/calendar.ts` with `buildGoogleCalendarUrl()`
- [ ] Step 2: Add `events.addToCalendar` to `lib/i18n/vi.json`
- [ ] Step 3: Update `components/event/event-details-section.tsx` — import util, wrap Calendar in flex column, add `<a>` button
- [ ] Step 4: Run `pnpm lint && pnpm typecheck && pnpm build` — confirm all pass
- [ ] Step 5: Manual browser check — button visible, deeplink opens Google Calendar with correct event data
- [ ] Step 6: Update harness (`feature_index.json`, `feat-017.json`, `progress.md`)
- [ ] Step 7: Update `docs/exec-plans/index.md` — move to Completed

---

## Surprises & Discoveries

_(fill in during implementation)_

---

## Decision Log

- **Decision**: Use a plain `<a>` deeplink rather than `.ics` download.
  **Rationale**: Google Calendar deeplink is the simplest zero-dependency approach that works on all devices (Android / iOS / desktop); `.ics` requires Content-Type handling and adds complexity with no added value for a single fixed event.
  **Date/Author**: 2026-05-07 / agent

- **Decision**: Event times hardcoded in UTC inside `buildGoogleCalendarUrl()`, not derived from `vi.json`.
  **Rationale**: UTC datetimes are technical constants, not user-facing copy. Keeping them in the util avoids mixing time-zone logic into the i18n layer.
  **Date/Author**: 2026-05-07 / agent

- **Decision**: No new React component; button lives inline in `event-details-section.tsx`.
  **Rationale**: A single `<a>` tag with an SVG icon does not warrant a new component per component-structure-pattern.md (components should only be extracted when reused or when complexity warrants it).
  **Date/Author**: 2026-05-07 / agent

---

## Outcomes & Retrospective

_(fill in after completion)_

---

## Implementation Notes

### Companion Skills

- `verification-before-completion` — run before marking done.
- `browser-qa` — optionally verify the button renders correctly and deeplink opens in a new tab.

### Common Pitfalls

1. **UTC offset**: Google Calendar `dates` param expects UTC, not local time.  
   17:00 ICT = 10:00 UTC → `20260608T100000Z`.  
   11:45 ICT = 04:45 UTC → `20260609T044500Z`.

2. **Encoding**: `&` in the event title must be `%26` via `encodeURIComponent`, otherwise the URL parser treats it as a query separator.

3. **Layout regression**: The center column currently uses `flex justify-center`. Wrapping in `flex-col items-center` is additive and should not break the existing `<Calendar />` render.
