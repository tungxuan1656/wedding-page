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
    'Cảm ơn bạn đã luôn dành tình cảm cho tụi mình. Mong được đón bạn trong ngày vui để cùng lưu lại thêm một kỷ niệm thật đẹp.',
  thuha:
    'Mong bạn sẽ đến chung vui và ở lại thật lâu để cùng tụi mình chia sẻ những khoảnh khắc ấm áp nhất của ngày cưới.',
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
