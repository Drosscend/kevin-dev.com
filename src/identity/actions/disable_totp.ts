import { inject } from '@adonisjs/core'
import { err, ok, type Result } from '#core/result'
import Totp from '#identity/domain/totp'
import { UserRepository } from '#identity/repositories/user_repository'
import type { InvalidTotpCodeError } from '#identity/actions/enable_totp'
import type User from '#identity/models/user'

export interface DisableTotpParams {
  user: User
  code: string
}

export type DisableTotpResult = Result<null, InvalidTotpCodeError>

@inject()
export class DisableTotp {
  constructor(private readonly users: UserRepository) {}

  async execute(params: DisableTotpParams): Promise<DisableTotpResult> {
    const secret = params.user.totpSecret

    if (!secret || !Totp.verify(params.user.email, secret, params.code)) {
      return err({ type: 'invalid_code' })
    }

    await this.users.saveTotpSecret(params.user, null)
    await this.users.saveRecoveryCodes(params.user, null)

    return ok(null)
  }
}
