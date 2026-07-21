import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'
import { categoryValidator } from '#validators/blog'

async function saveTranslations(category: Category, nameFr: string, nameEn?: string) {
  await category
    .related('translations')
    .updateOrCreate({ locale: 'fr' }, { locale: 'fr', name: nameFr })

  if (nameEn) {
    await category
      .related('translations')
      .updateOrCreate({ locale: 'en' }, { locale: 'en', name: nameEn })
  } else {
    await category.related('translations').query().where('locale', 'en').delete()
  }
}

export default class CategoriesController {
  async index({ inertia }: HttpContext) {
    const categories = await Category.query()
      .preload('translations')
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
    const { slug, nameFr, nameEn } = await request.validateUsing(categoryValidator)

    const existing = await Category.findBy('slug', slug)
    if (existing) {
      session.flash('errors', { slug: ['Ce slug est déjà utilisé'] })
      return response.redirect().back()
    }

    const category = await Category.create({ slug })
    await saveTranslations(category, nameFr, nameEn)

    session.flash('success', 'Catégorie créée')
    response.redirect().toRoute('admin.categories.index')
  }

  async update({ params, request, response, session }: HttpContext) {
    const category = await Category.findOrFail(params.id)
    const { slug, nameFr, nameEn } = await request.validateUsing(categoryValidator)

    const existing = await Category.query().where('slug', slug).whereNot('id', category.id).first()
    if (existing) {
      session.flash('errors', { slug: ['Ce slug est déjà utilisé'] })
      return response.redirect().back()
    }

    category.slug = slug
    await category.save()
    await saveTranslations(category, nameFr, nameEn)

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
