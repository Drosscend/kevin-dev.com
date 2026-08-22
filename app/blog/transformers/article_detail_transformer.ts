import { BaseTransformer } from '@adonisjs/core/transformers'

export interface ArticleDetail {
  title: string
  contentHtml: string
  publishedAt: string | null
  readingTimeLabel: string
  category: { slug: string; name: string } | null
  technologies: { slug: string; name: string }[]
}

export default class ArticleDetailTransformer extends BaseTransformer<ArticleDetail> {
  toObject() {
    return this.pick(this.resource, [
      'title',
      'contentHtml',
      'publishedAt',
      'readingTimeLabel',
      'category',
      'technologies',
    ])
  }
}
