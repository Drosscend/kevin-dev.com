import { inject } from '@adonisjs/core'
import vine from '@vinejs/vine'
import { TOTP_PENDING_KEY } from '#app/identity/session_keys'
import { VerifyUserCredentials } from '#identity/actions/verify_user_credentials'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class LoginController {
  static readonly validator = vine.create({
    email: vine.string().email().maxLength(254),
    password: vine.string().minLength(8).maxLength(72),
  })

  constructor(private readonly verifyUserCredentials: VerifyUserCredentials) {}

  render({ inertia }: HttpContext) {
    return inertia.render('auth/login', {})
  }

  async execute({ request, auth, response, session }: HttpContext) {
    const params = await request.validateUsing(LoginController.validator)
    const result = await this.verifyUserCredentials.execute(params)

    if (!result.ok) {
      session.flash('errors', { email: ['Identifiants invalides'] })
      return response.redirect().back()
    }

    if (result.value.totpEnabled) {
      session.put(TOTP_PENDING_KEY, result.value.id)
      return response.redirect().toRoute('admin.totp')
    }

    await auth.use('web').login(result.value)
    return response.redirect().toRoute('admin.dashboard')
  }
}
