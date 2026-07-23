import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Documents (PDF) live in the media library next to images, and have
 * no pixel dimensions.
 */
export default class extends BaseSchema {
  protected tableName = 'media'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('width').nullable().alter()
      table.integer('height').nullable().alter()
    })
  }

  async down() {
    this.defer(async (db) => {
      await db.from(this.tableName).whereNull('width').update({ width: 0, height: 0 })
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.integer('width').notNullable().alter()
      table.integer('height').notNullable().alter()
    })
  }
}
