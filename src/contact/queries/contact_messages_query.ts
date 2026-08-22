import { inject } from '@adonisjs/core'
import ContactMessage from '#contact/models/contact_message'
import type { DateTime } from 'luxon'

export interface ContactMessageListItem {
  id: number
  name: string
  email: string
  body: string
  isRead: boolean
  createdAt: DateTime
}

@inject()
export class ContactMessagesQuery {
  async execute(): Promise<ContactMessageListItem[]> {
    const messages = await ContactMessage.query()
      .select('id', 'name', 'email', 'body', 'read_at', 'created_at')
      .orderBy('created_at', 'desc')

    return messages.map((message) => ({
      id: message.id,
      name: message.name,
      email: message.email,
      body: message.body,
      isRead: message.isRead,
      createdAt: message.createdAt,
    }))
  }
}
