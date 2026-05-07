# 💍 Wedding Website Project – Product Specification

## 1. Project Overview

### 1.1 Goal

Build a **modern, personalized, and emotionally rich wedding invitation website** — not just an event info page, but an interactive story-driven experience that retells a 10-year love journey.

### 1.2 Product Philosophy

- Not a typical "online invitation card"
- A **story-driven experience**
- Focused on:
  - Emotion
  - Personalization
  - User experience (UX)

---

## 2. Tech Stack

### 2.1 Frontend

- Framework: **Next.js 16 (App Router)**
- Styling: Tailwind CSS v4
- Animation: Framer Motion (simple, React-friendly)

### 2.2 Backend (Lightweight)

- Google Apps Script (Web App API)
- Google Sheets (as database)

### 2.3 Hosting & Deployment

- Vercel:
  - Automatic CI/CD from GitHub
  - Global CDN
  - SSL included

### 2.4 Data Flow

```
User → Next.js frontend → (fetch POST)
→ Google Apps Script → Google Sheets
```

---

## 3. Core Features

### 3.1 Landing Page

**Purpose**
- Deliver key event information
- Create a strong first impression

**Content**
- Hero section: couple names, wedding photo
- Event dates and times
- Venue: address, Google Maps embed
- CTAs: "Confirm Attendance", "View Our Story"

---

### 3.2 Our Story (10-year storytelling)

**Goal**
- Turn a photo album into an emotionally engaging narrative
- Scroll-based experience

**Structure — chapter-based storytelling**

```
2015 – First meeting
2017 – Long distance
2020 – Challenges
2022 – Growing together
2025 – The proposal
```

**Each chapter contains:**
- Title (year + event name)
- 3–5 photos
- 1–2 short paragraphs
- Subtle animations: fade-in, slide-up, image zoom

**UX flow:**
```
Scroll down → each chapter appears
→ photos + text animate in
→ smooth scene transitions
```

**Design principles:**
- No more than 40 photos total
- Quality over quantity
- Every section must have meaning

---

### 3.3 Guest Personalization

**Goal**
- Each guest sees personalized content
- Increases emotional impact and engagement

**How it works — URL pattern:**
```
https://yourdomain.com?g=anhtu
```

**Data structure:**
```json
{
  "anhtu": {
    "name": "Anh Tuan",
    "message": "See you soon!",
    "image": "/guests/anhtu.jpg"
  }
}
```

**Processing logic:**
```js
const params = new URLSearchParams(window.location.search)
const guestId = params.get('g')
const guest = data[guestId]
```

**UI display:**
- "Hello, Anh Tuan"
- Personal message
- Name highlighted in the invitation

**Optional enhancements:**
- Per-guest QR code
- Show/hide content based on guest type

---

### 3.4 RSVP System

**Goal**
- Collect attendance confirmations
- No complex backend required

**Form fields:**
- Name
- Events attending (checkboxes)
- Optional note

**Frontend submit:**
```js
fetch(APPS_SCRIPT_URL, {
  method: 'POST',
  body: JSON.stringify({ name, eventDaiKhach, eventThanhHon, slug })
})
```

**Apps Script handler:**
```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()
  const data = JSON.parse(e.postData.contents)
  sheet.appendRow([data.name, data.eventDaiKhach, data.eventThanhHon])
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'success' }))
    .setMimeType(ContentService.MimeType.JSON)
}
```

**Output:** Saved to Google Sheets, easy to manage.

---

### 3.5 Performance Optimization

**Images:**
- Format: WebP / AVIF
- Resize before upload
- Lazy loading via `next/image`

**Code:**
- Dynamic import for animation-heavy components
- Avoid large JS bundles

**UX:**
- Fast load on mobile
- Smooth scrolling

---

### 3.6 Mobile Optimization

> 80–90% of users will be on mobile.

**Checklist:**
- Responsive layout
- Readable font sizes
- Touch-friendly button sizes
- No jank during scroll

---

### 3.7 Optional Features (Nice-to-have)

- 🎵 Background music
- 📷 Fullscreen gallery lightbox
- 📍 Interactive map
- 📲 Per-guest QR code

---

## 4. Project Structure (Next.js)

```
app/
  page.tsx          → Landing page
  story/page.tsx    → Our Story

components/
  hero/             → Hero section
  story/            → Story chapters
  rsvp/             → RSVP form
  guest/            → Guest personalization banner
  shared/           → Reusable components

lib/
  guests.ts         → Guest data & lookup
  api.ts            → Apps Script API client
  i18n/
    vi.json         → All UI strings (Vietnamese)
    index.ts        → i18n utility

public/
  images/           → Wedding photos
  guests/           → Guest-specific photos
```

---

## 5. Development Timeline

| Day | Focus |
|-----|-------|
| 1 | Project setup, Vercel deploy, landing page |
| 2 | Story sections, content |
| 3 | Animations, UI polish |
| 4 | RSVP (Apps Script integration) |
| 5 | Guest personalization, testing |

---

## 6. Risks & Pitfalls

1. **Over-engineering** — Too many animations, wasted time. Keep it simple.
2. **Too many photos** — Slows the site, loses focus. Max 40 total.
3. **Not testing on mobile** — Poor UX. Test on 3G throttle.
4. **RSVP failures** — Test thoroughly before the wedding date.

---

## 7. Success Criteria

- Load time < 2s on mobile
- Smooth scroll experience
- Story is clear and emotionally resonant
- RSVP works reliably end-to-end
- Guest personalization renders correctly

---

## 8. Architecture Summary

```
Next.js + Vercel + Apps Script + Google Sheets
```

A fast, lightweight, easy-to-build stack — powerful enough for a high-quality wedding experience.

> When done right, this is not just a wedding website — it's a memorable experience for every guest.