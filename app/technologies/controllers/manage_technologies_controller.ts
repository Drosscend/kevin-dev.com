import { inject } from '@adonisjs/core'
import { originalUrl } from '#app/shared/media_url'
import { MediaPickerQuery } from '#media/queries/media_picker_query'
import { TechnologyAdminListQuery } from '#technologies/queries/technology_admin_list_query'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ManageTechnologiesController {
  constructor(
    private readonly technologyAdminList: TechnologyAdminListQuery,
    private readonly mediaPicker: MediaPickerQuery
  ) {}

  async render({ inertia }: HttpContext) {
    const [technologies, media] = await Promise.all([
      this.technologyAdminList.execute(),
      this.mediaPicker.execute(),
    ])

    return inertia.render('admin/technologies', {
      technologies: technologies.map((technology) => ({
        id: technology.id,
        slug: technology.slug,
        name: technology.name,
        category: technology.category,
        logoMediaId: technology.logoMediaId,
        logoUrl: technology.logo ? originalUrl(technology.logo) : null,
        docsUrl: technology.docsUrl,
        descriptionFr: technology.descriptionFr,
        descriptionEn: technology.descriptionEn,
        projectsCount: technology.projectsCount,
      })),
      mediaOptions: media.map((item) => ({ id: item.id, alt: item.alt })),
    })
  }
}
