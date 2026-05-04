# Progress Index

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