import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import {
  applyContentFields,
  renderTranslations,
  replaceLinks,
  type ContentPayload,
} from '#services/content_service'
import { upsertTranslations } from '#services/translations_service'
import type Project from '#models/project'
import type { ProjectLinkType } from '#types/content'

export interface ProjectPayload extends ContentPayload {
  startedAt: string | null
  endedAt: string | null
  featured: boolean
  technologyIds: number[]
  articleIds: number[]
  links: { label: string; url: string; type: ProjectLinkType }[]
}

/**
 * Persists a project with its translations, external links, and
 * technology/article associations inside a single DB transaction, so
 * a failure can never leave the project half-saved.
 */
export default class ProjectService {
  static async save(project: Project, payload: ProjectPayload) {
    const translations = await renderTranslations(payload)

    return db.transaction(async (trx) => {
      project.useTransaction(trx)

      applyContentFields(project, payload)
      project.startedAt = payload.startedAt ? DateTime.fromISO(payload.startedAt) : null
      project.endedAt = payload.endedAt ? DateTime.fromISO(payload.endedAt) : null
      project.featured = payload.featured
      await project.save()

      await upsertTranslations(project.related('translations'), translations)
      await replaceLinks(project.related('links'), payload.links)
      await project.related('technologies').sync(payload.technologyIds)
      await project.related('articles').sync(payload.articleIds)

      return project
    })
  }
}
