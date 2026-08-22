import { inject } from '@adonisjs/core'
import vine from '@vinejs/vine'
import { RECOVERY_CODES_FLASH_KEY, TOTP_SETUP_KEY } from '#app/identity/session_keys'
import { EnableTotp } from '#identity/actions/enable_totp'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class EnableTotpController {
  static readonly validator = vine.create({
    code: vine
      .string()
      .fixedLength(6)
      .regex(/^\d{6}$/),
  })

  constructor(private readonly enableTotp: EnableTotp) {}

  async execute({ request, auth, session, response }: HttpContext) {
    const secret = session.get(TOTP_SETUP_KEY)

    if (!secret) {
      return response.redirect().toRoute('admin.security')
    }

    const { code } = await request.validateUsing(EnableTotpController.validator)
    const result = await this.enableTotp.execute({ user: auth.getUserOrFail(), secret, code })

    if (!result.ok) {
      session.flash('errors', { code: ['Code invalide, réessayez'] })
      return response.redirect().back()
    }

    session.forget(TOTP_SETUP_KEY)
    session.flash(RECOVERY_CODES_FLASH_KEY, result.value)
    session.flash('success', 'Double authentification activée')
    return response.redirect().toRoute('admin.security')
  }
}
