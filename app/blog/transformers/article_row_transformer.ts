import { BaseTransformer } from '@adonisjs/core/transformers'
import type { PublicationStatus } from '#types/content'

export interface ArticleRow {
  id: number
  slug: string
  title: string
  hasEnglish: boolean
  status: PublicationStatus
  publishedAt: string | null
  scheduled: boolean
  category: string | null
}

export default class ArticleRowTransformer extends BaseTransformer<ArticleRow> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'slug',
      'title',
      'hasEnglish',
      'status',
      'publishedAt',
      'scheduled',
      'category',
    ])
  }
}
