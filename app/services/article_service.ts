import { DateTime } from 'luxon'
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
  tagIds: number[]
  fr: TranslationPayload
  en: TranslationPayload | null
}

/**
 * Persists an article with its translations: Markdown is rendered
 * to HTML at save time, reading time is computed from the French
 * content, and publishedAt is set on the first publication only.
 */
export default class ArticleService {
  static async save(article: Article, payload: ArticlePayload) {
    article.slug = payload.slug
    article.categoryId = payload.categoryId
    article.readingTime = MarkdownService.readingTime(payload.fr.contentMarkdown)

    if (payload.status === 'published' && !article.publishedAt) {
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
        contentHtml: await MarkdownService.render(payload.fr.contentMarkdown),
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
          contentHtml: await MarkdownService.render(payload.en.contentMarkdown),
        }
      )
    } else {
      await article.related('translations').query().where('locale', 'en').delete()
    }

    await article.related('tags').sync(payload.tagIds)

    return article
  }
}
