import { BaseTransformer } from '@adonisjs/core/transformers'
import type { TechnologyCategory } from '#types/content'

export interface TechnologyRow {
  id: number
  slug: string
  name: string
  category: TechnologyCategory
  logoMediaId: number | null
  logoUrl: string | null
  docsUrl: string | null
  descriptionFr: string
  descriptionEn: string
  projectsCount: number
}

export default class TechnologyRowTransformer extends BaseTransformer<TechnologyRow> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'slug',
      'name',
      'category',
      'logoMediaId',
      'logoUrl',
      'docsUrl',
      'descriptionFr',
      'descriptionEn',
      'projectsCount',
    ])
  }
}
