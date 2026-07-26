import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'projects'

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
      table.date('started_at').nullable()
      table.date('ended_at').nullable()
      table.boolean('featured').notNullable().defaultTo(false)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    this.schema.createTable('project_translations', (table) => {
      table.increments('id').notNullable()
      table
        .integer('project_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('projects')
        .onDelete('CASCADE')
      table.string('locale', 5).notNullable()
      table.string('title').notNullable()
      table.text('summary').notNullable().defaultTo('')
      table.text('content_markdown').notNullable()
      table.text('content_html').notNullable()
      table.unique(['project_id', 'locale'])

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    this.schema.createTable('project_links', (table) => {
      table.increments('id').notNullable()
      table
        .integer('project_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('projects')
        .onDelete('CASCADE')
      table.string('label').notNullable()
      table.string('url').notNullable()
      table.string('type').notNullable().defaultTo('other')
      table.integer('position').notNullable().defaultTo(0)
    })

    this.schema.createTable('project_technology', (table) => {
      table.increments('id').notNullable()
      table
        .integer('project_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('projects')
        .onDelete('CASCADE')
      table
        .integer('technology_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('technologies')
        .onDelete('CASCADE')
      table.unique(['project_id', 'technology_id'])
    })

    this.schema.createTable('article_project', (table) => {
      table.increments('id').notNullable()
      table
        .integer('article_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('articles')
        .onDelete('CASCADE')
      table
        .integer('project_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('projects')
        .onDelete('CASCADE')
      table.unique(['article_id', 'project_id'])
    })
  }

  async down() {
    this.schema.dropTable('article_project')
    this.schema.dropTable('project_technology')
    this.schema.dropTable('project_links')
    this.schema.dropTable('project_translations')
    this.schema.dropTable(this.tableName)
  }
}
