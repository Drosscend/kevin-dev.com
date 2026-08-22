import { inject } from '@adonisjs/core'
import mail from '@adonisjs/mail/services/main'
import ContactMessageNotification from '#contact/mails/contact_message_notification'
import { ContactMessageRepository } from '#contact/repositories/contact_message_repository'

export interface SubmitContactMessageParams {
  name: string
  email: string
  message: string
}

@inject()
export class SubmitContactMessage {
  constructor(private readonly messages: ContactMessageRepository) {}

  async execute(params: SubmitContactMessageParams) {
    const message = await this.messages.create({
      name: params.name,
      email: params.email,
      body: params.message,
    })

    /**
     * Queued: delivery must never delay or fail the response, the
     * message is already stored at this point.
     */
    if (ContactMessageNotification.enabled) {
      await mail.sendLater(new ContactMessageNotification(message))
    }

    return message
  }
}
