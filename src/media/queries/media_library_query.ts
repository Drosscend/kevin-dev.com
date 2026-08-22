import { inject } from '@adonisjs/core'
import { MediaRepository } from '#media/repositories/media_repository'
import type { MediaVariant } from '#media/models/media'

export interface MediaLibraryItem {
  id: number
  key: string
  alt: string
  originalName: string
  isDocument: boolean
  width: number | null
  height: number | null
  size: number
  variants: MediaVariant[]
}

@inject()
export class MediaLibraryQuery {
  constructor(private readonly media: MediaRepository) {}

  async execute(): Promise<MediaLibraryItem[]> {
    const items = await this.media.all()

    return items.map((item) => ({
      id: item.id,
      key: item.key,
      alt: item.alt,
      originalName: item.originalName,
      isDocument: item.isDocument,
      width: item.width,
      height: item.height,
      size: item.size,
      variants: item.variants,
    }))
  }
}
