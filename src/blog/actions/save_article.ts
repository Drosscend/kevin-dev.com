import { inject } from '@adonisjs/core'
import Article from '#blog/models/article'
import { ArticleRepository } from '#blog/repositories/article_repository'
import { err, ok, type Result } from '#core/result'
import type { ArticlePayload } from '#blog/repositories/article_repository'

export interface SaveArticleParams {
  id?: number
  payload: ArticlePayload
}

export interface ArticleNotFoundError {
  type: 'article_not_found'
}

export type SaveArticleResult = Result<Article, ArticleNotFoundError>

@inject()
export class SaveArticle {
  constructor(private readonly articles: ArticleRepository) {}

  async execute(params: SaveArticleParams): Promise<SaveArticleResult> {
    if (params.id === undefined) {
      return ok(await this.articles.save(new Article(), params.payload))
    }

    const article = await this.articles.findById(params.id)

    if (!article) {
      return err({ type: 'article_not_found' })
    }

    return ok(await this.articles.save(article, params.payload))
  }
}
