import { inject } from '@adonisjs/core'
import { err, ok, type Result } from '#core/result'
import RecoveryCodes from '#identity/domain/recovery_codes'
import Totp from '#identity/domain/totp'
import { UserRepository } from '#identity/repositories/user_repository'
import type User from '#identity/models/user'

export interface VerifySecondFactorParams {
  userId: number
  code: string
}

export type VerifySecondFactorError = { type: 'unknown_user' } | { type: 'invalid_code' }
export type VerifySecondFactorResult = Result<User, VerifySecondFactorError>

const TOTP_CODE = /^\d{6}$/

/**
 * Second step of the admin login. Accepts a six-digit TOTP code or a
 * one-time recovery code, which is consumed on success.
 */
@inject()
export class VerifySecondFactor {
  constructor(private readonly users: UserRepository) {}

  async execute(params: VerifySecondFactorParams): Promise<VerifySecondFactorResult> {
    const user = await this.users.findById(params.userId)

    if (!user) {
      return err({ type: 'unknown_user' })
    }

    if (
      TOTP_CODE.test(params.code) &&
      user.totpSecret !== null &&
      Totp.verify(user.email, user.totpSecret, params.code)
    ) {
      return ok(user)
    }

    const index = await RecoveryCodes.match(user.recoveryCodes, params.code)

    if (index === -1) {
      return err({ type: 'invalid_code' })
    }

    await this.users.saveRecoveryCodes(
      user,
      user.recoveryCodes!.filter((_, position) => position !== index)
    )

    return ok(user)
  }
}
