import { randomBytes } from 'node:crypto'
import sharp from 'sharp'
import drive from '@adonisjs/drive/services/main'
import router from '@adonisjs/core/services/router'
import type { MultipartFile } from '@adonisjs/core/bodyparser'
import Media, { type MediaVariant } from '#models/media'

const VARIANT_WIDTHS = [320, 640, 1280]
const ORIGINAL_MAX_WIDTH = 1920
const WEBP_QUALITY = 82

/**
 * Raised when the uploaded file cannot be decoded as an image by sharp.
 */
export class InvalidImageError extends Error {}

/**
 * Media library backed by Drive (fs disk under storage/): every
 * upload is re-encoded to webp by sharp (neutralizes crafted
 * files), responsive variants are generated, and files are stored
 * under generated keys (no client-provided name ever reaches the
 * disk).
 */
export default class MediaService {
  /** Disk folder holding every variant of one media. */
  static #directory(mediaKey: string) {
    return `media/${mediaKey}`
  }

  static key(mediaKey: string, file: string) {
    return `${this.#directory(mediaKey)}/${file}`
  }

  /**
   * Public URL of the variant at `width`, falling back to the original
   * when the source image was narrower than that.
   */
  static url(media: Media | null, width = 640) {
    if (!media) {
      return null
    }
    const variant = media.variants.find((item) => item.width === width)?.file ?? 'original.webp'
    return router.makeUrl('uploads.show', { key: media.key, file: variant })
  }

  static async store(file: MultipartFile, alt: string) {
    const mediaKey = randomBytes(12).toString('hex')
    const disk = drive.use()

    let original
    try {
      original = await sharp(file.tmpPath!)
        .rotate()
        .resize({ width: ORIGINAL_MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toBuffer({ resolveWithObject: true })
    } catch {
      throw new InvalidImageError()
    }

    try {
      await disk.put(this.key(mediaKey, 'original.webp'), original.data)

      const variants: MediaVariant[] = []
      for (const width of VARIANT_WIDTHS) {
        if (original.info.width <= width) {
          continue
        }
        const variant = await sharp(file.tmpPath!)
          .rotate()
          .resize({ width })
          .webp({ quality: WEBP_QUALITY })
          .toBuffer({ resolveWithObject: true })
        await disk.put(this.key(mediaKey, `w${width}.webp`), variant.data)
        variants.push({
          file: `w${width}.webp`,
          width: variant.info.width,
          height: variant.info.height,
          size: variant.info.size,
        })
      }

      return await Media.create({
        key: mediaKey,
        originalName: file.clientName,
        alt,
        mimeType: 'image/webp',
        width: original.info.width,
        height: original.info.height,
        size: original.info.size,
        variants,
      })
    } catch (error) {
      await disk.deleteAll(this.#directory(mediaKey))
      throw error
    }
  }

  static async delete(media: Media) {
    await drive.use().deleteAll(this.#directory(media.key))
    await media.delete()
  }
}
