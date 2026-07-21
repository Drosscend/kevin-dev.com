import { BaseSeeder } from '@adonisjs/lucid/seeders'
import logger from '@adonisjs/core/services/logger'
import env from '#start/env'
import User from '#models/user'

/**
 * Creates the single admin account (there is no public signup).
 * Idempotent: leaves the account untouched when it already exists.
 */
export default class extends BaseSeeder {
  async run() {
    const email = env.get('ADMIN_EMAIL')
    const password = env.get('ADMIN_PASSWORD')

    if (!email || !password) {
      logger.warn('ADMIN_EMAIL / ADMIN_PASSWORD absents : seed du compte admin ignoré')
      return
    }

    await User.firstOrCreate({ email }, { email, password, fullName: 'Kévin Véronési' })
  }
}
