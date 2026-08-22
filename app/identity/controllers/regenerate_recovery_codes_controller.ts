import { inject } from '@adonisjs/core'
import vine from '@vinejs/vine'
import { RECOVERY_CODES_FLASH_KEY } from '#app/identity/session_keys'
import { RegenerateRecoveryCodes } from '#identity/actions/regenerate_recovery_codes'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class RegenerateRecoveryCodesController {
  static readonly validator = vine.create({
    code: vine
      .string()
      .fixedLength(6)
      .regex(/^\d{6}$/),
  })

  constructor(private readonly regenerateRecoveryCodes: RegenerateRecoveryCodes) {}

  async execute({ request, auth, session, response }: HttpContext) {
    const { code } = await request.validateUsing(RegenerateRecoveryCodesController.validator)
    const result = await this.regenerateRecoveryCodes.execute({
      user: auth.getUserOrFail(),
      code,
    })

    if (!result.ok) {
      session.flash('errors', { recoveryCode: ['Code invalide, réessayez'] })
      return response.redirect().back()
    }

    session.flash(RECOVERY_CODES_FLASH_KEY, result.value)
    session.flash('success', 'Nouveaux codes de secours générés')
    return response.redirect().toRoute('admin.security')
  }
}
