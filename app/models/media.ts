import { column } from '@adonisjs/lucid/orm'
import { MediaSchema } from '#database/schema'

export interface MediaVariant {
  file: string
  width: number
  height: number
  size: number
}

export default class Media extends MediaSchema {
  /**
   * Serialized to a JSON string so the jsonb column receives JSON
   * (node-postgres maps plain JS arrays to Postgres arrays).
   */
  @column({
    prepare: (value: MediaVariant[]) => JSON.stringify(value),
  })
  declare variants: MediaVariant[]
}
