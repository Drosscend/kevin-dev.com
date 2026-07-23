import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Articles join the technology taxonomy already shared by projects and
 * talks, and drop their own tags. Associations whose tag slug matches a
 * technology slug are carried over; the remaining ones disappear with
 * the tags tables.
 */
export default class extends BaseSchema {
  protected tableName = 'article_technology'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('article_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('articles')
        .onDelete('CASCADE')
      table
        .integer('technology_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('technologies')
        .onDelete('CASCADE')
      table.unique(['article_id', 'technology_id'])
      table.index(['technology_id'], 'article_technology_technology_id_index')
    })

    this.defer(async (db) => {
      await db.rawQuery(`
        INSERT INTO article_technology (article_id, technology_id)
        SELECT DISTINCT article_tag.article_id, technologies.id
        FROM article_tag
        JOIN tags ON tags.id = article_tag.tag_id
        JOIN technologies ON technologies.slug = tags.slug
      `)
    })

    this.schema.dropTable('article_tag')
    this.schema.dropTable('tag_translations')
    this.schema.dropTable('tags')
  }

  /** Restores the tags structure; the association data is not recoverable. */
  async down() {
    this.schema.createTable('tags', (table) => {
      table.increments('id').notNullable()
      table.string('slug').notNullable().unique()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    this.schema.createTable('tag_translations', (table) => {
      table.increments('id').notNullable()
      table
        .integer('tag_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('tags')
        .onDelete('CASCADE')
      table.string('locale', 5).notNullable()
      table.string('name').notNullable()
      table.unique(['tag_id', 'locale'])

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
      table.index(['tag_id'], 'article_tag_tag_id_index')
    })

    this.schema.dropTable(this.tableName)
  }
}
