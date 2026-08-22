import { inject } from '@adonisjs/core'
import { err, ok, type Result } from '#core/result'
import RecoveryCodes from '#identity/domain/recovery_codes'
import Totp from '#identity/domain/totp'
import { UserRepository } from '#identity/repositories/user_repository'
import type User from '#identity/models/user'

export interface EnableTotpParams {
  user: User
  secret: string
  code: string
}

export interface InvalidTotpCodeError {
  type: 'invalid_code'
}

export type EnableTotpResult = Result<string[], InvalidTotpCodeError>

/**
 * Confirms an enrollment. The candidate secret is only persisted once a
 * code proves the authenticator holds it, and the plain recovery codes
 * it returns are never readable again.
 */
@inject()
export class EnableTotp {
  constructor(private readonly users: UserRepository) {}

  async execute(params: EnableTotpParams): Promise<EnableTotpResult> {
    if (!Totp.verify(params.user.email, params.secret, params.code)) {
      return err({ type: 'invalid_code' })
    }

    const codes = await RecoveryCodes.issue()

    await this.users.saveTotpSecret(params.user, params.secret)
    await this.users.saveRecoveryCodes(params.user, codes.hashed)

    return ok(codes.plain)
  }
}
