import { inject } from '@adonisjs/core'
import { MediaRepository } from '#media/repositories/media_repository'
import type { MediaVariant } from '#media/models/media'

export interface MediaPickerOption {
  id: number
  key: string
  alt: string
  originalName: string
  isDocument: boolean
  variants: MediaVariant[]
}

/**
 * Images offered by the admin cover picker: enough to render a
 * searchable thumbnail grid in one payload, no second round-trip.
 */
@inject()
export class MediaPickerQuery {
  constructor(private readonly media: MediaRepository) {}

  async execute(): Promise<MediaPickerOption[]> {
    const items = await this.media.images()

    return items.map((item) => ({
      id: item.id,
      key: item.key,
      alt: item.alt,
      originalName: item.originalName,
      isDocument: item.isDocument,
      variants: item.variants,
    }))
  }
}
