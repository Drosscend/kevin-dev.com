import { toDataURL } from 'qrcode'
import { RECOVERY_CODES_FLASH_KEY, TOTP_SETUP_KEY } from '#app/identity/session_keys'
import RecoveryCodes from '#identity/domain/recovery_codes'
import Totp from '#identity/domain/totp'
import type { HttpContext } from '@adonisjs/core/http'

export default class SecurityController {
  /**
   * Security page. It offers enrollment while 2FA is inactive: the
   * candidate secret waits in the session, and freshly issued recovery
   * codes travel through a flash message so they show exactly once.
   */
  async render({ inertia, auth, session }: HttpContext) {
    const user = auth.getUserOrFail()

    if (user.totpEnabled) {
      return inertia.render('admin/security', {
        totpEnabled: true,
        qrCode: null,
        secret: null,
        recoveryCodes: (session.flashMessages.get(RECOVERY_CODES_FLASH_KEY) as string[]) ?? null,
        recoveryCodesRemaining: RecoveryCodes.count(user.recoveryCodes),
      })
    }

    let secret = session.get(TOTP_SETUP_KEY)
    if (!secret) {
      secret = Totp.generateSecret()
      session.put(TOTP_SETUP_KEY, secret)
    }

    return inertia.render('admin/security', {
      totpEnabled: false,
      qrCode: await toDataURL(Totp.uri(user.email, secret)),
      secret,
      recoveryCodes: null,
      recoveryCodesRemaining: 0,
    })
  }
}
