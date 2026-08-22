import User from '#identity/models/user'

export class UserRepository {
  async findById(id: number) {
    return User.find(id)
  }

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
