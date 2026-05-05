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

export const GUESTS: GuestMap = {
  anhtu: {
    name: 'Anh Tú',
    message:
      'Cảm ơn bạn đã luôn dành tình cảm cho tụi mình. Mong được đón bạn trong ngày vui để cùng lưu lại thêm một kỷ niệm thật đẹp.',
    photo: {
      src: '/guests/anh-tu.svg',
      alt: 'Minh hoạ chân dung khách mời Anh Tú',
      width: 320,
      height: 320,
    },
  },
  thuha: {
    name: 'Thu Hà',
    message:
      'Mong bạn sẽ đến chung vui và ở lại thật lâu để cùng tụi mình chia sẻ những khoảnh khắc ấm áp nhất của ngày cưới.',
  },
} as const

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
