// scripts/fetch-guests.ts
// Build-time script: fetch guest list from Google Sheets via Apps Script GET,
// then write lib/guests-generated.json.
//
// Usage:
//   NEXT_PUBLIC_APPS_SCRIPT_URL=<url> pnpm fetch-guests
//   Or set NEXT_PUBLIC_APPS_SCRIPT_URL in .env.local and run: pnpm fetch-guests
//
// This script reads dotenv manually so it works without next.js context.

import * as fs from 'fs'
import * as path from 'path'

// Load .env.local if present (best-effort, not required)
function loadDotEnvLocal() {
  const envPath = path.resolve('.env.local')
  if (!fs.existsSync(envPath)) return
  const content = fs.readFileSync(envPath, 'utf-8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const value = trimmed.slice(eqIdx + 1).trim()
    if (!(key in process.env)) {
      process.env[key] = value
    }
  }
}

type GuestRow = { name: string; slug: string; image: string | null }
type GuestScriptResponse = { guests: GuestRow[] }

type GeneratedGuestEntry = {
  name: string
  photo?: { src: string; alt: string; width: number; height: number }
}

async function main() {
  loadDotEnvLocal()

  const url = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL
  if (!url) {
    throw new Error(
      'NEXT_PUBLIC_APPS_SCRIPT_URL is not set. Add it to .env.local or pass as environment variable.',
    )
  }

  console.log('Fetching guest list...')
  const fetchUrl = `${url}?sheet=guests`
  const res = await fetch(fetchUrl)
  if (!res.ok) {
    throw new Error(`Fetch failed: HTTP ${res.status} ${res.statusText}`)
  }

  const json = (await res.json()) as GuestScriptResponse

  if (!Array.isArray(json.guests)) {
    throw new Error('Unexpected response shape: expected { guests: [...] }')
  }

  const map: Record<string, GeneratedGuestEntry> = {}

  for (const g of json.guests) {
    if (!g.slug || typeof g.slug !== 'string') continue
    const key = g.slug.trim().toLowerCase()
    if (!key) continue

    map[key] = {
      name: g.name,
      ...(g.image
        ? {
            photo: {
              src: g.image,
              alt: `Guest photo - ${g.name}`,
              width: 320,
              height: 320,
            },
          }
        : {}),
    }
  }

  const outPath = path.resolve('lib/guests-generated.json')
  fs.writeFileSync(outPath, JSON.stringify(map, null, 2) + '\n')
  console.log(
    `✓ Wrote ${Object.keys(map).length} guests to lib/guests-generated.json`,
  )
}

main().catch((err: unknown) => {
  console.error('fetch-guests failed:', err instanceof Error ? err.message : err)
  process.exit(1)
})
