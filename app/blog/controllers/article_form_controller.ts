import { inject } from '@adonisjs/core'
import vine from '@vinejs/vine'
import { variantUrl } from '#app/shared/media_url'
import { publishedAt, relationId, slug, status, translation } from '#app/shared/validators'
import { SaveArticle } from '#blog/actions/save_article'
import { ArticleFormQuery } from '#blog/queries/article_form_query'
import { CategoryOptionsQuery } from '#blog/queries/category_options_query'
import { MediaPickerQuery } from '#media/queries/media_picker_query'
import { pickerDateTime } from '#services/date_format'
import { TechnologyOptionsQuery } from '#technologies/queries/technology_options_query'
import type { EditedRow } from '#app/shared/validators'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ArticleFormController {
  static readonly validator = vine.withMetaData<EditedRow>().create({
    slug: slug('articles'),
    status: status(),
    categoryId: relationId('categories').nullable().optional(),
    coverMediaId: relationId('media').nullable().optional(),
    technologyIds: vine.array(relationId('technologies')).optional(),
    publishedAt: publishedAt(),
    fr: translation(),
    en: translation().optional(),
  })

  constructor(
    private readonly articleForm: ArticleFormQuery,
    private readonly saveArticle: SaveArticle,
    private readonly categoryOptions: CategoryOptionsQuery,
    private readonly technologyOptions: TechnologyOptionsQuery,
    private readonly mediaPicker: MediaPickerQuery
  ) {}

  async render({ params, inertia, response }: HttpContext) {
    const article = params.id ? await this.articleForm.execute(params.id) : null

    if (params.id && !article) {
      return response.notFound()
    }

    return inertia.render('admin/articles/form', {
      article: article && {
        ...article,
        publishedAt: pickerDateTime(article.publishedAt),
      },
      options: await this.formOptions(),
    })
  }

  async execute({ params, request, response, session }: HttpContext) {
    const current = params.id ? await this.articleForm.execute(params.id) : null

    if (params.id && !current) {
      return response.notFound()
    }

    const payload = await request.validateUsing(ArticleFormController.validator, {
      meta: current
        ? { id: current.id, currentSlug: current.slug, wasOnline: current.hasBeenOnline }
        : {},
    })

    const result = await this.saveArticle.execute({
      id: current?.id,
      payload: {
        slug: payload.slug,
        status: payload.status,
        categoryId: payload.categoryId ?? null,
        coverMediaId: payload.coverMediaId ?? null,
        technologyIds: payload.technologyIds ?? [],
        publishedAt: payload.publishedAt ?? null,
        fr: { summary: '', ...payload.fr },
        en: payload.en ? { summary: '', ...payload.en } : null,
      },
    })

    if (!result.ok) {
      return response.notFound()
    }

    session.flash('success', 'Article enregistré')
    return response.redirect().toRoute('admin.articles.edit', { id: result.value.id })
  }

  private async formOptions() {
    const [categories, technologies, media] = await Promise.all([
      this.categoryOptions.execute(),
      this.technologyOptions.execute(),
      this.mediaPicker.execute(),
    ])

    return {
      categories,
      technologies,
      media: media.map((item) => ({
        id: item.id,
        alt: item.alt,
        originalName: item.originalName,
        thumbnailUrl: variantUrl(item, 320),
      })),
    }
  }
}
