import { ContactMessageSchema } from '#database/schema'

export default class ContactMessage extends ContactMessageSchema {
  get isRead() {
    return this.readAt !== null
  }
}
