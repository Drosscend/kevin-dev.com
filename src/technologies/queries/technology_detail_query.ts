import { inject } from '@adonisjs/core'
import Technology from '#technologies/models/technology'
import type { MediaSource } from '#media/media_source'
import type { ContentCard } from '#shared/content/content_card'
import type { Locale } from '#types/i18n'

export interface TechnologyDetail {
  slug: string
  name: string
  logo: MediaSource | null
  docsUrl: string | null
  description: string
  projects: ContentCard[]
  articles: ContentCard[]
  talks: ContentCard[]
}

@inject()
export class TechnologyDetailQuery {
  async execute(slug: string, locale: Locale): Promise<TechnologyDetail | null> {
    const technology = await Technology.query()
      .where('slug', slug)
      .preload('translations', (translations) =>
        translations.select('id', 'technology_id', 'locale', 'description')
      )
      .preload('logo')
      .preload('projects', (projects) => {
        projects
          .withScopes((scopes) => scopes.published())
          .whereHas('translations', (translations) => translations.where('locale', locale))
          .preload('translations', (translations) =>
            translations.select('id', 'project_id', 'locale', 'title', 'summary')
          )
          .preload('cover')
          .orderBy('published_at', 'desc')
      })
      .preload('articles', (articles) => {
        articles
          .withScopes((scopes) => scopes.published())
          .whereHas('translations', (translations) => translations.where('locale', locale))
          .preload('translations', (translations) =>
            translations.select('id', 'article_id', 'locale', 'title', 'summary')
          )
          .preload('cover')
          .orderBy('published_at', 'desc')
      })
      .preload('talks', (talks) => {
        talks
          .withScopes((scopes) => scopes.published())
          .whereHas('translations', (translations) => translations.where('locale', locale))
          .preload('translations', (translations) =>
            translations.select('id', 'talk_id', 'locale', 'title', 'summary')
          )
          .preload('cover')
          .orderBy('event_date', 'desc')
      })
      .first()

    if (!technology) {
      return null
    }

    const card = (entry: {
      slug: string
      cover: MediaSource | null
      translation: (locale: Locale) => { title: string; summary: string } | undefined
    }): ContentCard => ({
      slug: entry.slug,
      title: entry.translation(locale)!.title,
      summary: entry.translation(locale)!.summary,
      cover: entry.cover,
    })

    return {
      slug: technology.slug,
      name: technology.name,
      logo: technology.logo,
      docsUrl: technology.docsUrl,
      description: technology.description(locale),
      projects: technology.projects.map(card),
      articles: technology.articles.map(card),
      talks: technology.talks.map(card),
    }
  }
}
