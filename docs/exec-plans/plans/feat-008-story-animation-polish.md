# feat-008: Story Animation Polish

## Title

Add per-image reveal animations (fade-in, gentle zoom) to story chapter photos with scroll-triggered Framer Motion effects, respecting reduced-motion preferences and mobile performance constraints.

## Purpose / Big Picture

Story chapter image slots currently render as static dashed-border placeholders with no entrance animation. This feature adds subtle, scroll-triggered reveal animations to each image slot so that as the user scrolls through the story, photos (and placeholders) fade in with a gentle zoom effect — matching the wedding aesthetic described in `docs/FRONTEND.md` and `docs/PRODUCT.md`.

**User-visible behaviour**: Guest scrolls through `/story` and sees each chapter's image slots smoothly fade in with a gentle zoom as they enter the viewport. Animations are subtle and elegant, not flashy. When the user has `prefers-reduced-motion` enabled, all animations are disabled and content appears immediately. On mobile devices, animations remain smooth without jank or stagger delays.

## Scope

### In Scope

- `components/story/story-image-slot.tsx` — Add Framer Motion `whileInView` animation (fade-in + gentle zoom) with `useReducedMotion()` guard.
- `components/story/story-chapter-card.tsx` — Minor adjustment only if animation context or stagger orchestration requires parent-level changes.
- `components/story/index.ts` — Update barrel export only if component naming changes.
- Harness state:
  - `harness/features/feat-008-story-animation-polish.json`
  - `harness/feature_index.json`
  - `harness/progress.md`
- Plan tracking:
  - `docs/exec-plans/index.md`

### Out of Scope

- New product features: new story content, new chapters, new image assets, dark mode, music, gallery.
- Changes to `SectionWrapper` animation behavior (already handles chapter-level reveal).
- Changes to landing page (`/`) animations.
- RSVP form or guest personalization changes.
- Real production photo assets (still deferred per tech-debt tracker).
- Performance optimization beyond animation density control (feat-005 scope).
- Accessibility audit beyond reduced-motion support (feat-009 scope).

## Non-negotiable Requirements

- Plan stays self-contained. No hidden assumptions.
- Result must produce observable animation behaviour on `/story` page.
- Acceptance criteria source of truth remains `harness/features/feat-008-story-animation-polish.json`.
- Framer Motion is the sole animation library. No CSS animation libraries, no GSAP.
- Animations must be subtle: fade-in (opacity 0→1) and gentle zoom (scale ~1.03→1). No flashy effects.
- `prefers-reduced-motion` must be fully respected: animations disabled when user prefers reduced motion.
- No per-card stagger on mobile. All image slots within a chapter animate together when they enter viewport.
- Animation must work with both placeholder slots and real `next/image` content.
- `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `./init.sh` must pass.
- Code/comments in English; UI copy in Vietnamese.

## Progress

- [ ] Add Framer Motion animation to `StoryImageSlot` component
- [ ] Verify reduced-motion support works correctly
- [ ] Verify animation density is bounded (no stagger on mobile)
- [ ] Verify `pnpm lint`, `pnpm typecheck`, `pnpm build`, `./init.sh`
- [ ] Update harness files with evidence

## Surprises & Discoveries

- `StoryImageSlot` already has `'use client'` directive but currently uses no client-side hooks. Adding Framer Motion makes this directive necessary again (it was previously unnecessary after feat-005 removed per-slot animation).
- `SectionWrapper` already provides chapter-level fade-in + slide-up animation. Per-image animations layer on top of this, creating a two-tier reveal: chapter card slides in, then images within fade in with zoom.
- `story-chapter-card.tsx` is a server component that imports client components (`SectionWrapper`, `StoryImageSlot`). This pattern is correct in Next.js App Router and does not need to change.

## Decision Log

- **Decision**: Add animation directly to `StoryImageSlot` rather than creating a separate wrapper component.
  - **Rationale**: `StoryImageSlot` is the single owner of image slot rendering. Adding animation here keeps the concern co-located. A separate wrapper would add indirection for a single-use animation that only applies to this component.
  - **Date/Author**: 2026-05-05 / session

- **Decision**: Use `whileInView` with `viewport={{ once: true, amount: 0.2 }}` for per-image reveal, matching `SectionWrapper`'s viewport configuration.
  - **Rationale**: Consistent trigger behavior across the story page. `once: true` prevents re-animation on scroll-back, keeping performance bounded. `amount: 0.2` triggers when 20% of the element is visible, which is early enough for a smooth feel.
  - **Date/Author**: 2026-05-05 / session

- **Decision**: No stagger between images within a chapter. All image slots animate together when they enter viewport.
  - **Rationale**: Acceptance criteria explicitly state "no per-card stagger that causes jank" on mobile. Staggered animations multiply layout recalculations and can cause visible jank on lower-end devices. Simultaneous reveal is simpler and more performant.
  - **Date/Author**: 2026-05-05 / session

- **Decision**: Use `scale` transform for gentle zoom (1.03→1) rather than `scaleX`/`scaleY` or CSS `transform-origin` tricks.
  - **Rationale**: Uniform scale is simpler, more performant (single transform), and matches the "gentle zoom" described in product spec. No need for directional zoom.
  - **Date/Author**: 2026-05-05 / session

- **Decision**: Keep `'use client'` on `StoryImageSlot` since Framer Motion hooks require client-side rendering.
  - **Rationale**: The acceptance criterion about removing unnecessary `'use client'` was written when feat-005 removed per-slot animation. Now that we're adding it back, the directive is necessary again.
  - **Date/Author**: 2026-05-05 / session

## Outcomes & Retrospective

- Target outcome: Story image slots animate smoothly into view with fade-in and gentle zoom on scroll. Reduced-motion users see no animation. Mobile performance is not degraded.
- Success is verified by: visual inspection of `/story` page, reduced-motion toggle test, and passing build checks.

## Context and Orientation

Repo orientation for reader with no prior context:

- `components/story/story-image-slot.tsx` — Current placeholder image slot with `'use client'` directive. Renders a dashed-border box with slot label. This is the primary file to modify.
- `components/story/story-chapter-card.tsx` — Server component rendering a single chapter card. Uses `SectionWrapper` for chapter-level animation and `StoryImageSlot` for each image slot.
- `components/story/story-chapter-list.tsx` — Server component mapping `STORY_CHAPTERS` to `StoryChapterCard` components.
- `components/story/story-page-shell.tsx` — Client component shell for the story page. Intro header, chapter list, and back link.
- `components/story/story-copy.ts` — Static copy and chapter data. No changes needed.
- `components/story/story-types.ts` — `StoryChapter` type definition. No changes needed.
- `components/shared/section-wrapper.tsx` — Shared Framer Motion reveal wrapper. Uses `motion.section` with `whileInView`, `useReducedMotion()`, and `viewport={{ once: true, amount: 0.2 }}`. This is the reference pattern for animation implementation.
- `app/story/page.tsx` — Story route with dynamic import of `StoryPageShell`. No changes needed.

Layer impact using `Types -> Config -> Repo -> Service -> Runtime -> UI` from `ARCHITECTURE.md`:

- **Types**: No new types needed. `StoryImageSlotProps` remains `{ chapterIndex: number; slotIndex: number }`.
- **Config**: No config changes.
- **Repo**: No data layer changes.
- **Service**: No service changes.
- **Runtime**: No route or loading changes.
- **UI**: Primary impact. `StoryImageSlot` gains Framer Motion animation. This is a UI-layer-only change.

Hard dependency checks:

- Lower layers do not depend on higher layers: ✅ (no lower-layer changes).
- UI does not bypass runtime/service contracts: ✅ (animation is purely client-side rendering).
- Data access enters through repository or explicit adapter boundaries: ✅ (no data access changes).
- New dependencies: None. Framer Motion is already a project dependency.

## Standards Enforcement

### Required References

- `AGENTS.md`
- `ARCHITECTURE.md`
- `docs/FRONTEND.md`
- `docs/references/frontend/project-folder-structure.md`
- `docs/references/frontend/component-structure-pattern.md`
- `docs/references/frontend/naming-and-conventions-pattern.md`
- `docs/references/shared/type-naming-pattern.md`

Optional-but-relevant references not present in repo:

- `docs/references/frontend/i18n-label-pattern.md` — not present; apply Vietnamese UI / English code rule from `docs/FRONTEND.md`.
- `docs/references/frontend/form-pattern.md` — not applicable (no forms).
- `docs/references/frontend/dialog-and-form-pattern.md` — not applicable.
- `docs/references/frontend/api-react-query-pattern.md` — not applicable.
- `docs/references/frontend/zustand-store-pattern.md` — not applicable.

### Concrete Coding Constraints From References

- `docs/references/frontend/project-folder-structure.md`
  - Keep animation logic in `components/story/` feature folder.
  - No new folders needed; modify existing `story-image-slot.tsx`.
- `docs/references/frontend/component-structure-pattern.md`
  - Export through `components/story/index.ts` barrel if component name changes.
  - Keep file under 200 lines; current file is 26 lines, adding animation will stay well under limit.
  - Component uses `export const` pattern.
- `docs/references/frontend/naming-and-conventions-pattern.md`
  - Use kebab-case filenames (already followed).
  - Use PascalCase component names (already followed).
  - Import order: third-party first → blank line → internal `@/`.
  - Comments in English, UI copy in Vietnamese.
- `docs/references/shared/type-naming-pattern.md`
  - Props type suffix: `StoryImageSlotProps` (already correct).
  - No new types needed for this feature.
- `docs/FRONTEND.md`
  - Framer Motion only. No CSS animation libraries, no GSAP.
  - Subtle animations: fade-in, slide-up, gentle zoom. No flashy effects.
  - Scroll-triggered via `whileInView`.
  - Always respect `prefers-reduced-motion`.
  - Lazy-load animation-heavy components with `next/dynamic` (already done at route level).
- `ARCHITECTURE.md`
  - Animation via Framer Motion only.
  - Client-first rendering for interactive components.
  - Mobile-first design.

## Implementation Notes

### Mandatory Patterns For This Scope

- Use `motion.div` from Framer Motion for the animated wrapper inside `StoryImageSlot`.
- Use `useReducedMotion()` hook to detect reduced-motion preference, matching `SectionWrapper` pattern.
- Use `whileInView` with `viewport={{ once: true, amount: 0.2 }}` for scroll-triggered reveal.
- Animation variants: `initial={{ opacity: 0, scale: 1.03 }}` → `whileInView={{ opacity: 1, scale: 1 }}`.
- Transition: `duration: 0.5, ease: 'easeOut'` (slightly faster than SectionWrapper's 0.6s to create a layered feel).
- When `shouldReduceMotion` is true, set `initial` to `false` and `whileInView` to `undefined` (matching SectionWrapper pattern).
- No stagger between images. All slots in a chapter animate simultaneously.

### Companion Skills For Implementation Phase

- `frontend-patterns` — for React/Framer Motion animation patterns and component structure.
- `verification-loop` — for build checks and visual verification.

### Common Pitfalls To Avoid

- Do not add stagger delays between image slots — this causes mobile jank.
- Do not use CSS animations or GSAP — Framer Motion only per `ARCHITECTURE.md`.
- Do not remove `'use client'` from `StoryImageSlot` — it's needed for Framer Motion hooks.
- Do not change `SectionWrapper` animation behavior — it handles chapter-level reveal; per-image animation is additive.
- Do not add new dependencies — Framer Motion is already installed.
- Do not change `story-chapter-card.tsx` to a client component — it correctly remains a server component importing client components.
- Do not make animations flashy — keep them subtle (fade + gentle zoom only).

## Plan of Work (Narrative)

### 1. Add Framer Motion animation to `StoryImageSlot`

Modify `components/story/story-image-slot.tsx`:

- Import `motion` and `useReducedMotion` from `framer-motion`.
- Use `useReducedMotion()` to detect user preference.
- Wrap the existing placeholder content in a `motion.div` with:
  - `initial={{ opacity: 0, scale: 1.03 }}` when animation is enabled, `false` when reduced-motion.
  - `whileInView={{ opacity: 1, scale: 1 }}` when animation is enabled, `undefined` when reduced-motion.
  - `viewport={{ once: true, amount: 0.2 }}` for scroll-trigger timing.
  - `transition={{ duration: 0.5, ease: 'easeOut' }}` for smooth reveal.
- Keep the existing placeholder UI (dashed border, label text) unchanged inside the animated wrapper.
- The `'use client'` directive remains since Framer Motion hooks require client-side rendering.

### 2. Verify animation behavior

- Run `pnpm dev` and navigate to `/story`.
- Scroll through chapters and verify each image slot fades in with a gentle zoom.
- Toggle `prefers-reduced-motion` in browser DevTools and verify animations are disabled.
- Verify no stagger between images within a chapter.
- Verify mobile viewport (375px) shows smooth animation without jank.

### 3. Run build verification

- `pnpm lint` — 0 errors.
- `pnpm typecheck` — no TypeScript errors.
- `pnpm build` — production build succeeds.
- `./init.sh` — all checks pass.

### 4. Update harness files

- Update `harness/features/feat-008-story-animation-polish.json` with status `done` and evidence.
- Update `harness/feature_index.json` feat-008 status to `done`.
- Update `harness/progress.md` with session log.
- Update `docs/exec-plans/index.md` to move feat-008 to Completed section.

## Concrete Steps (Commands)

All commands run from repo root (`/Users/tungdoan/Projects/Web/tx-va-wedding`).

```bash
# 1. Baseline verification before edits
./init.sh

# 2. Focused static checks during implementation
pnpm lint
pnpm typecheck
pnpm build

# 3. Final full verification
./init.sh
```

Expected short outputs:

- `./init.sh` → install/harness checks complete, lint passes, type-check passes, build passes.
- `pnpm lint` → 0 errors.
- `pnpm typecheck` → no type errors.
- `pnpm build` → production build succeeds, `/story` route statically generated.

## Validation and Acceptance

### Happy Path

1. Navigate to `/story` on desktop browser.
2. Scroll through chapters. Each image slot fades in with a gentle zoom as it enters the viewport.
3. Animations are subtle — no flashy effects, no bouncing, no excessive motion.
4. Once animated, slots stay visible (no re-animation on scroll-back due to `once: true`).

### Validation / Error Paths

1. Toggle `prefers-reduced-motion: reduce` in browser DevTools.
2. Reload `/story` and scroll through chapters.
3. All image slots appear immediately with no animation.
4. Content is fully visible and readable regardless of motion preference.

### Mobile Performance

1. Open `/story` on mobile viewport (375px width) or Chrome DevTools mobile emulation.
2. Scroll through chapters. Animations are smooth with no visible jank.
3. No stagger delay between images within a chapter — all animate together.

### Regression Checks

1. Chapter-level `SectionWrapper` animation still works (fade-in + slide-up for each card).
2. Story page intro header and back link render correctly.
3. Story page lazy-loading via `next/dynamic` still works.
4. Landing page (`/`) is unaffected.
5. `pnpm lint`, `pnpm typecheck`, `pnpm build` all pass.

### Acceptance Artifacts

- Build transcript from `./init.sh`.
- Visual confirmation of animation behavior on `/story` page.
- Reduced-motion toggle test confirmation.

## Idempotence & Recovery

- Code edits are safe to re-run. No data migrations or destructive operations.
- If animation causes performance issues, rollback is a simple `git revert` of the `story-image-slot.tsx` change.
- The `'use client'` directive was already present before this change, so reverting animation code returns to the exact prior state.

## Artifacts and Notes

- Required evidence destinations:
  - `harness/features/feat-008-story-animation-polish.json`
  - `harness/progress.md`
- Keep evidence concise: exact commands, exact verification notes.

## Interfaces & Dependencies

- `framer-motion` — already installed project dependency. Uses `motion` component and `useReducedMotion` hook.
- `components/shared/section-wrapper.tsx` — reference pattern for `whileInView` + `useReducedMotion` animation. No changes needed.
- `components/story/story-chapter-card.tsx` — parent component rendering `StoryImageSlot`. No changes needed.
- `app/story/page.tsx` — route-level dynamic import boundary. No changes needed.

No external API or backend dependency changes.