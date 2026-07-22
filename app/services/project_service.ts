import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import type Project from '#models/project'
import type { ProjectStatus } from '#models/project'
import type { ProjectLinkType } from '#models/project_link'
import MarkdownService from '#services/markdown_service'

export interface ProjectTranslationPayload {
  title: string
  summary: string
  contentMarkdown: string
}

export interface ProjectLinkPayload {
  label: string
  url: string
  type: ProjectLinkType
}

export interface ProjectPayload {
  slug: string
  status: ProjectStatus
  coverMediaId: number | null
  startedAt: string | null
  endedAt: string | null
  featured: boolean
  technologyIds: number[]
  articleIds: number[]
  links: ProjectLinkPayload[]
  fr: ProjectTranslationPayload
  en: ProjectTranslationPayload | null
}

/**
 * Persists a project with its translations, external links, and
 * technology/article associations inside a single DB transaction,
 * so a failure can never leave the project half-saved (the links
 * are replaced wholesale). Markdown is rendered before the
 * transaction starts and publishedAt is set on the first
 * publication only.
 */
export default class ProjectService {
  static async save(project: Project, payload: ProjectPayload) {
    const frHtml = await MarkdownService.render(payload.fr.contentMarkdown)
    const enHtml = payload.en ? await MarkdownService.render(payload.en.contentMarkdown) : null

    return db.transaction(async (trx) => {
      project.useTransaction(trx)

      project.slug = payload.slug
      project.coverMediaId = payload.coverMediaId
      project.startedAt = payload.startedAt ? DateTime.fromISO(payload.startedAt) : null
      project.endedAt = payload.endedAt ? DateTime.fromISO(payload.endedAt) : null
      project.featured = payload.featured

      if (payload.status === 'published' && !project.publishedAt) {
        project.publishedAt = DateTime.now()
      }
      project.status = payload.status
      await project.save()

      await project.related('translations').updateOrCreate(
        { locale: 'fr' },
        {
          locale: 'fr',
          title: payload.fr.title,
          summary: payload.fr.summary,
          contentMarkdown: payload.fr.contentMarkdown,
          contentHtml: frHtml,
        }
      )

      if (payload.en) {
        await project.related('translations').updateOrCreate(
          { locale: 'en' },
          {
            locale: 'en',
            title: payload.en.title,
            summary: payload.en.summary,
            contentMarkdown: payload.en.contentMarkdown,
            contentHtml: enHtml!,
          }
        )
      } else {
        await project.related('translations').query().where('locale', 'en').delete()
      }

      await project.related('links').query().delete()
      if (payload.links.length > 0) {
        await project
          .related('links')
          .createMany(payload.links.map((link, index) => ({ ...link, position: index })))
      }

      await project.related('technologies').sync(payload.technologyIds)
      await project.related('articles').sync(payload.articleIds)

      return project
    })
  }
}
