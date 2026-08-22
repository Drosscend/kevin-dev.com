import { inject } from '@adonisjs/core'
import { ArticleRepository } from '#blog/repositories/article_repository'
import { err, ok, type Result } from '#core/result'
import type { ArticleNotFoundError } from '#blog/actions/save_article'

export type DeleteArticleResult = Result<null, ArticleNotFoundError>

@inject()
export class DeleteArticle {
  constructor(private readonly articles: ArticleRepository) {}

  async execute(id: number): Promise<DeleteArticleResult> {
    const article = await this.articles.findById(id)

    if (!article) {
      return err({ type: 'article_not_found' })
    }

    await this.articles.delete(article)

    return ok(null)
  }
}
