import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * One-time recovery codes for the TOTP second factor. Stores an array
 * of code hashes; each code is removed once used.
 */
export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.json('recovery_codes').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('recovery_codes')
    })
  }
}
