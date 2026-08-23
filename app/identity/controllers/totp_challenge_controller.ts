import { inject } from '@adonisjs/core'
import vine from '@vinejs/vine'
import { TOTP_PENDING_KEY } from '#app/identity/session_keys'
import { flashFieldErrors } from '#app/shared/field_errors'
import { VerifySecondFactor } from '#identity/actions/verify_second_factor'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class TotpChallengeController {
  static readonly validator = vine.create({
    code: vine.string().trim().minLength(6).maxLength(11),
  })

  constructor(private readonly verifySecondFactor: VerifySecondFactor) {}

  render({ inertia, session, response }: HttpContext) {
    if (!session.has(TOTP_PENDING_KEY)) {
      return response.redirect().toRoute('admin.login')
    }

    return inertia.render('auth/verify', {})
  }

  async execute({ request, auth, session, response }: HttpContext) {
    const userId = session.get(TOTP_PENDING_KEY)

    if (!userId) {
      return response.redirect().toRoute('admin.login')
    }

    const { code } = await request.validateUsing(TotpChallengeController.validator)
    const result = await this.verifySecondFactor.execute({ userId, code })

    if (!result.ok) {
      if (result.error.type === 'unknown_user') {
        session.forget(TOTP_PENDING_KEY)
        return response.redirect().toRoute('admin.login')
      }

      flashFieldErrors(session, { code: ['Code invalide, réessayez'] })
      return response.redirect().back()
    }

    session.forget(TOTP_PENDING_KEY)
    await auth.use('web').login(result.value)
    return response.redirect().toRoute('admin.dashboard')
  }
}
