import { BaseTransformer } from '@adonisjs/core/transformers'

export interface HomeArticleCard {
  slug: string
  title: string
  summary: string
  publishedAt: string | null
  coverUrl: string | null
}

export default class HomeArticleTransformer extends BaseTransformer<HomeArticleCard> {
  toObject() {
    return this.pick(this.resource, ['slug', 'title', 'summary', 'publishedAt', 'coverUrl'])
  }
}
