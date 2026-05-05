# Progress Index

## 2026-05-05 — feat-006 Error & Navigation Pages ExecPlan Creation

- **Session**: feat-006-plan
- **Status**: in-progress
- **What was done**:
  - Identified `feat-006` as next pending feature from `harness/feature_index.json`
  - Read all required source documents: AGENTS.md, ARCHITECTURE.md, FRONTEND.md, harness state, Next.js 16 docs for error/not-found/loading conventions
  - Created ExecPlan at `docs/exec-plans/plans/feat-006-error-navigation.md`
  - Captured scope, layer impact, standards, validation matrix, Next.js 16 API notes (unstable_retry, global-error, not-found conventions), risks, and harness update requirements
  - Updated `docs/exec-plans/index.md` with active plan entry
  - Updated `harness/features/feat-006-error-navigation.json` status to `in-progress` and attached plan path
  - Updated `harness/feature_index.json` feat-006 status to `in-progress`
- **Blockers**:
  - Need to verify Next.js 16 version supports `unstable_retry` prop; if earlier version, fall back to `reset` pattern
- **Next steps**:
  - Implement feat-006 per ExecPlan: create not-found.tsx, error.tsx, global-error.tsx, loading.tsx, story/loading.tsx, and shared loading skeleton; verify all pages render correctly

## 2026-05-05 — feat-005 Performance & Mobile Optimization ExecPlan Creation

- **Session**: feat-005-plan
- **Status**: in-progress
- **What was done**:
  - Identified `feat-005` scope from `harness/features/feat-005-performance-optimization.json`, `docs/PRODUCT.md`, and `docs/FRONTEND.md`
  - Created ExecPlan at `docs/exec-plans/plans/feat-005-performance-mobile-optimization.md`
  - Captured scope boundaries, layer impact, performance/mobile acceptance path, standards mapping, measurement expectations, and harness update requirements
  - Updated `docs/exec-plans/index.md` with active plan entry
  - Updated `harness/features/feat-005-performance-optimization.json` status to `in-progress` and attached plan path
  - Updated `harness/feature_index.json` feat-005 status to `in-progress`
- **Blockers**:
  - `docs/PLANS.md` and `docs/knowledge/codex-exec-plan.md` are not present in repo, so plan structure relied on template and existing ExecPlans
  - `public/images/` currently has no real production images, so implementation may need actual asset delivery or explicit deferred-image debt logging to satisfy full acceptance
- **Next steps**:
  - Implement feat-005 per ExecPlan: create product-spec acceptance doc, audit real media/render cost, convert shipped images to optimized `next/image` paths, verify mobile viewports, and capture Lighthouse/performance evidence

## 2026-05-05 — feat-005 Performance & Mobile Optimization Implementation

- **Session**: feat-005-implement
- **Status**: in-progress
- **What was done**:
  - Added `docs/product-specs/feat-005-performance-mobile-optimization.md` to lock current asset inventory, acceptance scope, and manual measurement path
  - Updated `components/guest/guest-personalization.tsx` to supply `sizes` for existing guest media rendered through `next/image`
  - Updated `components/hero/hero-section.tsx` to defer Google Maps iframe load behind explicit user action while preserving stable layout height
  - Updated `components/shared/section-wrapper.tsx` to support optional animation disablement for future bounded performance tuning without changing current reveal behavior
  - Updated `components/story/story-image-slot.tsx` to remove per-slot Framer Motion cost from placeholder cards
  - Logged deferred full WebP/AVIF rollout in `docs/exec-plans/tech-debt-tracker.md` because repo still lacks production landing/story photos
  - Verified `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `./init.sh`
- **Blockers**:
  - `public/images/` still has no real production photos, so full image-format acceptance cannot be completed honestly yet
  - Lighthouse mobile score and <2s 3G evidence still need manual browser capture
- **Next steps**:
  - Capture manual viewport, throttled-load, and Lighthouse evidence
  - Revisit deferred debt when final landing/story photography is delivered

## 2026-05-05 — feat-004 RSVP System ExecPlan Creation

- **Session**: feat-004-plan
- **Status**: in-progress
- **What was done**:
  - Identified `feat-004` as next pending feature from `harness/feature_index.json`
  - Created ExecPlan at `docs/exec-plans/plans/feat-004-rsvp-system.md`
  - Captured scope, layer impact, standards, validation matrix, Apps Script contract notes, risks, and harness update requirements for RSVP form flow
  - Updated `docs/exec-plans/index.md` with active plan entry
  - Updated `harness/features/feat-004-rsvp-system.json` status to `in-progress` and attached plan path
  - Updated `harness/feature_index.json` feat-004 status to `in-progress`
- **Blockers**:
  - Need final Google Apps Script payload/response contract and target Google Sheet column order confirmed during implementation
- **Next steps**:
  - Implement feat-004 per ExecPlan: create `lib/api.ts`, build `components/rsvp/`, replace hero RSVP placeholder, document Apps Script deployment snippet, and verify submission/validation flows

## 2026-05-05 — feat-003 Guest Personalization Implementation

- **Session**: feat-003-implement
- **Status**: completed
- **What was done**:
  - Added `lib/guests.ts` with `GuestId`, `GuestData`, `GuestMap`, sample guest records, and `getGuestById()` lookup helper
  - Updated `app/page.tsx` to await Next.js 16 `searchParams` and resolve `g` at route boundary
  - Added `components/guest/guest-personalization.tsx` and `components/guest/index.ts`
  - Updated `components/hero/hero-section.tsx` to render guest-specific invitation text, greeting/message card, and optional photo
  - Updated `components/hero/hero-copy.ts` with invitation copy fragments for highlighted guest name path
  - Added sample local asset `public/guests/anh-tu.svg` to exercise optional photo path safely
  - Verified `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `./init.sh`
- **Blockers**: none
- **Next steps**: Start feat-004 (RSVP System) or feat-005 (Performance & Mobile Optimization)

## 2026-05-05 — feat-003 Guest Personalization ExecPlan Creation

- **Session**: feat-003-plan
- **Status**: in-progress
- **What was done**:
  - Identified `feat-003` as next pending feature from `harness/feature_index.json`
  - Created ExecPlan at `docs/exec-plans/plans/feat-003-guest-personalization.md`
  - Captured scope, layer impact, standards, validation path, risks, and harness update requirements for URL-based guest personalization
  - Updated `docs/exec-plans/index.md` with active plan entry
  - Updated `harness/features/feat-003-guest-personalization.json` status to `in-progress` and attached plan path
  - Updated `harness/feature_index.json` feat-003 status to `in-progress`
- **Blockers**:
  - Need actual sample guest records and at least one valid photo asset path to fully exercise optional photo path during implementation
- **Next steps**:
  - Implement feat-003 per ExecPlan: add `lib/guests.ts`, wire `searchParams.g` in `app/page.tsx`, add guest UI block, and verify `/`, `/?g=<known-id>`, and `/?g=unknown`

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
