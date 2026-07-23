import { randomBytes } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import sharp from 'sharp'
import drive from '@adonisjs/drive/services/main'
import router from '@adonisjs/core/services/router'
import type { MultipartFile } from '@adonisjs/core/bodyparser'
import Media, { DOCUMENT_MIME_TYPE, type MediaVariant } from '#models/media'

const VARIANT_WIDTHS = [320, 640, 1280]
const ORIGINAL_MAX_WIDTH = 1920
const WEBP_QUALITY = 82

/** Single file name every stored document lives under. */
export const DOCUMENT_FILE = 'document.pdf'

const PDF_SIGNATURE = Buffer.from('%PDF-')

/**
 * Raised when the uploaded file cannot be decoded as an image by sharp.
 */
export class InvalidImageError extends Error {}

/**
 * Raised when the uploaded document does not carry the PDF signature.
 */
export class InvalidDocumentError extends Error {}

/**
 * Media library backed by Drive (fs disk under storage/): every
 * image upload is re-encoded to webp by sharp (neutralizes crafted
 * files), responsive variants are generated, and files are stored
 * under generated keys (no client-provided name ever reaches the
 * disk). Documents (PDF) are stored as-is, under the same key
 * scheme, and carry no variant.
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
   * when the source image was narrower than that. Documents always
   * resolve to their single file.
   */
  static url(media: Media | null, width = 640) {
    if (!media) {
      return null
    }
    if (media.isDocument) {
      return this.documentUrl(media)
    }
    const variant = media.variants.find((item) => item.width === width)?.file ?? 'original.webp'
    return router.makeUrl('uploads.show', { key: media.key, file: variant })
  }

  static documentUrl(media: Media) {
    return router.makeUrl('uploads.show', { key: media.key, file: DOCUMENT_FILE })
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

  /**
   * Stores a PDF untouched: the magic number is checked so a renamed
   * file cannot be served back as application/pdf.
   */
  static async storeDocument(file: MultipartFile, alt: string) {
    const contents = await readFile(file.tmpPath!)
    if (!contents.subarray(0, PDF_SIGNATURE.length).equals(PDF_SIGNATURE)) {
      throw new InvalidDocumentError()
    }

    const mediaKey = randomBytes(12).toString('hex')
    const disk = drive.use()

    try {
      await disk.put(this.key(mediaKey, DOCUMENT_FILE), contents)

      return await Media.create({
        key: mediaKey,
        originalName: file.clientName,
        alt,
        mimeType: DOCUMENT_MIME_TYPE,
        width: null,
        height: null,
        size: contents.byteLength,
        variants: [],
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
