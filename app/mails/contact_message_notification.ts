import env from '#start/env'
import type ContactMessage from '#models/contact_message'
import { BaseMail } from '@adonisjs/mail'

/**
 * Notifies the site owner when a contact message lands. Sending is
 * disabled until a recipient is configured, so local development and
 * the test suite stay offline.
 */
export default class ContactMessageNotification extends BaseMail {
  static get enabled() {
    return Boolean(env.get('CONTACT_NOTIFICATION_EMAIL'))
  }

  constructor(private contactMessage: ContactMessage) {
    super()
  }

  prepare() {
    const { name, email, body } = this.contactMessage
    /**
     * Line breaks are stripped from the fields reused in headers so a
     * visitor cannot forge extra ones.
     */
    const singleLine = (value: string) => value.replace(/[\r\n]+/g, ' ')

    this.message
      .to(env.get('CONTACT_NOTIFICATION_EMAIL')!)
      .replyTo(email, singleLine(name))
      .subject(`Nouveau message de ${singleLine(name)}`)
      .text(
        [
          `De : ${singleLine(name)} <${singleLine(email)}>`,
          '',
          body,
          '',
          `— ${env.get('APP_URL')}/admin/messages`,
        ].join('\n')
      )
  }
}
