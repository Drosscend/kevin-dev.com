import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'media'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('key').notNullable().unique()
      table.string('original_name').notNullable()
      table.string('alt').notNullable()
      table.string('mime_type').notNullable()
      table.integer('width').notNullable()
      table.integer('height').notNullable()
      table.integer('size').notNullable()
      table.jsonb('variants').notNullable().defaultTo('[]')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
