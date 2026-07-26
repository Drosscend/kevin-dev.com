import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Link to the official documentation of a technology. Shared by every
 * locale: the destination site handles its own languages, if it has any.
 */
export default class extends BaseSchema {
  protected tableName = 'technologies'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('docs_url', 2048).nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('docs_url')
    })
  }
}
