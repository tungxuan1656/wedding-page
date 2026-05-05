# feat-004: RSVP System

## Title

Add landing-page RSVP form with Google Apps Script submission and guest-facing feedback.

## Purpose / Big Picture

Enable guests to confirm which wedding events they will attend directly from landing page without leaving site or contacting couple manually. Form must collect guest name plus attendance for `tiệc đãi khách` on `08/06/2026` and `lễ thành hôn` on `09/06/2026`, validate required input on client, submit to Google Apps Script endpoint, and show clear success or retryable error feedback.

**User-visible behaviour**: Guest opens landing page, scrolls to `#rsvp`, enters `Họ tên`, selects one or both event checkboxes, taps submit, and sees loading state followed by success confirmation if Apps Script accepts request. If guest leaves name empty, selects no events, or network/API call fails, form stays on page and shows validation or error feedback in Vietnamese with visible retry path.

## Scope

### In Scope

- `app/page.tsx` — keep landing page orchestrator unchanged except any minimal composition/import updates directly needed for RSVP section rendering.
- `components/rsvp/` — new RSVP feature UI and public barrel.
  - `rsvp-form.tsx` — form shell, local state, validation, submit flow, success/error states.
  - `rsvp-form-content.tsx` or similar internal split if main form file approaches 200 lines.
  - `rsvp-copy.ts` — centralized Vietnamese labels, helper text, and messages if static strings exceed reasonable inline scope.
  - `index.ts` — public export for feature component.
- `components/hero/hero-section.tsx` — replace placeholder RSVP card in `#rsvp` section with real feature component while preserving surrounding landing-page structure and anchor target.
- `lib/api.ts` — Google Apps Script client, request/response types, runtime guard for missing env var, fetch wrapper for RSVP submission.
- Optional small shared types/utilities only if directly needed for typed payload normalization. Prefer co-location over new abstraction.
- Documentation artifact for deployment handoff:
  - `docs/product-specs/feat-004-rsvp-system.md` — Apps Script contract, sheet columns, manual setup, and acceptance notes.
  - `docs/` script snippet or section inside product spec containing deployable Google Apps Script example required by harness acceptance.
- Harness state:
  - `harness/features/feat-004-rsvp-system.json`
  - `harness/feature_index.json`
  - `harness/progress.md`
- Plan tracking:
  - `docs/exec-plans/index.md`

### Out of Scope

- Guest auto-prefill from `feat-003` personalization data.
- Server-side Next.js API routes, databases, auth, cookies, or analytics.
- RSVP admin dashboard, deduplication workflow, edit/cancel flow, or capacity management.
- Email/SMS notifications.
- Broad landing-page redesign outside direct RSVP integration seam.
- Full performance pass (`feat-005`) beyond keeping form implementation lightweight and mobile-safe.
- Multi-language support. Copy remains Vietnamese only.
- New backend security model. Site remains public per `ARCHITECTURE.md`.

## Non-negotiable Requirements

- Plan stays self-contained. No hidden assumptions.
- Result must produce observable guest-facing behaviour for success, client validation failure, and API/network failure.
- `#rsvp` anchor remains stable and landing-page CTA continues to scroll correctly.
- Fields exactly match current feature contract:
  - `Họ tên` — required text input.
  - `Đi ăn ngày 8/6 dương lịch (23/4 âm lịch Bính Ngọ)` — checkbox for `tiệc đãi khách`.
  - `Đi đưa đón dâu ngày 9/6 dương lịch (24/4 âm lịch)` — checkbox for `lễ thành hôn`.
- Client validation requires non-empty name and at least one selected event before any network request.
- Submission uses `NEXT_PUBLIC_APPS_SCRIPT_URL` only. No hardcoded endpoint in source.
- `lib/api.ts` owns Google Apps Script fetch contract. UI must not call `fetch` with raw payload inline.
- Request/response types follow repo naming rules: `RsvpFormData`, `RsvpPayload`, `RsvpApiResponse`, props with `Props` suffix.
- UI copy stays Vietnamese. Code/comments/docs stay English.
- Keep page/component boundaries clean: `app/page.tsx` orchestrates, `components/rsvp/` owns form UI, `lib/api.ts` owns transport details.
- No new dependency unless exact reason and benefit are documented first. Prefer built-in React/Next/browser APIs.
- Files over 200 lines split by concern before merge.
- Error state must allow retry without page refresh.
- If endpoint env var missing, form must fail gracefully with user-facing error message and developer-readable internal branch in code.

## Progress

- [ ] Confirm final request payload keys and response contract for Google Apps Script in `docs/product-specs/feat-004-rsvp-system.md`
- [ ] Create `lib/api.ts` with typed `submitRsvp` client and request/response types
- [ ] Create `components/rsvp/rsvp-form.tsx`
- [ ] Create `components/rsvp/index.ts`
- [ ] Split internal RSVP files if form file exceeds size rule
- [ ] Replace hero RSVP placeholder copy with mounted `RsvpForm` inside existing `#rsvp` section
- [ ] Add loading, success, validation error, and submission error UI states
- [ ] Document Google Apps Script sample and sheet column order
- [ ] Verify happy-path submission payload shape against documented Apps Script contract
- [ ] Verify client validation blocks empty name and zero-checkbox submit
- [ ] Verify failure path shows retryable error when endpoint missing or request fails
- [ ] Verify mobile layout at narrow viewport
- [ ] Verify `pnpm lint`
- [ ] Verify `pnpm typecheck`
- [ ] Verify `pnpm build`
- [ ] Verify `./init.sh`
- [ ] Update harness files with status, evidence, and next-step notes
- [ ] Keep this plan and `docs/exec-plans/index.md` in sync

## Surprises & Discoveries

- `docs/PLANS.md` not present in repo as of 2026-05-05. `docs/exec-plans/__plan-template__.md` and existing ExecPlans remain current structure source.
- `docs/knowledge/codex-exec-plan.md` not present in repo as of 2026-05-05. No extra repo-local plan-writing guidance available beyond template and prior plans.
- `lib/api.ts` does not exist yet, so feat-004 must establish initial API client boundary cleanly instead of retrofitting existing transport code.
- `components/rsvp/` currently contains only `.gitkeep`, so RSVP feature can be introduced with minimal coupling.
- Landing page currently renders RSVP placeholder text inside `components/hero/hero-section.tsx`; form integration seam already exists at `#rsvp` and should be reused rather than adding second RSVP section.
- `docs/PRODUCT.md` still shows older generic RSVP fields (`Attending`, `Number of guests`, `Note`). Current source of truth for feat-004 is `harness/features/feat-004-rsvp-system.json` plus `docs/FRONTEND.md`.

## Decision Log

- **Decision**: Put Google Apps Script fetch wrapper in `lib/api.ts` and keep form component transport-agnostic.
  - **Rationale**: Matches architecture codemap, preserves UI/runtime boundary, and keeps payload normalization/test surface in one place.
  - **Date/Author**: 2026-05-05 / Codex

- **Decision**: Reuse existing `#rsvp` section in `components/hero/hero-section.tsx` instead of moving RSVP to separate page block.
  - **Rationale**: feat-001 already established anchor target and CTA behavior. Replacing placeholder keeps diff surgical and avoids layout drift.
  - **Date/Author**: 2026-05-05 / Codex

- **Decision**: Treat missing `NEXT_PUBLIC_APPS_SCRIPT_URL` as runtime submission error, not build-time hard failure.
  - **Rationale**: Site should still render invitation locally or in preview without secret/env wiring, while preserving clear guest-visible retry failure and developer-visible cause.
  - **Date/Author**: 2026-05-05 / Codex

- **Decision**: Use boolean checkboxes for two event selections rather than compressing attendance into one enum string.
  - **Rationale**: Acceptance criteria require independent selection of one or both events. Boolean fields keep payload and UI aligned.
  - **Date/Author**: 2026-05-05 / Codex

## Outcomes & Retrospective

- Target outcome: landing page gains complete RSVP flow with client validation, Google Apps Script submission, and clear guest-facing status messages.
- Scope remains bounded to frontend plus contract documentation. No server route or admin tooling added.
- Success evidence should include full verification transcript and one concrete submission artifact such as captured payload example or Apps Script response sample in docs.

## Context and Orientation

Repo orientation for reader with no prior context:

- `app/page.tsx` — landing-page route. Already resolves optional guest personalization and renders `<HeroSection guest={guest} />`.
- `components/hero/hero-section.tsx` — current visible landing page. Contains hero copy, event cards, venue card, CTA buttons, and existing `#rsvp` placeholder section to replace.
- `components/hero/hero-copy.ts` — centralized hero copy including current RSVP placeholder text.
- `components/rsvp/` — reserved RSVP feature folder, currently empty except `.gitkeep`.
- `lib/` — shared utility/data folder. Contains `guests.ts`; missing `api.ts` boundary expected by architecture docs.
- `harness/features/feat-004-rsvp-system.json` — current feature acceptance source of truth for fields, validation, success/error feedback, Apps Script docs requirement, and mobile-friendly layout.
- `docs/FRONTEND.md` — frontend rules naming exact RSVP fields, validation, Apps Script env var, Vietnamese labels, and light-mode requirement.

Layer impact using `Types -> Config -> Repo -> Service -> Runtime -> UI` from `ARCHITECTURE.md`:

- **Types**: add `RsvpFormData`, `RsvpPayload`, `RsvpApiResponse`, and any narrow submit-state types.
- **Config**: consume `NEXT_PUBLIC_APPS_SCRIPT_URL` from runtime environment. No new config source.
- **Repo**: none inside Next.js app. Google Sheets remains external persistence behind Apps Script.
- **Service**: `lib/api.ts` acts as thin transport/service boundary for POST submission.
- **Runtime**: browser submit event, payload serialization, env guard, fetch call, response parse, and retry state transitions.
- **UI**: main impact. Placeholder becomes interactive form with validation, loading, success, and error feedback.

Hard dependency checks:

- Lower layers do not depend on higher layers: `lib/api.ts` must not import UI components.
- UI does not bypass runtime/service contracts: `components/rsvp/` must call exported API helper, not inline raw endpoint or ad-hoc payload logic across multiple files.
- Data access enters through explicit adapter boundary: external POST to Google Apps Script must flow through `lib/api.ts`.
- New dependencies: none planned. Use installed React/Next/browser APIs only.

## Standards Enforcement

### Required References

- `AGENTS.md`
- `ARCHITECTURE.md`
- `docs/FRONTEND.md`
- `docs/references/frontend/project-folder-structure.md`
- `docs/references/frontend/component-structure-pattern.md`
- `docs/references/frontend/naming-and-conventions-pattern.md`
- `docs/references/shared/type-naming-pattern.md`
- `docs/references/frontend/form-pattern.md` — not present in repo; apply equivalent concrete constraints below from current feature docs and existing repo patterns.
- `docs/references/frontend/i18n-label-pattern.md` — not present in repo; apply Vietnamese-copy rule from `docs/FRONTEND.md` and naming guidance from frontend references.

### Concrete Coding Constraints From References

- `docs/references/frontend/project-folder-structure.md`
  - Keep route orchestration in `app/page.tsx` and RSVP feature UI inside `components/rsvp/`.
  - Put transport helper in `lib/api.ts`.
  - Use absolute `@/...` imports.
- `docs/references/frontend/component-structure-pattern.md`
  - `app/page.tsx` stays orchestration-only.
  - `RsvpForm` uses `export const` or `export default function`.
  - `components/rsvp/index.ts` exports only public RSVP component(s).
  - Split internal pieces if main form file exceeds 200 lines or mixes rendering/state/serialization concerns.
- `docs/references/frontend/naming-and-conventions-pattern.md`
  - Kebab-case files such as `rsvp-form.tsx` and `rsvp-copy.ts`.
  - Types: `RsvpFormData`, `RsvpPayload`, `RsvpApiResponse`, `RsvpFormProps` if props needed.
  - Static Vietnamese copy centralized in `RSVP_COPY` or similar constant object.
  - UI text Vietnamese; code/comments/docs English.
- `docs/references/shared/type-naming-pattern.md`
  - Outgoing API body uses `Payload` suffix.
  - Parsed response uses `Response` suffix.
  - Form state shape uses `FormData` suffix.
  - Keep form state type separate from API response type.
- `docs/FRONTEND.md`
  - Fields and validation must exactly follow documented RSVP contract.
  - Submit via POST to `NEXT_PUBLIC_APPS_SCRIPT_URL`.
  - Show success/error feedback after submission.
  - Keep mobile-friendly, Vietnamese labels, light mode only.
- `ARCHITECTURE.md`
  - Next.js app remains client-first static frontend with single POST integration to Google Apps Script.
  - No new backend layer or extra API calls.

## Implementation Notes

### Mandatory Patterns For This Scope

- Keep payload-building in one place, preferably small helper inside `lib/api.ts` or tightly scoped utility near form.
- Preserve current hero layout and replace only placeholder RSVP card content.
- Use semantic form elements: `<form>`, `<label>`, checkbox inputs with shared validation messaging, submit button with disabled/loading state.
- Prefer deterministic client validation before submit. Do not depend on Apps Script for first-pass required-field UX.
- Keep success state explicit and durable enough that duplicate taps do not immediately resubmit while success message visible.

### Companion Skills For Implementation Phase

- `tdd-workflow` — drive validation and submit-state behavior from failing checks first.
- `documentation-lookup` — confirm current Next.js 16 client/server env access and fetch behavior if any contract doubt remains.
- `frontend-patterns` — keep component boundaries and controlled-form approach clean.
- `verification-loop` — run lint, typecheck, build, and full `./init.sh` with captured evidence.
- `security-review` — required because feature handles user input and external POST endpoint.

### Common Pitfalls To Avoid

- Do not keep raw endpoint URL inline in component JSX.
- Do not leave placeholder RSVP copy visible once form ships.
- Do not add unrelated guest-prefill or story-page logic.
- Do not silently ignore failed submissions.
- Do not create payload keys that drift from documented Apps Script example without updating docs and form client together.
- Do not block page render when env var missing; fail only on submit with clear message.

## Plan of Work (Narrative)

### 1. Lock Google Apps Script contract in docs

Create `docs/product-specs/feat-004-rsvp-system.md` as source-of-truth document for implementation and deployment. It must define:

- user goal,
- field labels,
- validation rules,
- exact POST body example,
- expected JSON success/error shape,
- Google Sheets column order,
- deployable Apps Script snippet.

Recommended request contract:

```ts
export type RsvpPayload = {
  name: string
  eventDaiKhach: boolean
  eventThanhHon: boolean
}
```

Recommended response contract:

```ts
export type RsvpApiResponse = {
  status: 'success' | 'error'
  message?: string
}
```

If implementation chooses different key names, update docs and client together. No hidden divergence.

### 2. Create `lib/api.ts` transport boundary

Add `lib/api.ts` with:

- `RsvpFormData` for UI-controlled values,
- `RsvpPayload` for outbound body,
- `RsvpApiResponse` for parsed response,
- `submitRsvp(formData: RsvpFormData): Promise<RsvpApiResponse>` helper.

Helper responsibilities:

1. Read `process.env.NEXT_PUBLIC_APPS_SCRIPT_URL`.
2. If missing, return or throw well-defined error branch consumed by UI.
3. Normalize payload from form state to POST body.
4. Send `fetch(url, { method: 'POST', headers, body })`.
5. Parse JSON defensively.
6. Surface success vs failure in typed shape usable by UI.

Keep helper thin. No retry loop, no analytics, no global store.

### 3. Build RSVP feature component(s) under `components/rsvp/`

Create `components/rsvp/rsvp-form.tsx` as client component because it owns input state and submit interactions. Keep state minimal:

- `formData`
- `fieldErrors` or equivalent validation result
- `submitState` (`idle | submitting | success | error`)
- `submitMessage`

Render:

- section heading and short helper copy,
- name input,
- two checkboxes with full Vietnamese labels,
- inline validation message block,
- submit button with loading/disabled state,
- success banner/message,
- error banner/message with retry affordance.

If file grows beyond 200 lines, split pure copy/constants or status-message UI into internal companion files.

### 4. Replace placeholder in `components/hero/hero-section.tsx`

Import RSVP feature through `@/components/rsvp` barrel and replace current placeholder paragraph inside existing `#rsvp` `SectionWrapper`. Preserve:

- `id='rsvp'`,
- surrounding container spacing and card shell unless small form-driven layout adjustment needed,
- existing CTA link from hero.

Remove `HERO_COPY.rsvpPlaceholder` only when no longer used anywhere. Clean up orphaned copy property if feat-004 makes it dead.

### 5. Validate client behaviour and failure modes

Verify these flows during implementation:

1. Empty submit → shows name and/or event-selection validation, no network request.
2. Name only, no checkbox → validation blocks submit.
3. One checkbox selected + name + valid env URL → request fires, loading state visible, success message shown.
4. Both checkboxes selected + name → payload contains both booleans true.
5. Missing env var or unreachable endpoint → error message shown, form stays editable, guest can retry.

If repo has no test harness for interactive UI yet, capture exact manual verification steps and output evidence in progress/harness docs. If small unit test path is easy, prefer adding one for payload/validation helper behavior.

### 6. Update harness and plan tracking

When plan created, mark feat-004 as `in-progress` in harness feature records and add active entry in `docs/exec-plans/index.md`. After implementation session completes, feature evidence must cite exact verification commands and Apps Script contract artifact path.

## Concrete Steps (Commands)

All commands run from repo root (`/Users/tungdoan/Projects/Web/tx-va-wedding`).

```bash
# Baseline repo verification before edits
./init.sh

# Lint after implementation
pnpm lint

# Type-check after implementation
pnpm typecheck

# Production build after implementation
pnpm build

# Full final verification
./init.sh
```

Expected short outputs:

- `./init.sh` → install/harness checks/lint/typecheck/build complete with no errors
- `pnpm lint` → `0 errors`
- `pnpm typecheck` → no TypeScript errors
- `pnpm build` → Next.js production build succeeds

Manual dev check path if needed:

```bash
pnpm dev
```

Expected local behaviour:

- Open `/` and click `Xác nhận tham dự` → page scrolls to mounted form.
- Valid submit shows success feedback.
- Invalid submit shows validation feedback without page reload.

## Validation and Acceptance

### Acceptance Criteria

1. Landing page `#rsvp` section renders real form, not placeholder text.
2. Form contains `Họ tên` plus two event checkboxes with exact Vietnamese labels from feature record.
3. Client validation blocks empty name.
4. Client validation blocks submit when both event checkboxes are unchecked.
5. Valid submit sends POST request to `NEXT_PUBLIC_APPS_SCRIPT_URL` through `lib/api.ts`.
6. Success response shows visible success confirmation in Vietnamese.
7. Failed response or missing env var shows visible error message with retry path.
8. Form remains usable on mobile viewport.
9. `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `./init.sh` pass.
10. Google Apps Script code sample and sheet column mapping exist in repo docs.

### Validation Matrix

| Scenario | Input / Setup | Expected Result | Evidence |
| --- | --- | --- | --- |
| Happy path — reception only | Name filled, `eventDaiKhach=true`, valid endpoint | Loading state then success message | Manual run transcript or captured response |
| Happy path — ceremony only | Name filled, `eventThanhHon=true`, valid endpoint | Loading state then success message | Manual run transcript or captured response |
| Happy path — both events | Name filled, both checkboxes true | Success message, payload includes both booleans | Network payload capture or logged request sample |
| Validation — empty name | Empty name, one checkbox selected | Inline validation error, no request | Manual check |
| Validation — no events | Name filled, no checkbox | Inline validation error, no request | Manual check |
| Runtime failure — missing env | `NEXT_PUBLIC_APPS_SCRIPT_URL` unset | Submission error message, retry possible | Manual check |
| Runtime failure — non-200 / bad JSON / network | Invalid endpoint or offline | Submission error message, form editable again | Manual check |
| Regression — hero CTA | Tap `Xác nhận tham dự` in hero | Scroll lands on same form section | Manual check |
| Regression — guest personalization | Open `/?g=anhtu` then submit | Personalization still renders and RSVP section still works | Manual check |

### Acceptance Artifact Requirement

At least one concrete artifact must be recorded when implementation finishes:

- captured Apps Script response example such as `{ "status": "success" }`, or
- screenshot/transcript of successful local submission against test endpoint, or
- unit test output proving payload/validation helper behavior.

## Idempotence & Recovery

- File creation/edit steps are safe to re-run if changes remain scoped to same files.
- `./init.sh`, `pnpm lint`, `pnpm typecheck`, and `pnpm build` are safe to re-run.
- Google Apps Script deployment doc creation is idempotent when updating same canonical file.
- Risk: real endpoint testing can write duplicate rows to Google Sheets. Before pointing local app to production sheet, use dedicated test sheet/tab or temporarily deploy against staging Apps Script if available.
- Recovery for duplicate sheet writes: manually remove duplicate test rows from Google Sheet after verification. Document exact sheet columns so cleanup is low-risk.
- If submit contract drifts during implementation, revert to documented payload keys in `docs/product-specs/feat-004-rsvp-system.md` and `lib/api.ts` together before merge.

## Artifacts and Notes

- Required evidence after implementation:
  - verification command outputs for `pnpm lint`, `pnpm typecheck`, `pnpm build`, `./init.sh`
  - path to Google Apps Script deployment doc/spec
  - one acceptance artifact from validation section
- Keep snippets concise in harness/progress docs. Do not paste full build logs unless failure needs explanation.

## Interfaces & Dependencies

- Runtime env: `NEXT_PUBLIC_APPS_SCRIPT_URL` — public browser-readable Apps Script endpoint.
- Browser API: `fetch` for POST submission.
- Internal modules:
  - `@/components/hero` — landing page container where RSVP mounts.
  - `@/components/rsvp` — RSVP feature boundary.
  - `@/lib/api` — transport boundary.
  - `@/lib/guests` — unrelated feature that must continue working alongside RSVP.

Suggested function signatures:

```ts
export type RsvpFormData = {
  name: string
  eventDaiKhach: boolean
  eventThanhHon: boolean
}

export type RsvpPayload = RsvpFormData

export type RsvpApiResponse = {
  status: 'success' | 'error'
  message?: string
}

export async function submitRsvp(
  formData: RsvpFormData,
): Promise<RsvpApiResponse>
```

Google Apps Script example contract for docs:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date().toISOString(),
    data.name,
    data.eventDaiKhach,
    data.eventThanhHon,
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## Risks and Blockers

- **Contract mismatch risk**: Apps Script sample and frontend payload can drift if key names not locked early.
- **Env/config risk**: Missing or wrong `NEXT_PUBLIC_APPS_SCRIPT_URL` causes runtime failure that must remain guest-readable.
- **External-service risk**: Apps Script may return non-JSON or permissive 200s with failure text. Client parser must handle malformed responses safely.
- **Manual-test side effect**: Real submissions create persistent rows in Google Sheets; use controlled test process.
- **Source-of-truth conflict**: `docs/PRODUCT.md` older RSVP contract must not override harness/FRONTEND docs unless intentionally updated in same scope.

## Open Decisions

- Decide final sheet column order. Recommended: `submittedAt`, `name`, `eventDaiKhach`, `eventThanhHon`.
- Decide whether success state clears form immediately or leaves submitted values visible with disabled submit button.
- Decide whether helper copy should mention both dates in intro paragraph or let checkbox labels carry all detail.

## Verification Path

1. Run baseline `./init.sh` from repo root.
2. Implement docs, API client, and RSVP component.
3. Run `pnpm lint`, `pnpm typecheck`, `pnpm build`.
4. Run final `./init.sh`.
5. Start `pnpm dev` and manually verify validation, success, error, CTA anchor, and guest-personalized page regression.
6. Record evidence in harness files.

## Progress Log

- 2026-05-05 / Plan created for feat-004 RSVP System. Await implementation.
