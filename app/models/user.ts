import { column } from '@adonisjs/lucid/orm'
import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'

export default class User extends compose(UserSchema, withAuthFinder(hash)) {
  /**
   * Serialized to a JSON string so the json column receives JSON
   * (node-postgres maps plain JS arrays to Postgres arrays).
   */
  @column({
    serializeAs: null,
    prepare: (value: string[] | null) => (value === null ? null : JSON.stringify(value)),
  })
  declare recoveryCodes: string[] | null

  get totpEnabled() {
    return this.totpSecret !== null
  }

  get initials() {
    const [first, last] = this.fullName ? this.fullName.split(' ') : this.email.split('@')
    if (first && last) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
    }
    return `${first.slice(0, 2)}`.toUpperCase()
  }
}
