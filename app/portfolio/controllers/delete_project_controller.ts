import { inject } from '@adonisjs/core'
import { DeleteProject } from '#portfolio/actions/delete_project'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class DeleteProjectController {
  constructor(private readonly deleteProject: DeleteProject) {}

  async execute({ params, response, session }: HttpContext) {
    const result = await this.deleteProject.execute(params.id)

    if (!result.ok) {
      return response.notFound()
    }

    session.flash('success', 'Projet supprimé')
    return response.redirect().toRoute('admin.projects.index')
  }
}
