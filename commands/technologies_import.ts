import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { BaseCommand, args, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import Media from '#models/media'
import Technology, { TECHNOLOGY_CATEGORIES, type TechnologyCategory } from '#models/technology'
import TechnologyTranslation from '#models/technology_translation'
import { LOCALES, type Locale } from '#types/i18n'

interface Entry {
  slug: string
  name: string
  category: TechnologyCategory
  descriptionFr: string
  descriptionEn: string
}

/**
 * Imports technologies from a JSON file, for inventories prepared
 * outside the app. Each entry is matched with the media whose original
 * name is `<slug>.png`, so a logo library imported beforehand gets
 * wired up automatically.
 *
 * Existing slugs are left untouched — the back office is the source of
 * truth once an entry has been edited — unless --update is passed, and
 * a missing logo is filled in either way.
 */
export default class TechnologiesImport extends BaseCommand {
  static commandName = 'technologies:import'
  static description = 'Import technologies and their translations from a JSON file'

  static options: CommandOptions = { startApp: true }

  @args.string({ description: 'Path to the JSON file holding the entries' })
  declare file: string

  @flags.boolean({ description: 'Overwrite the name, category and descriptions of known slugs' })
  declare update: boolean

  async run() {
    const entries: Entry[] = JSON.parse(await readFile(resolve(this.file), 'utf8'))
    const invalid = entries.filter(
      (entry) => !entry.slug || !entry.name || !TECHNOLOGY_CATEGORIES.includes(entry.category)
    )

    if (invalid.length > 0) {
      this.exitCode = 1
      for (const entry of invalid) {
        this.logger.error(`${entry.slug ?? '(no slug)'} — missing name, slug or unknown category`)
      }
      return
    }

    const logos = await Media.query().select('id', 'originalName')
    const logoBySlug = new Map(logos.map((logo) => [logo.originalName.replace(/\.\w+$/, ''), logo]))

    let created = 0
    let updated = 0
    let skipped = 0
    const withoutLogo: string[] = []

    for (const entry of entries) {
      const logo = logoBySlug.get(entry.slug)
      if (!logo) {
        withoutLogo.push(entry.slug)
      }

      const known = await Technology.findBy('slug', entry.slug)

      if (known && !this.update) {
        skipped += 1
        if (logo && !known.logoMediaId) {
          await known.merge({ logoMediaId: logo.id }).save()
          this.logger.info(`${entry.slug} — kept, logo attached`)
        } else {
          this.logger.info(`${entry.slug} — already there`)
        }
        continue
      }

      const technology = await Technology.updateOrCreate(
        { slug: entry.slug },
        {
          name: entry.name,
          category: entry.category,
          logoMediaId: logo?.id ?? known?.logoMediaId ?? null,
        }
      )

      const descriptions: Record<Locale, string> = {
        fr: entry.descriptionFr,
        en: entry.descriptionEn,
      }
      for (const locale of LOCALES) {
        await TechnologyTranslation.updateOrCreate(
          { technologyId: technology.id, locale },
          { description: descriptions[locale] ?? '' }
        )
      }

      if (known) {
        updated += 1
        this.logger.success(`${entry.slug} — updated`)
      } else {
        created += 1
        this.logger.success(`${entry.slug} — created`)
      }
    }

    if (withoutLogo.length > 0) {
      this.logger.warning(`No logo found for: ${withoutLogo.join(', ')}`)
    }
    this.logger.info(
      `${created} created, ${updated} updated, ${skipped} skipped, out of ${entries.length} entries`
    )
  }
}
