import { inject } from '@adonisjs/core'
import { ContactMessageRepository } from '#contact/repositories/contact_message_repository'
import { err, ok, type Result } from '#core/result'
import type { MessageNotFoundError } from '#contact/actions/toggle_message_read'

export type DeleteContactMessageResult = Result<null, MessageNotFoundError>

@inject()
export class DeleteContactMessage {
  constructor(private readonly messages: ContactMessageRepository) {}

  async execute(id: number): Promise<DeleteContactMessageResult> {
    const message = await this.messages.findById(id)

    if (!message) {
      return err({ type: 'message_not_found' })
    }

    await this.messages.delete(message)

    return ok(null)
  }
}
