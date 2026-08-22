import { BaseTransformer } from '@adonisjs/core/transformers'
import type { PublicationStatus } from '#types/content'

export interface ArticleFormTranslationValues {
  title: string
  summary: string
  contentMarkdown: string
}

export interface ArticleFormView {
  id: number
  slug: string
  status: PublicationStatus
  categoryId: number | null
  coverMediaId: number | null
  technologyIds: number[]
  publishedAt: string | null
  hasBeenOnline: boolean
  fr: ArticleFormTranslationValues
  en: ArticleFormTranslationValues | null
}

export default class ArticleFormTransformer extends BaseTransformer<ArticleFormView> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'slug',
      'status',
      'categoryId',
      'coverMediaId',
      'technologyIds',
      'publishedAt',
      'hasBeenOnline',
      'fr',
      'en',
    ])
  }
}
