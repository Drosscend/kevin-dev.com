import { BaseSchema } from '@adonisjs/lucid/schema'
import MarkdownService from '#services/markdown_service'

/**
 * Projects and talks carry a reading time like articles do. The value is
 * derived from the French content, the only translation guaranteed to
 * exist, and is backfilled here for the entries already in place.
 */
export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('projects', (table) => {
      table.integer('reading_time').notNullable().defaultTo(1)
    })

    this.schema.alterTable('talks', (table) => {
      table.integer('reading_time').notNullable().defaultTo(1)
    })

    this.defer(async (db) => {
      for (const [table, translationTable, foreignKey] of [
        ['projects', 'project_translations', 'project_id'],
        ['talks', 'talk_translations', 'talk_id'],
      ]) {
        const translations = await db
          .from(translationTable)
          .select(foreignKey, 'content_markdown')
          .where('locale', 'fr')

        for (const translation of translations) {
          await db
            .from(table)
            .where('id', translation[foreignKey])
            .update({ reading_time: MarkdownService.readingTime(translation.content_markdown) })
        }
      }
    })
  }

  async down() {
    this.schema.alterTable('projects', (table) => {
      table.dropColumn('reading_time')
    })

    this.schema.alterTable('talks', (table) => {
      table.dropColumn('reading_time')
    })
  }
}
