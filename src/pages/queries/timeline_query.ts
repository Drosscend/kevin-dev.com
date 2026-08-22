import { inject } from '@adonisjs/core'
import TimelineEntry from '#pages/models/timeline_entry'
import type { TimelineHonours } from '#types/content'
import type { Locale } from '#types/i18n'

export interface TimelineItem {
  period: string
  title: string
  place: string
  honours: TimelineHonours
}

@inject()
export class TimelineQuery {
  async execute(locale: Locale): Promise<TimelineItem[]> {
    const entries = await TimelineEntry.query().preload('translations').orderBy('position')

    return entries.map((entry) => {
      const translation = entry.translation(locale)

      return {
        period: translation?.period ?? '',
        title: translation?.title ?? '',
        place: translation?.place ?? '',
        honours: entry.honours,
      }
    })
  }
}
