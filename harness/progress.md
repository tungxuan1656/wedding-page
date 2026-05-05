# Progress Index

## 2026-05-05 — feat-009 Accessibility Compliance Implementation

- **Session**: feat-009-implement
- **Status**: completed
- **What was done**:
  - Added skip-to-content link to `app/layout.tsx` — hidden link "Chuyển đến nội dung chính" visible on focus, targets `#main-content`
  - Added `id="main-content"` to `<main>` elements in `app/page.tsx`, `app/story/page.tsx` (via `StoryPageShell`), `app/not-found.tsx`, `app/error.tsx`, and `app/global-error.tsx` (on `<body>`)
  - Added ARIA landmarks: `aria-labelledby` on hero section (pointing to `#hero-heading`), RSVP section (pointing to `#rsvp-heading`), story intro (pointing to `#story-heading`), story chapters (`aria-label="Các chương câu chuyện"`), each chapter card (pointing to `#chapter-{year}-heading`)
  - Added `aria-label="Lời nhắn riêng"` on guest personalization card
  - Added `aria-label="Bản đồ địa điểm"` on map container
  - Added `aria-label` and `role="img"` on story image slots
  - Added `role="status"` and `aria-live="polite"` on `LoadingSkeleton`
  - Added `role="alert"` and auto-focus on error pages (`error.tsx`, `global-error.tsx`)
  - Added `<address>` element for venue address (replacing `<p>`)
  - Changed RSVP heading from `<p>` to `<h2>` with `id="rsvp-heading"`
  - Updated `SectionWrapper` to accept `aria-label` and `aria-labelledby` props
  - Fixed color contrast: `--color-text-muted` from `#9a8578` to `#7d6b5e`, `--color-gold` from `#c9a96e` to `#b08f4a`
  - Added `focus-visible` outline styles to not-found link and error page buttons
  - Verified `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `./init.sh`
- **Blockers**: none
- **Next steps**: Start feat-004 (RSVP System) or feat-005 (Performance & Mobile Optimization)

## 2026-05-05 — feat-009 Accessibility Compliance ExecPlan Creation

- **Session**: feat-009-plan
- **Status**: in-progress
- **What was done**:
  - Identified `feat-009` as next pending feature from `harness/feature_index.json`
  - Read all required source documents: AGENTS.md, ARCHITECTURE.md, FRONTEND.md, harness state, all component files
  - Audited current accessibility state: reduced-motion ✅, lang attribute ✅, main landmarks ✅, heading hierarchy ✅, focus-visible ✅, map title ✅
  - Identified gaps: no skip-to-content link, no ARIA landmarks, no screen reader announcements for loading/error, color contrast failures (text-muted, gold), no focus management in error pages, image slots lack role/aria-label
  - Created ExecPlan at `docs/exec-plans/plans/feat-009-accessibility-compliance.md`
  - Captured scope, layer impact, standards, validation matrix, color contrast audit results, risks, and harness update requirements
  - Key decisions: darken `text-muted` from `#9a8578` to `#7d6b5e`, darken `gold` from `#c9a96e` to `#b08f4a`, use `role="img"` + `aria-label` on image slots, defer automated a11y testing to tech debt
  - Updated `docs/exec-plans/index.md` with active plan entry
  - Updated `harness/features/feat-009-accessibility-compliance.json` status to `in-progress` and attached plan path
  - Updated `harness/feature_index.json` feat-009 status to `in-progress`
- **Blockers**: none
- **Next steps**:
  - Implement feat-009 per ExecPlan: add skip link, ARIA landmarks, screen reader announcements, focus management, color contrast fixes, semantic HTML improvements

## 2026-05-05 — feat-008 Story Animation Polish Implementation

- **Session**: feat-008-implement
- **Status**: completed
- **What was done**:
  - Added Framer Motion animation to `components/story/story-image-slot.tsx`
  - Animation: `initial={{ opacity: 0, scale: 1.03 }}` → `whileInView={{ opacity: 1, scale: 1 }}` with `transition={{ duration: 0.5, ease: 'easeOut' }}` and `viewport={{ once: true, amount: 0.2 }}`
  - Added `useReducedMotion()` guard: when reduced-motion is preferred, `initial` is `false` and `whileInView` is `undefined` (no animation)
  - No stagger between images — all slots in a chapter animate simultaneously for mobile performance
  - `'use client'` directive retained since Framer Motion hooks require client-side rendering
  - Verified `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `./init.sh`
- **Blockers**: none
- **Next steps**: Start feat-009 (Accessibility Compliance) or feat-004 (RSVP System)

## 2026-05-05 — feat-008 Story Animation Polish ExecPlan Creation

- **Session**: feat-008-plan
- **Status**: in-progress
- **What was done**:
  - Identified `feat-008` as next pending feature from `harness/feature_index.json`
  - Read all required source documents: AGENTS.md, ARCHITECTURE.md, FRONTEND.md, harness state, existing story components
  - Created ExecPlan at `docs/exec-plans/plans/feat-008-story-animation-polish.md`
  - Captured scope, layer impact, standards, validation matrix, Framer Motion animation pattern, reduced-motion support, mobile performance constraints, risks, and harness update requirements
  - Key decisions: add animation directly to `StoryImageSlot` (no separate wrapper), use `whileInView` with `viewport={{ once: true, amount: 0.2 }}`, no stagger between images, `scale: 1.03→1` gentle zoom, keep `'use client'` directive
  - Updated `docs/exec-plans/index.md` with active plan entry
  - Updated `harness/features/feat-008-story-animation-polish.json` status to `in-progress` and attached plan path
  - Updated `harness/feature_index.json` feat-008 status to `in-progress`
- **Blockers**: none
- **Next steps**:
  - Implement feat-008 per ExecPlan: add Framer Motion animation to `StoryImageSlot`, verify reduced-motion support, verify mobile performance, run build checks

## 2026-05-05 — feat-007 SEO & Social Sharing Implementation

- **Session**: feat-007-implement
- **Status**: completed
- **What was done**:
  - Created `app/robots.ts` — allows all crawlers, disallows `/private/`, references sitemap
  - Created `app/sitemap.ts` — generates sitemap with `/` (priority 1.0) and `/story` (priority 0.8) routes
  - Created `public/images/og-image.png` — 1200×630 wine-colored placeholder OG image (3.6KB)
  - Enhanced `app/layout.tsx` — added `metadataBase`, `openGraph.locale`, `openGraph.siteName`, `openGraph.images`, `twitter.card`, `twitter.title`, `twitter.description`, `twitter.images`
  - Added `generateMetadata` to `app/page.tsx` — page-specific OG title, description, image, Twitter card, and JSON-LD `Event` structured data with `eventType: "WeddingEvent"`
  - Added `generateMetadata` to `app/story/page.tsx` — story-specific OG title, description, image, Twitter card
  - Updated `.env.example` with `NEXT_PUBLIC_SITE_URL` variable
  - Fixed lint issues (import sort, prettier formatting)
  - Verified `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `./init.sh`
  - Build output confirms `/robots.txt` and `/sitemap.xml` routes are statically generated
  - Story page HTML contains correct `og:title`, `og:description`, `og:image`, `og:url`, `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- **Blockers**: none
- **Next steps**: Start feat-008 (Story Animation Polish) or feat-009 (Accessibility Compliance)

## 2026-05-05 — feat-007 SEO & Social Sharing ExecPlan Creation

- **Session**: feat-007-plan
- **Status**: in-progress
- **What was done**:
  - Identified `feat-007` as next pending feature from `harness/feature_index.json`
  - Read all required source documents: AGENTS.md, ARCHITECTURE.md, FRONTEND.md, harness state, Next.js 16 metadata API docs
  - Created ExecPlan at `docs/exec-plans/plans/feat-007-seo-social-sharing.md`
  - Captured scope, layer impact, standards, validation matrix, Next.js 16 API notes (robots.ts, sitemap.ts, generateMetadata, JSON-LD), risks, and harness update requirements
  - Key decisions: static OG image placeholder (not dynamic opengraph-image.tsx), `@type: Event` with `eventType: "WeddingEvent"` for JSON-LD, defer guest-specific OG metadata, use `NEXT_PUBLIC_SITE_URL` env var for metadataBase
  - Updated `docs/exec-plans/index.md` with active plan entry
  - Updated `harness/features/feat-007-seo-social-sharing.json` status to `in-progress` and attached plan path
  - Updated `harness/feature_index.json` feat-007 status to `in-progress`
- **Blockers**:
  - OG image placeholder will need a real design asset eventually; current placeholder is minimal
- **Next steps**:
  - Implement feat-007 per ExecPlan: create robots.ts, sitemap.ts, OG image placeholder, enhance layout metadata, add generateMetadata to both pages, add JSON-LD to landing page

## 2026-05-05 — feat-006 Error & Navigation Pages Implementation

- **Session**: feat-006-implement
- **Status**: completed
- **What was done**:
  - Created `components/shared/loading-skeleton.tsx` — reusable skeleton component with configurable lines and heading, using wedding palette (`bg-beige-dark`, `animate-pulse`)
  - Created `app/not-found.tsx` — custom 404 page with Vietnamese heading "404", message "Trang bạn tìm kiếm không tồn tại", and "Về lại trang chính" home link
  - Created `app/error.tsx` — route-level error boundary (client component) with Vietnamese message "Đã xảy ra lỗi" and `unstable_retry` button "Thử lại"
  - Created `app/global-error.tsx` — root-level error boundary (client component) with own `<html>`/`<body>` tags, importing `globals.css` for branded styling
  - Created `app/loading.tsx` — root loading state using `LoadingSkeleton` with heading and 2 lines
  - Created `app/story/loading.tsx` — story page loading state with 3 skeleton blocks
  - Updated `components/shared/index.ts` barrel export to include `LoadingSkeleton`
  - Fixed lint error: prefixed unused `error` param with `_error` in `global-error.tsx`
  - Fixed lint warnings: auto-fixed prettier formatting and prop sorting across all new files
  - Verified `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `./init.sh`
  - Build output confirms `/_not-found` route is statically generated
- **Blockers**: none
- **Next steps**: Start feat-007 (SEO & Social Sharing) or feat-008 (Story Animation Polish)

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
