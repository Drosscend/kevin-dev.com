import type { HttpContext } from '@adonisjs/core/http'
import Tag from '#models/tag'
import { tagValidator } from '#validators/blog'
import { upsertTranslations } from '#services/translations_service'

export default class TagsController {
  async index({ inertia }: HttpContext) {
    const tags = await Tag.query()
      .preload('translations', (translations) =>
        translations.select('id', 'tag_id', 'locale', 'name')
      )
      .withCount('articles')
      .orderBy('slug')

    return inertia.render('admin/tags', {
      tags: tags.map((tag) => ({
        id: tag.id,
        slug: tag.slug,
        nameFr: tag.translations.find((t) => t.locale === 'fr')?.name ?? '',
        nameEn: tag.translations.find((t) => t.locale === 'en')?.name ?? '',
        articlesCount: Number(tag.$extras.articles_count ?? 0),
      })),
    })
  }

  async store({ request, response, session }: HttpContext) {
    const { slug, nameFr, nameEn } = await request.validateUsing(tagValidator, { meta: {} })

    const tag = await Tag.create({ slug })
    await upsertTranslations(tag.related('translations'), {
      fr: { name: nameFr },
      en: nameEn ? { name: nameEn } : null,
    })

    session.flash('success', 'Tag créé')
    response.redirect().toRoute('admin.tags.index')
  }

  async update({ params, request, response, session }: HttpContext) {
    const tag = await Tag.findOrFail(params.id)
    const { slug, nameFr, nameEn } = await request.validateUsing(tagValidator, {
      meta: { id: tag.id },
    })

    tag.slug = slug
    await tag.save()
    await upsertTranslations(tag.related('translations'), {
      fr: { name: nameFr },
      en: nameEn ? { name: nameEn } : null,
    })

    session.flash('success', 'Tag mis à jour')
    response.redirect().toRoute('admin.tags.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const tag = await Tag.findOrFail(params.id)
    await tag.delete()

    session.flash('success', 'Tag supprimé')
    response.redirect().toRoute('admin.tags.index')
  }
}
