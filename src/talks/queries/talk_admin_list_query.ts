import { inject } from '@adonisjs/core'
import Talk from '#talks/models/talk'
import type { PublicationStatus } from '#types/content'
import type { DateTime } from 'luxon'

export interface TalkAdminListItem {
  id: number
  slug: string
  title: string
  hasEnglish: boolean
  status: PublicationStatus
  eventName: string
  eventDate: DateTime
  city: string
  upcoming: boolean
  publishedAt: DateTime | null
  scheduled: boolean
}

@inject()
export class TalkAdminListQuery {
  async execute(): Promise<TalkAdminListItem[]> {
    const talks = await Talk.query()
      .preload('translations', (translations) =>
        translations.select('id', 'talk_id', 'locale', 'title')
      )
      .orderBy('event_date', 'desc')

    return talks.map((talk) => ({
      id: talk.id,
      slug: talk.slug,
      title: talk.translation('fr')?.title ?? talk.slug,
      hasEnglish: talk.translation('en') !== undefined,
      status: talk.status,
      eventName: talk.eventName,
      eventDate: talk.eventDate,
      city: talk.city,
      upcoming: talk.isUpcoming,
      publishedAt: talk.publishedAt,
      scheduled: !talk.isPublished && talk.status === 'published',
    }))
  }
}
