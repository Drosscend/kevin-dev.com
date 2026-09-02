import { BaseTransformer } from '@adonisjs/core/transformers'
import type { Picture } from '#types/content'
import type { TechnologyCategory } from '#types/content'

export interface TechnologyCard {
  slug: string
  name: string
  category: TechnologyCategory
  logo: Picture | null
  usageLabel: string | null
}

export default class TechnologyCardTransformer extends BaseTransformer<TechnologyCard> {
  toObject() {
    return this.pick(this.resource, ['slug', 'name', 'category', 'logo', 'usageLabel'])
  }
}
