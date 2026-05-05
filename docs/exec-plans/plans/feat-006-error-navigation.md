# feat-006: Error & Navigation Pages

## Title

Add custom 404 page, error boundary, and loading states for graceful UX when routes are not found, components fail, or content is loading.

## Purpose / Big Picture

When a guest visits a non-existent route, a runtime error occurs, or a page is loading, the site currently shows Next.js default pages or a blank screen. This feature replaces those with wedding-themed, mobile-friendly pages that match the site's design system and guide guests back to useful content.

**User-visible behaviour**: Guest navigates to `/nonexistent` and sees a styled 404 page with a friendly Vietnamese message and a link back to the invitation. If a runtime error crashes a component, the guest sees a branded error message with a retry button instead of a white screen. When the story page is loading via dynamic import, the guest sees a skeleton/spinner placeholder that matches the site aesthetic. All three pages use the wedding palette (wine, cream, gold) and typography (Inter, Noto Serif) from `globals.css`.

## Scope

### In Scope

- `app/not-found.tsx` — custom 404 page for unmatched routes. Server component. Wedding-themed design with link back to home.
- `app/error.tsx` — error boundary for route-level runtime errors. Client component (`'use client'`). Shows user-friendly Vietnamese message with `unstable_retry` button.
- `app/global-error.tsx` — root-level error boundary for errors in the root layout. Client component. Must include own `<html>` and `<body>` tags with global styles.
- `app/story/loading.tsx` — loading state for the story page dynamic import. Server component. Shows skeleton/spinner matching site aesthetic.
- `app/loading.tsx` — root loading state for initial page navigation. Server component. Lightweight spinner/skeleton.
- `components/shared/not-found-content.tsx` — shared 404 UI component (optional, only if not-found and global-not-found share significant markup).
- `components/shared/error-content.tsx` — shared error UI component (optional, only if error and global-error share significant markup).
- `components/shared/loading-skeleton.tsx` — reusable loading skeleton for story and root loading states.
- Harness state:
  - `harness/features/feat-006-error-navigation.json`
  - `harness/feature_index.json`
  - `harness/progress.md`
- Plan tracking:
  - `docs/exec-plans/index.md`

### Out of Scope

- `global-not-found.js` (experimental Next.js 16 feature) — not needed since this app has a single root layout; `not-found.tsx` is sufficient.
- Custom error codes or status pages beyond 404 and general runtime error.
- Error reporting/analytics integration (Sentry, etc.).
- Loading states for individual components within pages (only route-level loading).
- Changes to existing page content or layout structure.
- SEO metadata for error pages (handled by Next.js defaults; feat-007 covers SEO).
- Dark mode (site is light-mode only per `FRONTEND.md`).
- Accessibility audit beyond basic semantic HTML and ARIA (feat-009 covers comprehensive a11y).

## Non-negotiable Requirements

- Plan stays self-contained. No hidden assumptions.
- Result must produce observable guest-facing behaviour for 404, error, and loading states.
- All error/loading pages must follow wedding palette and typography from `globals.css` (`--color-wine`, `--color-cream`, `--font-serif`, `--font-sans`).
- Error boundary must be a client component (`'use client'`) per Next.js App Router convention.
- `global-error.tsx` must include its own `<html>` and `<body>` tags because it replaces the root layout when active.
- Loading states must be lightweight — no heavy animation libraries, no Framer Motion in loading skeletons.
- Vietnamese copy for user-facing messages. English for code/comments/docs.
- Mobile-first design. All error/loading pages must work on narrow viewports.
- No new dependencies. Use built-in React/Next.js APIs only.
- Files over 200 lines must be split by concern before merge.

## Progress

- [ ] Create `components/shared/loading-skeleton.tsx` — reusable skeleton component
- [ ] Create `app/not-found.tsx` — custom 404 page
- [ ] Create `app/error.tsx` — route-level error boundary
- [ ] Create `app/global-error.tsx` — root-level error boundary
- [ ] Create `app/loading.tsx` — root loading state
- [ ] Create `app/story/loading.tsx` — story page loading state
- [ ] Verify 404 renders at `/nonexistent-route` with wedding theme and home link
- [ ] Verify error boundary catches runtime errors and shows retry button
- [ ] Verify loading state renders for story page navigation
- [ ] Verify all pages are mobile-friendly
- [ ] Verify `pnpm lint`
- [ ] Verify `pnpm typecheck`
- [ ] Verify `pnpm build`
- [ ] Verify `./init.sh`
- [ ] Update harness files with status, evidence, and next-step notes
- [ ] Keep this plan and `docs/exec-plans/index.md` in sync

## Surprises & Discoveries

- Next.js 16 uses `unstable_retry` prop (added v16.2.0) instead of the older `reset` function pattern. The error boundary component must use `unstable_retry` for retry functionality.
- `global-not-found.js` is an experimental Next.js feature (v15.4.0+) that bypasses normal rendering. This app has a single root layout, so `not-found.tsx` is sufficient and `global-not-found.js` is not needed.
- `not-found.tsx` is a Server Component by default (can be async). `error.tsx` and `global-error.tsx` must be Client Components.
- `loading.tsx` is a Server Component by default. It wraps `page.tsx` in a `<Suspense>` boundary automatically.
- The story page (`app/story/page.tsx`) is already lazy-loaded via `next/dynamic`, so `app/story/loading.tsx` provides the Suspense fallback during navigation.

## Decision Log

- **Decision**: Use `not-found.tsx` at root level instead of experimental `global-not-found.js`.
  - **Rationale**: This app has a single root layout, so `not-found.tsx` composed with the root layout is sufficient. `global-not-found.js` is experimental and requires importing global styles/fonts independently, adding complexity for no benefit.
  - **Date/Author**: 2026-05-05 / Codex

- **Decision**: Create a shared `loading-skeleton.tsx` component rather than inline skeleton markup in each loading file.
  - **Rationale**: Both `app/loading.tsx` and `app/story/loading.tsx` need skeleton UI. A shared component avoids duplication and follows the project's component structure pattern. If the shared component is trivial (< 30 lines), inline is acceptable.
  - **Date/Author**: 2026-05-05 / Codex

- **Decision**: Use `unstable_retry` in error boundary instead of custom `reset` pattern.
  - **Rationale**: Next.js 16 provides `unstable_retry` as the recommended way to attempt recovery from errors. Using the built-in API keeps the component simple and aligned with framework conventions.
  - **Date/Author**: 2026-05-05 / Codex

- **Decision**: Keep error and not-found pages as separate files rather than extracting shared UI into `components/shared/` unless markup duplication exceeds ~50 lines.
  - **Rationale**: Error and not-found pages have different content, tone, and actions (retry vs. go home). Premature extraction adds indirection. If both pages share significant visual structure, extract then.
  - **Date/Author**: 2026-05-05 / Codex

- **Decision**: Add `app/loading.tsx` (root loading) in addition to `app/story/loading.tsx`.
  - **Rationale**: Root loading provides a Suspense fallback for the landing page during initial navigation. It should be lightweight (simple spinner/skeleton). Story page loading can be more specific (chapter skeleton).
  - **Date/Author**: 2026-05-05 / Codex

## Outcomes & Retrospective

- Target outcome: guests never see a white screen or default Next.js error page. All error, not-found, and loading states are branded and mobile-friendly.
- Success evidence: verification commands pass, manual browser checks confirm themed pages render correctly.

## Context and Orientation

Repo orientation for reader with no prior context:

- `app/layout.tsx` — root layout with Inter + Noto Serif fonts, `lang='vi'`, cream background, wine text. Error/loading pages compose within this layout (except `global-error.tsx` which replaces it).
- `app/page.tsx` — landing page. Server component that resolves guest personalization and renders `<HeroSection>`.
- `app/story/page.tsx` — story page. Lazy-loaded via `next/dynamic`.
- `app/globals.css` — Tailwind CSS v4 imports + CSS custom properties for wedding palette (wine, cream, beige, gold) and typography (Inter, Noto Serif).
- `components/shared/section-wrapper.tsx` — shared section wrapper with Framer Motion animations. Not suitable for error/loading states (too heavy).
- `components/shared/index.ts` — barrel export for shared components.
- `harness/features/feat-006-error-navigation.json` — current feature acceptance source of truth.

Layer impact using `Types -> Config -> Repo -> Service -> Runtime -> UI` from `ARCHITECTURE.md`:

- **Types**: no new types needed. Error/loading pages use built-in Next.js props (`Error` with `digest`, `unstable_retry`).
- **Config**: no config changes. Next.js App Router file conventions handle routing automatically.
- **Repo**: no data access. Error/loading pages are purely presentational.
- **Service**: no service layer changes.
- **Runtime**: error boundary uses `unstable_retry` for client-side recovery. Loading uses React Suspense.
- **UI**: main impact. New files for `not-found`, `error`, `global-error`, `loading`, and `story/loading`.

Hard dependency checks:

- Lower layers do not depend on higher layers: no types/config/service depend on UI.
- UI does not bypass runtime/service contracts: error/loading pages are self-contained, no API calls.
- No new dependencies introduced.

## Standards Enforcement

### Required References

- `AGENTS.md`
- `ARCHITECTURE.md`
- `docs/FRONTEND.md`
- `docs/references/frontend/project-folder-structure.md`
- `docs/references/frontend/component-structure-pattern.md`
- `docs/references/frontend/naming-and-conventions-pattern.md`
- `docs/references/shared/type-naming-pattern.md`
- `docs/references/frontend/i18n-label-pattern.md` — not present in repo; apply Vietnamese-copy rule from `docs/FRONTEND.md` and naming guidance from frontend references.

### Concrete Coding Constraints From References

- `docs/references/frontend/project-folder-structure.md`
  - Route files follow Next.js App Router convention: `app/not-found.tsx`, `app/error.tsx`, `app/global-error.tsx`, `app/loading.tsx`, `app/story/loading.tsx`.
  - Shared components go in `components/shared/`.
  - Use absolute `@/...` imports.
- `docs/references/frontend/component-structure-pattern.md`
  - `export default function` for page-level components (Next.js convention).
  - `export const` or `export default function` for shared components.
  - `components/shared/index.ts` exports only public components.
  - Files over 200 lines split by concern.
- `docs/references/frontend/naming-and-conventions-pattern.md`
  - Kebab-case files: `loading-skeleton.tsx`, `not-found-content.tsx`, `error-content.tsx`.
  - UI text in Vietnamese; code/comments/docs in English.
  - Static copy centralized in domain-specific constants (e.g., `ERROR_COPY`, `NOT_FOUND_COPY`).
- `docs/references/shared/type-naming-pattern.md`
  - No new shared types needed for this feature. Error/loading pages use built-in Next.js prop types.
- `docs/FRONTEND.md`
  - Mobile-first responsive design.
  - Light mode only.
  - Vietnamese labels.
  - Framer Motion for animations — but loading skeletons should be lightweight (CSS-only or minimal animation, no Framer Motion).
- `ARCHITECTURE.md`
  - No traditional backend. Error/loading pages are purely client/server presentational.
  - Client-first rendering for interactive pages. Error boundary must be client component.
  - Animation via Framer Motion only — but loading skeletons are exempt (lightweight CSS animation is acceptable for skeleton pulse effects).

## Implementation Notes

### Mandatory Patterns For This Scope

- Use Next.js App Router file conventions (`not-found.tsx`, `error.tsx`, `global-error.tsx`, `loading.tsx`) — do not create custom error handling when framework conventions exist.
- Error boundary must use `'use client'` directive.
- `global-error.tsx` must include `<html>` and `<body>` tags with global styles because it replaces the root layout.
- `not-found.tsx` is a Server Component by default — no `'use client'` needed unless using hooks.
- `loading.tsx` is a Server Component by default — keep it lightweight, no client-side state.
- Use wedding palette CSS custom properties from `globals.css` (`--color-wine`, `--color-cream`, `--color-gold`, `--font-serif`, `--font-sans`).
- Keep error/loading pages simple. No complex layouts, no heavy animations, no Framer Motion in skeletons.
- Skeleton pulse animation can use CSS `@keyframes` or Tailwind `animate-pulse`.

### Companion Skills For Implementation Phase

- `frontend-patterns` — keep component boundaries and Next.js App Router conventions clean.
- `verification-loop` — run lint, typecheck, build, and full `./init.sh` with captured evidence.

### Common Pitfalls To Avoid

- Do not use `global-not-found.js` — it's experimental and unnecessary for this single-layout app.
- Do not add Framer Motion to loading skeletons — keep them lightweight CSS-only.
- Do not forget `'use client'` on `error.tsx` and `global-error.tsx`.
- Do not forget `<html>` and `<body>` tags in `global-error.tsx`.
- Do not add analytics or error reporting services — out of scope.
- Do not create overly complex shared components when inline markup is simpler and under 50 lines.
- Do not use `reset()` in error boundary — use `unstable_retry()` per Next.js 16 convention.

## Plan of Work (Narrative)

### 1. Create shared loading skeleton component

Create `components/shared/loading-skeleton.tsx` with a lightweight, reusable skeleton component that uses wedding palette colors and CSS pulse animation. This component will be used by both `app/loading.tsx` and `app/story/loading.tsx`.

The skeleton should:
- Use `--color-cream-dark` / `--color-beige` for skeleton bar colors.
- Use Tailwind `animate-pulse` for the shimmer effect.
- Be a Server Component (no `'use client'` needed for pure CSS animation).
- Export via `components/shared/index.ts`.

If the skeleton component is trivial (< 30 lines), consider inlining in each loading file instead. Evaluate during implementation.

### 2. Create custom 404 page

Create `app/not-found.tsx` as a Server Component. This file handles:
- Unmatched routes (e.g., `/nonexistent-route`).
- Explicit `notFound()` calls from other pages (future use).

Content:
- Friendly Vietnamese heading (e.g., "Trang không tồn tại" or similar).
- Brief Vietnamese message explaining the page wasn't found.
- Link back to home page (`/`) using Next.js `<Link>`.
- Wedding-themed styling using `--color-wine`, `--color-cream`, `--font-serif`.
- Mobile-first responsive layout.
- Centered layout with max-width container.

This page composes within the root layout (inherits fonts, global styles, `<html>` and `<body>`).

### 3. Create route-level error boundary

Create `app/error.tsx` as a Client Component (`'use client'`). This file handles:
- Runtime errors in page components and their children.
- Displays user-friendly Vietnamese error message.
- Provides `unstable_retry()` button for recovery.

Content:
- `'use client'` directive at top.
- Vietnamese heading (e.g., "Đã xảy ra lỗi" or similar).
- Brief Vietnamese message.
- Retry button calling `unstable_retry()`.
- Wedding-themed styling.
- Mobile-first responsive layout.

This page composes within the root layout (inherits fonts, global styles).

### 4. Create root-level error boundary

Create `app/global-error.tsx` as a Client Component (`'use client'`). This file handles:
- Errors in the root layout that `error.tsx` cannot catch.
- Must include its own `<html>` and `<body>` tags.
- Must import global styles (`globals.css`) and font classes.

Content:
- `'use client'` directive at top.
- Import `./globals.css` for base styles.
- Apply font classes to `<html>` or `<body>`.
- Vietnamese error message with retry button.
- Minimal but branded layout.

### 5. Create root loading state

Create `app/loading.tsx` as a Server Component. This file provides:
- Suspense fallback for the landing page during navigation.
- Lightweight spinner or skeleton using wedding palette.
- Centered layout.

Keep this minimal — a simple centered spinner or small skeleton is sufficient. The landing page loads quickly, so this is primarily for slow network conditions.

### 6. Create story page loading state

Create `app/story/loading.tsx` as a Server Component. This file provides:
- Suspense fallback for the story page during dynamic import.
- Skeleton that hints at the story page structure (chapter cards or similar).
- Wedding-themed styling.

This can be slightly more detailed than the root loading state since the story page has a heavier dynamic import, but still keep it lightweight (no Framer Motion).

### 7. Verify and validate

Run verification commands and manually check:
- Navigate to `/nonexistent-route` → custom 404 page renders with wedding theme and home link.
- Trigger a runtime error → error boundary renders with retry button.
- Navigate to `/story` → loading skeleton renders briefly before story content.
- All pages are mobile-friendly at narrow viewports.
- `pnpm lint`, `pnpm typecheck`, `pnpm build`, `./init.sh` all pass.

### 8. Update harness and plan tracking

Update harness files with status, evidence, and next-step notes.

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

Manual dev check path:

```bash
pnpm dev
```

Expected local behaviour:

- Open `/nonexistent-route` → custom 404 page with wedding theme and home link.
- Open `/` → landing page loads normally (root loading briefly visible on slow network).
- Open `/story` → story loading skeleton briefly visible, then story content.
- Trigger error (e.g., throw in a component) → error boundary with retry button.

## Validation and Acceptance

### Acceptance Criteria

1. Custom not-found page renders at `/nonexistent-route` with wedding-themed design and link back to home.
2. Error boundary catches runtime errors and shows user-friendly Vietnamese message with retry option instead of white screen.
3. Global error boundary catches root layout errors with branded fallback including `<html>` and `<body>` tags.
4. Loading state renders for story page dynamic import with visible skeleton/spinner.
5. Root loading state renders for landing page navigation with lightweight spinner/skeleton.
6. All error/loading pages follow wedding palette and typography from `globals.css`.
7. Error pages are mobile-friendly and match site aesthetic.
8. `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `./init.sh` pass.

### Validation Matrix

| Scenario | Input / Setup | Expected Result | Evidence |
| --- | --- | --- | --- |
| 404 — unmatched route | Navigate to `/nonexistent-route` | Custom not-found page with Vietnamese text, home link, wedding palette | Manual browser check |
| 404 — home link | Click home link on 404 page | Navigates to `/` and landing page renders | Manual browser check |
| Error boundary — runtime error | Throw error in a component | Error boundary renders with Vietnamese message and retry button | Manual browser check (dev mode) |
| Error boundary — retry | Click retry button on error page | Re-attempts rendering the failed segment | Manual browser check |
| Global error — root layout error | Force error in root layout | Global error page renders with own `<html>`/`<body>`, branded styling | Manual browser check |
| Loading — story page | Navigate to `/story` | Skeleton/spinner briefly visible before story content loads | Manual browser check |
| Loading — root | Navigate to `/` on slow network | Lightweight spinner/skeleton briefly visible | Manual browser check (throttled) |
| Mobile — 404 | View 404 page on narrow viewport | Layout is responsive, text readable, link tappable | Manual browser check |
| Mobile — error | View error page on narrow viewport | Layout is responsive, retry button tappable | Manual browser check |
| Regression — landing page | Navigate to `/` | Landing page renders normally, no layout shift | Manual browser check |
| Regression — story page | Navigate to `/story` | Story page renders normally with animations | Manual browser check |
| Build | `pnpm build` | Production build succeeds with no errors | Build transcript |

### Acceptance Artifact Requirement

At least one concrete artifact must be recorded when implementation finishes:

- Screenshot or transcript of custom 404 page rendering at `/nonexistent-route`, or
- Screenshot or transcript of error boundary rendering with retry button, or
- Build transcript showing all pages compile successfully.

## Idempotence & Recovery

- File creation steps are safe to re-run if changes remain scoped to same files.
- `./init.sh`, `pnpm lint`, `pnpm typecheck`, and `pnpm build` are safe to re-run.
- No database or external service changes involved.
- No destructive operations. All changes are additive (new files only, no existing files modified except `components/shared/index.ts` barrel export).

## Artifacts and Notes

- Required evidence after implementation:
  - verification command outputs for `pnpm lint`, `pnpm typecheck`, `pnpm build`, `./init.sh`
  - at least one acceptance artifact from validation section
- Keep snippets concise in harness/progress docs. Do not paste full build logs unless failure needs explanation.

## Interfaces & Dependencies

- Internal modules:
  - `app/layout.tsx` — root layout that error/loading pages compose within (except `global-error.tsx` which replaces it).
  - `app/globals.css` — wedding palette and typography custom properties used by all error/loading pages.
  - `components/shared/` — barrel export for shared loading skeleton component.
- Next.js App Router conventions:
  - `not-found.tsx` — Server Component, renders for unmatched routes and `notFound()` calls.
  - `error.tsx` — Client Component, receives `error` and `unstable_retry` props.
  - `global-error.tsx` — Client Component, receives `error` and `unstable_retry` props, must include `<html>` and `<body>`.
  - `loading.tsx` — Server Component, renders as Suspense fallback during navigation.
- No external dependencies or API calls.

Suggested component signatures:

```tsx
// app/not-found.tsx (Server Component)
export default function NotFound() {
  // Returns wedding-themed 404 UI with home link
}

// app/error.tsx (Client Component)
'use client'
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  // Returns wedding-themed error UI with retry button
}

// app/global-error.tsx (Client Component)
'use client'
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  // Returns full HTML document with wedding-themed error UI
}

// app/loading.tsx (Server Component)
export default function Loading() {
  // Returns lightweight root loading skeleton
}

// app/story/loading.tsx (Server Component)
export default function StoryLoading() {
  // Returns story-page-specific loading skeleton
}
```

## Risks and Blockers

- **Next.js 16 API stability**: `unstable_retry` is marked unstable (added v16.2.0). If the project uses an earlier Next.js 16 version, the `reset` prop may be needed instead. Verify Next.js version during implementation.
- **Global error styling**: `global-error.tsx` must import its own styles and fonts since it replaces the root layout. If styles are missing, the page will render unstyled.
- **Loading state visibility**: On fast connections, loading states may flash too briefly to verify. Use browser throttling or artificial delay for testing.
- **Error boundary scope**: `error.tsx` does not catch errors in the root layout. Only `global-error.tsx` catches those. Both are needed for full coverage.

## Open Decisions

- Decide exact Vietnamese copy for 404 heading, message, and CTA link text.
- Decide exact Vietnamese copy for error heading, message, and retry button text.
- Decide whether loading skeleton should hint at page structure (chapter cards for story) or be a generic spinner.
- Decide whether to extract shared error/not-found UI into `components/shared/` or keep inline. Recommendation: keep inline unless duplication exceeds ~50 lines.

## Verification Path

1. Run baseline `./init.sh` from repo root.
2. Implement all error/loading/not-found files.
3. Run `pnpm lint`, `pnpm typecheck`, `pnpm build`.
4. Run final `./init.sh`.
5. Start `pnpm dev` and manually verify:
   - `/nonexistent-route` → custom 404 page.
   - Error boundary renders on runtime error with retry.
   - `/story` → loading skeleton briefly visible.
   - `/` → root loading briefly visible on slow network.
   - All pages mobile-friendly.
6. Record evidence in harness files.

## Progress Log

- 2026-05-05 / Plan created for feat-006 Error & Navigation Pages. Await implementation.