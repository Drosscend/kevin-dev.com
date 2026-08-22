import { inject } from '@adonisjs/core'
import Category from '#blog/models/category'

export interface CategoryAdminListItem {
  id: number
  slug: string
  nameFr: string
  nameEn: string
  articlesCount: number
}

@inject()
export class CategoryAdminListQuery {
  async execute(): Promise<CategoryAdminListItem[]> {
    const categories = await Category.query()
      .preload('translations', (translations) =>
        translations.select('id', 'category_id', 'locale', 'name')
      )
      .withCount('articles')
      .orderBy('slug')

    return categories.map((category) => ({
      id: category.id,
      slug: category.slug,
      nameFr: category.translations.find((item) => item.locale === 'fr')?.name ?? '',
      nameEn: category.translations.find((item) => item.locale === 'en')?.name ?? '',
      articlesCount: Number(category.$extras.articles_count ?? 0),
    }))
  }
}
