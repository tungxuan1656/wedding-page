# Landing Page

## Goal

`Show elegant first-screen wedding invitation with couple names, event dates, venue, map, and clear CTAs for RSVP and story.`

## Entry Conditions

- `Guest opens root route / on mobile or desktop browser`
- `No guest personalization required`
- `No RSVP form submission required for this feature`

## User Flow

1. `Guest lands on / and immediately sees Xuân Tùng & Vân Anh with wedding introduction.`
2. `Guest reads event schedule, venue details, and embedded Google Map.`
3. `Guest taps Xác nhận tham dự to scroll toward RSVP area or taps Xem hành trình to open /story.`

## Acceptance Criteria

- `Hero section renders couple names, elegant wedding copy, and both wedding dates.`
- `Venue details render Sân đình thôn Gia Lương, Xã Đông Anh, TP Hà Nội with embedded Google Map.`
- `CTA buttons for RSVP and story are visible, readable, and tappable on mobile.`
- `Page uses wedding palette and subtle Framer Motion entrance animation with reduced-motion support.`
- `Story CTA resolves to a real /story route, not a broken link.`

## Failure States

- `If map embed cannot load, venue text still remains visible and usable.`
- `If reduced motion is enabled, content still appears without noticeable movement.`
