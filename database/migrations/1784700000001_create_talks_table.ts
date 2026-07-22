import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'talks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('slug').notNullable().unique()
      table.string('status').notNullable().defaultTo('draft')
      table.timestamp('published_at').nullable()
      table
        .integer('cover_media_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('media')
        .onDelete('SET NULL')
      table.date('event_date').notNullable()
      table.string('event_name').notNullable()
      table.string('city').notNullable().defaultTo('')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index(['status', 'event_date'], 'talks_status_event_date_index')
    })

    this.schema.createTable('talk_translations', (table) => {
      table.increments('id').notNullable()
      table
        .integer('talk_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('talks')
        .onDelete('CASCADE')
      table.string('locale', 5).notNullable()
      table.string('title').notNullable()
      table.text('summary').notNullable().defaultTo('')
      table.text('content_markdown').notNullable()
      table.text('content_html').notNullable()
      table.unique(['talk_id', 'locale'])

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    this.schema.createTable('talk_links', (table) => {
      table.increments('id').notNullable()
      table
        .integer('talk_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('talks')
        .onDelete('CASCADE')
      table.string('label').notNullable()
      table.string('url').notNullable()
      table.string('type').notNullable().defaultTo('other')
      table.integer('position').notNullable().defaultTo(0)
    })

    this.schema.createTable('talk_technology', (table) => {
      table.increments('id').notNullable()
      table
        .integer('talk_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('talks')
        .onDelete('CASCADE')
      table
        .integer('technology_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('technologies')
        .onDelete('CASCADE')
      table.unique(['talk_id', 'technology_id'])
      table.index(['technology_id'], 'talk_technology_technology_id_index')
    })
  }

  async down() {
    this.schema.dropTable('talk_technology')
    this.schema.dropTable('talk_links')
    this.schema.dropTable('talk_translations')
    this.schema.dropTable(this.tableName)
  }
}
