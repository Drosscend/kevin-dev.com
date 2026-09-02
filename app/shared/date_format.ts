import { SITE_ZONE } from '#shared/site_zone'
import type { Locale } from '#types/i18n'
import type { DateTime } from 'luxon'

/** "24 juillet 2026" / "July 24, 2026": publication and event dates. */
export function longDate(date: DateTime, locale?: Locale): string
export function longDate(date: DateTime | null, locale?: Locale): string | null
export function longDate(date: DateTime | null, locale: Locale = 'fr') {
  return (
    date
      ?.setZone(SITE_ZONE)
      .setLocale(locale)
      .toLocaleString({ day: 'numeric', month: 'long', year: 'numeric' }) ?? null
  )
}

/** "juillet 2026" / "July 2026": project periods and the upcoming talks of the home page. */
export function monthYear(date: DateTime, locale: Locale): string
export function monthYear(date: DateTime | null, locale: Locale): string | null
export function monthYear(date: DateTime | null, locale: Locale) {
  return (
    date?.setZone(SITE_ZONE).setLocale(locale).toLocaleString({ month: 'long', year: 'numeric' }) ??
    null
  )
}

/** The "YYYY-MM-DDTHH:mm" value the admin date-time pickers speak, on the site's clock. */
export function pickerDateTime(date: DateTime | null) {
  return date?.setZone(SITE_ZONE).toISO({ includeOffset: false })?.slice(0, 16) ?? null
}
