import { inject } from '@adonisjs/core'
import Article from '#models/article'

export interface ArticleOption {
  id: number
  title: string
}

@inject()
export class ArticleOptionsQuery {
  async execute(): Promise<ArticleOption[]> {
    const articles = await Article.query()
      .select('id', 'slug')
      .preload('translations', (translations) =>
        translations.select('id', 'article_id', 'locale', 'title')
      )
      .orderBy('created_at', 'desc')

    return articles.map((article) => ({
      id: article.id,
      title: article.translation('fr')?.title ?? article.slug,
    }))
  }
}
