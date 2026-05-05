# feat-003: Guest Personalization

## Title

Add URL-based guest personalization to landing page hero.

## Purpose / Big Picture

Enable invitation to feel personally addressed when guest opens shared link with `?g=<guestId>`. Known guest IDs should personalize greeting, invitation line, custom message, and optional photo without changing core wedding content. Unknown or missing guest IDs must fall back to current generic landing-page content with no visible error state.

**User-visible behaviour**: Guest opens `/` with no query and sees current generic invitation. Guest opens `/?g=anhtu` and sees personalized greeting such as `Xin chào Anh Tú`, guest name highlighted in invitation text, custom message block, and optional guest photo if record includes one. Guest opens `/?g=unknown` and still sees generic invitation with no crash, warning banner, or broken image.

## Scope

### In Scope

- `app/page.tsx` — read `searchParams`, resolve `g`, keep route orchestration-only.
- `lib/guests.ts` — typed static guest data, guest lookup helper, shared guest types.
- `components/guest/` — guest-personalization UI component(s) and public barrel export.
  - `guest-personalization.tsx` — render greeting, message, optional photo.
  - `index.ts` — export public guest UI.
- `components/hero/hero-section.tsx` — accept resolved guest data via props and insert personalized content into existing hero.
- `components/hero/hero-copy.ts` — keep generic fallback copy and any new static label strings centralized if needed.
- Harness state:
  - `harness/features/feat-003-guest-personalization.json`
  - `harness/feature_index.json`
  - `harness/progress.md`
- Plan tracking:
  - `docs/exec-plans/index.md`

### Out of Scope

- RSVP form and Google Apps Script submission flow (`feat-004`).
- Story page changes (`feat-002`) except preserving existing `/story` CTA behavior.
- Cross-site performance optimization pass (`feat-005`) beyond required safe use of existing Next.js image tooling if photo rendering is added.
- New backend, API, auth, database, cookies, or analytics.
- Admin editing flow for guest data.
- Bulk guest import tooling.
- Real asset pipeline work beyond referencing already-present guest images if available.
- Any error page or invalid-token UX. Unknown guest IDs must silently fall back.

## Non-negotiable Requirements

- Plan stays self-contained. No hidden assumptions.
- Result must produce observable landing-page behavior for known, unknown, and missing guest IDs.
- Every technical term is defined in-place or by exact file/path reference.
- Guest data source of truth lives in `lib/guests.ts` as typed static constant per harness acceptance.
- `app/page.tsx` stays orchestrator-only; URL parsing and lookup may happen there, but rendering logic belongs in feature components.
- Feature-owned guest UI lives under `components/guest/`.
- Fallback path for unknown guest IDs must show generic content with no error state.
- Personalized content must not bypass existing landing-page structure; hero, event details, venue, and CTAs remain intact.
- Use Next.js and existing repo dependencies only. No new package unless exact reason is documented first.
- File naming: kebab-case files, PascalCase components, `Props` suffix for props types, named exports for utilities.
- UI copy stays Vietnamese. Code/comments/docs stay English.
- If photo support is implemented, use Next.js `<Image>` and repo image rules from `docs/FRONTEND.md`.
- Files over 200 lines split by concern before merge.

## Progress

- [ ] Confirm guest content contract in `lib/guests.ts` (`GuestId`, `GuestData`, `GuestMap`, lookup helper)
- [ ] Update `app/page.tsx` to read `searchParams.g` and resolve guest
- [ ] Create `components/guest/guest-personalization.tsx`
- [ ] Create `components/guest/index.ts`
- [ ] Update `components/hero/hero-section.tsx` props and personalized rendering slots
- [ ] Update `components/hero/hero-copy.ts` only for generic fallback/static labels directly needed by feat-003
- [ ] Verify known guest path renders greeting, highlighted name, custom message, optional photo
- [ ] Verify missing guest path renders current generic landing page
- [ ] Verify unknown guest path renders generic landing page with no error UI
- [ ] Verify `pnpm lint`
- [ ] Verify `pnpm typecheck`
- [ ] Verify `pnpm build`
- [ ] Verify `./init.sh`
- [ ] Update harness files with status/evidence
- [ ] Keep this plan and `docs/exec-plans/index.md` in sync

## Surprises & Discoveries

- `docs/PLANS.md` not present in repo as of 2026-05-05. `docs/exec-plans/__plan-template__.md` and existing ExecPlans act as current structure source.
- `docs/knowledge/codex-exec-plan.md` not present in repo as of 2026-05-05. No extra repo-specific plan-writing guidance available beyond template and prior plans.
- `lib/` exists but currently contains only `.gitkeep`, so feat-003 can define clean guest-data contract without migration burden.
- `components/guest/` exists but currently contains only `.gitkeep`, so guest UI can be introduced with minimal coupling.
- `app/page.tsx` currently renders only `<HeroSection />`, making it clean place to own `searchParams` parsing while keeping page thin.

## Decision Log

- **Decision**: Resolve `searchParams.g` in `app/page.tsx`, not inside client hero component.
  - **Rationale**: App Router page is correct route-boundary place for URL param handling. Keeps client component focused on rendering, not routing state.
  - **Date/Author**: 2026-05-05 / Codex

- **Decision**: Keep guest data in `lib/guests.ts` instead of colocating inside `components/guest/`.
  - **Rationale**: Harness acceptance explicitly names `lib/guests.ts`, and data may later feed RSVP defaults or other shared personalization points.
  - **Date/Author**: 2026-05-05 / Codex

- **Decision**: Unknown guest IDs silently fall back to generic content.
  - **Rationale**: Product and frontend docs explicitly require graceful fallback with no error state.
  - **Date/Author**: 2026-05-05 / Codex

- **Decision**: Personalized UI remains inside existing hero rather than adding separate page layout branch.
  - **Rationale**: Request changes wording and personalization, not page structure. Reusing hero keeps diff surgical and preserves feat-001 behavior.
  - **Date/Author**: 2026-05-05 / Codex

## Outcomes & Retrospective

- Pending implementation.
- Expected outcome: landing page supports shareable guest-specific links while preserving generic invite behavior and existing navigation/event content.

## Context and Orientation

Repo orientation for reader with no prior context:

- `app/page.tsx` — landing-page route. Currently thin server component rendering `HeroSection` only.
- `components/hero/hero-section.tsx` — current visible landing-page hero. Contains intro copy, event cards, venue card, `/story` CTA, and `#rsvp` placeholder section.
- `components/hero/hero-copy.ts` — centralized hero fallback copy and map URL.
- `components/guest/` — reserved feature folder for guest personalization, currently empty.
- `lib/` — shared non-UI utilities/data folder, currently empty except `.gitkeep`.
- `docs/FRONTEND.md` — frontend constraints: mobile-first, Vietnamese UI, Framer Motion only, image rules.
- `harness/features/feat-003-guest-personalization.json` — acceptance record requiring `?g=<guestId>`, greeting, message, optional photo, highlighted guest name, and generic fallback.

Layer impact using `Types -> Config -> Repo -> Service -> Runtime -> UI` from `ARCHITECTURE.md`:

- **Types**: new guest types in `lib/guests.ts` such as `GuestId`, `GuestData`, and `GuestMap`.
- **Config**: none expected.
- **Repo**: none. No database/repository layer exists for this feature.
- **Service**: none. No API call or business-service abstraction required.
- **Runtime**: route reads `searchParams` and hands resolved guest data into UI.
- **UI**: main impact. Hero copy becomes conditionally personalized and guest photo/message block renders when known guest present.

Hard dependency checks:

- Lower layers do not depend on higher layers: `lib/guests.ts` must not import UI components.
- UI does not bypass runtime/service contracts: hero receives resolved guest data through props from page layer, not by reading URL itself.
- Data access enters through repository or explicit adapter boundaries: not applicable because guest data is static in-process constant, not external persistence.
- New dependencies: none planned. Use installed Next.js/React/Tailwind/Framer Motion only.

## Standards Enforcement

### Required References

- `AGENTS.md`
- `ARCHITECTURE.md`
- `docs/FRONTEND.md`
- `docs/references/frontend/project-folder-structure.md`
- `docs/references/frontend/component-structure-pattern.md`
- `docs/references/frontend/naming-and-conventions-pattern.md`
- `docs/references/shared/type-naming-pattern.md`
- `docs/references/frontend/i18n-label-pattern.md` — not present in repo; use existing Vietnamese-copy rule in `docs/FRONTEND.md` and naming/copy guidance in current frontend references instead.

### Concrete Coding Constraints From References

- `docs/references/frontend/project-folder-structure.md`
  - Keep landing route entry in `app/page.tsx`.
  - Put guest feature UI in `components/guest/`.
  - Put guest lookup/data contract in `lib/guests.ts`.
  - Use absolute `@/...` imports.
- `docs/references/frontend/component-structure-pattern.md`
  - `app/page.tsx` stays orchestration-only.
  - New guest component uses `export const` or `export default function`.
  - `components/guest/index.ts` exports only public guest UI.
  - Split files by concern if any file approaches 200 lines.
- `docs/references/frontend/naming-and-conventions-pattern.md`
  - Kebab-case file names like `guest-personalization.tsx`.
  - Props types use `Props` suffix, e.g. `GuestPersonalizationProps`, `HeroSectionProps`.
  - Guest utility types use descriptive names from pattern: `GuestData`, `GuestId`, `GuestMap`.
  - Centralize fallback copy/static labels rather than scattering strings.
  - UI text in Vietnamese, comments/docs/code in English.
- `docs/references/shared/type-naming-pattern.md`
  - Use exact guest naming family: `GuestId`, `GuestData`, `GuestMap`.
  - Keep component prop types separate from guest data types.
- `docs/FRONTEND.md`
  - Mobile-first layout.
  - If photo exists, use optimized Next.js `<Image>` with explicit sizing.
  - If guest ID not found, show generic content without error state.
  - Personalization may include greeting, message, optional guest photo.

## Implementation Notes

### Mandatory Patterns For This Scope

- Parse URL query in page layer, not in deeply nested component.
- Keep generic fallback copy intact and derive personalized strings from resolved guest record.
- Prefer smallest rendering seam: pass guest view data into `HeroSection` props instead of rewriting page structure.
- Use `components/guest/` for personalization-specific block UI rather than growing `hero-section.tsx` with unrelated markup.
- Keep `lib/guests.ts` typed and deterministic; no async lookup, fetch, or side effect.

### Companion Skills For Implementation Phase

- `tdd-workflow` — drive known/unknown/missing guest behavior with tests or verification-first steps.
- `documentation-lookup` — confirm current Next.js 16 `searchParams` page contract and `next/image` behavior if needed.
- `frontend-patterns` — keep server/client split and component boundaries clean.
- `verification-loop` — run full repo verification and capture evidence.
- `security-review` — low-effort check still useful because feature reads user-controlled query input and may render dynamic copy/photo paths.

### Common Pitfalls To Avoid

- Do not read `window.location` inside hero component.
- Do not add error banner for unknown guest ID.
- Do not hardcode guest-specific branches directly into `app/page.tsx` JSX.
- Do not place guest data constant inside component file.
- Do not render broken image if guest has no photo.
- Do not over-generalize guest schema beyond current needs.

## Plan of Work (Narrative)

### 1. Define guest data contract in `lib/guests.ts`

Create `lib/guests.ts` with typed static guest data and lookup helper. Keep contract minimal and aligned to acceptance criteria.

Planned contract:

```ts
export type GuestId = string

export type GuestData = {
  name: string
  message: string
  photo?: {
    src: string
    alt: string
    width: number
    height: number
  }
}

export type GuestMap = Record<GuestId, GuestData>

export const GUESTS: GuestMap = {
  // example records
}

export const getGuestById = (guestId?: string | string[]) => {
  // normalize and return GuestData | null
}
```

Normalization should be conservative:

- accept only string query input,
- trim surrounding whitespace,
- normalize casing if chosen,
- return `null` for empty, missing, array, or unknown values.

No async code. No remote fetch. No hidden fallback mutation.

### 2. Update route orchestrator `app/page.tsx`

Change `app/page.tsx` to accept App Router `searchParams`. Extract `g`, call `getGuestById`, and pass resolved guest data into `HeroSection`.

Planned shape:

```tsx
type HomePageProps = {
  searchParams?: Promise<{ g?: string | string[] }>
}
```

If actual Next.js 16 page `searchParams` shape differs, confirm via docs before coding and record final contract in implementation notes/evidence. Core rule: page owns URL param handling, component receives plain props.

### 3. Introduce guest UI block in `components/guest/`

Create `components/guest/guest-personalization.tsx` to render personalization-specific UI without bloating hero file. Component should accept resolved `GuestData` and render:

- greeting line (`Xin chào <name>` or similar),
- custom message text,
- optional photo only when `photo` exists.

Use light-touch styling consistent with hero card system. If photo renders inside dark hero area, ensure contrast and spacing stay readable on mobile. Export public component through `components/guest/index.ts`.

### 4. Extend `HeroSection` with explicit props

Update `components/hero/hero-section.tsx` to accept optional guest prop, for example:

```ts
type HeroSectionProps = {
  guest: GuestData | null
}
```

Then make three bounded rendering changes only:

1. **Greeting/introduction area**
   - For known guest, show personalized greeting and custom message block.
   - For missing/unknown guest, preserve existing generic intro copy.

2. **Invitation line with highlighted guest name**
   - For known guest, update invitation sentence so guest name appears visually emphasized within text.
   - For fallback path, keep current generic sentence.

3. **Optional photo**
   - Render photo only when `guest.photo` exists.
   - No empty frame, no placeholder silhouette, no broken image for guests without photo.

Event cards, venue card, RSVP anchor section, and `/story` CTA must remain unchanged unless small prop-threading or spacing adjustments are directly needed.

### 5. Keep generic copy centralized

If additional fallback or label strings are introduced, add them to `components/hero/hero-copy.ts` or tightly scoped guest component constants rather than scattering across JSX. Do not move all guest data into hero copy file; only stable generic strings belong there.

### 6. Verify known, missing, and unknown query paths

Implementation must prove three states:

- `/` → generic invite remains.
- `/?g=<known-id>` → personalized state appears.
- `/?g=<unknown-id>` → generic invite remains, no warning/error.

If repo has no test harness for component assertions yet, manual verification plus lint/type/build/init evidence is minimum acceptance artifact. If easy to add small render test without introducing harness churn, do so under `tdd-workflow` guidance.

### 7. Update harness continuity artifacts

After implementation and verification:

- set `feat-003` status/evidence in `harness/features/feat-003-guest-personalization.json`,
- mirror status/evidence in `harness/feature_index.json`,
- add newest-first session entry in `harness/progress.md`,
- keep `docs/exec-plans/index.md` accurate under `Active` during implementation and `Completed` when done.

## Concrete Steps (Commands)

All commands run from repo root: `/Users/tungdoan/Projects/Web/tx-va-wedding`

```bash
# Baseline repo verification before edits
./init.sh

# Start local app for manual URL-path checks
pnpm dev

# Focused verification during implementation
pnpm lint
pnpm typecheck
pnpm build

# Final full verification
./init.sh
```

Expected short outputs:

- `./init.sh` → install/harness checks/lint/typecheck/build complete without errors.
- `pnpm lint` → `0 errors`, `0 warnings`.
- `pnpm typecheck` → no TypeScript errors.
- `pnpm build` → Next.js production build succeeds.
- `pnpm dev` → local dev server starts; visiting `/`, `/?g=<known-id>`, and `/?g=unknown` shows correct content states.

## Validation and Acceptance

### Happy Path

1. Open `http://localhost:3000/?g=<known-id>` using guest ID from `lib/guests.ts`.
   - Expected: personalized greeting renders with guest name.
   - Expected: personalized message block renders.
   - Expected: invitation text highlights guest name.
   - Expected: optional guest photo renders only if selected guest record has photo.
2. Scroll rest of page.
   - Expected: event cards, `/story` CTA, venue map, and `#rsvp` placeholder remain visible and usable.

### Validation / Error Paths

1. Open `http://localhost:3000/`.
   - Expected: current generic invitation content renders.
2. Open `http://localhost:3000/?g=unknown`.
   - Expected: same generic invitation content renders.
   - Expected: no error card, toast, console-thrown rendering failure, or broken image.
3. Open `http://localhost:3000/?g=`.
   - Expected: treated same as missing guest ID and shows generic content.

### Unauthorized / Forbidden

- Not applicable. Feature has no auth boundary and no protected data path.

### Regression Checks

- `http://localhost:3000/story` still works.
- Landing page CTA `Xem hành trình` still navigates to `/story`.
- Venue map iframe still renders.
- `#rsvp` anchor still scrolls to RSVP placeholder section.
- `./init.sh` still passes after feature lands.

### Acceptance Artifacts

At least one concrete artifact must be recorded in harness evidence:

- `./init.sh` passing transcript summary, and
- manual verification note covering `/`, `/?g=<known-id>`, and `/?g=unknown`, and
- if added, screenshot or test output proving personalized greeting/message path.

## Idempotence & Recovery

- Static file creation and edits are safe to re-run.
- No destructive operations, migrations, or remote writes.
- If guest contract proves awkward, rollback can stay bounded to `lib/guests.ts`, `components/guest/`, `components/hero/hero-section.tsx`, and `app/page.tsx`.
- If photo rendering introduces layout or build issues, recovery path is to keep data contract and message personalization while temporarily omitting photo UI until assets are valid.
- Verification commands (`pnpm lint`, `pnpm typecheck`, `pnpm build`, `./init.sh`) are safe to repeat.

## Artifacts and Notes

### Planned Files To Create

| File | Purpose |
| --- | --- |
| `lib/guests.ts` | Typed guest data constant and lookup helper |
| `components/guest/guest-personalization.tsx` | Guest-specific greeting/message/photo UI |
| `components/guest/index.ts` | Public guest-component exports |

### Planned Files To Modify

| File | Change |
| --- | --- |
| `app/page.tsx` | Read `searchParams`, resolve guest, pass prop into hero |
| `components/hero/hero-section.tsx` | Accept optional guest prop and render personalized content |
| `components/hero/hero-copy.ts` | Add or adjust only generic fallback/label strings needed by personalization |
| `harness/features/feat-003-guest-personalization.json` | Update plan path, status, evidence |
| `harness/feature_index.json` | Update feat-003 status/evidence |
| `harness/progress.md` | Add session log entry |
| `docs/exec-plans/index.md` | Add active/completed plan tracking |

## Interfaces & Dependencies

### External Dependencies

- **Next.js 16 App Router** — page route `app/page.tsx`, URL `searchParams`, optional `next/image` for guest photo.
- **React 19** — component composition and typed props.
- **Tailwind CSS v4** — layout and styling.
- **Framer Motion** — existing hero/section motion remains in place; no new animation system.

### Internal Dependencies

- `components/hero/hero-section.tsx`
  - current public interface becomes prop-driven instead of zero-prop.
- `components/hero/hero-copy.ts`
  - fallback generic invitation strings remain source of truth.
- `components/shared/section-wrapper.tsx`
  - existing reduced-motion-safe wrapper remains unchanged unless spacing/layout demands minimal edit.

### Planned Internal Contracts

```ts
// lib/guests.ts
export type GuestId = string

export type GuestPhoto = {
  src: string
  alt: string
  width: number
  height: number
}

export type GuestData = {
  name: string
  message: string
  photo?: GuestPhoto
}

export type GuestMap = Record<GuestId, GuestData>

export const getGuestById: (guestId?: string | string[]) => GuestData | null
```

```ts
// components/hero/hero-section.tsx
type HeroSectionProps = {
  guest: GuestData | null
}
```

```ts
// components/guest/guest-personalization.tsx
type GuestPersonalizationProps = {
  guest: GuestData
}
```

### No New Dependencies

Feature should ship with existing repo dependencies only.

## Open Decisions

- Which exact sample guest records should seed `lib/guests.ts` for verification? At minimum include one record with photo and one without so both paths can be exercised.
- Should guest ID matching be case-insensitive? Recommended: yes, normalize to lowercase in lookup helper for safer shared links.
- Should personalized greeting replace generic intro line entirely or render above it? Recommended: replace intro line for known guests, keep rest of hero intact.

## Risks and Blockers

- **Risk: invalid guest photo path** — could create broken image or build-time asset issues.
  - **Mitigation**: keep photo optional and only reference validated existing asset paths.
- **Risk: Next.js 16 `searchParams` contract drift** — page prop shape may differ from prior versions.
  - **Mitigation**: confirm with `documentation-lookup` before implementation if uncertain.
- **Risk: hero layout crowding on mobile** — extra guest message/photo may push critical wedding details too far down.
  - **Mitigation**: keep guest block compact and verify 375px viewport manually.
- **Blocker**: none currently known for planning. Implementation needs actual sample guest records/assets to fully exercise optional photo path.

## Verification Path

1. Run `./init.sh` from repo root before and after work.
2. Run `pnpm dev`.
3. Manually verify:
   - `/`
   - `/?g=<known-id>`
   - `/?g=unknown`
4. Run `pnpm lint`, `pnpm typecheck`, `pnpm build`.
5. Record evidence in harness files.

## Progress Log

- 2026-05-05 / plan-created / Owner: Codex / Status: ready-for-implementation
  - Selected next pending feature from harness order: `feat-003`.
  - Captured file-level implementation map, constraints, validation path, and harness update requirements.

## Current Step

- **Owner**: implementation agent/human
- **Status**: pending
- **Task**: confirm guest sample records/assets and implement `lib/guests.ts` plus route/hero prop wiring first.
