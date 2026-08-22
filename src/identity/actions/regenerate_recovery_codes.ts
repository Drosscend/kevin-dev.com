import { inject } from '@adonisjs/core'
import { err, ok, type Result } from '#core/result'
import RecoveryCodes from '#identity/domain/recovery_codes'
import Totp from '#identity/domain/totp'
import { UserRepository } from '#identity/repositories/user_repository'
import type { InvalidTotpCodeError } from '#identity/actions/enable_totp'
import type User from '#identity/models/user'

export interface RegenerateRecoveryCodesParams {
  user: User
  code: string
}

export type RegenerateRecoveryCodesResult = Result<string[], InvalidTotpCodeError>

@inject()
export class RegenerateRecoveryCodes {
  constructor(private readonly users: UserRepository) {}

  async execute(params: RegenerateRecoveryCodesParams): Promise<RegenerateRecoveryCodesResult> {
    const secret = params.user.totpSecret

    if (!secret || !Totp.verify(params.user.email, secret, params.code)) {
      return err({ type: 'invalid_code' })
    }

    const codes = await RecoveryCodes.issue()
    await this.users.saveRecoveryCodes(params.user, codes.hashed)

    return ok(codes.plain)
  }
}
