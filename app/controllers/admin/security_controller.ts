import { toDataURL } from 'qrcode'
import type { HttpContext } from '@adonisjs/core/http'
import TotpService from '#services/totp_service'
import RecoveryCodesService from '#services/recovery_codes_service'
import { totpCodeValidator } from '#validators/auth'

const TOTP_SETUP_KEY = 'totp_setup_secret'
const RECOVERY_CODES_FLASH_KEY = 'recovery_codes'

export default class SecurityController {
  /**
   * Security page: offers TOTP enrollment when 2FA is inactive.
   * The candidate secret lives in the session until it is confirmed
   * with a valid code: nothing is persisted before that. Freshly
   * generated recovery codes transit through a flash message so they
   * are displayed exactly once.
   */
  async show({ inertia, auth, session }: HttpContext) {
    const user = auth.user!

    if (user.totpEnabled) {
      return inertia.render('admin/security', {
        totpEnabled: true,
        qrCode: null,
        secret: null,
        recoveryCodes: (session.flashMessages.get(RECOVERY_CODES_FLASH_KEY) as string[]) ?? null,
        recoveryCodesRemaining: RecoveryCodesService.remaining(user),
      })
    }

    let secret = session.get(TOTP_SETUP_KEY)
    if (!secret) {
      secret = TotpService.generateSecret()
      session.put(TOTP_SETUP_KEY, secret)
    }

    const qrCode = await toDataURL(TotpService.uri(user.email, secret))
    return inertia.render('admin/security', {
      totpEnabled: false,
      qrCode,
      secret,
      recoveryCodes: null,
      recoveryCodesRemaining: 0,
    })
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
    const recoveryCodes = await RecoveryCodesService.generate(user)
    session.forget(TOTP_SETUP_KEY)
    session.flash(RECOVERY_CODES_FLASH_KEY, recoveryCodes)
    session.flash('success', 'Double authentification activée')
    response.redirect().toRoute('admin.security')
  }

  /**
   * Regenerates the recovery-code set. Requires a valid TOTP code and
   * invalidates every previous code.
   */
  async regenerateRecovery({ request, auth, session, response }: HttpContext) {
    const user = auth.user!
    const { code } = await request.validateUsing(totpCodeValidator)

    if (!user.totpSecret || !TotpService.verify(user.email, user.totpSecret, code)) {
      session.flash('errors', { recoveryCode: ['Code invalide, réessayez'] })
      return response.redirect().back()
    }

    const recoveryCodes = await RecoveryCodesService.generate(user)
    session.flash(RECOVERY_CODES_FLASH_KEY, recoveryCodes)
    session.flash('success', 'Nouveaux codes de secours générés')
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
    await RecoveryCodesService.clear(user)
    session.flash('success', 'Double authentification désactivée')
    response.redirect().toRoute('admin.security')
  }
}
