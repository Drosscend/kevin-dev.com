import { inject } from '@adonisjs/core'
import Project from '#portfolio/models/project'
import type { MediaSource } from '#media/media_source'
import type { ProjectTechnologyItem } from '#portfolio/queries/project_list_query'
import type { ProjectLinkType } from '#types/content'
import type { Locale } from '#types/i18n'
import type { DateTime } from 'luxon'

export interface ProjectDetail {
  slug: string
  status: string
  isPublished: boolean
  title: string
  summary: string
  contentHtml: string
  cover: MediaSource | null
  startedAt: DateTime | null
  endedAt: DateTime | null
  readingTime: number
  ongoing: boolean
  hasOtherLocale: boolean
  hasEnglish: boolean
  links: { label: string; url: string; type: ProjectLinkType }[]
  technologies: ProjectTechnologyItem[]
  articles: { slug: string; title: string }[]
}

@inject()
export class ProjectDetailQuery {
  async execute(slug: string, locale: Locale): Promise<ProjectDetail | null> {
    const project = await Project.query()
      .where('slug', slug)
      .preload('translations', (translations) =>
        translations.select('id', 'project_id', 'locale', 'title', 'summary', 'content_html')
      )
      .preload('cover')
      .preload('links', (links) => links.orderBy('position'))
      .preload('technologies')
      .preload('articles', (articles) => {
        articles
          .withScopes((scopes) => scopes.published())
          .preload('translations', (translations) =>
            translations.select('id', 'article_id', 'locale', 'title')
          )
      })
      .first()

    if (!project) {
      return null
    }

    const translation = project.translation(locale)

    if (!translation) {
      return null
    }

    return {
      slug: project.slug,
      status: project.status,
      isPublished: project.isPublished,
      title: translation.title,
      summary: translation.summary,
      contentHtml: translation.contentHtml,
      cover: project.cover,
      startedAt: project.startedAt,
      endedAt: project.endedAt,
      readingTime: project.readingTime,
      ongoing: project.isOngoing,
      hasOtherLocale: project.translation(locale === 'fr' ? 'en' : 'fr') !== undefined,
      hasEnglish: project.translation('en') !== undefined,
      links: project.links.map((link) => ({ label: link.label, url: link.url, type: link.type })),
      technologies: project.technologies.map((technology) => ({
        slug: technology.slug,
        name: technology.name,
      })),
      articles: project.articles
        .filter((article) => article.translation(locale) !== undefined)
        .map((article) => ({ slug: article.slug, title: article.translation(locale)!.title })),
    }
  }
}
