# Progress Index

## 2026-05-05 — feat-002 Our Story Implementation

- **Session**: feat-002-implement
- **Status**: completed
- **What was done**:
  - Created `docs/product-specs/feat-002-our-story.md`
  - Replaced `/story` placeholder route with lazy-loaded story page shell in `app/story/page.tsx`
  - Added `components/story/` feature set: story copy, local type, chapter list/card, image slot, page shell, barrel export
  - Added 10 placeholder chapters for 2016–2025 with 39 total image slots and Vietnamese copy
  - Removed stale `storyPlaceholder` field from `components/hero/hero-copy.ts`
  - Verified `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `./init.sh`
- **Blockers**: none
- **Next steps**: Start feat-003 (Guest Personalization), feat-004 (RSVP System), or feat-005 (Performance & Mobile Optimization)

## 2026-05-05 — feat-001 Landing Page Implementation

- **Session**: feat-001-implement
- **Status**: completed
- **What was done**:
  - Created `docs/product-specs/feat-001-landing-page.md`
  - Built `components/shared/section-wrapper.tsx` with Framer Motion `whileInView` and reduced-motion support
  - Built `components/hero/hero-copy.ts` and `components/hero/hero-section.tsx`
  - Updated `app/page.tsx` to compose the new landing page hero
  - Added `app/story/page.tsx` placeholder so `/story` CTA resolves to real route
  - Added RSVP placeholder section with `#rsvp` anchor target
  - Verified `pnpm lint`, `pnpm typecheck`, and `./init.sh`
- **Blockers**: none
- **Next steps**: Start feat-002 (Our Story) or feat-004 (RSVP System)

## 2026-05-04 — feat-001 ExecPlan Creation

- **Session**: feat-001-plan
- **Status**: in-progress
- **What was done**:
  - Created ExecPlan at `docs/exec-plans/plans/feat-001-landing-page.md`
  - Updated `harness/features/feat-001-landing-page.json` status to `in-progress`
  - Updated `harness/feature_index.json` feat-001 status to `in-progress`
  - Updated `docs/exec-plans/index.md` with active plan entry
- **Blockers**: none
- **Next steps**: Implement feat-001 per ExecPlan (create components, update page.tsx, verify build)

## 2026-05-04 — Boilerplate Cleanup & Content Setup

- **Session**: setup-content
- **Status**: completed
- **What was done**:
  - Replaced Next.js boilerplate with wedding landing page (Xuân Tùng & Vân Anh)
  - Set up wedding design tokens in globals.css (wine/cream/beige/gold palette, Inter + Noto Serif fonts)
  - Updated layout.tsx: lang="vi", wedding metadata, Inter + Noto Serif fonts, light mode only
  - Created directory structure: components/{hero,story,rsvp,guest,shared}/, lib/, public/{images,guests}/
  - Created .env.example with NEXT_PUBLIC_APPS_SCRIPT_URL
  - Updated feature JSONs with content decisions:
    - feat-001: couple names, dates, venue
    - feat-002: 10 chapters for 10 years (template with placeholders)
    - feat-004: RSVP with name + 2 event checkboxes (tiệc đãi khách 8/6, lễ thành hôn 9/6)
  - Updated FRONTEND.md RSVP section
  - Fixed all lint errors (11 errors + 58 warnings → 0)
  - Lint, typecheck, build all pass
- **Blockers**: none
- **Next steps**: Start feat-001 (Landing Page) implementation

## 2026-05-04 — Project Initialization

- **Session**: init-project
- **Status**: completed
- **What was done**:
  - Set up Next.js 16 project with Tailwind CSS v4, TypeScript, ESLint, Prettier
  - Created harness system (feature_index.json, progress.md, session-handoff.md)
  - Created ARCHITECTURE.md, docs/FRONTEND.md
  - Updated AGENTS.md for wedding project context
  - Cleaned up finance-system references from copied project
- **Blockers**: none
- **Next steps**: Start feat-001 (Landing Page)
