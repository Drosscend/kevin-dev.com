import { BaseTransformer } from '@adonisjs/core/transformers'

export interface MediaItem {
  id: number
  alt: string
  originalName: string
  isDocument: boolean
  width: number | null
  height: number | null
  size: number
  url: string
  absoluteUrl: string
  thumbnailUrl: string | null
}

export default class MediaItemTransformer extends BaseTransformer<MediaItem> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'alt',
      'originalName',
      'isDocument',
      'width',
      'height',
      'size',
      'url',
      'absoluteUrl',
      'thumbnailUrl',
    ])
  }
}
