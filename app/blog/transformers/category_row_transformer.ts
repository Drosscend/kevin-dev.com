import { BaseTransformer } from '@adonisjs/core/transformers'

export interface CategoryRow {
  id: number
  slug: string
  nameFr: string
  nameEn: string
  articlesCount: number
}

export default class CategoryRowTransformer extends BaseTransformer<CategoryRow> {
  toObject() {
    return this.pick(this.resource, ['id', 'slug', 'nameFr', 'nameEn', 'articlesCount'])
  }
}
