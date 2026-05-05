# feat-005: Performance & Mobile Optimization

## Title

Ship cross-site image, bundle, and mobile optimizations for landing and story experiences.

## Purpose / Big Picture

Improve wedding site so guests on mobile connections get fast, stable, polished experience instead of heavy first load, layout shifts, or scroll lag. This feature must convert current placeholder/animation-heavy frontend into production-ready mobile-first delivery by optimizing images, deferring non-critical story code, and tightening responsive behavior across landing page and `/story`.

**User-visible behaviour**: Guest opens `/` on mobile and sees above-the-fold content load quickly, with no visible jump when media appears, tappable controls, readable spacing, and stable layout. Guest opens `/story` and gets same chapter content with smoother loading because heavy story UI is lazy-loaded and image slots resolve through `next/image`-based responsive media once assets exist. Reviewers can verify responsive layout at `375px`, `414px`, and `768px`, confirm Lighthouse performance score above `90`, and confirm initial load stays under `2s` on 3G-throttled baseline for critical route checks.

## Scope

### In Scope

- `app/page.tsx` — only minimal orchestration changes if performance boundaries require route-level dynamic import or image priority wiring.
- `app/story/page.tsx` — tune existing dynamic-import boundary and loading fallback only if required for bundle or UX improvement.
- `components/hero/hero-section.tsx` — replace non-optimized media or iframe loading choices only where directly needed for performance/mobile pass.
- `components/hero/hero-copy.ts` — minimal copy or asset metadata changes only if required for responsive image rendering.
- `components/story/`
  - `story-page-shell.tsx`
  - `story-chapter-list.tsx`
  - `story-chapter-card.tsx`
  - `story-image-slot.tsx`
  - `story-copy.ts`
  - `index.ts`
  - plus new internal image/render helpers if needed
- `components/shared/section-wrapper.tsx` — only if motion behavior must be tightened to reduce scroll cost while preserving reduced-motion support.
- `public/images/` — production-ready wedding media assets converted to WebP and/or AVIF, named in kebab-case, sized for actual UI slots.
- `public/guests/` — guest-specific image optimization if existing guest asset remains part of landing-page personalization path.
- `docs/product-specs/feat-005-performance-mobile-optimization.md` — feature-specific acceptance, viewport checks, asset inventory, and measurement notes.
- Harness state:
  - `harness/features/feat-005-performance-optimization.json`
  - `harness/feature_index.json`
  - `harness/progress.md`
- Plan tracking:
  - `docs/exec-plans/index.md`

### Out of Scope

- New product features: music, fullscreen gallery, dark mode, QR codes, analytics, or new story content.
- RSVP flow redesign or Apps Script contract changes beyond keeping embed/form routes light.
- Guest-personalization behavior changes beyond image optimization for already-supported optional guest media.
- CDN/provider changes, custom image loader infrastructure, or third-party performance tooling beyond browser/Lighthouse verification.
- Backend, database, auth, cookies, or server API work.
- Broad visual redesign unrelated to mobile readability, tap targets, or layout stability.
- Speculative abstractions for future media pipelines.

## Non-negotiable Requirements

- Plan stays self-contained. No hidden assumptions.
- Result must produce observable performance and mobile behavior, not only code cleanup.
- Acceptance criteria source of truth remains `harness/features/feat-005-performance-optimization.json`.
- All user-facing route media must use Next.js `<Image>` with explicit `width`, `height`, and `sizes`, unless asset is purely decorative CSS and intentionally not content media.
- Photo assets shipped for this feature must be WebP primary, with AVIF used when supported by repo workflow and not creating duplicate maintenance burden.
- Above-the-fold landing hero media may use `priority`; non-critical media must stay lazy.
- Story route must keep dynamic import boundary for heavy animation tree, and any extra heavy subsections must not regress bundle size.
- Layout must stay stable: no image layout shift, no collapsing placeholder areas, no major scroll jump when content appears.
- Mobile-first verification must cover `375px`, `414px`, and `768px` widths.
- Performance target: under `2s` initial load on 3G throttle for critical landing-page path, with documented measurement method in product spec and progress log.
- Lighthouse performance target: `>90` for representative page under documented test setup.
- App Router pages remain orchestrators. Feature components own rendering details.
- No new dependency unless exact reason and benefit are documented first. Prefer current Next.js 16, React 19, Tailwind v4, and Framer Motion stack.
- Keep code/comments/docs English; UI copy Vietnamese.
- Files over 200 lines split by concern before merge.

## Progress

- [ ] Create `docs/product-specs/feat-005-performance-mobile-optimization.md` with measurable acceptance and asset inventory
- [ ] Audit current media/render paths on landing page, story page, guest personalization path, and map/embed cost
- [ ] Replace placeholder or inline media rendering with `next/image`-based responsive image components where real assets now exist
- [ ] Add optimized site image assets in `public/images/` and optimize existing guest asset path in `public/guests/` as needed
- [ ] Ensure every shipped content image has explicit intrinsic dimensions and `sizes`
- [ ] Confirm story route lazy-load boundary remains effective and loading fallback stays lightweight
- [ ] Split or defer any heavy story-only rendering work that still lands in initial bundle
- [ ] Tighten mobile spacing, text sizing, grid behavior, and tap targets at `375px`, `414px`, and `768px`
- [ ] Verify no image layout shift on `/` and `/story`
- [ ] Verify scroll remains smooth and reduced-motion path still works
- [ ] Capture Lighthouse score evidence and throttled-load evidence
- [ ] Verify `pnpm lint`
- [ ] Verify `pnpm typecheck`
- [ ] Verify `pnpm build`
- [ ] Verify `./init.sh`
- [ ] Update harness files with status, evidence, and next-step notes
- [ ] Keep this plan and `docs/exec-plans/index.md` in sync

## Surprises & Discoveries

- `docs/PLANS.md` not present in repo as of 2026-05-05. `docs/exec-plans/__plan-template__.md` and existing ExecPlans remain structure source.
- `docs/knowledge/codex-exec-plan.md` not present in repo as of 2026-05-05. No extra repo-local plan guidance available beyond template, harness docs, and prior plans.
- `harness/features/feat-005-performance-optimization.json` is only canonical source containing explicit feat-005 acceptance criteria.
- `public/images/` currently has no production image assets, so feat-005 must either introduce first real site images or explicitly keep story placeholders while optimizing all real media currently present.
- Existing `/story` route already uses `next/dynamic` in `app/story/page.tsx`; feat-005 should preserve and validate this boundary instead of reinventing route splitting.
- Current guest photo asset is `public/guests/anh-tu.svg`; acceptance says WebP/AVIF for images, so implementation must decide whether guest-photo path remains SVG illustration or converts to optimized photo asset and document rationale.
- Landing page still contains Google Maps iframe inside hero card. This may be main non-image cost on mobile and must be measured before deciding whether to defer or keep eager.
- `feat-004` remains in-progress. feat-005 must avoid absorbing RSVP product work, but should leave room for later form/mobile polish if RSVP lands before final perf pass closes.

## Decision Log

- **Decision**: Treat feat-005 as frontend-only cross-cutting work, not backend or fullstack work.
  - **Rationale**: All acceptance criteria concern client rendering, route loading, image formats, layout stability, and viewport behavior. No server contract changes required.
  - **Date/Author**: 2026-05-05 / Codex

- **Decision**: Use product-spec companion doc to lock measurement method and asset inventory before implementation starts.
  - **Rationale**: Performance work becomes ambiguous fast unless exact pages, throttling setup, and asset list are written down first.
  - **Date/Author**: 2026-05-05 / Codex

- **Decision**: Reuse existing `next/dynamic` route split for `/story`, then refine inside that boundary only if evidence shows more deferral needed.
  - **Rationale**: Current code already follows repo animation-loading rule. Surgical validation beats speculative restructuring.
  - **Date/Author**: 2026-05-05 / Codex

- **Decision**: Keep page routes thin and push image/render behavior into feature components or local helpers.
  - **Rationale**: Matches `ARCHITECTURE.md`, `FRONTEND.md`, and frontend reference patterns.
  - **Date/Author**: 2026-05-05 / Codex

- **Decision**: Measure map/embed impact explicitly before changing venue experience.
  - **Rationale**: Iframe may dominate mobile load cost. Plan must allow evidence-based choice instead of automatic removal.
  - **Date/Author**: 2026-05-05 / Codex

## Outcomes & Retrospective

- Target outcome: landing and story experiences remain visually same in intent but load faster, shift less, and behave better on narrow mobile devices.
- Scope stays bounded to performance/mobile readiness, not feature redesign.
- Success evidence should include at least one concrete artifact set: Lighthouse transcript/screenshot, throttled network timing note, and manual viewport validation notes.

## Context and Orientation

Repo orientation for reader with no prior context:

- `app/page.tsx` — landing-page route. Currently server component resolving optional guest personalization and rendering `<HeroSection guest={guest} />`.
- `components/hero/hero-section.tsx` — landing-page UI with CTA buttons, event cards, venue card, Google Maps iframe, and RSVP placeholder section.
- `app/story/page.tsx` — thin route already lazy-loading `StoryPageShell` with `next/dynamic`.
- `components/story/story-page-shell.tsx` — story route shell with intro, chapter list, and back link.
- `components/story/story-chapter-card.tsx` and `story-image-slot.tsx` — chapter rendering and current media placeholder path.
- `components/shared/section-wrapper.tsx` — shared Framer Motion reveal wrapper used by landing/story sections.
- `public/images/` — intended home for optimized wedding photos; currently empty except `.gitkeep`.
- `public/guests/anh-tu.svg` — only current guest-specific asset.
- `docs/PRODUCT.md` sections `3.5 Performance Optimization` and `3.6 Mobile Optimization` — product-level source for fast mobile load, dynamic import, lazy load, readable sizing, and scroll smoothness.
- `docs/FRONTEND.md` — mandatory frontend rules for `<Image>`, WebP/AVIF, lazy loading, mobile-first design, max-40-images limit, and animation lazy-loading.
- `harness/features/feat-005-performance-optimization.json` — canonical feat-005 acceptance criteria and note that this is a cross-cutting feature.

Layer impact using `Types -> Config -> Repo -> Service -> Runtime -> UI` from `ARCHITECTURE.md`:

- **Types**: optional local image metadata types or prop types for optimized image components.
- **Config**: no new config expected unless image metadata constants or route-level tuning values need local constants; no environment variables required.
- **Repo**: none inside app runtime; static assets under `public/` are primary data source touched by this feature.
- **Service**: none expected unless RSVP route integration or asset helper wrapper needs tiny utility. No network/business-service layer target for feat-005.
- **Runtime**: route code-splitting, image loading behavior, iframe deferral behavior if changed, responsive rendering, motion execution cost.
- **UI**: main impact. Landing hero, venue/media blocks, story chapters/media slots, guest-photo presentation, responsive spacing/typography.

Hard dependency checks:

- Lower layers do not depend on higher layers: image metadata helpers or asset constants must not import components.
- UI does not bypass runtime/service contracts: route pages keep orchestration role; media rendering logic lives in components/helpers.
- Data access enters through repository or explicit adapter boundaries: not applicable for static media beyond `public/` assets and existing Apps Script flow untouched by this plan.
- New dependencies: none planned. If image-conversion tooling or measurement tooling is introduced, plan must document exact reason first.

## Standards Enforcement

### Required References

- `AGENTS.md`
- `ARCHITECTURE.md`
- `docs/FRONTEND.md`
- `docs/references/frontend/project-folder-structure.md`
- `docs/references/frontend/component-structure-pattern.md`
- `docs/references/frontend/naming-and-conventions-pattern.md`
- `docs/references/shared/type-naming-pattern.md`
- `docs/references/frontend/i18n-label-pattern.md` — not present in repo; apply Vietnamese UI / English code rule from `docs/FRONTEND.md` and naming reference.

Optional-but-relevant references absent in repo, so convert requirement into concrete constraints here instead of blocking plan:

- `docs/references/frontend/api-react-query-pattern.md` — not applicable; feat-005 does not add client API query layer.
- `docs/references/frontend/form-pattern.md` — not primary scope; RSVP perf follow-up stays out unless form already landed and needs bounded mobile polish.
- `docs/references/frontend/dialog-and-form-pattern.md` — not applicable.
- `docs/references/frontend/zustand-store-pattern.md` — not applicable; no store work planned.

### Concrete Coding Constraints From References

- `docs/references/frontend/project-folder-structure.md`
  - Keep route files in `app/` orchestration-only.
  - Keep feature-owned UI in `components/hero/`, `components/story/`, and `components/guest/`.
  - Keep shared helpers in `lib/` only if reused across multiple features.
  - Store optimized assets under `public/images/` and `public/guests/` with kebab-case names.
- `docs/references/frontend/component-structure-pattern.md`
  - Export public feature entrypoints through folder `index.ts` files only.
  - Split files once a component mixes layout, data mapping, and image metadata logic or exceeds ~200 lines.
  - Keep internal helper components out of public barrels.
- `docs/references/frontend/naming-and-conventions-pattern.md`
  - Use kebab-case filenames.
  - Use PascalCase component names and `Props` suffix for props.
  - Use domain constants for media metadata and copy rather than duplicated literals.
  - Keep comments in English and UI copy in Vietnamese.
- `docs/references/shared/type-naming-pattern.md`
  - Name shared image metadata types with domain meaning (`HeroImageAsset`, `StoryImageAsset`, `GuestImageAsset`) and keep them narrow.
  - Co-locate types with feature unless reused across features.
- `docs/FRONTEND.md`
  - Use Next.js `<Image>` with explicit dimensions and `sizes`.
  - Prefer WebP primary and AVIF where supported.
  - Lazy-load non-critical media.
  - Keep total site image count at or under 40.
  - Lazy-load animation-heavy components with `next/dynamic`.
  - Stay mobile-first and keep scroll smooth.
- `ARCHITECTURE.md`
  - Image optimization is mandatory for production.
  - Framer Motion remains sole animation system.
  - Client-first rendering stays intact; no backend added.

## Implementation Notes

### Mandatory Patterns For This Scope

- Measure before refactoring. Record current route cost and bottlenecks first.
- Prefer exact `next/image` conversion and responsive sizing over generic wrapper abstractions.
- Preserve `app/story/page.tsx` lazy-load seam and keep loading fallback cheap.
- Replace placeholder media with real optimized assets only when assets are available and bounded within image-count limit.
- If real story photos are still unavailable, optimize all actual images now and document remaining placeholder limitation explicitly instead of faking completion.
- Keep map/embed handling surgical: defer, lazy-show, or keep as-is only with measurement evidence.

### Companion Skills For Implementation Phase

- `tdd-workflow` — drive measurable regressions first, especially for helper logic and route/render verification.
- `documentation-lookup` — confirm Next.js 16 `<Image>` and `next/dynamic` behavior if version-specific questions appear.
- `frontend-patterns` — keep component boundaries, responsive layout changes, and asset rendering clean.
- `verification-loop` — required for repeated perf/mobile validation, build checks, and acceptance evidence.
- `security-review` — low-to-medium relevance only if RSVP/mobile pass touches form inputs or embed constraints; otherwise bounded review of external iframe changes.

### Common Pitfalls To Avoid

- Do not claim feat-005 complete while `public/images/` is empty unless plan explicitly narrows completion to currently shipped real media and logs deferred tech debt.
- Do not convert route files into large client components.
- Do not use `next/image` without `sizes`; this defeats responsive optimization.
- Do not preload non-critical story media.
- Do not keep layout-shifting placeholders or unknown intrinsic dimensions.
- Do not add broad styling churn unrelated to mobile readability and stable layout.
- Do not let performance work silently change product copy or feature behavior.

## Plan of Work (Narrative)

### 1. Lock acceptance and measurement method in product spec

Create `docs/product-specs/feat-005-performance-mobile-optimization.md` first. This doc must define exact pages under test (`/` and `/story`), viewport matrix (`375px`, `414px`, `768px`), network throttle setup for mobile baseline, Lighthouse run mode, and asset inventory. It must also state what counts as acceptance when story still contains placeholders versus when real photos are available. Without this, implementation can drift into subjective “feels faster” claims.

Recommended spec sections:

- user goal and non-goals,
- tested routes,
- asset inventory table (`path`, `format`, `dimensions`, `used by`, `priority/lazy`),
- viewport checklist,
- measurement procedure,
- acceptance artifact list.

### 2. Audit existing rendering and bundle seams before edits

Review current landing and story code paths:

- `app/page.tsx` → `HeroSection`
- `app/story/page.tsx` → dynamic `StoryPageShell`
- `components/hero/hero-section.tsx`
- `components/story/story-page-shell.tsx`
- `components/story/story-chapter-card.tsx`
- `components/story/story-image-slot.tsx`
- `components/shared/section-wrapper.tsx`

Goal of audit:

1. identify real media already shipped,
2. identify layout-shift risk,
3. identify expensive above-the-fold content,
4. confirm current dynamic-import boundary,
5. decide whether map iframe or animation wrappers need deferral/tuning.

Record findings in plan progress and product spec before making code changes.

### 3. Introduce optimized image assets and metadata only where real media exists

If production wedding photos are now available, add optimized files under `public/images/` in WebP and optionally AVIF format. Each asset should have known intrinsic dimensions and a single owning UI slot. Use asset metadata constants or local typed records to avoid scattering raw numbers across JSX.

Likely targets:

- landing hero image,
- story chapter images if placeholder path is replaced with real photos,
- optional guest photo asset if still part of landing experience.

If story photos are not yet available, do not fake full-image completion. Instead:

- optimize any real landing/guest media now,
- keep story placeholders stable and lightweight,
- log remaining story-photo conversion work to `docs/exec-plans/tech-debt-tracker.md` only if feat-005 cannot fully satisfy image criteria without pending assets.

### 4. Convert UI media rendering to `next/image`

Update feature components that render actual content images so each uses `<Image>` with:

- explicit `src`, `alt`, `width`, `height`, and `sizes`,
- `priority` only for above-the-fold landing hero image,
- default lazy loading for all other images,
- stable wrapper sizing to prevent layout shift.

Likely file edits:

- `components/hero/hero-section.tsx` — mount optimized hero or venue/supporting image if design includes one.
- `components/story/story-image-slot.tsx` — either remain placeholder-only with fixed aspect-ratio shells, or render real optimized images through prop-driven metadata.
- `components/story/story-chapter-card.tsx` — pass image metadata into slot renderer if story images land in this feature.
- `components/guest/guest-personalization.tsx` or related guest component — convert optional guest photo path to stable optimized rendering if not already.

Keep image logic co-located. Do not introduce cross-site media framework unless at least two features need same helper.

### 5. Tighten route splitting and expensive non-image content

Keep `app/story/page.tsx` dynamic import. Validate whether current fallback is cheap enough and whether additional heavy child work should stay inside story route only. If performance evidence shows venue map iframe hurts initial landing load, evaluate bounded options in this order:

1. keep iframe but ensure `loading='lazy'` and stable container,
2. defer iframe behind user action or below-the-fold visibility only if product still meets feat-001 venue expectations,
3. replace immediate embed with lighter static preview plus CTA only if measurement proves necessary and change stays within product intent.

Any choice must be recorded in decision log with evidence.

### 6. Tighten mobile layout and scroll behavior

Audit landing and story at `375px`, `414px`, and `768px` widths. Adjust only performance/mobile-critical layout issues:

- readable text sizes,
- button tap area,
- card/grid wrapping,
- story image grid aspect ratios,
- spacing that causes wasted vertical load or cramped content,
- motion settings that create perceived lag.

If `SectionWrapper` animation causes visible scroll cost, reduce transition weight or viewport trigger aggressiveness without breaking reduced-motion support or removing subtle reveal behavior required by docs.

### 7. Validate acceptance with concrete artifacts

Implementation is not done until repo checks and performance evidence both exist. Capture:

- `./init.sh` transcript,
- Lighthouse score evidence,
- manual viewport checklist notes for `375px`, `414px`, `768px`,
- confirmation that content images no longer shift layout,
- timing note for landing-page initial load under documented 3G-throttle procedure.

If any acceptance item cannot be met because assets are unavailable or existing feature dependency is incomplete, log exact blocker and deferred follow-up instead of stretching scope.

## Concrete Steps (Commands)

All commands run from repo root (`/Users/tungdoan/Projects/Web/tx-va-wedding`) unless stated otherwise.

```bash
# 1. Baseline full verification before edits
./init.sh

# 2. Inspect current routes locally
pnpm dev

# 3. Focused static checks during implementation
pnpm lint
pnpm typecheck
pnpm build

# 4. Final full verification
./init.sh
```

Expected short outputs:

- `./init.sh` → install/harness checks complete, lint passes, type-check passes, build passes.
- `pnpm lint` → `0 errors`.
- `pnpm typecheck` → no type errors.
- `pnpm build` → production build succeeds.
- Browser dev check at mobile widths → landing and story remain readable/tappable with no obvious layout jumps.

Manual measurement commands / actions to record in product spec:

1. Open Chrome DevTools on `/`.
2. Set viewport to `375x812`, throttle network to Fast 3G or repo-agreed 3G baseline, disable cache.
3. Reload and capture initial-load timing plus screenshot/video if needed.
4. Run Lighthouse Performance audit for `/` and `/story` under same documented mode.

Expected evidence examples:

- Lighthouse Performance `91+`
- No CLS warning attributable to image render
- Story route shell appears quickly with lightweight loading fallback

## Validation and Acceptance

### Happy Path

1. Landing page `/` loads on `375px` mobile viewport with fast visible first paint, readable content, tappable CTAs, and no image shift.
2. Story page `/story` loads with lightweight fallback, then renders chapter content smoothly without bundle-induced lag spikes.
3. All real content images render through `<Image>` with correct aspect ratio and no overflow.

### Validation / Error / Edge Paths

1. Slow 3G throttle still preserves usable landing-page first render under documented `<2s` target.
2. Reduced-motion users still get content without costly reveal effects or hidden content.
3. If optional guest photo missing, generic path still renders stably without broken layout.
4. If map iframe stays lazy, viewport scroll into venue section must not cause layout collapse.

### Unauthorized / Forbidden

- Not applicable. feat-005 does not change auth model or protected routes.

### Regression Checks

1. Hero CTA to `#rsvp` still works.
2. Hero CTA to `/story` still works.
3. Guest personalization via `?g=<guestId>` still renders greeting and optional image path.
4. Story page still renders 10 chapters and reduced-motion-safe experience.
5. Existing RSVP placeholder or form integration seam remains intact.

### Acceptance Artifacts

At least one concrete artifact set must be attached to harness/progress evidence:

- Lighthouse transcript/screenshot for `/` and optionally `/story`,
- viewport validation notes for `375px`, `414px`, `768px`,
- build transcript from `./init.sh`,
- asset inventory snippet from `docs/product-specs/feat-005-performance-mobile-optimization.md`.

## Idempotence & Recovery

- Code edits and product-spec updates are safe to re-run.
- Re-optimizing assets is safe if output filenames remain stable and old unused files are cleaned up in same change.
- Before replacing existing media assets, keep original source files outside repo or in working backup location until final verification passes.
- If performance change regresses UX, rollback path is file-level git revert of touched UI/component files and asset paths.
- Do not delete original asset source files from external working set until Lighthouse/mobile checks pass.

## Artifacts and Notes

- Required evidence destinations:
  - `docs/product-specs/feat-005-performance-mobile-optimization.md`
  - `harness/features/feat-005-performance-optimization.json`
  - `harness/progress.md`
- Keep evidence concise: exact scores, exact commands, exact viewport notes.
- If any acceptance criterion is deferred because real image assets are unavailable, log it in `docs/exec-plans/tech-debt-tracker.md` with blocker and owner note.

## Interfaces & Dependencies

- `next/image` — required for optimized responsive image delivery.
- `next/dynamic` — existing story-route split; preserve and refine if needed.
- `framer-motion` — existing animation system. Use only if reveal-cost tuning needed.
- Static assets under `public/` — primary media source for this feature.
- Existing route/component interfaces:
  - `app/page.tsx` → `<HeroSection guest={guest} />`
  - `app/story/page.tsx` → dynamically imported `StoryPageShell`
  - `StoryChapterCardProps` currently accepts `{ chapter, index }`; may need bounded image metadata extension if real chapter images land.

No external API or backend dependency changes planned.
