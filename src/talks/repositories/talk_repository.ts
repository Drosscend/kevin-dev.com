import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import {
  applyContentFields,
  renderTranslations,
  replaceLinks,
  type ContentPayload,
} from '#shared/content/content_fields'
import { upsertTranslations } from '#shared/content/translations'
import Talk from '#talks/models/talk'
import type { TalkLinkType } from '#types/content'

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
export class TalkRepository {
  async findById(id: number) {
    return Talk.find(id)
  }

  async delete(talk: Talk) {
    await talk.delete()
  }

  async save(talk: Talk, payload: TalkPayload) {
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
