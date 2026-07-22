import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'
import { categoryValidator } from '#validators/blog'
import { upsertTranslations } from '#services/translations_service'

export default class CategoriesController {
  async index({ inertia }: HttpContext) {
    const categories = await Category.query()
      .preload('translations', (translations) =>
        translations.select('id', 'category_id', 'locale', 'name')
      )
      .withCount('articles')
      .orderBy('slug')

    return inertia.render('admin/categories', {
      categories: categories.map((category) => ({
        id: category.id,
        slug: category.slug,
        nameFr: category.translations.find((t) => t.locale === 'fr')?.name ?? '',
        nameEn: category.translations.find((t) => t.locale === 'en')?.name ?? '',
        articlesCount: Number(category.$extras.articles_count ?? 0),
      })),
    })
  }

  async store({ request, response, session }: HttpContext) {
    const { slug, nameFr, nameEn } = await request.validateUsing(categoryValidator, { meta: {} })

    const category = await Category.create({ slug })
    await upsertTranslations(category.related('translations'), {
      fr: { name: nameFr },
      en: nameEn ? { name: nameEn } : null,
    })

    session.flash('success', 'Catégorie créée')
    response.redirect().toRoute('admin.categories.index')
  }

  async update({ params, request, response, session }: HttpContext) {
    const category = await Category.findOrFail(params.id)
    const { slug, nameFr, nameEn } = await request.validateUsing(categoryValidator, {
      meta: { id: category.id },
    })

    category.slug = slug
    await category.save()
    await upsertTranslations(category.related('translations'), {
      fr: { name: nameFr },
      en: nameEn ? { name: nameEn } : null,
    })

    session.flash('success', 'Catégorie mise à jour')
    response.redirect().toRoute('admin.categories.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const category = await Category.findOrFail(params.id)
    await category.delete()

    session.flash('success', 'Catégorie supprimée')
    response.redirect().toRoute('admin.categories.index')
  }
}
