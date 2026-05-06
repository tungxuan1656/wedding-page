# Feat 010: Homepage Floating CTA

## Purpose / Big Picture
Add a floating call-to-action (CTA) button "Xem hành trình" to the homepage that remains visible when scrolling on mobile devices. This ensures the primary storytelling feature is easily accessible, improving UX for the 80% mobile user base.

## Scope
- New component: `components/shared/floating-cta.tsx`
- Integration: `app/page.tsx`
- Out of scope: Modifying the actual `/story` page.

## Non-negotiable Requirements
- Must only be floating/fixed to the bottom on mobile viewports.
- Must adhere to `docs/FRONTEND.md` animation (Framer Motion) and styling rules (Tailwind v4).
- Must include `docs/references/frontend/component-structure-pattern.md`.

## Progress
- [ ] Create `FloatingCta` component.
- [ ] Add it to `app/page.tsx`.
- [ ] Verify styling on mobile and desktop viewports.

## Surprises & Discoveries
- (To be filled during implementation)

## Decision Log
- Decision: Place the button fixed at the bottom on mobile, but hidden on desktop.
  Rationale: Desktop already has sufficient CTAs in the hero section; mobile needs persistent navigation to the story.

## Context and Orientation
- `app/page.tsx`: Main landing page orchestrator.
- `components/shared/`: Location for reusable, non-feature-specific UI components.

## Plan of Work (Narrative)
1. Create `components/shared/floating-cta.tsx` exporting a `FloatingCta` component.
   - Use `motion.a` from `framer-motion` for a subtle entry animation.
   - Use Tailwind classes `fixed bottom-4 inset-x-4 z-50 md:hidden` to make it mobile-only and sticky.
   - Style it with the `wine` or `gold` theme.
2. Update `app/page.tsx` to include `<FloatingCta />` just inside the main `<main>` tag.

## Concrete Steps (Commands)
```bash
./init.sh
```

## Validation and Acceptance
- Resize viewport to mobile (<768px). The button "Xem hành trình" should be visible fixed at the bottom.
- Click the button; it should navigate to `/story`.
- Resize to desktop (>=768px). The button should not be visible.

## Idempotence & Recovery
- Safe to re-run. If issues occur, revert changes in `app/page.tsx`.

## Interfaces & Dependencies
- `framer-motion` for animations.
- Next.js `next/link`.

## Implementation Notes
- **Mandatory Patterns**: `docs/references/frontend/component-structure-pattern.md`
- **Companion Skills**: `frontend-patterns`
- **Pitfalls**: Ensure `z-index` is high enough so it isn't covered by the map or RSVP form.
