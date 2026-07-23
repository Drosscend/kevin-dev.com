import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { TimelineEntrySchema } from '#database/schema'
import TimelineEntryTranslation from '#models/timeline_entry_translation'
import type { Locale } from '#types/i18n'

export const TIMELINE_HONOURS = ['none', 'fair', 'good', 'very_good'] as const
export type TimelineHonours = (typeof TIMELINE_HONOURS)[number]

export default class TimelineEntry extends TimelineEntrySchema {
  declare honours: TimelineHonours

  @hasMany(() => TimelineEntryTranslation)
  declare translations: HasMany<typeof TimelineEntryTranslation>

  /** Returns the translation for the locale, falling back to French. */
  translation(locale: Locale) {
    return (
      this.translations.find((item) => item.locale === locale) ??
      this.translations.find((item) => item.locale === 'fr') ??
      this.translations[0]
    )
  }
}
