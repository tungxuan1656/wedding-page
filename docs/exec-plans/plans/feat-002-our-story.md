# feat-002: Our Story

## Purpose / Big Picture

Build story page that turns couple's 10-year journey into scroll-based, chapter-by-chapter experience. Guests should open `/story` and move through 10 chapters covering 2016–2025, with each chapter showing year, title, placeholder narrative copy, and image slots in elegant mobile-first layout. Motion must feel soft and intentional, and reduced-motion users must get same content without animated entrance effects.

**User-visible behaviour**: Guest taps "Xem hành trình" from landing page or opens `/story` directly and sees complete long-form story page instead of placeholder card. Page renders 10 vertically stacked chapters, each with year marker, Vietnamese title, 1–2 short paragraphs, and 3–5 image placeholders. As guest scrolls, chapters and media enter with subtle fade/slide/zoom motion; when `prefers-reduced-motion` is enabled, content renders without motion-heavy transitions. Layout stays readable and tappable on mobile viewport.

## Scope

### In Scope

- `app/story/page.tsx` — Replace current placeholder page with story-page orchestrator.
- `components/story/` — New story feature components and local data/constants.
  - `story-page-shell.tsx` — Top-level client component for story experience.
  - `story-chapter-list.tsx` — Chapter list renderer.
  - `story-chapter-card.tsx` — Single chapter block with text and media slots.
  - `story-image-slot.tsx` — Placeholder image tile with reduced-motion-safe zoom/fade treatment.
  - `story-copy.ts` — `STORY_COPY` constant with intro text and 10 chapter placeholder records for 2016–2025.
  - `story-types.ts` — Local types for chapter records if shape reuse becomes clearer than inline types.
  - `index.ts` — Barrel export for public story components.
- `components/shared/section-wrapper.tsx` — Reuse existing wrapper if sufficient; only extend if story needs minimal extra prop support directly tied to feat-002.
- `components/hero/hero-copy.ts` — Optional minimal copy update only if current `storyPlaceholder` text becomes stale after feat-002 lands.
- `docs/product-specs/feat-002-our-story.md` — Create missing product spec for this feature.
- Harness state:
  - `harness/features/feat-002-our-story.json`
  - `harness/feature_index.json`
  - `harness/progress.md`
- Plan tracking:
  - `docs/exec-plans/index.md`

### Out of Scope

- Real couple story copy beyond bounded placeholders.
- Real wedding image assets or image optimization pipeline work beyond placeholder slots.
- Landing page redesign beyond removing stale story placeholder copy if needed.
- Guest personalization (`feat-003`).
- RSVP form or Google Apps Script integration (`feat-004`).
- Performance optimization pass across whole app (`feat-005`) beyond required lazy-loading and reduced-motion support inside story feature.
- Any backend, auth, or data persistence work.

## Non-negotiable Requirements

- Plan stays self-contained. No hidden assumptions.
- Result must show observable user-facing behavior at `/story` and pass repo verification path.
- Every technical term used here is defined in-place or by file/path reference.
- Source of truth for chapter range is **10 chapters covering 2016–2025**.
- App Router pages stay orchestrators. `app/story/page.tsx` must compose feature components, not hold full feature logic.
- Feature components live under `components/story/`; shared code only moves to `components/shared/` if reused outside this feature.
- Framer Motion only for motion work. No GSAP, CSS animation library, or bespoke animation engine.
- Respect `prefers-reduced-motion` for all chapter/media entrance behavior.
- Story UI text stays Vietnamese; code/comments/docs stay English.
- Kebab-case filenames, PascalCase components, `Props` suffix for props types, absolute `@/...` imports.
- Files over 200 lines should split by concern before merge.
- No UI path may bypass current static content approach. Placeholder content belongs in typed constants/data module, not hardcoded across JSX.
- No new dependency unless plan records exact reason first.

## Progress

- [x] Create `docs/product-specs/feat-002-our-story.md`
- [x] Replace `app/story/page.tsx` placeholder with story orchestrator
- [x] Create `components/story/story-copy.ts` with 10 placeholder chapter records for 2016–2025
- [x] Create story component set under `components/story/`
- [x] Add `components/story/index.ts` barrel export
- [x] Confirm motion path respects `prefers-reduced-motion`
- [x] Confirm story media path uses placeholder slots and does not require real assets
- [x] Verify `pnpm lint`
- [x] Verify `pnpm typecheck`
- [x] Verify `pnpm build`
- [x] Verify `./init.sh`
- [x] Update harness files with evidence and status
- [x] Keep this plan and `docs/exec-plans/index.md` in sync

## Surprises & Discoveries

- `docs/PLANS.md` not present in repo as of 2026-05-05. Template and existing plan patterns in `docs/exec-plans/` become working plan structure source for this session.
- `docs/knowledge/codex-exec-plan.md` not present in repo as of 2026-05-05. No extra repo-specific ExecPlan guidance available beyond template and prior plan.
- `app/story/page.tsx` currently renders only placeholder card using `HERO_COPY.storyPlaceholder`, so feat-002 must replace existing user-visible placeholder rather than add new route.
- `components/story/` currently contains only `.gitkeep`, so feature can choose clean component boundaries without migration burden.

## Decision Log

- **Decision**: Follow harness record for chapter range: 2016–2025.
  - **Rationale**: User confirmed harness range should be source of truth, and harness is continuity record for future sessions.
  - **Date/Author**: 2026-05-05 / Codex

- **Decision**: Use placeholder image slots instead of temporary real image files.
  - **Rationale**: Feature acceptance allows template content; avoiding fake assets keeps scope tight and leaves image optimization to feat-005.
  - **Date/Author**: 2026-05-05 / Codex

- **Decision**: Keep story content as typed constant module inside `components/story/` rather than `lib/`.
  - **Rationale**: Content belongs to single frontend feature and should stay co-located with owning UI unless another feature needs it later.
  - **Date/Author**: 2026-05-05 / Codex

- **Decision**: Use client story components beneath server page orchestrator.
  - **Rationale**: Framer Motion hooks and scroll-triggered variants require client boundary, while App Router page should remain thin.
  - **Date/Author**: 2026-05-05 / Codex

## Outcomes & Retrospective

- `/story` now renders full story experience instead of placeholder card.
- Feature shipped with 10 chapters for 2016–2025, 39 visible media slots, and reduced-motion-safe Framer Motion reveals.
- Scope stayed tight: no guest personalization, RSVP, backend work, or fake image assets added.
- Future content-fill work now has clean drop-in points in `components/story/story-copy.ts` and placeholder slot UI.

## Context and Orientation

Repo orientation for reader with no prior context:

- `app/story/page.tsx` — Current `/story` route. Right now placeholder only. This file should stay orchestration-focused.
- `components/story/` — Empty feature folder reserved for story implementation.
- `components/shared/section-wrapper.tsx` — Existing reusable motion wrapper using `motion.section` and `useReducedMotion()`.
- `components/hero/hero-copy.ts` — Landing-page copy source, includes stale `storyPlaceholder` line currently used by `/story` placeholder.
- `docs/FRONTEND.md` — Frontend rules: subtle Framer Motion, mobile-first, lazy-load heavy animation, max 40 images total across site.
- `harness/features/feat-002-our-story.json` — Feature record with acceptance criteria and placeholder-content rules.
- `harness/feature_index.json` — Sequencing/status record. `feat-002` is next pending feature and blocks part of `feat-005`.

Layer impact using `Types -> Config -> Repo -> Service -> Runtime -> UI` from `ARCHITECTURE.md`:

- **Types**: local story chapter types in feature module if needed.
- **Config**: none expected.
- **Repo**: none; no database or persistent data layer exists for this feature.
- **Service**: none; no API client or business-service boundary touched.
- **Runtime**: Next.js route composition and dynamic import behavior for motion-heavy story UI.
- **UI**: main impact. Story page, chapter cards, image placeholders, intro/outro layout.

Hard dependency checks:

- Lower layers do not depend on higher layers: any local types/data must not import UI components.
- UI does not bypass runtime/service contracts: no direct API calls or new data source should appear in story UI.
- Data access enters through repository or explicit adapter boundaries: not applicable because story data is static typed content local to frontend feature.
- New dependencies: none planned. If motion/lazy-loading can be done with installed Framer Motion + Next.js, do not add packages.

## Standards Enforcement

### Required References

- `AGENTS.md`
- `ARCHITECTURE.md`
- `docs/FRONTEND.md`
- `docs/references/frontend/project-folder-structure.md`
- `docs/references/frontend/component-structure-pattern.md`
- `docs/references/frontend/naming-and-conventions-pattern.md`

### Concrete Coding Constraints From References

- `docs/references/frontend/project-folder-structure.md`
  - Keep route entry in `app/story/page.tsx`.
  - Keep feature-owned UI in `components/story/`.
  - Use absolute imports via `@/...`.
- `docs/references/frontend/component-structure-pattern.md`
  - Export components with `export const` or `export default function`.
  - Add `components/story/index.ts` barrel and export only public components.
  - Split components before any file grows beyond single concern or ~200 lines.
- `docs/references/frontend/naming-and-conventions-pattern.md`
  - Kebab-case filenames like `story-chapter-card.tsx`.
  - Props types named `StoryChapterCardProps`.
  - Text constants grouped under `STORY_COPY` instead of repeated string literals.
  - Comments in English, UI copy in Vietnamese.
- `docs/FRONTEND.md`
  - Use Framer Motion only.
  - Motion style must stay subtle: fade-in, slide-up, gentle zoom.
  - Support `prefers-reduced-motion`.
  - Lazy-load animation-heavy component tree with `next/dynamic` if story shell becomes motion-heavy enough to justify split.
  - Stay mobile-first and keep image count representation within max-40-images product limit; placeholder slots should model 3–5 images per chapter without requiring real files.

## Implementation Notes

### Mandatory Patterns For This Scope

- Co-locate story copy/data with story feature.
- Keep `app/story/page.tsx` thin; push animation and list rendering into `components/story/`.
- Reuse `SectionWrapper` if current API works; avoid broad shared-component refactor unless story feature proves concrete need.
- Placeholder media tiles should communicate future image placement without pretending real assets exist.

### Companion Skills For Implementation Phase

- `tdd-workflow` — drive feature with tests or at minimum verification-first edits around route and render output.
- `documentation-lookup` — check current Next.js 16 docs if dynamic import or App Router behavior becomes unclear.
- `frontend-patterns` — keep component boundaries and client/server split clean.
- `verification-loop` — run repo checks and capture evidence.

### Common Pitfalls To Avoid

- Do not leave `/story` dependent on `HERO_COPY.storyPlaceholder` after feat-002 lands.
- Do not put all 10 chapters inline in `app/story/page.tsx`.
- Do not add fake binary image assets to satisfy placeholder requirement.
- Do not over-animate chapter entry or ignore reduced-motion mode.
- Do not introduce shared abstraction before second concrete consumer exists.

## Plan of Work (Narrative)

### 1. Create product-spec companion for feat-002

Add `docs/product-specs/feat-002-our-story.md` so feature has durable product-level acceptance notes matching harness. Capture page goal, scroll storytelling flow, chapter structure, placeholder-content policy, motion expectations, reduced-motion rule, and max-40-images constraint. This keeps implementation and later content-fill work aligned.

### 2. Replace `/story` placeholder with orchestration-only route

Update `app/story/page.tsx` to stop rendering placeholder card and instead compose story feature entrypoint, likely `StoryPageShell` or similar public component imported from `@/components/story`. Keep route file server-first unless direct client hook need appears. If motion-heavy tree needs client boundary, page should import client component rather than become client component itself.

### 3. Create local story data contract

Create `components/story/story-copy.ts` with `STORY_COPY` constant containing:

- page intro/eyebrow/back-link copy if needed,
- 10 chapter records for years 2016 through 2025,
- per chapter: `year`, `title`, `paragraphs`, `imageSlotCount` or explicit image placeholder labels.

Use Vietnamese placeholder copy that makes unfinished nature obvious without harming UX. Example note style: short emotionally neutral placeholder lines, not lorem ipsum. If shape reuse improves readability, add `components/story/story-types.ts` with local type such as:

```ts
export type StoryChapter = {
  year: number
  title: string
  paragraphs: [string, ...string[]]
  imageSlotCount: 3 | 4 | 5
}
```

Keep type local to feature unless another domain consumes it.

### 4. Build story component tree under `components/story/`

Planned split:

- `story-page-shell.tsx`
  - Own page-level spacing, intro header, optional back link, and chapter list composition.
  - If needed, use `next/dynamic` to lazy-load animated chapter list.
- `story-chapter-list.tsx`
  - Map over chapter records and render `StoryChapterCard`.
- `story-chapter-card.tsx`
  - Render year, title, paragraphs, and media placeholder grid.
  - Apply subtle reveal pattern via Framer Motion or existing `SectionWrapper`.
- `story-image-slot.tsx`
  - Render placeholder box with aspect ratio, slot label, and gentle zoom/fade treatment when in view.
- `index.ts`
  - Export only public story entrypoints.

Do not create extra abstraction layers beyond these unless one file crosses size/clarity threshold.

### 5. Define motion and reduced-motion behavior

Motion behavior should use only accepted patterns from docs:

- chapter container: fade-in + slide-up,
- image slots: gentle zoom/fade,
- no parallax, pinned scroll, or theatrical transforms.

For reduced-motion users:

- disable motion-specific initial/while-in-view transitions,
- preserve exact content order and readability,
- avoid relying on animation for information hierarchy.

If existing `SectionWrapper` already covers chapter-level motion, reuse it. If image-slot animation needs separate local motion variant, keep variant local to story feature rather than bloating shared wrapper.

### 6. Keep placeholder media honest and future-proof

Story acceptance wants 3–5 images per chapter, but real assets are pending. Represent this with styled placeholders rather than nonexistent files. Each chapter should visibly show 3–5 slots so reviewers can verify final layout density. Placeholder labels should make replacement path obvious, such as `Ảnh kỷ niệm 01`, `Ảnh kỷ niệm 02`, etc. This preserves product shape without fake assets.

### 7. Cleanup stale copy only if directly caused by feat-002

If `components/hero/hero-copy.ts` still contains `storyPlaceholder` used nowhere after route rewrite, remove or update only that now-unused field. Do not refactor unrelated landing-page copy.

### 8. Verify and record evidence

Run repo verification path from root. Capture at least:

- `./init.sh` passing transcript,
- route render evidence via `pnpm dev` manual check at `/story`,
- optional screenshot or short notes confirming 10 chapters, mobile readability, and reduced-motion handling.

Then update harness records and mark plan/index status consistently.

## Concrete Steps (Commands)

All commands run from repo root: `/Users/tungdoan/Projects/Web/tx-va-wedding`

```bash
# Baseline verify before edits
./init.sh

# Work on story feature in dev
pnpm dev

# Focused verification
pnpm lint
pnpm typecheck
pnpm build

# Final full verification
./init.sh
```

Expected short outputs:

- `./init.sh` → install/harness checks/lint/typecheck/build all complete without errors.
- `pnpm lint` → `0 errors`, `0 warnings`.
- `pnpm typecheck` → no TypeScript errors.
- `pnpm build` → Next.js production build succeeds.
- `pnpm dev` → local dev server starts; visiting `http://localhost:3000/story` shows 10 chapter story page.

## Validation and Acceptance

### Happy Path

1. Open `http://localhost:3000/story`.
   - Expected: full story page renders, not placeholder card.
2. Scroll through page.
   - Expected: exactly 10 chapters appear in order from 2016 to 2025.
3. Inspect one chapter.
   - Expected: chapter shows year, Vietnamese title, 1–2 short paragraphs, and 3–5 media placeholders.
4. Inspect page on mobile width (~375px).
   - Expected: text remains readable, grids stack cleanly, tap targets usable, no horizontal overflow.

### Validation / Error Paths

- Reduced-motion path:
  - Enable `prefers-reduced-motion` in browser tools.
  - Expected: chapter content still visible and ordered correctly; entrance motion is removed or materially reduced.
- Missing real assets path:
  - Expected: page still renders fully using placeholder slots; no broken-image icons or missing file errors.

### Unauthorized / Forbidden

- Not applicable. Feature has no auth boundary and no protected data path.

### Regression Checks

- Landing page CTA path:
  - Open `/`, click `Xem hành trình`.
  - Expected: navigation still reaches `/story` successfully.
- Existing build path:
  - `./init.sh` still passes after story feature lands.

### Acceptance Artifacts

At least one artifact must be recorded in harness evidence:

- `./init.sh` passing transcript summary, and
- manual verification note: `/story` shows 10 chapters for 2016–2025 with reduced-motion-safe scroll presentation.

## Idempotence & Recovery

- File creation and edits in this feature are safe to re-run.
- No database migrations, no remote APIs, no destructive ops.
- If component split proves awkward, recovery path is local revert of `components/story/` and `app/story/page.tsx` only.
- If dynamic import adds complexity without measurable value, rollback to direct import is safe because no external contract depends on that split.
- `./init.sh`, `pnpm lint`, `pnpm typecheck`, and `pnpm build` are safe to repeat.

## Artifacts and Notes

### Planned Files To Create

| File | Purpose |
| --- | --- |
| `docs/product-specs/feat-002-our-story.md` | Product-level spec and acceptance notes for story feature |
| `components/story/story-copy.ts` | Placeholder chapter data and page copy |
| `components/story/story-page-shell.tsx` | Story page feature entrypoint |
| `components/story/story-chapter-list.tsx` | Chapter list renderer |
| `components/story/story-chapter-card.tsx` | Single chapter renderer |
| `components/story/story-image-slot.tsx` | Placeholder media tile |
| `components/story/index.ts` | Barrel exports for public story components |
| `components/story/story-types.ts` | Optional local type definitions if needed |

### Planned Files To Modify

| File | Change |
| --- | --- |
| `app/story/page.tsx` | Replace placeholder page with story orchestrator |
| `components/shared/section-wrapper.tsx` | Only if minimal extra prop support is directly required |
| `components/hero/hero-copy.ts` | Remove/update stale `storyPlaceholder` only if now unused |
| `harness/features/feat-002-our-story.json` | Update status and evidence |
| `harness/feature_index.json` | Update feat-002 status/evidence |
| `harness/progress.md` | Add session log entry |
| `docs/exec-plans/index.md` | Add plan to Active section |

## Interfaces & Dependencies

### External Dependencies

- **Next.js 16 App Router** — route file `app/story/page.tsx`, optional `next/dynamic` lazy-load path.
- **React 19** — component composition.
- **Framer Motion** — `motion.*`, `whileInView`, `useReducedMotion()` for subtle scroll-triggered UI.
- **Tailwind CSS v4** — layout, spacing, design tokens, responsive classes.

### Internal Dependencies

- `components/shared/section-wrapper.tsx`
  - Current contract:
    ```ts
    type SectionWrapperProps = {
      children: ReactNode
      className?: string
      id?: string
    }
    ```
  - Reuse for chapter-level reveal if enough.
- `components/hero/hero-copy.ts`
  - Current story placeholder text may become orphaned after feat-002.
- `harness/features/feat-002-our-story.json`
  - Acceptance criteria source for chapter count, motion, reduced-motion, lazy-loading, responsive layout, and max-40-images rule.

### No New Dependencies Planned

Story feature should ship using already-installed stack. Add package only if repo verification proves missing capability, and record reason in Decision Log first.

## Verification Path

1. Run `./init.sh` before and after changes.
2. Run `pnpm dev` and manually verify `/story` plus navigation from `/`.
3. Run `pnpm lint`, `pnpm typecheck`, `pnpm build`.
4. Record evidence in harness feature record and progress log.

## Risks and Blockers

- **Risk: Overbuilt motion system**
  - Impact: unnecessary complexity, reduced maintainability.
  - Mitigation: reuse `SectionWrapper`; keep image-slot motion local and minimal.
- **Risk: Placeholder content looks broken instead of intentional**
  - Impact: weak UX, unclear review outcome.
  - Mitigation: use polished Vietnamese placeholder copy and explicit image-slot labels.
- **Risk: Story files grow too large with 10 chapters**
  - Impact: unreadable components.
  - Mitigation: keep data in `story-copy.ts`, split page/list/card/slot files early.
- **Risk: Missing plan-doc sources (`docs/PLANS.md`, `docs/knowledge/codex-exec-plan.md`)**
  - Impact: possible mismatch with intended plan standard.
  - Mitigation: follow available template plus repo's existing feat-001 plan structure; note gap explicitly.
- **Blocker status**: none current.

## Open Decisions

- Whether story shell truly needs `next/dynamic` split, or direct import keeps code simpler while still meeting performance rule.
- Whether chapter placeholder paragraphs should be 1 or 2 by default for all records, or mixed to better preview final cadence.
- Whether `SectionWrapper` should gain variant props, or story feature should own any extra motion details locally.

## Harness Integration

- `harness/features/feat-002-our-story.json`
  - Move status `pending` → `in-progress` when implementation starts.
  - Move to `done` only after verification commands pass.
  - Add evidence string mentioning `./init.sh`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, and manual `/story` validation.
- `harness/feature_index.json`
  - Mirror feat-002 status/evidence with same completion facts.
- `harness/progress.md`
  - Add newest-first session entry for plan creation, later implementation session, blockers, next steps.
- `harness/session-handoff.md`
  - Update only if implementation session stops mid-feature.

## Progress Log

- 2026-05-05 — Plan created for `feat-002` with scope fixed to frontend story route and chapter placeholder system. Missing `docs/PLANS.md` and `docs/knowledge/codex-exec-plan.md` noted as repo gaps, not blockers.
- 2026-05-05 — Implementation completed. `/story` now uses lazy-loaded shell, feature-owned chapter data, 10 ordered chapters, placeholder image slots, and reduced-motion-safe motion. Verification passed with `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `./init.sh`.

## Multi-session Checklist

- [x] Owner: coding-agent — create product spec and story copy data
- [x] Owner: coding-agent — implement story component tree
- [x] Owner: coding-agent — wire `/story` route and optional stale-copy cleanup
- [x] Owner: coding-agent — run verification commands and capture evidence
- [x] Owner: coding-agent — update harness state and plan/index status

## Current Step

- **Owner**: coding-agent
- **Status**: completed
- **Task**: feature delivered and verified; next owner should pick next pending feature
