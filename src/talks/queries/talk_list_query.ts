import { inject } from '@adonisjs/core'
import Talk from '#talks/models/talk'
import type { MediaSource } from '#media/media_source'
import type { TalkLinkType } from '#types/content'
import type { Locale } from '#types/i18n'
import type { DateTime } from 'luxon'

export interface TalkLinkItem {
  label: string
  url: string
  type: TalkLinkType
}

export interface TalkTechnologyItem {
  slug: string
  name: string
}

export interface TalkListItem {
  slug: string
  title: string
  summary: string
  eventName: string
  eventDate: DateTime
  city: string
  readingTime: number
  upcoming: boolean
  links: TalkLinkItem[]
  technologies: TalkTechnologyItem[]
  cover: MediaSource | null
}

@inject()
export class TalkListQuery {
  async execute(locale: Locale): Promise<TalkListItem[]> {
    const talks = await Talk.query()
      .withScopes((scopes) => scopes.published())
      .whereHas('translations', (translations) => translations.where('locale', locale))
      .preload('translations', (translations) =>
        translations.select('id', 'talk_id', 'locale', 'title', 'summary')
      )
      .preload('links', (links) => links.orderBy('position'))
      .preload('technologies')
      .preload('cover')
      .orderBy('event_date', 'desc')

    return talks.map((talk) => {
      const translation = talk.translation(locale)!

      return {
        slug: talk.slug,
        title: translation.title,
        summary: translation.summary,
        eventName: talk.eventName,
        eventDate: talk.eventDate,
        city: talk.city,
        readingTime: talk.readingTime,
        upcoming: talk.isUpcoming,
        links: talk.links.map((link) => ({ label: link.label, url: link.url, type: link.type })),
        technologies: talk.technologies.map((technology) => ({
          slug: technology.slug,
          name: technology.name,
        })),
        cover: talk.cover,
      }
    })
  }
}
