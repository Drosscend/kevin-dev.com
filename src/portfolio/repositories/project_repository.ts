import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import Project from '#portfolio/models/project'
import {
  applyContentFields,
  renderTranslations,
  replaceLinks,
  type ContentPayload,
} from '#shared/content/content_fields'
import { upsertTranslations } from '#shared/content/translations'
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
export class ProjectRepository {
  async findById(id: number) {
    return Project.find(id)
  }

  async delete(project: Project) {
    await project.delete()
  }

  async save(project: Project, payload: ProjectPayload) {
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
