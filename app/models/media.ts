import { column, scope } from '@adonisjs/lucid/orm'
import { MediaSchema } from '#database/schema'

export interface MediaVariant {
  file: string
  width: number
  height: number
  size: number
}

export const DOCUMENT_MIME_TYPE = 'application/pdf'

export default class Media extends MediaSchema {
  /**
   * Serialized to a JSON string so the jsonb column receives JSON
   * (node-postgres maps plain JS arrays to Postgres arrays).
   */
  @column({
    prepare: (value: MediaVariant[]) => JSON.stringify(value),
  })
  declare variants: MediaVariant[]

  /**
   * Images only: documents are never valid covers or logos.
   */
  static images = scope((query) => {
    query.where('mime_type', 'like', 'image/%')
  })

  get isDocument() {
    return this.mimeType === DOCUMENT_MIME_TYPE
  }
}
