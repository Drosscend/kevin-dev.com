import type { MediaSource } from '#media/media_source'

/**
 * How one content entry shows up in a list built by another
 * capability: enough to draw a card, nothing else.
 */
export interface ContentCard {
  slug: string
  title: string
  summary: string
  cover: MediaSource | null
}
