import User from '#identity/models/user'

/** The admin account the authenticated tests sign in with. */
export function admin() {
  return User.create({ email: 'admin@example.com', password: 'motdepasse' })
}
