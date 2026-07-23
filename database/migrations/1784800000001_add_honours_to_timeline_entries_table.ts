import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Academic honours of a timeline entry. The value is shared by every
 * locale and rendered from the translation files, so "none" simply
 * hides the mention on the public page.
 */
export default class extends BaseSchema {
  protected tableName = 'timeline_entries'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('honours').notNullable().defaultTo('none')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('honours')
    })
  }
}
