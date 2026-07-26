import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import TotpService from '#services/totp_service'
import RecoveryCodesService from '#services/recovery_codes_service'
import { challengeCodeValidator, loginValidator } from '#validators/auth'

const TOTP_PENDING_KEY = 'totp_pending_user_id'

export default class SessionController {
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/login', {})
  }

  /**
   * First step: email + password. When the account has TOTP enabled,
   * no session is opened yet: the user is sent to the TOTP challenge.
   */
  async store({ request, auth, response, session }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    let user: User
    try {
      user = await User.verifyCredentials(email, password)
    } catch {
      session.flash('errors', { email: ['Identifiants invalides'] })
      return response.redirect().back()
    }

    if (user.totpEnabled) {
      session.put(TOTP_PENDING_KEY, user.id)
      return response.redirect().toRoute('admin.totp')
    }

    await auth.use('web').login(user)
    response.redirect().toRoute('admin.dashboard')
  }

  async totpCreate({ inertia, session, response }: HttpContext) {
    if (!session.has(TOTP_PENDING_KEY)) {
      return response.redirect().toRoute('admin.login')
    }
    return inertia.render('auth/verify', {})
  }

  /**
   * Second step: a six-digit TOTP code, or a one-time recovery code
   * (consumed on success) when the authenticator is unavailable.
   */
  async totpStore({ request, auth, session, response }: HttpContext) {
    const userId = session.get(TOTP_PENDING_KEY)
    if (!userId) {
      return response.redirect().toRoute('admin.login')
    }

    const { code } = await request.validateUsing(challengeCodeValidator)
    const user = await User.findOrFail(userId)

    const isTotp =
      /^\d{6}$/.test(code) &&
      user.totpSecret !== null &&
      TotpService.verify(user.email, user.totpSecret, code)
    const isRecovery = !isTotp && (await RecoveryCodesService.verifyAndConsume(user, code))

    if (!isTotp && !isRecovery) {
      session.flash('errors', { code: ['Code invalide, réessayez'] })
      return response.redirect().back()
    }

    session.forget(TOTP_PENDING_KEY)
    await auth.use('web').login(user)
    response.redirect().toRoute('admin.dashboard')
  }

  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    response.redirect().toRoute('admin.login')
  }
}
