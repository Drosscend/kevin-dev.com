import { inject } from '@adonisjs/core'
import { pickerDateTime } from '#app/shared/date_format'
import { ContactMessagesQuery } from '#contact/queries/contact_messages_query'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class MessagesController {
  constructor(private readonly contactMessages: ContactMessagesQuery) {}

  async render({ inertia }: HttpContext) {
    const messages = await this.contactMessages.execute()

    return inertia.render('admin/messages', {
      messages: messages.map((message) => ({
        ...message,
        // Raw value: the admin formats every date through one helper,
        // so a message reads like a publication date.
        createdAt: pickerDateTime(message.createdAt),
      })),
    })
  }
}
