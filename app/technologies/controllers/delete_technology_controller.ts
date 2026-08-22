import { inject } from '@adonisjs/core'
import { DeleteTechnology } from '#technologies/actions/delete_technology'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class DeleteTechnologyController {
  constructor(private readonly deleteTechnology: DeleteTechnology) {}

  async execute({ params, response, session }: HttpContext) {
    const result = await this.deleteTechnology.execute(params.id)

    if (!result.ok) {
      return response.notFound()
    }

    session.flash('success', 'Technologie supprimée')
    return response.redirect().toRoute('admin.technologies.index')
  }
}
