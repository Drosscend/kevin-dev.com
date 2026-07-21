import type ContactMessageReceived from '#events/contact_message_received'
import TelegramService from '#services/telegram_service'

/**
 * Notifies Telegram when a contact message lands. Line breaks are
 * stripped from user-controlled fields so a visitor cannot forge
 * extra lines in the notification.
 */
export default class SendContactNotification {
  async handle(event: ContactMessageReceived) {
    const singleLine = (value: string) => value.replace(/[\r\n]+/g, ' ')
    const { name, email, body } = event.message

    await TelegramService.send(
      `📬 Nouveau message sur kevin-dev.com\n\nDe : ${singleLine(name)} <${singleLine(email)}>\n\n${body.slice(0, 500)}`
    )
  }
}
