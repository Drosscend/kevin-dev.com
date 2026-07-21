import env from '#start/env'
import logger from '@adonisjs/core/services/logger'

/**
 * Sends notifications through the Telegram Bot API. Disabled when
 * the bot token or chat id is not configured. Failures are logged
 * and never propagate: a Telegram outage must not affect the
 * caller (the contact message is already stored at that point).
 */
export default class TelegramService {
  static get enabled() {
    return Boolean(env.get('TELEGRAM_BOT_TOKEN') && env.get('TELEGRAM_CHAT_ID'))
  }

  static async send(text: string) {
    if (!this.enabled) {
      return
    }

    try {
      const token = env.get('TELEGRAM_BOT_TOKEN')
      const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: env.get('TELEGRAM_CHAT_ID'), text }),
        signal: AbortSignal.timeout(10_000),
      })
      if (!response.ok) {
        logger.error({ status: response.status }, 'Telegram notification failed')
      }
    } catch (error) {
      logger.error({ err: error }, 'Telegram notification failed')
    }
  }

  /**
   * Fire-and-forget variant: schedules the call without making the
   * caller wait for the Telegram API.
   */
  static notifyInBackground(text: string) {
    void this.send(text)
  }
}
