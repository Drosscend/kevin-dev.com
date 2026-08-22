import { inject } from '@adonisjs/core'
import { longDate } from '#app/shared/date_format'
import { ProjectAdminListQuery } from '#portfolio/queries/project_admin_list_query'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ManageProjectsController {
  constructor(private readonly projectAdminList: ProjectAdminListQuery) {}

  async render({ inertia }: HttpContext) {
    const projects = await this.projectAdminList.execute()

    return inertia.render('admin/projects/index', {
      projects: projects.map((project) => ({
        id: project.id,
        slug: project.slug,
        title: project.title,
        hasEnglish: project.hasEnglish,
        status: project.status,
        featured: project.featured,
        publishedAt: longDate(project.publishedAt),
        scheduled: project.scheduled,
        technologiesCount: project.technologiesCount,
      })),
    })
  }
}
