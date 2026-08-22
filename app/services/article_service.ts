import db from '@adonisjs/lucid/services/db'
import {
  applyContentFields,
  renderTranslations,
  type ContentPayload,
} from '#shared/content/content_fields'
import { upsertTranslations } from '#shared/content/translations'
import type Article from '#models/article'

export interface ArticlePayload extends ContentPayload {
  categoryId: number | null
  technologyIds: number[]
}

/**
 * Persists an article with its translations inside a single DB
 * transaction, so a failure can never leave a published article
 * without translations or technologies.
 */
export default class ArticleService {
  static async save(article: Article, payload: ArticlePayload) {
    const translations = await renderTranslations(payload)

    return db.transaction(async (trx) => {
      article.useTransaction(trx)

      applyContentFields(article, payload)
      article.categoryId = payload.categoryId
      await article.save()

      await upsertTranslations(article.related('translations'), translations)
      await article.related('technologies').sync(payload.technologyIds)

      return article
    })
  }
}
