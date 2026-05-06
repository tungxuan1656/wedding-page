# Feat 011: Gift Registry (Gửi Quà Cưới)

## Purpose / Big Picture
Add a "Gửi Quà Cưới" (Gift Registry) section to the homepage. This allows guests who cannot attend or prefer to send gifts online to easily find the couple's bank QR codes and account details.

## Scope
- New component: `components/event/gift-registry-section.tsx`
- Integration: `app/page.tsx`
- Out of scope: Payment gateway integration (only static QR codes).

## Non-negotiable Requirements
- Must display bank account details (Bank name, Account name, Account number) and QR codes clearly.
- Must be responsive and accessible on mobile devices.
- Must follow the project's elegant design system.

## Progress
- [ ] Create `GiftRegistrySection` component.
- [ ] Add it to `app/page.tsx` (above or below RSVP).
- [ ] Verify layout on mobile and desktop.

## Surprises & Discoveries
- (To be filled during implementation)

## Decision Log
- Decision: Use static images for QR codes instead of generating them client-side.
  Rationale: QR codes for bank accounts are static; images are simpler and faster to load.

## Context and Orientation
- `components/event/`: Relevant location for event-related info like gifts.
- `app/page.tsx`: Needs to render this new section.

## Plan of Work (Narrative)
1. Create `components/event/gift-registry-section.tsx`.
   - Design a two-column layout on desktop (Groom's QR, Bride's QR), stacking vertically on mobile.
   - Use `next/image` to render placeholder QR codes.
   - Include account numbers with a "Copy" button functionality for convenience.
2. Update `app/page.tsx` to include `<GiftRegistrySection />`, likely before the RSVP section.

## Concrete Steps (Commands)
```bash
./init.sh
```

## Validation and Acceptance
- Ensure the section renders correctly.
- Ensure the "Copy Account Number" button copies the text to the clipboard and gives visual feedback.
- Verify mobile responsiveness (stacked layout).

## Idempotence & Recovery
- Safe to re-run. Revert `app/page.tsx` if needed.

## Interfaces & Dependencies
- `lucide-react` or SVG icons for the copy button.
- `framer-motion` for section reveal animation.

## Implementation Notes
- **Mandatory Patterns**: `docs/references/frontend/component-structure-pattern.md`
- **Companion Skills**: `frontend-patterns`
- **Pitfalls**: QR code images must be clear and not scaled down too much on mobile, otherwise they won't be scannable.
