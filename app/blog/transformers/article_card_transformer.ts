import { BaseTransformer } from '@adonisjs/core/transformers'
import type { Picture } from '#types/content'

export interface ArticleCard {
  slug: string
  title: string
  summary: string
  publishedAt: string | null
  readingTimeLabel: string
  category: { slug: string; name: string } | null
  technologies: { slug: string; name: string }[]
  cover: Picture | null
}

export default class ArticleCardTransformer extends BaseTransformer<ArticleCard> {
  toObject() {
    return this.pick(this.resource, [
      'slug',
      'title',
      'summary',
      'publishedAt',
      'readingTimeLabel',
      'category',
      'technologies',
      'cover',
    ])
  }
}
