import { inject } from '@adonisjs/core'
import { ContactMessageRepository } from '#contact/repositories/contact_message_repository'
import { err, ok, type Result } from '#core/result'

export interface MessageNotFoundError {
  type: 'message_not_found'
}

export type ToggleMessageReadResult = Result<{ isRead: boolean }, MessageNotFoundError>

@inject()
export class ToggleMessageRead {
  constructor(private readonly messages: ContactMessageRepository) {}

  async execute(id: number): Promise<ToggleMessageReadResult> {
    const message = await this.messages.findById(id)

    if (!message) {
      return err({ type: 'message_not_found' })
    }

    await this.messages.markRead(message, !message.isRead)

    return ok({ isRead: message.isRead })
  }
}
