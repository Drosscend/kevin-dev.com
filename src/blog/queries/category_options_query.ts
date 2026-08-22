import { inject } from '@adonisjs/core'
import Category from '#blog/models/category'

export interface CategoryOption {
  id: number
  name: string
}

@inject()
export class CategoryOptionsQuery {
  async execute(): Promise<CategoryOption[]> {
    const categories = await Category.query()
      .select('id', 'slug')
      .preload('translations', (translations) =>
        translations.select('id', 'category_id', 'locale', 'name')
      )
      .orderBy('slug')

    return categories.map((category) => ({ id: category.id, name: category.name('fr') }))
  }
}
