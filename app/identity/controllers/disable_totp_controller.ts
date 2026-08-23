import { inject } from '@adonisjs/core'
import vine from '@vinejs/vine'
import { flashFieldErrors } from '#app/shared/field_errors'
import { DisableTotp } from '#identity/actions/disable_totp'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class DisableTotpController {
  static readonly validator = vine.create({
    code: vine
      .string()
      .fixedLength(6)
      .regex(/^\d{6}$/),
  })

  constructor(private readonly disableTotp: DisableTotp) {}

  async execute({ request, auth, session, response }: HttpContext) {
    const { code } = await request.validateUsing(DisableTotpController.validator)
    const result = await this.disableTotp.execute({ user: auth.getUserOrFail(), code })

    if (!result.ok) {
      flashFieldErrors(session, { code: ['Code invalide, réessayez'] })
      return response.redirect().back()
    }

    session.flash('success', 'Double authentification désactivée')
    return response.redirect().toRoute('admin.security')
  }
}
