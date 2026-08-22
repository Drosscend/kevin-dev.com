import Category from '#blog/models/category'
import { upsertTranslations } from '#shared/content/translations'

export interface CategoryPayload {
  slug: string
  nameFr: string
  nameEn: string | null
}

export class CategoryRepository {
  async findById(id: number) {
    return Category.find(id)
  }

  async save(category: Category, payload: CategoryPayload) {
    category.slug = payload.slug
    await category.save()

    await upsertTranslations(category.related('translations'), {
      fr: { name: payload.nameFr },
      en: payload.nameEn ? { name: payload.nameEn } : null,
    })

    return category
  }

  async delete(category: Category) {
    await category.delete()
  }
}
