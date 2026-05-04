# feat-001: Landing Page

## Purpose / Big Picture

Build the wedding landing page — the first thing guests see when they open the invitation. The page must convey emotion immediately: couple names (Xuân Tùng & Vân Anh), event dates, venue with an embedded Google Map, and two clear CTAs (RSVP and Our Story). The hero section should feel elegant and personal, using the established wine/cream/gold palette with subtle Framer Motion animations.

**User-visible behaviour**: A guest opens the URL and sees a full-screen hero with the couple's names in serif typography, event details (tiệc đãi khách 08/06/2026, lễ thành hôn 09/06/2026), venue address with an embedded Google Map, and two buttons — "Xác nhận tham dự" (scrolls to RSVP) and "Xem hành trình" (navigates to /story). On mobile, everything is readable and tappable. Animations are subtle and respect reduced-motion preferences.

## Scope

### In Scope

- `app/page.tsx` — Landing page orchestrator (compose hero, event details, map, CTAs)
- `components/hero/` — Hero section component(s)
  - `hero-section.tsx` — Main hero with couple names, date, venue
  - `hero-copy.ts` — Static Vietnamese text constants (`HERO_COPY`)
  - `index.ts` — Barrel export
- `components/shared/` — Shared section wrapper component
  - `section-wrapper.tsx` — Reusable scroll-animated section container
  - `index.ts` — Barrel export
- `app/globals.css` — Any additional landing-page-specific styles (minimal, Tailwind-first)
- Product spec for feat-001 in `docs/product-specs/feat-001-landing-page.md`

### Out of Scope

- RSVP form implementation (feat-004) — only the CTA button/anchor link is in scope
- Our Story page content (feat-002) — only the CTA link is in scope
- Guest personalization (feat-003) — no URL param handling yet
- Google Apps Script integration — backend not touched
- Image optimization pipeline (feat-005) — placeholder/gradient used for hero background
- Dark mode — light mode only per FRONTEND.md
- Music, gallery, QR codes — optional features, not in scope

## Non-negotiable Requirements

- The plan must be self-contained (include definitions and commands needed to complete it).
- The plan must produce observable behaviour or tests demonstrating success.
- Every technical term must be defined in-place.
- Framer Motion only for animations — no GSAP, no CSS animation libraries.
- Mobile-first responsive design (base → sm → md → lg).
- Vietnamese UI text, English code/comments.
- All components follow naming conventions: kebab-case files, PascalCase components, `Props` suffix for types.
- Static content data separated from component logic (e.g., `HERO_COPY` constant).
- Barrel `index.ts` for folders with multiple exports.
- Files under 200 lines; split by concern if exceeded.
- `prefers-reduced-motion` must be respected.

## Progress

- [ ] Create product spec `docs/product-specs/feat-001-landing-page.md`
- [ ] Create `components/shared/section-wrapper.tsx` with Framer Motion scroll animation
- [ ] Create `components/shared/index.ts` barrel export
- [ ] Create `components/hero/hero-copy.ts` with `HERO_COPY` constants
- [ ] Create `components/hero/hero-section.tsx` with hero layout
- [ ] Create `components/hero/index.ts` barrel export
- [ ] Update `app/page.tsx` to compose hero, event details, map, CTAs
- [ ] Add Google Maps embed for venue
- [ ] Verify: lint, typecheck, build all pass
- [ ] Update harness: `harness/features/feat-001.json`, `harness/feature_index.json`, `harness/progress.md`

## Surprises & Discoveries

_(To be filled during implementation)_

## Decision Log

- **Decision**: Use placeholder/gradient background for hero instead of actual wedding photo (no images available yet).
  - **Rationale**: feat-005 handles image optimization. Using a CSS gradient keeps feat-001 self-contained and avoids blocking on asset delivery.
  - **Date**: 2026-05-04

- **Decision**: RSVP CTA is an anchor link (`#rsvp`) rather than a full RSVP form.
  - **Rationale**: feat-004 owns the RSVP form. The landing page only needs a CTA that scrolls to where the RSVP form will appear.
  - **Date**: 2026-05-04

- **Decision**: Our Story CTA navigates to `/story` route.
  - **Rationale**: feat-002 owns the story page. The landing page links to it.
  - **Date**: 2026-05-04

- **Decision**: Google Maps embed uses an iframe with the venue address.
  - **Rationale**: Simple, no API key required, works on all devices. The venue is "Sân đình thôn Gia Lương, Đông Anh, Hà Nội".
  - **Date**: 2026-05-04

## Outcomes & Retrospective

_(To be filled after implementation)_

## Context and Orientation

Key files and their purpose:

- `app/page.tsx` — Current minimal placeholder with couple names and date. Will become the landing page orchestrator.
- `app/layout.tsx` — Root layout with Inter + Noto Serif fonts, lang="vi", cream/wine theme. No changes needed.
- `app/globals.css` — Tailwind v4 with `@theme inline`, wedding design tokens. May need minor additions.
- `components/hero/` — Currently empty (`.gitkeep`). Will contain hero section components.
- `components/shared/` — Currently empty (`.gitkeep`). Will contain shared section wrapper.
- `components/rsvp/` — Currently empty (`.gitkeep`). Not in scope for this feature (only CTA link).
- `components/story/` — Currently empty (`.gitkeep`). Not in scope for this feature (only CTA link).
- `components/guest/` — Currently empty (`.gitkeep`). Not in scope (feat-003).
- `lib/` — Currently empty (`.gitkeep`). Not in scope for this feature.

Design tokens available (from `globals.css`):
- Colors: wine, wine-light, wine-dark, cream, cream-dark, beige, beige-dark, gold, gold-light
- Text: text-primary, text-secondary, text-muted
- Fonts: font-sans (Inter), font-serif (Noto Serif)
- Spacing: space-section (6rem)

## Plan of Work (Narrative)

### Step 1: Create product spec

Create `docs/product-specs/feat-001-landing-page.md` with goal, entry conditions, user flow, acceptance criteria, and failure states for the landing page feature.

### Step 2: Create shared section wrapper

Create `components/shared/section-wrapper.tsx` — a reusable component that wraps content in a `<section>` with Framer Motion `whileInView` animation (fade-in + slide-up). This component will be used by hero and future story/RSVP sections.

Props: `children`, `className?`, `id?` (for anchor links like `#rsvp`).

Animation: fade-in from opacity 0→1, slide-up from y=20→0, with `prefers-reduced-motion` support via Framer Motion's `useReducedMotion()` hook.

Create `components/shared/index.ts` barrel export.

### Step 3: Create hero copy constants

Create `components/hero/hero-copy.ts` with `HERO_COPY` constant containing all Vietnamese text:

```ts
export const HERO_COPY = {
  coupleNames: 'Xuân Tùng & Vân Anh',
  eventReception: 'Tiệc đãi khách',
  eventReceptionDate: '08/06/2026',
  eventCeremony: 'Lễ thành hôn',
  eventCeremonyDate: '09/06/2026',
  venue: 'Sân đình thôn Gia Lương, Đông Anh, Hà Nội',
  ctaRsvp: 'Xác nhận tham dự',
  ctaStory: 'Xem hành trình',
} as const
```

### Step 4: Create hero section component

Create `components/hero/hero-section.tsx` — the main hero section containing:

1. **Hero banner**: Full-viewport-height section with gradient background (wine → wine-dark), couple names in serif font, and a decorative divider.
2. **Event details**: Two event cards/rows showing tiệc đãi khách (08/06/2026) and lễ thành hôn (09/06/2026).
3. **Venue section**: Address text + Google Maps iframe embed.
4. **CTA buttons**: Two buttons — "Xác nhận tham dự" (anchor to `#rsvp`) and "Xem hành trình" (link to `/story`).

The component uses `SectionWrapper` from shared for scroll animations.

Client component (`'use client'`) because it uses Framer Motion.

Create `components/hero/index.ts` barrel export.

### Step 5: Update landing page orchestrator

Update `app/page.tsx` to compose the hero section. The page remains a server component — it imports the client hero component.

Structure:
```tsx
import { HeroSection } from '@/components/hero'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
    </main>
  )
}
```

### Step 6: Verify and update harness

Run `./init.sh` to verify lint, typecheck, and build all pass. Update harness files.

## Concrete Steps (Commands)

All commands run from repo root (`/Users/tungdoan/Projects/Web/tx-va-wedding`).

```bash
# Step 1: Create product spec
# (file creation — no command needed)

# Step 2-5: Create component files
# (file creation — no command needed)

# Step 6: Full verification
./init.sh
```

Expected output from `./init.sh`:
- `pnpm install` — dependencies installed
- `pnpm lint` — 0 errors, 0 warnings
- `pnpm typecheck` (or `tsc --noEmit`) — no type errors
- `pnpm build` — successful build, no errors

## Validation and Acceptance

### Acceptance Criteria

1. **Hero renders**: Landing page displays couple names "Xuân Tùng & Vân Anh" in serif font on a wine-gradient background.
2. **Event details visible**: Both events shown — "Tiệc đãi khách 08/06/2026" and "Lễ thành hôn 09/06/2026".
3. **Venue with map**: Address "Sân đình thôn Gia Lương, Đông Anh, Hà Nội" displayed with an embedded Google Maps iframe.
4. **CTA buttons**: "Xác nhận tham dự" links to `#rsvp`, "Xem hành trình" links to `/story`.
5. **Mobile responsive**: All content readable and buttons tappable on mobile viewport (375px).
6. **Animations subtle**: Fade-in and slide-up animations on scroll, respecting `prefers-reduced-motion`.
7. **Build passes**: `./init.sh` completes with 0 errors, 0 warnings.
8. **TypeScript strict**: No type errors in `tsc --noEmit`.

### Validation Commands

```bash
# From repo root
./init.sh

# Manual visual check (after dev server starts)
pnpm dev
# Open http://localhost:3000 — verify hero, events, map, CTAs render correctly
# Check mobile viewport in browser DevTools (375px width)
# Check reduced motion: enable prefers-reduced-motion in DevTools
```

## Idempotence & Recovery

- All file creations are safe to re-run (overwrite with same content).
- No database migrations or destructive operations.
- If a step fails, re-run from that step.
- `./init.sh` is idempotent — safe to run multiple times.
- No external dependencies beyond what's already in `package.json`.

## Artifacts and Notes

### Files Created

| File | Purpose |
|------|---------|
| `docs/product-specs/feat-001-landing-page.md` | Product spec with acceptance criteria |
| `components/shared/section-wrapper.tsx` | Reusable scroll-animated section wrapper |
| `components/shared/index.ts` | Barrel export for shared components |
| `components/hero/hero-copy.ts` | Vietnamese text constants for hero |
| `components/hero/hero-section.tsx` | Main hero section component |
| `components/hero/index.ts` | Barrel export for hero components |

### Files Modified

| File | Change |
|------|--------|
| `app/page.tsx` | Replace placeholder with hero composition |
| `harness/feature_index.json` | Update feat-001 status to `in-progress` then `done` |
| `harness/features/feat-001.json` | Create feature record with evidence |
| `harness/progress.md` | Add session entry |
| `docs/exec-plans/index.md` | Add feat-001 plan to Active section |

### Implementation Notes

**Scope-specific patterns (mandatory)**:
- Component structure: `export const` or `export default function`, barrel `index.ts`, Props suffix
- Naming: kebab-case files, PascalCase components, `HERO_COPY` for text constants
- Types: `ComponentNameProps` for props
- Animation: Framer Motion `whileInView`, `useReducedMotion()`, lazy-load via `next/dynamic`
- Styling: Tailwind v4 utility classes, design tokens from `globals.css`
- Mobile-first: base → sm → md → lg breakpoints

**Skill recommendations for implementation**:
- `frontend-patterns` — for React/Next.js component patterns
- `documentation-lookup` — for Next.js 16 App Router API if needed
- `verification-loop` — for iterative verification

**Common pitfalls to avoid**:
- Don't use `'use client'` on the page itself — only on components that need interactivity
- Don't import Framer Motion in server components
- Don't hardcode Vietnamese text in JSX — use `HERO_COPY` constants
- Don't forget `prefers-reduced-motion` support
- Don't add images yet — use CSS gradient for hero background (feat-005 handles images)
- Don't create RSVP form — only the CTA anchor link

## Interfaces & Dependencies

### External Dependencies

- **Framer Motion** (v12.38.0) — already in `package.json`. Used for `whileInView`, `motion.div`, `useReducedMotion()`.
- **Next.js** (v16.2.4) — App Router, `next/dynamic` for lazy loading.
- **React** (v19.2.4) — client components.
- **Tailwind CSS v4** — utility classes, `@theme` tokens.

### Internal Dependencies

- `app/globals.css` — design tokens (wine, cream, gold, font-serif, etc.)
- `app/layout.tsx` — root layout provides font variables and base styling

### No New Dependencies

This feature does not introduce any new packages. Everything needed is already in `package.json`.

### Future Integration Points

- `#rsvp` anchor — will link to the RSVP form section (feat-004)
- `/story` route — will link to the Our Story page (feat-002)
- `?g=<id>` URL param — will be handled by guest personalization (feat-003)
- Hero background image — will replace gradient when images are available (feat-005)