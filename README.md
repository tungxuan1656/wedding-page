# 💍 Wedding Website Template

A modern, story-driven wedding invitation website built with Next.js 16. Features scroll-based interactive storytelling, guest personalization via URL parameters, and a serverless RSVP system backed by Google Sheets.

## Features

- **Landing page** — couple names, event details, venue map, countdown, gift registry
- **Our Story** — chapter-based scroll storytelling with Framer Motion animations
- **Guest personalization** — `?g=<id>` URL parameter shows a custom greeting and message
- **RSVP system** — form submission stored in Google Sheets via Google Apps Script
- **Background audio** — ambient music with play/pause toggle
- **i18n-ready** — all UI strings centralized in `lib/i18n/vi.json`; add more locales by extending `lib/i18n/index.ts`

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Backend | Google Apps Script + Google Sheets |
| Deployment | Vercel (CI/CD from GitHub) |
| Package manager | pnpm |

## Quick Start

```bash
# 1. Clone and install
git clone https://github.com/YOUR_USERNAME/wedding-website.git
cd wedding-website
pnpm install

# 2. Copy environment variables
cp .env.example .env.local
# Fill in NEXT_PUBLIC_APPS_SCRIPT_URL (see docs/GOOGLE_SHEETS_SETUP.md)

# 3. Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server (Turbopack) |
| `pnpm build` | Build for production |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript check |
| `pnpm fetch-guests` | Sync guest list from Google Sheets |

## Project Structure

```
app/
  page.tsx            → Landing page (hero, event info, RSVP CTA)
  story/page.tsx      → Our Story (scroll-animated chapters)
  layout.tsx          → Root layout (fonts, metadata)
  globals.css         → Design tokens (wine / cream / beige / gold)

components/
  hero/               → Hero section (names, photo, event dates)
  story/              → Story chapter components
  rsvp/               → RSVP form with validation
  event/              → Event details, map, gift registry
  countdown/          → Live countdown timer
  family/             → Family introduction section
  gallery/            → Photo gallery with lightbox
  guest/              → Guest personalization banner
  shared/             → Reusable components (audio, footer, etc.)

lib/
  guests.ts           → Guest data lookup (URL slug → personalized content)
  api.ts              → Google Apps Script RSVP client
  i18n/
    vi.json           → All Vietnamese UI strings (single source of truth)
    index.ts          → i18n utility — import { strings } from '@/lib/i18n'

scripts/
  fetch-guests.ts     → Build-time script to sync guest list from Sheets

public/
  images/             → Wedding photos (WebP/AVIF recommended)
  audios/             → Background music file
```

## Customization

### 1. Update content

Edit `lib/i18n/vi.json` to change all UI text — couple names, event dates, venue, story chapters, family info, and more. This is the single source of truth for all displayed content.

### 2. Add guests

See `docs/GOOGLE_SHEETS_SETUP.md` for the full setup guide. In short:
1. Add guests to the Google Sheet (`name`, `slug`, `image` columns)
2. Run `pnpm fetch-guests` to regenerate `lib/guests-generated.json`
3. Optionally add a personalised message in `lib/guests.ts → GUEST_MESSAGES`
4. Commit and push → Vercel auto-deploys

### 3. Add a language

1. Create `lib/i18n/en.json` mirroring the shape of `vi.json`
2. Import it in `lib/i18n/index.ts` and add to the `translations` map
3. Drive locale selection from a cookie or URL prefix

### 4. Replace photos

Drop WebP/AVIF files into `public/images/` and update paths in `lib/i18n/vi.json` (gallery section) or directly in the relevant component.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_APPS_SCRIPT_URL` | Yes | Google Apps Script web app URL |
| `NEXT_PUBLIC_SITE_URL` | No | Production URL for OG metadata (defaults to Vercel URL) |

## Deployment

This project is configured for **Vercel**. Connect your GitHub repository in the Vercel dashboard, set the environment variables, and every push to `main` will trigger a production deployment.

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

## License

MIT License

Copyright (c) 2026 Xuan Tung & Van Anh

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
