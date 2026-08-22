import { inject } from '@adonisjs/core'
import { err, ok, type Result } from '#core/result'
import { MediaRepository } from '#media/repositories/media_repository'
import { MediaStorage } from '#media/storage'
import type Media from '#media/models/media'

export interface MediaNotFoundError {
  type: 'media_not_found'
}

export type DeleteMediaResult = Result<Media, MediaNotFoundError>

@inject()
export class DeleteMedia {
  constructor(
    private readonly media: MediaRepository,
    private readonly storage: MediaStorage
  ) {}

  async execute(id: number): Promise<DeleteMediaResult> {
    const media = await this.media.findById(id)

    if (!media) {
      return err({ type: 'media_not_found' })
    }

    await this.storage.deleteAll(media.key)
    await this.media.delete(media)

    return ok(media)
  }
}
