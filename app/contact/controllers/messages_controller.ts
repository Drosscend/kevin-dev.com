import { inject } from '@adonisjs/core'
import ContactMessageTransformer from '#app/contact/transformers/contact_message_transformer'
import { pickerDateTime } from '#app/shared/date_format'
import { ContactMessagesQuery } from '#contact/queries/contact_messages_query'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class MessagesController {
  constructor(private readonly contactMessages: ContactMessagesQuery) {}

  async render({ inertia }: HttpContext) {
    const messages = await this.contactMessages.execute()

    return inertia.render('admin/messages', {
      messages: ContactMessageTransformer.transform(
        messages.map((message) => ({
          ...message,
          createdAt: pickerDateTime(message.createdAt),
        }))
      ),
    })
  }
}
