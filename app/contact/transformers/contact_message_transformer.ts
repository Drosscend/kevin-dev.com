import { BaseTransformer } from '@adonisjs/core/transformers'

export interface ContactMessageRow {
  id: number
  name: string
  email: string
  body: string
  isRead: boolean
  createdAt: string | null
}

export default class ContactMessageTransformer extends BaseTransformer<ContactMessageRow> {
  toObject() {
    return this.pick(this.resource, ['id', 'name', 'email', 'body', 'isRead', 'createdAt'])
  }
}
