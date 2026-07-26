import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { DateTime } from 'luxon'
import { BaseCommand, args, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import Project from '#models/project'
import Technology from '#models/technology'
import ProjectService from '#services/project_service'
import { PROJECT_LINK_TYPES, type ProjectLinkType } from '#models/project_link'

interface Entry {
  slug: string
  startedAt: string | null
  endedAt: string | null
  featured: boolean
  technologies: string[]
  links: { label: string; url: string; type: string }[]
  fr: { title: string; summary: string; contentMarkdown: string }
  en: { title: string; summary: string; contentMarkdown: string }
}

/**
 * Imports projects from a JSON file, for inventories prepared outside
 * the app. Everything goes through ProjectService, so translations,
 * links and technology links are written exactly like a back office
 * save, Markdown rendering included.
 *
 * Technologies are matched by slug and the ones missing from the
 * library are skipped and reported, rather than failing the import.
 * Existing slugs are left untouched unless --update is passed.
 *
 * With --publish, entries go live in file order: the publication date
 * is staggered by one minute so the listing, which sorts on that date,
 * keeps the order of the inventory.
 */
export default class ProjectsImport extends BaseCommand {
  static commandName = 'projects:import'
  static description = 'Import projects, translations and links from a JSON file'

  static options: CommandOptions = { startApp: true }

  @args.string({ description: 'Path to the JSON file holding the entries' })
  declare file: string

  @flags.boolean({ description: 'Publish the imported projects instead of leaving them drafts' })
  declare publish: boolean

  @flags.boolean({ description: 'Overwrite projects whose slug is already known' })
  declare update: boolean

  async run() {
    const entries: Entry[] = JSON.parse(await readFile(resolve(this.file), 'utf8'))

    const invalid = entries.filter(
      (entry) =>
        !entry.slug ||
        !entry.fr?.title ||
        !entry.fr?.contentMarkdown ||
        entry.links.some((link) => !PROJECT_LINK_TYPES.includes(link.type as ProjectLinkType))
    )
    if (invalid.length > 0) {
      this.exitCode = 1
      for (const entry of invalid) {
        this.logger.error(`${entry.slug ?? '(no slug)'} · missing title or unknown link type`)
      }
      return
    }

    const technologies = await Technology.query().select('id', 'slug')
    const idBySlug = new Map(technologies.map((technology) => [technology.slug, technology.id]))

    const now = DateTime.now()
    let created = 0
    let updated = 0
    let skipped = 0
    const unknownTechnologies = new Set<string>()

    for (const [index, entry] of entries.entries()) {
      const known = await Project.findBy('slug', entry.slug)
      if (known && !this.update) {
        skipped += 1
        this.logger.info(`${entry.slug} · already there`)
        continue
      }

      const technologyIds: number[] = []
      for (const slug of entry.technologies) {
        const id = idBySlug.get(slug)
        if (id === undefined) {
          unknownTechnologies.add(slug)
          continue
        }
        technologyIds.push(id)
      }

      await ProjectService.save(known ?? new Project(), {
        slug: entry.slug,
        status: this.publish ? 'published' : 'draft',
        coverMediaId: known?.coverMediaId ?? null,
        startedAt: entry.startedAt,
        endedAt: entry.endedAt,
        featured: entry.featured,
        technologyIds,
        articleIds: [],
        links: entry.links.map((link) => ({ ...link, type: link.type as ProjectLinkType })),
        publishedAt: this.publish
          ? now.minus({ minutes: index }).toISO({ includeOffset: false })
          : null,
        fr: entry.fr,
        en: entry.en?.title ? entry.en : null,
      })

      if (known) {
        updated += 1
        this.logger.success(`${entry.slug} · updated (${technologyIds.length} techno)`)
      } else {
        created += 1
        this.logger.success(`${entry.slug} · created (${technologyIds.length} techno)`)
      }
    }

    if (unknownTechnologies.size > 0) {
      this.logger.warning(
        `Unknown technologies, not linked: ${[...unknownTechnologies].join(', ')}`
      )
    }
    this.logger.info(
      `${created} created, ${updated} updated, ${skipped} skipped, out of ${entries.length} entries`
    )
  }
}
