import { inject } from '@adonisjs/core'
import vine from '@vinejs/vine'
import ProjectFormTransformer from '#app/portfolio/transformers/project_form_transformer'
import { pickerDateTime } from '#app/shared/date_format'
import { variantUrl } from '#app/shared/media_url'
import { publishedAt, relationId, slug, status, translation } from '#app/shared/validators'
import { ArticleOptionsQuery } from '#blog/queries/article_options_query'
import { MediaPickerQuery } from '#media/queries/media_picker_query'
import { SaveProject } from '#portfolio/actions/save_project'
import { ProjectFormQuery } from '#portfolio/queries/project_form_query'
import { TechnologyOptionsQuery } from '#technologies/queries/technology_options_query'
import { PROJECT_LINK_TYPES } from '#types/content'
import type { EditedRow } from '#app/shared/validators'
import type { HttpContext } from '@adonisjs/core/http'

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

@inject()
export default class ProjectFormController {
  static readonly validator = vine.withMetaData<EditedRow>().create({
    slug: slug('projects'),
    status: status(),
    coverMediaId: relationId('media').nullable().optional(),
    startedAt: vine.string().trim().regex(DATE_PATTERN).nullable().optional(),
    endedAt: vine.string().trim().regex(DATE_PATTERN).nullable().optional(),
    featured: vine.boolean().optional(),
    technologyIds: vine.array(relationId('technologies')).optional(),
    articleIds: vine.array(relationId('articles')).optional(),
    links: vine
      .array(
        vine.object({
          label: vine.string().trim().minLength(1).maxLength(100),
          url: vine.string().trim().url().maxLength(2048),
          type: vine.enum(PROJECT_LINK_TYPES),
        })
      )
      .optional(),
    publishedAt: publishedAt(),
    fr: translation(),
    en: translation().optional(),
  })

  constructor(
    private readonly projectForm: ProjectFormQuery,
    private readonly saveProject: SaveProject,
    private readonly mediaPicker: MediaPickerQuery,
    private readonly technologyOptions: TechnologyOptionsQuery,
    private readonly articleOptions: ArticleOptionsQuery
  ) {}

  async render({ params, inertia, response }: HttpContext) {
    const project = params.id ? await this.projectForm.execute(params.id) : null

    if (params.id && !project) {
      return response.notFound()
    }

    return inertia.render('admin/projects/form', {
      project:
        project &&
        ProjectFormTransformer.transform({
          ...project,
          startedAt: project.startedAt?.toISODate() ?? null,
          endedAt: project.endedAt?.toISODate() ?? null,
          publishedAt: pickerDateTime(project.publishedAt),
        }),
      options: await this.formOptions(),
    })
  }

  async execute({ params, request, response, session }: HttpContext) {
    const current = params.id ? await this.projectForm.execute(params.id) : null

    if (params.id && !current) {
      return response.notFound()
    }

    const payload = await request.validateUsing(ProjectFormController.validator, {
      meta: current
        ? { id: current.id, currentSlug: current.slug, wasOnline: current.hasBeenOnline }
        : {},
    })

    const result = await this.saveProject.execute({
      id: current?.id,
      payload: {
        slug: payload.slug,
        status: payload.status,
        coverMediaId: payload.coverMediaId ?? null,
        startedAt: payload.startedAt ?? null,
        endedAt: payload.endedAt ?? null,
        featured: payload.featured ?? false,
        technologyIds: payload.technologyIds ?? [],
        articleIds: payload.articleIds ?? [],
        links: payload.links ?? [],
        publishedAt: payload.publishedAt ?? null,
        fr: { summary: '', ...payload.fr },
        en: payload.en ? { summary: '', ...payload.en } : null,
      },
    })

    if (!result.ok) {
      return response.notFound()
    }

    session.flash('success', 'Projet enregistré')
    return response.redirect().toRoute('admin.projects.edit', { id: result.value.id })
  }

  private async formOptions() {
    const [technologies, articles, media] = await Promise.all([
      this.technologyOptions.execute(),
      this.articleOptions.execute(),
      this.mediaPicker.execute(),
    ])

    return {
      technologies,
      articles,
      media: media.map((item) => ({
        id: item.id,
        alt: item.alt,
        originalName: item.originalName,
        thumbnailUrl: variantUrl(item, 320),
      })),
    }
  }
}
