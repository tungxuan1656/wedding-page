import generatedGuests from './guests-generated.json'

export type GuestId = string

export type GuestPhoto = {
  src: string
  alt: string
  width: number
  height: number
}

export type GuestData = {
  name: string
  message: string
  photo?: GuestPhoto
}

export type GuestMap = Record<GuestId, GuestData>

// Personalised messages per slug — copy owned in code, not in the sheet.
// Add an entry here for each guest who should receive a custom message.
const GUEST_MESSAGES: Record<string, string> = {
  anhtu:
    'Thank you for always being there for us. We would love to have you join the celebration and make another beautiful memory together.',
  thuha:
    'We hope you can come and stay as long as you like, sharing the warmest moments of our wedding day with us.',
}

// Merge generated (name + photo from sheet) with personalised messages.
// Falls back to empty object if guests-generated.json is missing or empty.
const rawGenerated = generatedGuests as Record<
  string,
  { name: string; photo?: GuestPhoto }
>

export const GUESTS: GuestMap = Object.fromEntries(
  Object.entries(rawGenerated).map(([slug, data]) => [
    slug,
    {
      name: data.name,
      message: GUEST_MESSAGES[slug] ?? '',
      ...(data.photo ? { photo: data.photo } : {}),
    },
  ]),
)

export const getGuestById = (guestId?: string | string[]) => {
  if (typeof guestId !== 'string') {
    return null
  }

  const normalizedGuestId = guestId.trim().toLowerCase()

  if (!normalizedGuestId) {
    return null
  }

  return GUESTS[normalizedGuestId] ?? null
}
