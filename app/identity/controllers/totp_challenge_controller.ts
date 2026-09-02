import { inject } from '@adonisjs/core'
import vine from '@vinejs/vine'
import { TOTP_PENDING_KEY, TOTP_PENDING_UNTIL_KEY } from '#app/identity/session_keys'
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
    if (!pendingUserId(session)) {
      return response.redirect().toRoute('admin.login')
    }

    return inertia.render('auth/verify', {})
  }

  async execute({ request, auth, session, response }: HttpContext) {
    const userId = pendingUserId(session)

    if (!userId) {
      return response.redirect().toRoute('admin.login')
    }

    const { code } = await request.validateUsing(TotpChallengeController.validator)
    const result = await this.verifySecondFactor.execute({ userId, code })

    if (!result.ok) {
      if (result.error.type === 'unknown_user') {
        forgetPending(session)
        return response.redirect().toRoute('admin.login')
      }

      flashFieldErrors(session, { code: ['Code invalide, réessayez'] })
      return response.redirect().back()
    }

    forgetPending(session)
    await auth.use('web').login(result.value)
    return response.redirect().toRoute('admin.dashboard')
  }
}

/**
 * The account waiting for its second factor, or null once the step
 * has expired: the password then has to be typed again.
 */
function pendingUserId(session: HttpContext['session']): number | null {
  const userId = session.get(TOTP_PENDING_KEY)
  const until = Number(session.get(TOTP_PENDING_UNTIL_KEY))

  if (!userId || !(until > Date.now())) {
    forgetPending(session)
    return null
  }

  return userId
}

function forgetPending(session: HttpContext['session']) {
  session.forget(TOTP_PENDING_KEY)
  session.forget(TOTP_PENDING_UNTIL_KEY)
}
