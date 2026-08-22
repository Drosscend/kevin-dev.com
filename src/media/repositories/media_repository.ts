import Media, { type MediaVariant } from '#media/models/media'

export interface CreateMediaPayload {
  key: string
  originalName: string
  alt: string
  mimeType: string
  width: number | null
  height: number | null
  size: number
  variants: MediaVariant[]
}

export class MediaRepository {
  async findById(id: number) {
    return Media.find(id)
  }

  async findByKey(key: string) {
    return Media.findBy('key', key)
  }

  async all() {
    return Media.query().orderBy('created_at', 'desc')
  }

  async images() {
    return Media.query()
      .withScopes((scopes) => scopes.images())
      .orderBy('created_at', 'desc')
  }

  async create(payload: CreateMediaPayload) {
    return Media.create(payload)
  }

  async delete(media: Media) {
    await media.delete()
  }
}
