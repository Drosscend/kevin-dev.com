import { inject } from '@adonisjs/core'
import vine from '@vinejs/vine'
import { relationId, slug } from '#app/shared/validators'
import { SaveTechnology } from '#technologies/actions/save_technology'
import { TECHNOLOGY_CATEGORIES } from '#types/content'
import type { EditedRow } from '#app/shared/validators'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class SaveTechnologyController {
  static readonly validator = vine.withMetaData<EditedRow>().create({
    slug: slug('technologies'),
    name: vine.string().trim().minLength(1).maxLength(100),
    category: vine.enum(TECHNOLOGY_CATEGORIES),
    logoMediaId: relationId('media').nullable().optional(),
    docsUrl: vine.string().trim().url().maxLength(2048).nullable().optional(),
    descriptionFr: vine.string().trim().maxLength(1000).optional(),
    descriptionEn: vine.string().trim().maxLength(1000).optional(),
  })

  constructor(private readonly saveTechnology: SaveTechnology) {}

  async execute({ params, request, response, session }: HttpContext) {
    const id = params.id ? Number(params.id) : undefined
    const payload = await request.validateUsing(SaveTechnologyController.validator, {
      meta: id ? { id } : {},
    })

    const result = await this.saveTechnology.execute({
      id,
      payload: {
        slug: payload.slug,
        name: payload.name,
        category: payload.category,
        logoMediaId: payload.logoMediaId ?? null,
        docsUrl: payload.docsUrl ?? null,
        descriptionFr: payload.descriptionFr ?? '',
        descriptionEn: payload.descriptionEn ?? null,
      },
    })

    if (!result.ok) {
      return response.notFound()
    }

    session.flash('success', id ? 'Technologie mise à jour' : 'Technologie créée')
    return response.redirect().toRoute('admin.technologies.index')
  }
}
