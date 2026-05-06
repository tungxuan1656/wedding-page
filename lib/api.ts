export type RsvpFormData = {
  name: string
  eventDaiKhach: boolean
  eventThanhHon: boolean
}

// Outgoing POST body — includes optional slug for guest identification
export type RsvpPayload = RsvpFormData & { slug?: string }

export type RsvpApiResponse = {
  status: 'success' | 'error'
  message?: string
}

export type RsvpGetData = {
  name: string
  eventDaiKhach: boolean
  eventThanhHon: boolean
  submittedAt: string
}

export type RsvpGetResponse = {
  status: 'success' | 'error'
  data: RsvpGetData | null
  message?: string
}

// Fetch the last RSVP submission for a given guest slug.
// Returns null data if no prior submission exists.
// Silently returns error shape on any network/parse failure — callers should treat as no prior RSVP.
export async function getRsvp(slug: string): Promise<RsvpGetResponse> {
  const url = process.env.NEXT_PUBLIC_RSVP_SCRIPT_URL
  if (!url) {
    return { status: 'error', data: null, message: 'Endpoint not configured' }
  }

  try {
    const res = await fetch(`${url}?slug=${encodeURIComponent(slug)}`)
    if (!res.ok) {
      return { status: 'error', data: null }
    }

    let json: RsvpGetResponse
    try {
      json = (await res.json()) as RsvpGetResponse
    } catch {
      return { status: 'error', data: null }
    }

    return json
  } catch {
    return { status: 'error', data: null }
  }
}

export async function submitRsvp(
  formData: RsvpFormData,
  slug?: string,
): Promise<RsvpApiResponse> {
  // Prefer slug-aware endpoint; fall back to legacy POST-only endpoint
  const url =
    process.env.NEXT_PUBLIC_RSVP_SCRIPT_URL ||
    process.env.NEXT_PUBLIC_APPS_SCRIPT_URL

  if (!url) {
    return {
      status: 'error',
      message: 'Endpoint không được cấu hình. Vui lòng liên hệ ban tổ chức.',
    }
  }

  const payload: RsvpPayload = {
    name: formData.name.trim(),
    eventDaiKhach: formData.eventDaiKhach,
    eventThanhHon: formData.eventThanhHon,
    ...(slug ? { slug } : {}),
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    let data: RsvpApiResponse
    try {
      data = (await response.json()) as RsvpApiResponse
    } catch {
      return { status: 'error', message: 'Phản hồi từ máy chủ không hợp lệ.' }
    }

    if (data.status === 'success') {
      return { status: 'success' }
    }

    return {
      status: 'error',
      message: data.message ?? 'Gửi thất bại. Vui lòng thử lại.',
    }
  } catch {
    return {
      status: 'error',
      message: 'Không thể kết nối. Vui lòng kiểm tra mạng và thử lại.',
    }
  }
}
