import type { HttpContext } from '@adonisjs/core/http'
import ContactMessage from '#models/contact_message'
import ContactMessageReceived from '#events/contact_message_received'
import SeoService from '#services/seo_service'
import { contactValidator } from '#validators/contact'
import { localePath, type Locale } from '#types/i18n'

export default class ContactController {
  async show({ inertia, i18n }: HttpContext) {
    const locale = i18n.locale as Locale

    return inertia.render('contact', {
      labels: {
        title: i18n.t('messages.contact.title'),
        intro: i18n.t('messages.contact.intro'),
        name: i18n.t('messages.contact.name'),
        email: i18n.t('messages.contact.email'),
        message: i18n.t('messages.contact.message'),
        submit: i18n.t('messages.contact.submit'),
        privacy: i18n.t('messages.contact.privacy'),
      },
      meta: SeoService.build({
        title: i18n.t('messages.contact.title'),
        description: i18n.t('messages.contact.intro'),
        locale,
        path: localePath(locale, '/contact'),
        alternates: { fr: '/contact', en: '/en/contact' },
      }),
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

    const contactMessage = await ContactMessage.create({ name, email, body: message })

    /**
     * Not awaited: the notification must never delay or fail the
     * response, the message is already stored at this point.
     */
    void ContactMessageReceived.dispatch(contactMessage)

    session.flash('success', i18n.t('messages.contact.sent'))
    response.redirect().back()
  }
}
