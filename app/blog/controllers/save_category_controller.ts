import { inject } from '@adonisjs/core'
import vine from '@vinejs/vine'
import { slug } from '#app/shared/validators'
import { SaveCategory } from '#blog/actions/save_category'
import type { EditedRow } from '#app/shared/validators'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class SaveCategoryController {
  static readonly validator = vine.withMetaData<EditedRow>().create({
    slug: slug('categories'),
    nameFr: vine.string().trim().minLength(1).maxLength(255),
    nameEn: vine.string().trim().maxLength(255).optional(),
  })

  constructor(private readonly saveCategory: SaveCategory) {}

  async execute({ params, request, response, session }: HttpContext) {
    const id = params.id ? Number(params.id) : undefined
    const payload = await request.validateUsing(SaveCategoryController.validator, {
      meta: id ? { id } : {},
    })

    const result = await this.saveCategory.execute({
      id,
      payload: {
        slug: payload.slug,
        nameFr: payload.nameFr,
        nameEn: payload.nameEn ?? null,
      },
    })

    if (!result.ok) {
      return response.notFound()
    }

    session.flash('success', id ? 'Catégorie mise à jour' : 'Catégorie créée')
    return response.redirect().toRoute('admin.categories.index')
  }
}
