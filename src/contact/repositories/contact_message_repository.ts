import { DateTime } from 'luxon'
import ContactMessage from '#contact/models/contact_message'

export interface CreateContactMessagePayload {
  name: string
  email: string
  body: string
}

export class ContactMessageRepository {
  async findById(id: number) {
    return ContactMessage.find(id)
  }

  async create(payload: CreateContactMessagePayload) {
    return ContactMessage.create(payload)
  }

  async markRead(message: ContactMessage, read: boolean) {
    message.readAt = read ? DateTime.now() : null
    await message.save()
  }

  async delete(message: ContactMessage) {
    await message.delete()
  }
}
