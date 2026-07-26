/**
 * French display formatting for the "YYYY-MM-DDTHH:mm" values the admin
 * exchanges with the server. Kept in one place so every screen reads a
 * date the same way: "24 juillet 2026", "24 juillet 2026 à 14:30". The
 * fr-FR locale is always 24-hour, so no AM/PM ever shows.
 */

const DATE_FORMAT = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' })
const DATE_TIME_FORMAT = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'long',
  timeStyle: 'short',
})

function parseLocal(value: string | null | undefined) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatFrDate(value: string | null | undefined): string {
  const date = parseLocal(value)
  return date ? DATE_FORMAT.format(date) : ''
}

export function formatFrDateTime(value: string | null | undefined): string {
  const date = parseLocal(value)
  return date ? DATE_TIME_FORMAT.format(date) : ''
}
