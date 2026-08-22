import { inject } from '@adonisjs/core'
import { ToggleMessageRead } from '#contact/actions/toggle_message_read'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ToggleMessageReadController {
  constructor(private readonly toggleMessageRead: ToggleMessageRead) {}

  async execute({ params, response, session }: HttpContext) {
    const result = await this.toggleMessageRead.execute(params.id)

    if (!result.ok) {
      return response.notFound()
    }

    session.flash(
      'success',
      result.value.isRead ? 'Message marqué comme lu' : 'Message marqué non lu'
    )
    return response.redirect().toRoute('admin.messages.index')
  }
}
