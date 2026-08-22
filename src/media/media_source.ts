import type { MediaVariant } from '#media/models/media'

/**
 * What building a media URL needs, so both the models and the
 * projections of the read side satisfy it.
 */
export interface MediaSource {
  key: string
  isDocument: boolean
  variants: MediaVariant[]
}
