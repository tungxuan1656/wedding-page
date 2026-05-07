import { strings } from './i18n'

export function buildGoogleCalendarUrl(): string {
  const start = '20260608'
  const end = '20260610'
  const title = encodeURIComponent(strings.events.titleCalendar)
  const location = encodeURIComponent(
    'https://maps.app.goo.gl/xBVg6Gs3JPenCaC89',
  )

  return (
    `https://calendar.google.com/calendar/render` +
    `?action=TEMPLATE` +
    `&text=${title}` +
    `&dates=${start}/${end}` +
    `&location=${location}`
  )
}
