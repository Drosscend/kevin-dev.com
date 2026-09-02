import router from '@adonisjs/core/services/router'
import { DOCUMENT_FILE } from '#media/storage'
import type { MediaSource } from '#media/media_source'
import type { Picture } from '#types/content'

export function variantUrl(media: MediaSource, width: number) {
  const file = media.variants.find((variant) => variant.width === width)?.file ?? 'original.webp'
  return router.makeUrl('uploads.show', { key: media.key, file })
}

export function documentUrl(media: MediaSource) {
  return router.makeUrl('uploads.show', { key: media.key, file: DOCUMENT_FILE })
}

/**
 * Public URL of the variant at `width`, falling back to the original
 * when the source image was narrower than that. Documents always
 * resolve to their single file.
 */
export function mediaUrl(media: MediaSource | null, width = 640) {
  if (!media) {
    return null
  }

  return media.isDocument ? documentUrl(media) : variantUrl(media, width)
}

/**
 * Every variant of an image as a srcset, so the browser picks the one
 * its slot needs; the 640 px variant is the plain fallback. A document
 * has no picture.
 */
export function picture(media: MediaSource | null): Picture | null {
  if (!media || media.isDocument) {
    return null
  }

  const variants = [...media.variants].sort((a, b) => a.width - b.width)

  if (variants.length === 0) {
    return { src: originalUrl(media), srcSet: null, width: null, height: null }
  }

  const fallback =
    variants.find((variant) => variant.width === 640) ?? variants[variants.length - 1]

  return {
    src: variantUrl(media, fallback.width),
    srcSet: variants
      .map((variant) => `${variantUrl(media, variant.width)} ${variant.width}w`)
      .join(', '),
    width: fallback.width,
    height: fallback.height,
  }
}

/**
 * Small preview URL (320px variant) for gallery grids, or null for
 * documents, which carry no image to show.
 */
export function thumbnailUrl(media: MediaSource) {
  return media.isDocument ? null : variantUrl(media, 320)
}

export function originalUrl(media: MediaSource) {
  return router.makeUrl('uploads.show', { key: media.key, file: 'original.webp' })
}
