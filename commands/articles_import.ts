import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { DateTime } from 'luxon'
import { BaseCommand, args, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import Article from '#models/article'
import Category from '#models/category'
import Technology from '#models/technology'
import ArticleService from '#services/article_service'

interface Entry {
  slug: string
  category: string | null
  technologies: string[]
  fr: { title: string; summary: string; contentMarkdown: string }
  en: { title: string; summary: string; contentMarkdown: string }
}

/**
 * Imports articles from a JSON file, for posts written outside the app.
 * Everything goes through ArticleService, so translations and
 * technology links are written exactly like a back office save, Markdown
 * rendering and reading time included.
 *
 * Category and technologies are matched by slug and the ones missing
 * from the library are skipped and reported, rather than failing the
 * import. Existing slugs are left untouched unless --update is passed.
 *
 * With --publish, entries go live in file order: the publication date
 * is staggered by one minute so the listing, which sorts on that date,
 * keeps the order of the file.
 */
export default class ArticlesImport extends BaseCommand {
  static commandName = 'articles:import'
  static description = 'Import articles and their translations from a JSON file'

  static options: CommandOptions = { startApp: true }

  @args.string({ description: 'Path to the JSON file holding the entries' })
  declare file: string

  @flags.boolean({ description: 'Publish the imported articles instead of leaving them drafts' })
  declare publish: boolean

  @flags.boolean({ description: 'Overwrite articles whose slug is already known' })
  declare update: boolean

  async run() {
    const entries: Entry[] = JSON.parse(await readFile(resolve(this.file), 'utf8'))

    const invalid = entries.filter(
      (entry) => !entry.slug || !entry.fr?.title || !entry.fr?.contentMarkdown
    )
    if (invalid.length > 0) {
      this.exitCode = 1
      for (const entry of invalid) {
        this.logger.error(`${entry.slug ?? '(no slug)'} · missing slug, title or content`)
      }
      return
    }

    const technologies = await Technology.query().select('id', 'slug')
    const technologyIdBySlug = new Map(
      technologies.map((technology) => [technology.slug, technology.id])
    )
    const categories = await Category.query().select('id', 'slug')
    const categoryIdBySlug = new Map(categories.map((category) => [category.slug, category.id]))

    const now = DateTime.now()
    let created = 0
    let updated = 0
    let skipped = 0
    const unknownTechnologies = new Set<string>()
    const unknownCategories = new Set<string>()

    for (const [index, entry] of entries.entries()) {
      const known = await Article.findBy('slug', entry.slug)
      if (known && !this.update) {
        skipped += 1
        this.logger.info(`${entry.slug} · already there`)
        continue
      }

      const technologyIds: number[] = []
      for (const slug of entry.technologies) {
        const id = technologyIdBySlug.get(slug)
        if (id === undefined) {
          unknownTechnologies.add(slug)
          continue
        }
        technologyIds.push(id)
      }

      let categoryId = known?.categoryId ?? null
      if (entry.category) {
        const id = categoryIdBySlug.get(entry.category)
        if (id === undefined) {
          unknownCategories.add(entry.category)
        } else {
          categoryId = id
        }
      }

      await ArticleService.save(known ?? new Article(), {
        slug: entry.slug,
        status: this.publish ? 'published' : 'draft',
        categoryId,
        coverMediaId: known?.coverMediaId ?? null,
        technologyIds,
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

    if (unknownCategories.size > 0) {
      this.logger.warning(`Unknown categories, not linked: ${[...unknownCategories].join(', ')}`)
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
