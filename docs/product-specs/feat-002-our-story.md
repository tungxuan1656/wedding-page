# Our Story

## Goal

`Show scroll-based wedding story page at /story with 10 chapters for 2016–2025, each chapter presenting year, title, short Vietnamese placeholder narrative, and 3–5 image slots in elegant mobile-first layout.`

## Entry Conditions

- `Guest opens /story directly or arrives from Xem hành trình CTA on /.`
- `No guest personalization required.`
- `No real story copy or image assets required for this feature.`
- `Reduced-motion users must receive same content without motion-heavy transitions.`

## User Flow

1. `Guest opens /story and sees intro header for the 10-year journey.`
2. `Guest scrolls downward through 10 chapters ordered from 2016 to 2025.`
3. `Each chapter shows year, title, 1–2 short paragraphs, and visible image placeholders for future wedding photos.`
4. `Guest reaches footer link and can return to landing page.`

## Acceptance Criteria

- `The /story route renders a complete page, not placeholder card content.`
- `Exactly 10 chapters render in order from 2016 through 2025.`
- `Each chapter displays year, Vietnamese title, 1–2 short paragraphs, and 3–5 image placeholders.`
- `Story layout is mobile-first, readable, and free of horizontal overflow on small screens.`
- `Framer Motion entrance effects stay subtle (fade, slide-up, gentle zoom).`
- `When prefers-reduced-motion is enabled, story content remains fully usable with reduced or removed motion.`
- `Landing page CTA Xem hành trình still routes correctly to /story.`
- `Total placeholder image count stays within overall product limit of 40.`

## Failure States

- `If reduced motion is enabled, content still appears in full without relying on animation to communicate structure.`
- `If lazy-loaded story shell takes time to load, user still sees non-broken loading state rather than blank screen.`
- `If real story content is still unavailable, polished placeholder copy and image slots still communicate intended final experience.`
