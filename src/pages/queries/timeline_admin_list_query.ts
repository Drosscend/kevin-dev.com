import { inject } from '@adonisjs/core'
import TimelineEntry from '#pages/models/timeline_entry'
import type { TimelineHonours } from '#types/content'

export interface TimelineAdminListItem {
  id: number
  honours: TimelineHonours
  periodFr: string
  titleFr: string
  placeFr: string
  periodEn: string
  titleEn: string
  placeEn: string
}

@inject()
export class TimelineAdminListQuery {
  async execute(): Promise<TimelineAdminListItem[]> {
    const entries = await TimelineEntry.query()
      .preload('translations', (translations) =>
        translations.select('id', 'timeline_entry_id', 'locale', 'period', 'title', 'place')
      )
      .orderBy('position')

    return entries.map((entry) => {
      const fr = entry.translations.find((item) => item.locale === 'fr')
      const en = entry.translations.find((item) => item.locale === 'en')

      return {
        id: entry.id,
        honours: entry.honours,
        periodFr: fr?.period ?? '',
        titleFr: fr?.title ?? '',
        placeFr: fr?.place ?? '',
        periodEn: en?.period ?? '',
        titleEn: en?.title ?? '',
        placeEn: en?.place ?? '',
      }
    })
  }
}
