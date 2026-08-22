import { inject } from '@adonisjs/core'
import Article from '#blog/models/article'
import Settings from '#pages/repositories/settings_repository'
import Project from '#portfolio/models/project'
import Talk from '#talks/models/talk'
import Technology from '#technologies/models/technology'
import type { MediaSource } from '#media/media_source'
import type { Locale } from '#types/i18n'
import type { DateTime } from 'luxon'

/**
 * The stack section only shows the technologies carrying the most published
 * projects; the rest stays one click away on /technologies.
 */
const TECHNOLOGIES_SHOWN = 12
const SECTION_SIZE = 3

export interface HomeArticle {
  slug: string
  title: string
  summary: string
  publishedAt: DateTime | null
  cover: MediaSource | null
}

export interface HomeProject {
  slug: string
  title: string
  summary: string
  cover: MediaSource | null
  ongoing: boolean
  technologies: string[]
}

export interface HomeTalk {
  slug: string
  title: string
  summary: string
  eventName: string
  eventDate: DateTime
  city: string
  upcoming: boolean
  cover: MediaSource | null
}

export interface HomeOverview {
  now: string | null
  roles: string[]
  location: string | null
  articles: HomeArticle[]
  articlesTotal: number
  projects: HomeProject[]
  projectsTotal: number
  talks: HomeTalk[]
  talksTotal: number
  technologies: { slug: string; name: string }[]
  hiddenTechnologies: number
}

/**
 * Every listed section only shows its first few entries, so each carries a
 * total to hint at what the "see all" link leads to. The counts reuse the
 * exact filters of the matching listing (/projects, /blog, /talks) to stay
 * in sync with what the visitor lands on.
 */
@inject()
export class HomeOverviewQuery {
  async execute(locale: Locale): Promise<HomeOverview> {
    const [
      articles,
      articlesTotal,
      projects,
      projectsTotal,
      talks,
      talksTotal,
      technologies,
      technologiesTotal,
      settings,
    ] = await Promise.all([
      Article.query()
        .withScopes((scopes) => scopes.published())
        .whereHas('translations', (translations) => translations.where('locale', locale))
        .preload('translations', (translations) =>
          translations.select('id', 'article_id', 'locale', 'title', 'summary')
        )
        .preload('cover')
        .orderBy('published_at', 'desc')
        .limit(SECTION_SIZE),
      Article.query()
        .withScopes((scopes) => scopes.published())
        .whereHas('translations', (translations) => translations.where('locale', locale))
        .count('* as total')
        .firstOrFail()
        .then((row) => Number(row.$extras.total)),
      // Featured projects lead the section, then the most recently published
      // ones fill the remaining slots. "featured" prioritises rather than
      // restricts, so the grid never looks bare when only a few are pinned.
      Project.query()
        .withScopes((scopes) => scopes.published())
        .whereHas('translations', (translations) => translations.where('locale', locale))
        .preload('translations', (translations) =>
          translations.select('id', 'project_id', 'locale', 'title', 'summary')
        )
        .preload('cover')
        .preload('technologies', (query) => query.select('slug', 'name'))
        .orderBy('featured', 'desc')
        .orderBy('published_at', 'desc')
        .limit(SECTION_SIZE),
      Project.query()
        .withScopes((scopes) => scopes.published())
        .whereHas('translations', (translations) => translations.where('locale', locale))
        .count('* as total')
        .firstOrFail()
        .then((row) => Number(row.$extras.total)),
      Talk.query()
        .withScopes((scopes) => scopes.published())
        .whereHas('translations', (translations) => translations.where('locale', locale))
        .preload('translations', (translations) =>
          translations.select('id', 'talk_id', 'locale', 'title', 'summary')
        )
        .preload('cover')
        .orderBy('event_date', 'desc')
        .limit(SECTION_SIZE),
      Talk.query()
        .withScopes((scopes) => scopes.published())
        .whereHas('translations', (translations) => translations.where('locale', locale))
        .count('* as total')
        .firstOrFail()
        .then((row) => Number(row.$extras.total)),
      Technology.query()
        .select('slug', 'name')
        .withCount('projects', (query) => query.withScopes((scopes) => scopes.published()))
        .orderBy('projects_count', 'desc')
        .orderBy('name')
        .limit(TECHNOLOGIES_SHOWN),
      Technology.query()
        .count('* as total')
        .firstOrFail()
        .then((row) => Number(row.$extras.total)),
      Settings.getMany(['now_fr', 'now_en', 'hero_roles_fr', 'hero_roles_en', 'hero_location']),
    ])

    const localized = (fr: string, en: string) => (locale === 'en' ? en || fr : fr)

    return {
      now: localized(settings.now_fr, settings.now_en) || null,
      // The hero comes entirely from the settings: an empty value hides its line.
      roles: localized(settings.hero_roles_fr, settings.hero_roles_en)
        .split('\n')
        .map((role) => role.trim())
        .filter(Boolean),
      location: settings.hero_location || null,
      articles: articles.map((article) => ({
        slug: article.slug,
        title: article.translation(locale)!.title,
        summary: article.translation(locale)!.summary,
        publishedAt: article.publishedAt,
        cover: article.cover,
      })),
      articlesTotal,
      projects: projects.map((project) => ({
        slug: project.slug,
        title: project.translation(locale)!.title,
        summary: project.translation(locale)!.summary,
        cover: project.cover,
        ongoing: project.isOngoing,
        technologies: project.technologies.map((technology) => technology.name),
      })),
      projectsTotal,
      talks: talks.map((talk) => ({
        slug: talk.slug,
        title: talk.translation(locale)!.title,
        summary: talk.translation(locale)!.summary,
        eventName: talk.eventName,
        eventDate: talk.eventDate,
        city: talk.city,
        upcoming: talk.isUpcoming,
        cover: talk.cover,
      })),
      talksTotal,
      technologies: technologies.map((technology) => ({
        slug: technology.slug,
        name: technology.name,
      })),
      hiddenTechnologies: Math.max(0, technologiesTotal - technologies.length),
    }
  }
}
