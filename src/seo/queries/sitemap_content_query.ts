import { inject } from '@adonisjs/core'
import Article from '#blog/models/article'
import Project from '#portfolio/models/project'
import Talk from '#talks/models/talk'

export interface SitemapEntryContent {
  slug: string
  hasEnglish: boolean
  lastmod: string | undefined
}

export interface SitemapContent {
  articles: SitemapEntryContent[]
  projects: SitemapEntryContent[]
  talks: SitemapEntryContent[]
}

@inject()
export class SitemapContentQuery {
  async execute(): Promise<SitemapContent> {
    const [articles, projects, talks] = await Promise.all([
      Article.query()
        .withScopes((scopes) => scopes.published())
        .preload('translations', (query) => query.select('id', 'article_id', 'locale')),
      Project.query()
        .withScopes((scopes) => scopes.published())
        .preload('translations', (query) => query.select('id', 'project_id', 'locale')),
      Talk.query()
        .withScopes((scopes) => scopes.published())
        .preload('translations', (query) => query.select('id', 'talk_id', 'locale')),
    ])

    const entry = (item: {
      slug: string
      translations: { locale: string }[]
      updatedAt: { toISODate(): string | null } | null
      publishedAt: { toISODate(): string | null } | null
    }): SitemapEntryContent => ({
      slug: item.slug,
      hasEnglish: item.translations.some((translation) => translation.locale === 'en'),
      lastmod: item.updatedAt?.toISODate() ?? item.publishedAt?.toISODate() ?? undefined,
    })

    return {
      articles: articles.map(entry),
      projects: projects.map(entry),
      talks: talks.map(entry),
    }
  }
}
