import { BaseTransformer } from '@adonisjs/core/transformers'

export interface ArticleCard {
  slug: string
  title: string
  summary: string
  publishedAt: string | null
  readingTimeLabel: string
  category: { slug: string; name: string } | null
  technologies: { slug: string; name: string }[]
  coverUrl: string | null
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
      'coverUrl',
    ])
  }
}
