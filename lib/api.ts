export type RsvpFormData = {
  name: string
  eventDaiKhach: boolean
  eventThanhHon: boolean
}

// Outgoing POST body matches Apps Script contract
export type RsvpPayload = RsvpFormData

export type RsvpApiResponse = {
  status: 'success' | 'error'
  message?: string
}

export async function submitRsvp(
  formData: RsvpFormData,
): Promise<RsvpApiResponse> {
  const url = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL

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
