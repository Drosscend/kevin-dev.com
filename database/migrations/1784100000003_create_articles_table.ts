import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'articles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('slug').notNullable().unique()
      table.string('status').notNullable().defaultTo('draft')
      table.timestamp('published_at').nullable()
      table
        .integer('category_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('categories')
        .onDelete('SET NULL')
      table.integer('reading_time').notNullable().defaultTo(1)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    this.schema.createTable('article_translations', (table) => {
      table.increments('id').notNullable()
      table
        .integer('article_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('articles')
        .onDelete('CASCADE')
      table.string('locale', 5).notNullable()
      table.string('title').notNullable()
      table.text('summary').notNullable().defaultTo('')
      table.text('content_markdown').notNullable()
      table.text('content_html').notNullable()
      table.unique(['article_id', 'locale'])

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    this.schema.createTable('article_tag', (table) => {
      table.increments('id').notNullable()
      table
        .integer('article_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('articles')
        .onDelete('CASCADE')
      table
        .integer('tag_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('tags')
        .onDelete('CASCADE')
      table.unique(['article_id', 'tag_id'])
    })
  }

  async down() {
    this.schema.dropTable('article_tag')
    this.schema.dropTable('article_translations')
    this.schema.dropTable(this.tableName)
  }
}
