import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * The homepage "talks" blurb became the talks table: its settings
 * rows are now dead weight. Irreversible by nature: rolling back
 * restores the (empty) editor, not the text that was stored.
 */
export default class extends BaseSchema {
  async up() {
    this.defer(async (db) => {
      await db.from('settings').whereIn('key', ['talks_fr', 'talks_en']).delete()
    })
  }

  async down() {}
}
