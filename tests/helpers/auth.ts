import { TOTP_PENDING_KEY, TOTP_PENDING_UNTIL_KEY } from '#app/identity/session_keys'
import User from '#identity/models/user'

/** The admin account the authenticated tests sign in with. */
export function admin() {
  return User.create({ email: 'admin@example.com', password: 'motdepasse' })
}

/** The session a password-verified login carries into the TOTP challenge. */
export function pendingTotp(user: User, until = Date.now() + 60_000) {
  return { [TOTP_PENDING_KEY]: user.id, [TOTP_PENDING_UNTIL_KEY]: until }
}
