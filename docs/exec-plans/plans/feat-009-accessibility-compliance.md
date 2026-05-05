# feat-009: Accessibility Compliance

## Purpose / Big Picture

Ensure the wedding website is usable by all guests — including elderly users and users with disabilities — by adding skip navigation, ARIA landmarks, screen reader announcements, focus management, and color contrast verification. The site already handles `prefers-reduced-motion` (feat-001/feat-002/feat-008) and has basic semantic HTML (`<main>`, `<h1>`/`<h2>`, `<article>`). This feature fills the remaining gaps to meet WCAG 2.1 AA.

**User-observable behavior:**
- Keyboard users can Tab through all interactive elements and skip to main content.
- Screen readers announce page structure (landmarks, headings, regions) correctly.
- Focus indicators are visible and styled consistently.
- Color contrast meets WCAG 2.1 AA (4.5:1 normal text, 3:1 large text).
- Loading and error states are announced to assistive technology.
- Map iframe has accessible title and fallback content.

## Scope

### In Scope

1. **Skip-to-content link** — hidden link at top of page, visible on focus, jumps to `<main>`.
2. **ARIA landmarks and labels** — `aria-label` or `aria-labelledby` on all `<section>` elements (hero, events, venue, RSVP, story chapters).
3. **Screen reader announcements** — `aria-live` regions for loading/error states, `aria-label` on decorative/placeholder elements, `role="status"` on loading skeletons.
4. **Focus management** — auto-focus on error messages in error pages, focus trap consideration for map modal (currently inline, no trap needed).
5. **Color contrast verification** — audit all color combinations against WCAG 2.1 AA and fix any failures.
6. **Semantic HTML improvements** — `<address>` for venue, `aria-current` on active nav, proper heading hierarchy verification.
7. **Image alt text audit** — ensure all images and image placeholders have meaningful alt text or `aria-label`.

### Out of Scope

- RSVP form accessibility (feat-004, not yet implemented).
- Automated accessibility testing tooling (e.g., axe-core integration) — defer to tech debt.
- Dark mode or high-contrast mode (not in product scope).
- Full WCAG AAA compliance (target is AA).
- Keyboard shortcut system (not needed for this simple site).
- Screen reader testing with actual devices (manual verification only).

## Non-negotiable Requirements

- All changes must pass `pnpm lint`, `pnpm typecheck`, `pnpm build`.
- No new dependencies.
- No visual regressions — accessibility additions must not change the visual design.
- `prefers-reduced-motion` support must remain intact (already implemented).

## Context and Orientation

- `app/layout.tsx` — Root layout with `<html lang="vi">`, fonts, metadata.
- `app/page.tsx` — Landing page orchestrator, renders `<HeroSection>`.
- `app/story/page.tsx` — Story page, lazy-loads `StoryPageShell`.
- `components/hero/hero-section.tsx` — Hero section with events, venue, map, RSVP anchor.
- `components/hero/hero-copy.ts` — Static copy constants for hero section.
- `components/guest/guest-personalization.tsx` — Guest personalization card.
- `components/shared/section-wrapper.tsx` — Framer Motion section wrapper (renders `<motion.section>`).
- `components/shared/loading-skeleton.tsx` — Loading skeleton component.
- `components/story/story-chapter-card.tsx` — Story chapter card with heading, text, image slots.
- `components/story/story-image-slot.tsx` — Image placeholder with animation.
- `components/story/story-page-shell.tsx` — Story page shell with intro, chapters, back link.
- `app/not-found.tsx` — 404 page.
- `app/error.tsx` — Route-level error boundary.
- `app/global-error.tsx` — Root error boundary.
- `app/globals.css` — Global styles with design tokens and reduced-motion support.

## Plan of Work

### Step 1: Add skip-to-content link to root layout

**File:** `app/layout.tsx`

Add a visually hidden skip link as the first child of `<body>`, before `{children}`. The link targets `#main-content` and becomes visible on focus with wedding-themed styling.

```tsx
<a
  className='sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-wine focus:px-4 focus:py-2 focus:text-cream focus:outline-2 focus:outline-offset-2 focus:outline-gold-light'
  href='#main-content'>
  Chuyển đến nội dung chính
</a>
```

Add `id="main-content"` to the `<main>` element in `app/page.tsx` and `app/story/page.tsx`.

### Step 2: Add ARIA landmarks and labels to sections

**File:** `components/hero/hero-section.tsx`

- Add `aria-labelledby` to the hero `<SectionWrapper>` pointing to the hero heading.
- Add `id` on the hero `<h1>` element for `aria-labelledby` reference.
- Add `aria-labelledby` to the RSVP `<SectionWrapper>` pointing to the RSVP heading.
- Add `id` on the RSVP heading element.

**File:** `components/story/story-page-shell.tsx`

- Add `aria-labelledby` to the story intro section pointing to the story `<h1>`.
- Add `id` on the story `<h1>` element.
- Add `aria-label="Các chương câu chuyện"` on the chapter list section.

**File:** `components/story/story-chapter-card.tsx`

- Add `aria-labelledby` to the `<SectionWrapper>` pointing to the chapter `<h2>`.
- Add `id` on the chapter `<h2>` element.

**File:** `components/guest/guest-personalization.tsx`

- Add `aria-label="Lời nhắn riêng"` on the guest personalization `<div>`.

### Step 3: Add screen reader announcements for loading and error states

**File:** `components/shared/loading-skeleton.tsx`

- Add `role="status"` and `aria-live="polite"` to the outer `<div>`.
- Add `aria-label="Đang tải nội dung"` on the outer `<div>`.

**File:** `app/error.tsx`

- Add `role="alert"` on the error container.
- Auto-focus the error heading on mount using `useEffect` + `useRef`.

**File:** `app/global-error.tsx`

- Add `role="alert"` on the error container.
- Auto-focus the error heading on mount using `useEffect` + `useRef`.

**File:** `app/not-found.tsx`

- No changes needed — already has `<h1>` and `<main>`, which screen readers announce.

### Step 4: Improve semantic HTML

**File:** `components/hero/hero-section.tsx`

- Wrap venue address in `<address>` element.
- Add `aria-label="Bản đồ địa điểm"` on the map container `<div>`.

**File:** `components/story/story-image-slot.tsx`

- Add `role="img"` and `aria-label` on the image slot `<motion.div>` since it's a decorative placeholder that should be announced.

### Step 5: Color contrast audit and fixes

Audit all color combinations in `globals.css` and component classes:

| Combination | Foreground | Background | Ratio | Pass? |
|---|---|---|---|---|
| `text-wine` on `bg-cream` | `#8b1a2b` | `#fff8f0` | ~6.5:1 | ✅ AA |
| `text-cream` on `bg-wine` | `#fff8f0` | `#8b1a2b` | ~6.5:1 | ✅ AA |
| `text-cream/85` on `bg-wine` | `#fff8f0` at 85% | `#8b1a2b` | ~5.5:1 | ✅ AA |
| `text-gold-light` on `bg-wine` | `#dfc08a` | `#8b1a2b` | ~4.7:1 | ✅ AA |
| `text-text-secondary` on `bg-cream` | `#6b5344` | `#fff8f0` | ~5.5:1 | ✅ AA |
| `text-text-muted` on `bg-cream` | `#9a8578` | `#fff8f0` | ~3.5:1 | ⚠️ AA large text only |
| `text-text-muted` on `bg-cream-dark` | `#9a8578` | `#f5ede0` | ~3.0:1 | ❌ Fails AA normal text |
| `text-gold` on `bg-cream` | `#c9a96e` | `#fff8f0` | ~2.5:1 | ❌ Fails AA |
| `text-wine-light` on `bg-cream` | `#a63042` | `#fff8f0` | ~5.0:1 | ✅ AA |

**Fixes needed:**
- `text-text-muted` (`#9a8578`) on `bg-cream` — used for small labels like "Chương 01" and image slot labels. These are small text (< 18px). Fix: darken `text-text-muted` to `#7d6b5e` (contrast ~4.6:1 on cream).
- `text-text-muted` on `bg-cream-dark` — same issue. Fix: same color change resolves both.
- `text-gold` (`#c9a96e`) on `bg-cream` — used for uppercase labels like "Wedding Invitation". Fix: darken to `#b08f4a` (contrast ~4.5:1 on cream).

**File:** `app/globals.css`

- Change `--color-text-muted` from `#9a8578` to `#7d6b5e`.
- Change `--color-gold` from `#c9a96e` to `#b08f4a`.

**Note:** `--color-gold-light` (`#dfc08a`) on wine (`#8b1a2b`) passes at ~4.7:1, so no change needed there.

### Step 6: Verify heading hierarchy

Current heading structure:

**Landing page (`app/page.tsx`):**
- `<h1>` — Couple names (hero section) ✅
- `<h2>` — Venue name ✅
- No `<h3>` needed ✅

**Story page (`app/story/page.tsx`):**
- `<h1>` — Story title ✅
- `<h2>` — Chapter titles ✅
- No `<h3>` needed ✅

**404 page (`app/not-found.tsx`):**
- `<h1>` — "404" ✅

**Error pages (`app/error.tsx`, `app/global-error.tsx`):**
- `<h1>` — "Đã xảy ra lỗi" ✅

Heading hierarchy is correct. No changes needed.

### Step 7: Add `id="main-content"` to main elements

**File:** `app/page.tsx` — Add `id="main-content"` to `<main>`.
**File:** `app/story/page.tsx` — Add `id="main-content"` to `<main>` in `StoryPageShell`.
**File:** `app/not-found.tsx` — Add `id="main-content"` to `<main>`.
**File:** `app/error.tsx` — Add `id="main-content"` to `<main>`.
**File:** `app/global-error.tsx` — Add `id="main-content"` to `<body>` (since it has its own `<html>`/`<body>`).

## Concrete Steps (Commands)

```bash
# From repo root — verify baseline
./init.sh

# After all changes — verify
pnpm lint
pnpm typecheck
pnpm build

# Full verification
./init.sh
```

Expected outputs:
- `pnpm lint` → 0 errors, 0 warnings
- `pnpm typecheck` → no TypeScript errors
- `pnpm build` → successful build with all routes statically generated
- `./init.sh` → all checks pass

## Validation and Acceptance

### Acceptance Criteria

1. **Skip-to-content**: Tab into page → skip link appears → Enter → focus jumps to `#main-content`.
2. **ARIA landmarks**: Screen reader announces regions: "hero", "địa điểm", "xác nhận tham dự", "hành trình 10 năm", "các chương câu chuyện", each chapter.
3. **Focus indicators**: All interactive elements (links, buttons) show visible focus ring with wedding palette.
4. **Color contrast**: All text/background combinations meet WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text).
5. **Screen reader announcements**: Loading skeletons announce "Đang tải nội dung". Error pages auto-focus error message.
6. **Map accessibility**: Map iframe has `title` attribute (already present). Map container has `aria-label`.
7. **Image placeholders**: Story image slots have `role="img"` and `aria-label` describing the placeholder.
8. **Guest personalization**: Personalization card has `aria-label`.
9. **`prefers-reduced-motion`**: Still works correctly (no regression from feat-001/feat-002/feat-008).
10. **Build passes**: `pnpm lint`, `pnpm typecheck`, `pnpm build`, `./init.sh` all pass.

### Manual Verification

- Tab through entire landing page and story page — all interactive elements reachable.
- Skip link appears on first Tab and navigates to main content on Enter.
- Color contrast verified with browser DevTools or contrast checker tool.

## Idempotence & Recovery

- All changes are additive (ARIA attributes, skip link, color token updates).
- Color token changes are reversible — revert `globals.css` changes to restore original colors.
- No database migrations, no destructive operations.
- Safe to re-run all steps.

## Interfaces & Dependencies

- **No new dependencies.** All changes use built-in HTML ARIA attributes and existing Tailwind utilities.
- **Framer Motion**: `useReducedMotion` already used — no changes needed.
- **Next.js App Router**: Skip link uses standard `<a href="#main-content">` — works with Next.js routing.
- **Tailwind CSS v4**: `sr-only` and `focus:not-sr-only` utilities available out of the box.

## Risks and Blockers

- **Color token changes** may subtly affect visual design. The proposed changes (`text-muted` from `#9a8578` → `#7d6b5e`, `gold` from `#c9a96e` → `#b08f4a`) are small darkening adjustments that maintain the wedding palette feel while meeting contrast requirements.
- **No automated a11y testing** in this feature. Manual verification only. Automated testing (axe-core, Lighthouse) deferred to tech debt.
- **Screen reader testing** limited to browser DevTools accessibility tree inspection. Real device testing recommended but not in scope.

## Progress

- [ ] Step 1: Add skip-to-content link to root layout and `id="main-content"` to main elements
- [ ] Step 2: Add ARIA landmarks and labels to sections
- [ ] Step 3: Add screen reader announcements for loading/error states
- [ ] Step 4: Improve semantic HTML (address, aria-label on map, role="img" on slots)
- [ ] Step 5: Color contrast audit and fixes (darken text-muted and gold tokens)
- [ ] Step 6: Verify heading hierarchy (no changes expected)
- [ ] Step 7: Verify build passes (lint, typecheck, build, init.sh)

## Decision Log

- **Decision**: Use `sr-only` + `focus:not-sr-only` for skip link instead of custom CSS.
  **Rationale**: Tailwind v4 provides these utilities out of the box. No custom CSS needed.
  **Date**: 2026-05-05

- **Decision**: Darken `--color-text-muted` from `#9a8578` to `#7d6b5e` and `--color-gold` from `#c9a96e` to `#b08f4a`.
  **Rationale**: These are the only two color tokens that fail WCAG 2.1 AA on their primary backgrounds. The darkening is minimal (~10-15% darker) and maintains the wedding palette aesthetic.
  **Date**: 2026-05-05

- **Decision**: Use `role="img"` + `aria-label` on story image slots instead of `aria-hidden="true"`.
  **Rationale**: Image slots are placeholders that convey meaning ("Ảnh kỷ niệm 01"). Screen readers should announce them so users know content is coming. When real images replace placeholders, the `role="img"` + `alt` pattern will be natural.
  **Date**: 2026-05-05

- **Decision**: Defer automated accessibility testing (axe-core, Lighthouse CI) to tech debt.
  **Rationale**: Adding test infrastructure is out of scope for this feature. Manual verification is sufficient for a wedding website with limited pages.
  **Date**: 2026-05-05

## Surprises & Discoveries

- (To be filled during implementation)

## Outcomes & Retrospective

- (To be filled after completion)

## Implementation Notes

### Scope-specific patterns (mandatory)

- **Component structure**: Follow `docs/references/frontend/component-structure-pattern.md` — `export const` or `export default function`, barrel exports in `index.ts`.
- **Naming**: Follow `docs/references/frontend/naming-and-conventions-pattern.md` — kebab-case files, Vietnamese UI text, English code/comments.
- **Folder structure**: Follow `docs/references/frontend/project-folder-structure.md` — shared components in `components/shared/`.

### Skill recommendations

- `verification-loop`: After implementation, verify all acceptance criteria manually.
- `frontend-patterns`: For ARIA patterns and semantic HTML decisions.

### Common pitfalls

- **Skip link must be first focusable element** — place it as the first child of `<body>` in layout.
- **`aria-labelledby` requires existing `id`** — always verify the referenced `id` exists on the page.
- **Color contrast changes must not break the wedding palette** — use minimal darkening.
- **`role="status"` with `aria-live="polite"`** — don't use `aria-live="assertive"` for loading states (too intrusive).
- **Focus management in error pages** — use `useRef` + `useEffect` to auto-focus error heading, not `autoFocus` attribute (which only works on initial render).