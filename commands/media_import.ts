import { readdir } from 'node:fs/promises'
import { basename, extname, join, resolve } from 'node:path'
import { BaseCommand, args, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import type { MultipartFile } from '@adonisjs/core/bodyparser'
import Media from '#models/media'
import MediaService, { InvalidImageError } from '#services/media_service'

const EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']

/**
 * Bulk-imports a folder of images into the media library, for batches
 * prepared outside the app that would otherwise go through the admin
 * uploader one file at a time. Files go through MediaService, so they
 * are re-encoded and get their variants exactly like an admin upload.
 * The file name without its extension becomes the alt text, and a name
 * already present in the library is skipped so the command can be run
 * twice without duplicating anything.
 */
export default class MediaImport extends BaseCommand {
  static commandName = 'media:import'
  static description = 'Import every image of a folder into the media library'

  static options: CommandOptions = { startApp: true }

  @args.string({ description: 'Path to the folder holding the images' })
  declare folder: string

  @flags.boolean({ description: 'Import file names that are already in the library' })
  declare force: boolean

  async run() {
    const folder = resolve(this.folder)
    const entries = await readdir(folder, { withFileTypes: true })
    const files = entries
      .filter((entry) => entry.isFile() && EXTENSIONS.includes(extname(entry.name).toLowerCase()))
      .map((entry) => entry.name)
      .sort()

    if (files.length === 0) {
      this.logger.warning(`No image found in ${folder}`)
      return
    }

    const library = this.force ? [] : await Media.query().select('originalName')
    const known = new Set(library.map((media) => media.originalName))

    let imported = 0
    let skipped = 0

    for (const file of files) {
      if (known.has(file)) {
        skipped += 1
        this.logger.info(`${file} · already in the library`)
        continue
      }

      try {
        await MediaService.store(
          { tmpPath: join(folder, file), clientName: file } as MultipartFile,
          basename(file, extname(file))
        )
        imported += 1
        this.logger.success(`${file}`)
      } catch (error) {
        this.exitCode = 1
        this.logger.error(
          `${file} · ${error instanceof InvalidImageError ? 'unreadable image' : String(error)}`
        )
      }
    }

    this.logger.info(`${imported} imported, ${skipped} skipped, out of ${files.length} images`)
  }
}
