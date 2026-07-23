import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import type Article from '#models/article'
import type { ArticleStatus } from '#models/article'
import MarkdownService from '#services/markdown_service'

export interface TranslationPayload {
  title: string
  summary: string
  contentMarkdown: string
}

export interface ArticlePayload {
  slug: string
  status: ArticleStatus
  categoryId: number | null
  coverMediaId: number | null
  technologyIds: number[]
  publishedAt?: string | null
  fr: TranslationPayload
  en: TranslationPayload | null
}

/**
 * Persists an article with its translations inside a single DB
 * transaction, so a failure can never leave a published article
 * without translations or technologies. Markdown is rendered before the
 * transaction starts, reading time is computed from the French
 * content, and publishedAt is set on the first publication only.
 */
export default class ArticleService {
  static async save(article: Article, payload: ArticlePayload) {
    const frHtml = await MarkdownService.render(payload.fr.contentMarkdown)
    const enHtml = payload.en ? await MarkdownService.render(payload.en.contentMarkdown) : null

    return db.transaction(async (trx) => {
      article.useTransaction(trx)

      article.slug = payload.slug
      article.categoryId = payload.categoryId
      article.coverMediaId = payload.coverMediaId
      article.readingTime = MarkdownService.readingTime(payload.fr.contentMarkdown)

      // An explicit date wins (future = scheduled); otherwise the date
      // is stamped automatically on the first publication.
      if (payload.publishedAt) {
        article.publishedAt = DateTime.fromISO(payload.publishedAt)
      } else if (payload.status === 'published' && !article.publishedAt) {
        article.publishedAt = DateTime.now()
      }
      article.status = payload.status
      await article.save()

      await article.related('translations').updateOrCreate(
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
        await article.related('translations').updateOrCreate(
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
        await article.related('translations').query().where('locale', 'en').delete()
      }

      await article.related('technologies').sync(payload.technologyIds)

      return article
    })
  }
}
