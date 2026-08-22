import User from '#identity/models/user'

/**
 * Every read and write of the admin account. Keeping them here is what
 * lets the actions stay about the second factor rather than about
 * columns.
 */
export class UserRepository {
  async findById(id: number) {
    return User.find(id)
  }

  /**
   * Null rather than a thrown error: failing to sign in is an expected
   * outcome, not a broken execution.
   */
  async findByCredentials(email: string, password: string) {
    try {
      return await User.verifyCredentials(email, password)
    } catch {
      return null
    }
  }

  async saveTotpSecret(user: User, secret: string | null) {
    user.totpSecret = secret
    await user.save()
  }

  async saveRecoveryCodes(user: User, hashed: string[] | null) {
    user.recoveryCodes = hashed
    await user.save()
  }
}
