import { inject } from '@adonisjs/core'
import Talk from '#talks/models/talk'
import type { PublicationStatus, TalkLinkType } from '#types/content'
import type { DateTime } from 'luxon'

export interface TalkFormTranslation {
  title: string
  summary: string
  contentMarkdown: string
}

export interface TalkForm {
  id: number
  slug: string
  status: PublicationStatus
  coverMediaId: number | null
  eventDate: DateTime
  eventName: string
  city: string
  technologyIds: number[]
  links: { label: string; url: string; type: TalkLinkType }[]
  publishedAt: DateTime | null
  hasBeenOnline: boolean
  fr: TalkFormTranslation
  en: TalkFormTranslation | null
}

@inject()
export class TalkFormQuery {
  async execute(id: number): Promise<TalkForm | null> {
    const talk = await Talk.query()
      .where('id', id)
      .preload('translations', (translations) =>
        translations.select('id', 'talk_id', 'locale', 'title', 'summary', 'content_markdown')
      )
      .preload('links', (links) => links.orderBy('position'))
      .preload('technologies', (technologies) => technologies.select('id'))
      .first()

    if (!talk) {
      return null
    }

    const fr = talk.translation('fr')
    const en = talk.translation('en')

    return {
      id: talk.id,
      slug: talk.slug,
      status: talk.status,
      coverMediaId: talk.coverMediaId,
      eventDate: talk.eventDate,
      eventName: talk.eventName,
      city: talk.city,
      technologyIds: talk.technologies.map((technology) => technology.id),
      links: talk.links.map((link) => ({ label: link.label, url: link.url, type: link.type })),
      publishedAt: talk.publishedAt,
      hasBeenOnline: talk.hasBeenOnline,
      fr: {
        title: fr?.title ?? '',
        summary: fr?.summary ?? '',
        contentMarkdown: fr?.contentMarkdown ?? '',
      },
      en: en ? { title: en.title, summary: en.summary, contentMarkdown: en.contentMarkdown } : null,
    }
  }
}
