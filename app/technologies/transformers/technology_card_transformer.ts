import { BaseTransformer } from '@adonisjs/core/transformers'
import type { TechnologyCategory } from '#types/content'

export interface TechnologyCard {
  slug: string
  name: string
  category: TechnologyCategory
  logoUrl: string | null
  docsUrl: string | null
  description: string
  usageLabel: string
}

export default class TechnologyCardTransformer extends BaseTransformer<TechnologyCard> {
  toObject() {
    return this.pick(this.resource, [
      'slug',
      'name',
      'category',
      'logoUrl',
      'docsUrl',
      'description',
      'usageLabel',
    ])
  }
}
