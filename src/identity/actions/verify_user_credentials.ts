import { inject } from '@adonisjs/core'
import { err, ok, type Result } from '#core/result'
import { UserRepository } from '#identity/repositories/user_repository'
import type User from '#identity/models/user'

export interface VerifyUserCredentialsParams {
  email: string
  password: string
}

export interface InvalidCredentialsError {
  type: 'invalid_credentials'
}

export type VerifyUserCredentialsResult = Result<User, InvalidCredentialsError>

@inject()
export class VerifyUserCredentials {
  constructor(private readonly users: UserRepository) {}

  async execute(params: VerifyUserCredentialsParams): Promise<VerifyUserCredentialsResult> {
    const user = await this.users.findByCredentials(params.email, params.password)

    return user ? ok(user) : err({ type: 'invalid_credentials' })
  }
}
