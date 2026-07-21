import { BaseEvent } from '@adonisjs/core/events'
import type ContactMessage from '#models/contact_message'

export default class ContactMessageReceived extends BaseEvent {
  constructor(public message: ContactMessage) {
    super()
  }
}
