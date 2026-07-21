import type { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'
import Technology from '#models/technology'
import Media from '#models/media'
import { technologyValidator } from '#validators/portfolio'

async function saveTranslations(
  technology: Technology,
  descriptionFr?: string,
  descriptionEn?: string
) {
  await technology
    .related('translations')
    .updateOrCreate({ locale: 'fr' }, { locale: 'fr', description: descriptionFr ?? '' })

  if (descriptionEn) {
    await technology
      .related('translations')
      .updateOrCreate({ locale: 'en' }, { locale: 'en', description: descriptionEn })
  } else {
    await technology.related('translations').query().where('locale', 'en').delete()
  }
}

export default class TechnologiesController {
  async index({ inertia }: HttpContext) {
    const [technologies, media] = await Promise.all([
      Technology.query()
        .preload('translations')
        .preload('logo')
        .withCount('projects')
        .orderBy('name'),
      Media.query().orderBy('created_at', 'desc'),
    ])

    return inertia.render('admin/technologies', {
      technologies: technologies.map((technology) => ({
        id: technology.id,
        slug: technology.slug,
        name: technology.name,
        category: technology.category,
        logoMediaId: technology.logoMediaId,
        logoUrl: technology.logo
          ? router.makeUrl('uploads.show', { key: technology.logo.key, file: 'original.webp' })
          : null,
        descriptionFr: technology.translations.find((t) => t.locale === 'fr')?.description ?? '',
        descriptionEn: technology.translations.find((t) => t.locale === 'en')?.description ?? '',
        projectsCount: Number(technology.$extras.projects_count ?? 0),
      })),
      mediaOptions: media.map((item) => ({ id: item.id, alt: item.alt })),
    })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(technologyValidator)

    const existing = await Technology.findBy('slug', payload.slug)
    if (existing) {
      session.flash('errors', { slug: ['Ce slug est déjà utilisé'] })
      return response.redirect().back()
    }

    const technology = await Technology.create({
      slug: payload.slug,
      name: payload.name,
      category: payload.category,
      logoMediaId: payload.logoMediaId ?? null,
    })
    await saveTranslations(technology, payload.descriptionFr, payload.descriptionEn)

    session.flash('success', 'Technologie créée')
    response.redirect().toRoute('admin.technologies.index')
  }

  async update({ params, request, response, session }: HttpContext) {
    const technology = await Technology.findOrFail(params.id)
    const payload = await request.validateUsing(technologyValidator)

    const existing = await Technology.query()
      .where('slug', payload.slug)
      .whereNot('id', technology.id)
      .first()
    if (existing) {
      session.flash('errors', { slug: ['Ce slug est déjà utilisé'] })
      return response.redirect().back()
    }

    technology.merge({
      slug: payload.slug,
      name: payload.name,
      category: payload.category,
      logoMediaId: payload.logoMediaId ?? null,
    })
    await technology.save()
    await saveTranslations(technology, payload.descriptionFr, payload.descriptionEn)

    session.flash('success', 'Technologie mise à jour')
    response.redirect().toRoute('admin.technologies.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const technology = await Technology.findOrFail(params.id)
    await technology.delete()

    session.flash('success', 'Technologie supprimée')
    response.redirect().toRoute('admin.technologies.index')
  }
}
