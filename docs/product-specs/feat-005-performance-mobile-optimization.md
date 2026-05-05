# Feat-005 — Performance & Mobile Optimization

## Objective

Ship bounded performance and mobile improvements for current landing and story routes without expanding product scope.

## Current Asset Inventory

- `public/guests/anh-tu.svg` — only real user-facing media asset currently shipped.
- `public/images/` — no production images yet; only `.gitkeep` present.
- Story route currently renders placeholder image slots, not real photos.
- Landing route embeds Google Maps venue iframe.

## Acceptance Scope For Current Repo State

### Must ship now

- Existing guest media uses `next/image` with explicit `width`, `height`, and `sizes`.
- `/story` keeps `next/dynamic` route split.
- Story placeholders avoid per-card animation overload on mobile.
- Landing route defers Google Maps iframe until guest explicitly requests it.
- Mobile layouts remain usable at `375px`, `414px`, and `768px`.
- No layout shift introduced by guest media or deferred map container.

### Deferred until real photo assets exist

- Full WebP/AVIF rollout for story and landing imagery.
- Full-site audit proving all shipped photography uses `next/image`.

Deferred items must stay logged in `docs/exec-plans/tech-debt-tracker.md` until production assets land.

## Measurement Method

### Local verification path

1. Run `pnpm dev` from repo root.
2. Open `/` and `/story` in Chrome DevTools device mode.
3. Verify layouts at `375px`, `414px`, and `768px` widths.
4. For landing route, throttle network to Fast 3G and confirm initial view renders before map load.
5. Click `Xem bản đồ`; confirm iframe loads only after interaction.
6. Run Lighthouse on `/` with mobile preset.

### Evidence to capture

- Lighthouse mobile performance score.
- Note whether landing route stays below 2s first load under throttled profile.
- Manual viewport notes for `375px`, `414px`, `768px`.
- Confirmation that story route remains dynamically imported.

## Non-goals

- No RSVP redesign.
- No new analytics or monitoring stack.
- No backend or API changes.
- No placeholder-to-real-photo content expansion.
