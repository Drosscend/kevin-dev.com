import { inject } from '@adonisjs/core'
import { DeleteCategory } from '#blog/actions/delete_category'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class DeleteCategoryController {
  constructor(private readonly deleteCategory: DeleteCategory) {}

  async execute({ params, response, session }: HttpContext) {
    const result = await this.deleteCategory.execute(params.id)

    if (!result.ok) {
      return response.notFound()
    }

    session.flash('success', 'Catégorie supprimée')
    return response.redirect().toRoute('admin.categories.index')
  }
}
