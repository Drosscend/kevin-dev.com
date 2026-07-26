import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Career timeline shown on the homepage, previously hardcoded in the
 * home controller. Seeded with the current entries so the public page
 * keeps its content after the migration.
 */
const SEED = [
  {
    position: 1,
    fr: {
      period: '2025-auj.',
      title: 'Consultant Data Migration · Développeur Full Stack & IA',
      place: 'En poste',
    },
    en: {
      period: '2025-today',
      title: 'Data Migration Consultant · Full Stack & AI Developer',
      place: 'Currently employed',
    },
  },
  {
    position: 2,
    fr: {
      period: '2023-2025',
      title: 'Master MIASHS ICE-LD',
      place: 'Université Toulouse Jean Jaurès',
    },
    en: {
      period: '2023-2025',
      title: "Master's degree MIASHS ICE-LD",
      place: 'Université Toulouse Jean Jaurès',
    },
  },
  {
    position: 3,
    fr: { period: '2022-2023', title: 'Licence pro APSIO', place: 'IUT de Blagnac' },
    en: { period: '2022-2023', title: 'Professional bachelor APSIO', place: 'IUT de Blagnac' },
  },
  {
    position: 4,
    fr: { period: '2020-2022', title: 'DUT Informatique', place: 'IUT de Blagnac' },
    en: { period: '2020-2022', title: 'DUT in computer science', place: 'IUT de Blagnac' },
  },
  {
    position: 5,
    fr: { period: '2020', title: 'BAC STI2D', place: 'LPO Le Garros, Auch' },
    en: { period: '2020', title: 'STI2D high school diploma', place: 'LPO Le Garros, Auch' },
  },
]

export default class extends BaseSchema {
  protected tableName = 'timeline_entries'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('position').notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    this.schema.createTable('timeline_entry_translations', (table) => {
      table.increments('id').notNullable()
      table
        .integer('timeline_entry_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('timeline_entries')
        .onDelete('CASCADE')
      table.string('locale', 5).notNullable()
      table.string('period').notNullable()
      table.string('title').notNullable()
      table.string('place').notNullable()
      table.unique(['timeline_entry_id', 'locale'])

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    this.defer(async (db) => {
      const now = new Date()
      for (const entry of SEED) {
        const [row] = await db
          .table(this.tableName)
          .insert({ position: entry.position, created_at: now })
          .returning('id')
        const id = typeof row === 'object' ? row.id : row
        await db.table('timeline_entry_translations').multiInsert([
          { timeline_entry_id: id, locale: 'fr', ...entry.fr, created_at: now },
          { timeline_entry_id: id, locale: 'en', ...entry.en, created_at: now },
        ])
      }
    })
  }

  async down() {
    this.schema.dropTable('timeline_entry_translations')
    this.schema.dropTable(this.tableName)
  }
}
