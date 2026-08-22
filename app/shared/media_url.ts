import router from '@adonisjs/core/services/router'
import { DOCUMENT_FILE } from '#media/storage'
import type { MediaSource } from '#media/media_source'

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
 * Small preview URL (320px variant) for gallery grids, or null for
 * documents, which carry no image to show.
 */
export function thumbnailUrl(media: MediaSource) {
  return media.isDocument ? null : variantUrl(media, 320)
}

export function originalUrl(media: MediaSource) {
  return router.makeUrl('uploads.show', { key: media.key, file: 'original.webp' })
}
