import { toDataURL } from 'qrcode'
import type { HttpContext } from '@adonisjs/core/http'
import TotpService from '#services/totp_service'
import { totpCodeValidator } from '#validators/auth'

const TOTP_SETUP_KEY = 'totp_setup_secret'

export default class SecurityController {
  /**
   * Security page: offers TOTP enrollment when 2FA is inactive.
   * The candidate secret lives in the session until it is confirmed
   * with a valid code — nothing is persisted before that.
   */
  async show({ inertia, auth, session }: HttpContext) {
    const user = auth.user!

    if (user.totpEnabled) {
      return inertia.render('admin/security', { totpEnabled: true, qrCode: null, secret: null })
    }

    let secret = session.get(TOTP_SETUP_KEY)
    if (!secret) {
      secret = TotpService.generateSecret()
      session.put(TOTP_SETUP_KEY, secret)
    }

    const qrCode = await toDataURL(TotpService.uri(user.email, secret))
    return inertia.render('admin/security', { totpEnabled: false, qrCode, secret })
  }

  async store({ request, auth, session, response }: HttpContext) {
    const user = auth.user!
    const secret = session.get(TOTP_SETUP_KEY)

    if (!secret) {
      return response.redirect().toRoute('admin.security')
    }

    const { code } = await request.validateUsing(totpCodeValidator)

    if (!TotpService.verify(user.email, secret, code)) {
      session.flash('errors', { code: ['Code invalide, réessayez'] })
      return response.redirect().back()
    }

    user.totpSecret = secret
    await user.save()
    session.forget(TOTP_SETUP_KEY)
    session.flash('success', 'Double authentification activée')
    response.redirect().toRoute('admin.security')
  }

  /**
   * Disabling 2FA requires a valid current TOTP code, so a stolen
   * session alone cannot remove the second factor.
   */
  async destroy({ request, auth, session, response }: HttpContext) {
    const user = auth.user!
    const { code } = await request.validateUsing(totpCodeValidator)

    if (!user.totpSecret || !TotpService.verify(user.email, user.totpSecret, code)) {
      session.flash('errors', { code: ['Code invalide, réessayez'] })
      return response.redirect().back()
    }

    user.totpSecret = null
    await user.save()
    session.flash('success', 'Double authentification désactivée')
    response.redirect().toRoute('admin.security')
  }
}
