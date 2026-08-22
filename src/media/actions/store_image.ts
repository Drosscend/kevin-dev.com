import { randomBytes } from 'node:crypto'
import { inject } from '@adonisjs/core'
import sharp from 'sharp'
import { err, ok, type Result } from '#core/result'
import { MediaRepository } from '#media/repositories/media_repository'
import { MediaStorage } from '#media/storage'
import type Media from '#media/models/media'
import type { MediaVariant } from '#media/models/media'
import type { MultipartFile } from '@adonisjs/core/bodyparser'

const VARIANT_WIDTHS = [320, 640, 1280]
const ORIGINAL_MAX_WIDTH = 1920
const WEBP_QUALITY = 82

export interface StoreImageParams {
  file: MultipartFile
  alt: string
}

export interface InvalidImageError {
  type: 'invalid_image'
}

export type StoreImageResult = Result<Media, InvalidImageError>

/**
 * Every upload is re-encoded to webp by sharp, which neutralizes
 * crafted files, then declined into responsive variants.
 */
@inject()
export class StoreImage {
  constructor(
    private readonly media: MediaRepository,
    private readonly storage: MediaStorage
  ) {}

  async execute(params: StoreImageParams): Promise<StoreImageResult> {
    const mediaKey = randomBytes(12).toString('hex')

    let original
    try {
      original = await sharp(params.file.tmpPath!)
        .rotate()
        .resize({ width: ORIGINAL_MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toBuffer({ resolveWithObject: true })
    } catch {
      return err({ type: 'invalid_image' })
    }

    try {
      await this.storage.put(mediaKey, 'original.webp', original.data)

      const variants: MediaVariant[] = []
      for (const width of VARIANT_WIDTHS) {
        if (original.info.width <= width) {
          continue
        }

        const variant = await sharp(params.file.tmpPath!)
          .rotate()
          .resize({ width })
          .webp({ quality: WEBP_QUALITY })
          .toBuffer({ resolveWithObject: true })

        await this.storage.put(mediaKey, `w${width}.webp`, variant.data)
        variants.push({
          file: `w${width}.webp`,
          width: variant.info.width,
          height: variant.info.height,
          size: variant.info.size,
        })
      }

      return ok(
        await this.media.create({
          key: mediaKey,
          originalName: params.file.clientName,
          alt: params.alt,
          mimeType: 'image/webp',
          width: original.info.width,
          height: original.info.height,
          size: original.info.size,
          variants,
        })
      )
    } catch (error) {
      await this.storage.deleteAll(mediaKey)
      throw error
    }
  }
}
