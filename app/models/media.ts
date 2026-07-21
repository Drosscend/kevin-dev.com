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
   * jsonb : sans prepare, node-postgres sérialiserait le tableau JS
   * en tableau Postgres au lieu de JSON.
   */
  @column({
    prepare: (value: MediaVariant[]) => JSON.stringify(value),
  })
  declare variants: MediaVariant[]
}
