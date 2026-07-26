import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'technologies'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('slug').notNullable().unique()
      table.string('name').notNullable()
      table.string('category').notNullable().defaultTo('outil')
      table
        .integer('logo_media_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('media')
        .onDelete('SET NULL')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    this.schema.createTable('technology_translations', (table) => {
      table.increments('id').notNullable()
      table
        .integer('technology_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('technologies')
        .onDelete('CASCADE')
      table.string('locale', 5).notNullable()
      table.text('description').notNullable().defaultTo('')
      table.unique(['technology_id', 'locale'])

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable('technology_translations')
    this.schema.dropTable(this.tableName)
  }
}
