import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import type Talk from '#models/talk'
import type { TalkLinkType } from '#types/content'
import {
  applyContentFields,
  renderTranslations,
  replaceLinks,
  type ContentPayload,
} from '#services/content_service'
import { upsertTranslations } from '#services/translations_service'

export interface TalkPayload extends ContentPayload {
  eventDate: string
  eventName: string
  city: string
  technologyIds: number[]
  links: { label: string; url: string; type: TalkLinkType }[]
}

/**
 * Persists a talk with its translations, external links and
 * technology associations inside a single DB transaction, so a
 * failure can never leave the talk half-saved.
 */
export default class TalkService {
  static async save(talk: Talk, payload: TalkPayload) {
    const translations = await renderTranslations(payload)

    return db.transaction(async (trx) => {
      talk.useTransaction(trx)

      applyContentFields(talk, payload)
      talk.eventDate = DateTime.fromISO(payload.eventDate)
      talk.eventName = payload.eventName
      talk.city = payload.city
      await talk.save()

      await upsertTranslations(talk.related('translations'), translations)
      await replaceLinks(talk.related('links'), payload.links)
      await talk.related('technologies').sync(payload.technologyIds)

      return talk
    })
  }
}
