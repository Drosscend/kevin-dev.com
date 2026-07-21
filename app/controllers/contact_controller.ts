import type { HttpContext } from '@adonisjs/core/http'
import ContactMessage from '#models/contact_message'
import TelegramService from '#services/telegram_service'
import { contactValidator } from '#validators/contact'
import type { Locale } from '#types/i18n'

export default class ContactController {
  async show({ inertia, i18n }: HttpContext) {
    const locale = i18n.locale as Locale

    return inertia.render('contact', {
      locale,
      labels: {
        title: i18n.t('messages.contact.title'),
        intro: i18n.t('messages.contact.intro'),
        name: i18n.t('messages.contact.name'),
        email: i18n.t('messages.contact.email'),
        message: i18n.t('messages.contact.message'),
        submit: i18n.t('messages.contact.submit'),
      },
    })
  }

  async store({ request, response, session, i18n }: HttpContext) {
    /**
     * Honeypot: the "website" field is invisible to humans. When a
     * bot fills it, pretend everything went fine and store nothing.
     */
    if (request.input('website')) {
      session.flash('success', i18n.t('messages.contact.sent'))
      return response.redirect().back()
    }

    const { name, email, message } = await request.validateUsing(contactValidator)

    await ContactMessage.create({ name, email, body: message })

    TelegramService.notifyInBackground(
      `📬 Nouveau message sur kevin-dev.com\n\nDe : ${name} <${email}>\n\n${message.slice(0, 500)}`
    )

    session.flash('success', i18n.t('messages.contact.sent'))
    response.redirect().back()
  }
}
