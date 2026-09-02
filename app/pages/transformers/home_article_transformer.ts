import { BaseTransformer } from '@adonisjs/core/transformers'
import type { Picture } from '#types/content'

export interface HomeArticleCard {
  slug: string
  title: string
  summary: string
  publishedAt: string | null
  cover: Picture | null
}

export default class HomeArticleTransformer extends BaseTransformer<HomeArticleCard> {
  toObject() {
    return this.pick(this.resource, ['slug', 'title', 'summary', 'publishedAt', 'cover'])
  }
}
