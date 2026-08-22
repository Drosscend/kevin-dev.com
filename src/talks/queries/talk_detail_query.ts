import { inject } from '@adonisjs/core'
import Talk from '#talks/models/talk'
import type { MediaSource } from '#media/media_source'
import type { TalkLinkItem, TalkTechnologyItem } from '#talks/queries/talk_list_query'
import type { Locale } from '#types/i18n'
import type { DateTime } from 'luxon'

export interface TalkDetail {
  slug: string
  status: string
  isPublished: boolean
  title: string
  summary: string
  contentHtml: string
  eventName: string
  eventDate: DateTime
  city: string
  readingTime: number
  upcoming: boolean
  hasOtherLocale: boolean
  hasEnglish: boolean
  links: TalkLinkItem[]
  technologies: TalkTechnologyItem[]
  cover: MediaSource | null
}

@inject()
export class TalkDetailQuery {
  async execute(slug: string, locale: Locale): Promise<TalkDetail | null> {
    const talk = await Talk.query()
      .where('slug', slug)
      .preload('translations', (translations) =>
        translations.select('id', 'talk_id', 'locale', 'title', 'summary', 'content_html')
      )
      .preload('cover')
      .preload('links', (links) => links.orderBy('position'))
      .preload('technologies')
      .first()

    if (!talk) {
      return null
    }

    const translation = talk.translation(locale)

    if (!translation) {
      return null
    }

    return {
      slug: talk.slug,
      status: talk.status,
      isPublished: talk.isPublished,
      title: translation.title,
      summary: translation.summary,
      contentHtml: translation.contentHtml,
      eventName: talk.eventName,
      eventDate: talk.eventDate,
      city: talk.city,
      readingTime: talk.readingTime,
      upcoming: talk.isUpcoming,
      hasOtherLocale: talk.translation(locale === 'fr' ? 'en' : 'fr') !== undefined,
      hasEnglish: talk.translation('en') !== undefined,
      links: talk.links.map((link) => ({ label: link.label, url: link.url, type: link.type })),
      technologies: talk.technologies.map((technology) => ({
        slug: technology.slug,
        name: technology.name,
      })),
      cover: talk.cover,
    }
  }
}
