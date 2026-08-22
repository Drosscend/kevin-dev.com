import { inject } from '@adonisjs/core'
import { DeleteContactMessage } from '#contact/actions/delete_contact_message'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class DeleteMessageController {
  constructor(private readonly deleteContactMessage: DeleteContactMessage) {}

  async execute({ params, response, session }: HttpContext) {
    const result = await this.deleteContactMessage.execute(params.id)

    if (!result.ok) {
      return response.notFound()
    }

    session.flash('success', 'Message supprimé')
    return response.redirect().toRoute('admin.messages.index')
  }
}
