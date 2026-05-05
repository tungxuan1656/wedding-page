# feat-007: SEO & Social Sharing

## Purpose / Big Picture

When guests share the wedding invitation link on messaging apps (Zalo, Messenger) or social media, rich previews must render with the couple's names, event details, and a representative image. Search engines must discover both routes (`/` and `/story`) via a sitemap, and crawlers must be allowed via `robots.txt`. This feature makes the wedding invitation discoverable and shareable with proper metadata, structured data, and crawl configuration.

**User-visible behaviour**: Sharing `https://<domain>/` or `https://<domain>/story` on any platform produces a rich card with Vietnamese title, description, and image. Google can index both pages. `robots.txt` and `sitemap.xml` are served at their standard paths.

## Scope

### In Scope

| Item | File(s) | Description |
|------|---------|-------------|
| robots.txt | `app/robots.ts` | Allow all crawlers, reference sitemap |
| Sitemap | `app/sitemap.ts` | Generate sitemap with `/` and `/story` routes |
| Root metadata | `app/layout.tsx` | Add `metadataBase`, enhance root `Metadata` with full OG + Twitter card |
| Landing page metadata | `app/page.tsx` | Add `generateMetadata` for landing page with OG image, description, JSON-LD `WeddingEvent` |
| Story page metadata | `app/story/page.tsx` | Add `generateMetadata` for story page with OG image, description |
| OG image placeholder | `public/images/og-image.png` | Placeholder OG image (1200×630) for social sharing previews |
| JSON-LD structured data | `app/page.tsx` | `Event` schema for wedding on landing page |

### Out of Scope

- Dynamic OG image generation via `opengraph-image.tsx` (use static placeholder for now; dynamic generation deferred to tech debt)
- Guest-specific OG metadata per `?g=<id>` (requires dynamic metadata per guest; deferred)
- Canonical URL tags beyond Next.js defaults (not needed for single-domain site)
- Google Analytics or other tracking scripts
- Multi-language alternate URLs (site is Vietnamese-only)

## Non-negotiable Requirements

- Plan is self-contained: all definitions, commands, and acceptance criteria are included.
- Plan produces observable behaviour: build output, metadata HTML, sitemap XML, robots.txt.
- Every technical term defined in-place.

## Context and Orientation

- **Root layout**: `app/layout.tsx` — currently exports static `metadata` with basic title, description, and OG title/description. Needs `metadataBase` and enhanced OG/Twitter fields.
- **Landing page**: `app/page.tsx` — Server Component, currently has no metadata export. Needs `generateMetadata` for page-specific OG and JSON-LD.
- **Story page**: `app/story/page.tsx` — Server Component wrapper around lazy-loaded `StoryPageShell`. Needs `generateMetadata` for story-specific OG.
- **Hero copy**: `components/hero/hero-copy.ts` — canonical Vietnamese text for couple names, event dates, venue. Source of truth for metadata strings.
- **Guest data**: `lib/guests.ts` — static guest lookup. Not used in metadata (deferred).
- **No existing SEO files**: No `robots.ts`, `sitemap.ts`, or OG images exist yet.

## Layer Impact

```
Types → Config → Repo → Service → Runtime → UI
  ✓        ✓        ✓                          (metadata types, Next.js config, static assets)
```

- **Types**: No new shared types needed. Uses Next.js built-in `Metadata`, `MetadataRoute`.
- **Config**: `metadataBase` in root layout metadata.
- **Repo**: `app/robots.ts`, `app/sitemap.ts`, `public/images/og-image.png`.
- **UI**: Metadata renders as `<head>` tags; JSON-LD renders as `<script>` in page body.

**Hard dependency check**: No lower-layer violations. Metadata and SEO files are App Router conventions that produce static output at build time.

## Standards Enforcement

### Required References

| Reference | Coding Constraint |
|-----------|-------------------|
| `docs/references/frontend/project-folder-structure.md` | SEO files go in `app/` per Next.js App Router convention. OG image goes in `public/images/`. |
| `docs/references/frontend/naming-and-conventions-pattern.md` | File names: `robots.ts`, `sitemap.ts` (kebab-case). Constants: `UPPER_SNAKE_CASE`. Vietnamese UI text, English code/comments. |
| `docs/references/frontend/component-structure-pattern.md` | No new components needed. Metadata is inline in page files. |
| `docs/references/shared/type-naming-pattern.md` | No new shared types. Uses Next.js `Metadata` and `MetadataRoute`. |

### Implementation Notes

- **Next.js 16**: `params` and `searchParams` are Promises in `generateMetadata`. Must `await` them.
- **metadataBase**: Required for resolving relative OG image paths to absolute URLs. Set once in root layout.
- **JSON-LD**: Render as native `<script type="application/ld+json">` in Server Components. Do NOT use `next/script`. Escape `<` as `\u003c` in JSON-LD output.
- **OG image**: Use a static placeholder PNG (1200×630) at `public/images/og-image.png`. Dynamic generation via `opengraph-image.tsx` is deferred.
- **Vietnamese content**: All metadata title, description, and OG text must be Vietnamese, matching `HERO_COPY` content.
- **Twitter card**: Use `summary_large_image` card type for both pages.

## Plan of Work (Narrative)

### Step 1: Create `app/robots.ts`

Create a Next.js App Router robots file that returns a `MetadataRoute.Robots` object:
- Allow all user agents to crawl `/`
- Disallow `/private/` (defensive, even though no private routes exist yet)
- Reference sitemap at `<metadataBase>/sitemap.xml`

### Step 2: Create `app/sitemap.ts`

Create a Next.js App Router sitemap file that returns a `MetadataRoute.Sitemap` array:
- Entry for `/` (landing page) — priority 1.0, changeFrequency `monthly`
- Entry for `/story` — priority 0.8, changeFrequency `monthly`
- Use absolute URLs based on `metadataBase`

### Step 3: Create placeholder OG image

Create a minimal placeholder OG image at `public/images/og-image.png` (1200×630). This can be a simple solid-color image with couple names. For now, a minimal placeholder is acceptable — the real OG image will be designed later.

**Decision**: Use a static PNG placeholder rather than `opengraph-image.tsx` dynamic generation. Dynamic generation adds complexity and the couple hasn't provided final design assets. Logged as tech debt.

### Step 4: Enhance root layout metadata in `app/layout.tsx`

Update the existing `metadata` export in `app/layout.tsx`:
- Add `metadataBase` with the production URL (use `NEXT_PUBLIC_SITE_URL` env var or default to `https://tx-va-wedding.vercel.app`)
- Add `openGraph.images` pointing to `/images/og-image.png`
- Add `openGraph.locale` set to `vi_VN`
- Add `openGraph.siteName` set to couple names
- Add `twitter.card` set to `summary_large_image`
- Add `twitter.title` and `twitter.description`
- Keep existing title and description

### Step 5: Add `generateMetadata` to `app/page.tsx`

Add a `generateMetadata` export to the landing page:
- Title: `Xuân Tùng & Vân Anh — Thiệp cưới`
- Description: Vietnamese invitation text from `HERO_COPY`
- OG title, description, image (override root defaults with page-specific values)
- Twitter card override with page-specific values

### Step 6: Add JSON-LD structured data to `app/page.tsx`

Add a JSON-LD `<script>` tag in the landing page component body:
- Schema.org `Event` type (not `WeddingEvent` — Schema.org doesn't have a dedicated `WeddingEvent`; use `Event` with `eventType: "WeddingEvent"`)
- Include: name, startDate, endDate, location (with `Place` and `PostalAddress`), description
- Render via `dangerouslySetInnerHTML` with `<` escaped as `\u003c`

### Step 7: Add `generateMetadata` to `app/story/page.tsx`

Add a `generateMetadata` export to the story page:
- Title: `Hành trình yêu — Xuân Tùng & Vân Anh`
- Description: Vietnamese story description
- OG title, description, image
- Twitter card override

### Step 8: Verify build and metadata output

Run `pnpm lint`, `pnpm typecheck`, `pnpm build` and verify:
- Build succeeds
- `robots.txt` and `sitemap.xml` routes are generated
- Metadata renders correctly in HTML `<head>`

## Concrete Steps (Commands)

```bash
# From repo root

# 1. Full workspace verification baseline
./init.sh

# 2. After implementation, verify lint
pnpm lint

# 3. Verify type checking
pnpm typecheck

# 4. Verify production build (generates robots.txt, sitemap.xml, metadata)
pnpm build

# 5. Verify robots.txt is served
# After starting dev server: curl http://localhost:3000/robots.txt
# Expected: User-agent: * / Allow: / / Disallow: /private/ / Sitemap: https://...

# 6. Verify sitemap.xml is served
# After starting dev server: curl http://localhost:3000/sitemap.xml
# Expected: XML with <url> entries for / and /story

# 7. Verify metadata in HTML
# After starting dev server: curl http://localhost:3000 | grep og:title
# Expected: <meta property="og:title" content="Xuân Tùng & Vân Anh — Thiệp cưới">
```

## Validation and Acceptance

### Acceptance Criteria

| # | Criterion | How to Verify |
|---|-----------|---------------|
| 1 | `robots.txt` allows all crawlers and references sitemap | `curl /robots.txt` shows `Allow: /` and `Sitemap:` line |
| 2 | Sitemap lists `/` and `/story` routes | `curl /sitemap.xml` shows both URLs |
| 3 | Landing page has OG title, description, and image | View page source, find `og:title`, `og:description`, `og:image` |
| 4 | Story page has OG title, description, and image | View page source, find `og:title`, `og:description`, `og:image` |
| 5 | Twitter Card metadata present on both pages | View page source, find `twitter:card`, `twitter:title` |
| 6 | JSON-LD `Event` structured data on landing page | View page source, find `<script type="application/ld+json">` with `@type: Event` |
| 7 | OG image path resolves (placeholder exists) | `public/images/og-image.png` exists and is referenced in metadata |
| 8 | Metadata is Vietnamese and matches hero copy | Compare `og:title` and `og:description` with `HERO_COPY` values |
| 9 | `pnpm lint`, `pnpm typecheck`, `pnpm build` pass | Run commands, expect 0 errors |
| 10 | `./init.sh` passes | Run full verification |

### Happy Path

1. Build succeeds with no errors.
2. `/robots.txt` returns valid robots configuration.
3. `/sitemap.xml` returns valid sitemap with both routes.
4. Landing page HTML contains complete OG + Twitter + JSON-LD metadata.
5. Story page HTML contains complete OG + Twitter metadata.

### Regression Checks

- Existing pages still render correctly (landing, story, 404, error).
- Guest personalization (`?g=<id>`) still works.
- Loading and error states still function.

## Idempotence & Recovery

- All steps are idempotent: re-running `pnpm build` regenerates the same output.
- No database migrations or destructive operations.
- If OG image placeholder needs replacement, simply overwrite `public/images/og-image.png`.
- Metadata changes are purely additive — no existing metadata is removed, only enhanced.

## Interfaces & Dependencies

| Dependency | Type | Notes |
|------------|------|-------|
| Next.js Metadata API | Framework | `Metadata`, `MetadataRoute`, `generateMetadata` — built-in App Router |
| `HERO_COPY` | Internal | Source of truth for Vietnamese text in `components/hero/hero-copy.ts` |
| `metadataBase` | Config | Must be set to production URL for absolute OG image URLs |
| `public/images/og-image.png` | Static asset | Placeholder OG image (1200×630) |

## Risks & Blockers

| Risk | Mitigation |
|------|------------|
| OG image placeholder looks poor in social previews | Acceptable for now; real OG image design deferred. Logged in tech debt. |
| `metadataBase` URL must match production domain | Use `NEXT_PUBLIC_SITE_URL` env var with sensible default. Document in `.env.example`. |
| JSON-LD `Event` schema may not be recognized as "WeddingEvent" by all platforms | Use `@type: Event` with `eventType: "WeddingEvent"` per Schema.org convention. |
| Dynamic OG per guest (`?g=<id>`) not in scope | Deferred; current implementation serves same OG for all guests. |

## Progress

- [x] Create `app/robots.ts`
- [x] Create `app/sitemap.ts`
- [x] Create placeholder OG image at `public/images/og-image.png`
- [x] Enhance root layout metadata in `app/layout.tsx`
- [x] Add `generateMetadata` to `app/page.tsx`
- [x] Add JSON-LD structured data to `app/page.tsx`
- [x] Add `generateMetadata` to `app/story/page.tsx`
- [x] Verify: `pnpm lint`, `pnpm typecheck`, `pnpm build`, `./init.sh`
- [x] Update harness files with evidence

## Surprises & Discoveries

- (To be filled during implementation)

## Decision Log

- **Decision**: Use static OG image placeholder instead of dynamic `opengraph-image.tsx` generation.
  - **Rationale**: Dynamic generation adds complexity; couple hasn't provided final design assets. A placeholder is sufficient for initial launch. Deferred to tech debt.
  - **Date**: 2026-05-05

- **Decision**: Use `@type: Event` with `eventType: "WeddingEvent"` for JSON-LD.
  - **Rationale**: Schema.org doesn't have a dedicated `WeddingEvent` type. Using `Event` with `eventType` is the standard convention.
  - **Date**: 2026-05-05

- **Decision**: Defer guest-specific OG metadata per `?g=<id>`.
  - **Rationale**: Would require `generateMetadata` to read `searchParams` and produce different OG per guest. Adds complexity and the primary use case (messaging app previews) works with generic OG. Deferred.
  - **Date**: 2026-05-05

- **Decision**: Use `NEXT_PUBLIC_SITE_URL` env var for `metadataBase`.
  - **Rationale**: Production domain may differ from development. Environment variable allows configuration without code changes.
  - **Date**: 2026-05-05

## Outcomes & Retrospective

- All acceptance criteria met: robots.txt, sitemap, OG metadata, Twitter Cards, JSON-LD, OG image placeholder, Vietnamese content, build passes.
- Build confirms `/robots.txt` and `/sitemap.xml` are statically generated.
- Story page HTML verified to contain correct `og:title`, `og:description`, `og:image`, `og:url`, `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`.
- Landing page has `generateMetadata` with OG + Twitter + JSON-LD `Event` schema with `eventType: "WeddingEvent"`.
- OG image is a minimal 1200×630 wine-colored placeholder (3.6KB). Real OG image design deferred to tech debt.
- Guest-specific OG metadata per `?g=<id>` deferred per plan decision.