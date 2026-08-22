import { inject } from '@adonisjs/core'
import { DeleteArticle } from '#blog/actions/delete_article'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class DeleteArticleController {
  constructor(private readonly deleteArticle: DeleteArticle) {}

  async execute({ params, response, session }: HttpContext) {
    const result = await this.deleteArticle.execute(params.id)

    if (!result.ok) {
      return response.notFound()
    }

    session.flash('success', 'Article supprimé')
    return response.redirect().toRoute('admin.articles.index')
  }
}
