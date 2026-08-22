import { inject } from '@adonisjs/core'
import vine from '@vinejs/vine'
import SeoService from '#app/shared/seo_service'
import { SubmitContactMessage } from '#contact/actions/submit_contact_message'
import { localePath, toLocale } from '#types/i18n'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ContactController {
  static readonly validator = vine.create({
    name: vine.string().trim().minLength(2).maxLength(100),
    email: vine.string().trim().email().maxLength(254),
    message: vine.string().trim().minLength(10).maxLength(5000),
  })

  constructor(private readonly submitContactMessage: SubmitContactMessage) {}

  render({ inertia, i18n }: HttpContext) {
    const locale = toLocale(i18n.locale)

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

  async execute({ request, response, session, i18n }: HttpContext) {
    /**
     * Honeypot: the "website" field is invisible to humans. When a
     * bot fills it, pretend everything went fine and store nothing.
     */
    if (request.input('website')) {
      session.flash('success', i18n.t('messages.contact.sent'))
      return response.redirect().back()
    }

    const params = await request.validateUsing(ContactController.validator)
    await this.submitContactMessage.execute(params)

    session.flash('success', i18n.t('messages.contact.sent'))
    return response.redirect().back()
  }
}
