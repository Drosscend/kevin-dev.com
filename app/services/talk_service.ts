import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import type Talk from '#models/talk'
import type { TalkStatus } from '#models/talk'
import type { TalkLinkType } from '#models/talk_link'
import MarkdownService from '#services/markdown_service'

export interface TalkTranslationPayload {
  title: string
  summary: string
  contentMarkdown: string
}

export interface TalkLinkPayload {
  label: string
  url: string
  type: TalkLinkType
}

export interface TalkPayload {
  slug: string
  status: TalkStatus
  coverMediaId: number | null
  eventDate: string
  eventName: string
  city: string
  technologyIds: number[]
  links: TalkLinkPayload[]
  publishedAt?: string | null
  fr: TalkTranslationPayload
  en: TalkTranslationPayload | null
}

/**
 * Persists a talk with its translations, external links and
 * technology associations inside a single DB transaction, so a
 * failure can never leave the talk half-saved (the links are
 * replaced wholesale). Markdown is rendered before the transaction
 * starts and publishedAt is set on the first publication only.
 */
export default class TalkService {
  static async save(talk: Talk, payload: TalkPayload) {
    const frHtml = await MarkdownService.render(payload.fr.contentMarkdown)
    const enHtml = payload.en ? await MarkdownService.render(payload.en.contentMarkdown) : null

    return db.transaction(async (trx) => {
      talk.useTransaction(trx)

      talk.slug = payload.slug
      talk.coverMediaId = payload.coverMediaId
      talk.eventDate = DateTime.fromISO(payload.eventDate)
      talk.eventName = payload.eventName
      talk.city = payload.city

      // An explicit date wins (future = scheduled); otherwise the date
      // is stamped automatically on the first publication.
      if (payload.publishedAt) {
        talk.publishedAt = DateTime.fromISO(payload.publishedAt)
      } else if (payload.status === 'published' && !talk.publishedAt) {
        talk.publishedAt = DateTime.now()
      }
      talk.status = payload.status
      await talk.save()

      await talk.related('translations').updateOrCreate(
        { locale: 'fr' },
        {
          locale: 'fr',
          title: payload.fr.title,
          summary: payload.fr.summary,
          contentMarkdown: payload.fr.contentMarkdown,
          contentHtml: frHtml,
        }
      )

      if (payload.en) {
        await talk.related('translations').updateOrCreate(
          { locale: 'en' },
          {
            locale: 'en',
            title: payload.en.title,
            summary: payload.en.summary,
            contentMarkdown: payload.en.contentMarkdown,
            contentHtml: enHtml!,
          }
        )
      } else {
        await talk.related('translations').query().where('locale', 'en').delete()
      }

      await talk.related('links').query().delete()
      if (payload.links.length > 0) {
        await talk
          .related('links')
          .createMany(payload.links.map((link, index) => ({ ...link, position: index })))
      }

      await talk.related('technologies').sync(payload.technologyIds)

      return talk
    })
  }
}
