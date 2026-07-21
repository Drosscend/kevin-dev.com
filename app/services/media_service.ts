import { join } from 'node:path'
import { randomBytes } from 'node:crypto'
import { mkdir, rm } from 'node:fs/promises'
import sharp from 'sharp'
import app from '@adonisjs/core/services/app'
import type { MultipartFile } from '@adonisjs/core/bodyparser'
import Media, { type MediaVariant } from '#models/media'

const VARIANT_WIDTHS = [320, 640, 1280]
const ORIGINAL_MAX_WIDTH = 1920
const WEBP_QUALITY = 82

/**
 * Le fichier uploadé n'est pas une image décodable par sharp.
 */
export class InvalidImageError extends Error {}

/**
 * Bibliothèque média : réencodage systématique en webp par sharp
 * (neutralise les fichiers malveillants), variantes responsive,
 * stockage sous des noms générés (aucun nom client sur le disque).
 */
export default class MediaService {
  static storagePath(...paths: string[]) {
    return app.makePath('storage/media', ...paths)
  }

  static async store(file: MultipartFile, alt: string) {
    const key = randomBytes(12).toString('hex')
    const dir = this.storagePath(key)
    await mkdir(dir, { recursive: true })

    let original
    try {
      original = await sharp(file.tmpPath!)
        .rotate()
        .resize({ width: ORIGINAL_MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toFile(join(dir, 'original.webp'))
    } catch {
      await rm(dir, { recursive: true, force: true })
      throw new InvalidImageError()
    }

    try {
      const variants: MediaVariant[] = []
      for (const width of VARIANT_WIDTHS) {
        if (original.width <= width) {
          continue
        }
        const variant = await sharp(file.tmpPath!)
          .rotate()
          .resize({ width })
          .webp({ quality: WEBP_QUALITY })
          .toFile(join(dir, `w${width}.webp`))
        variants.push({
          file: `w${width}.webp`,
          width: variant.width,
          height: variant.height,
          size: variant.size,
        })
      }

      return await Media.create({
        key,
        originalName: file.clientName,
        alt,
        mimeType: 'image/webp',
        width: original.width,
        height: original.height,
        size: original.size,
        variants,
      })
    } catch (error) {
      await rm(dir, { recursive: true, force: true })
      throw error
    }
  }

  static async delete(media: Media) {
    await rm(this.storagePath(media.key), { recursive: true, force: true })
    await media.delete()
  }
}
