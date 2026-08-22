import { inject } from '@adonisjs/core'
import { ArticleAdminListQuery } from '#blog/queries/article_admin_list_query'
import { longDate } from '#services/date_format'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ManageArticlesController {
  constructor(private readonly articleAdminList: ArticleAdminListQuery) {}

  async render({ inertia }: HttpContext) {
    const articles = await this.articleAdminList.execute()

    return inertia.render('admin/articles/index', {
      articles: articles.map((article) => ({
        id: article.id,
        slug: article.slug,
        title: article.title,
        hasEnglish: article.hasEnglish,
        status: article.status,
        publishedAt: longDate(article.publishedAt),
        scheduled: article.scheduled,
        category: article.category,
      })),
    })
  }
}
