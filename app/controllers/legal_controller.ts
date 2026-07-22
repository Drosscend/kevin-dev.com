import type { HttpContext } from '@adonisjs/core/http'
import SettingsService from '#services/settings_service'
import SeoService from '#services/seo_service'
import { localePath, type Locale } from '#types/i18n'

export default class LegalController {
  async show({ inertia, i18n }: HttpContext) {
    const locale = i18n.locale as Locale
    const settings = await SettingsService.getMany(['legal_html_fr', 'legal_html_en'])

    return inertia.render('legal', {
      contentHtml: locale === 'en' ? settings.legal_html_en : settings.legal_html_fr,
      labels: {
        title: i18n.t('messages.legal.title'),
        empty: i18n.t('messages.legal.empty'),
      },
      meta: SeoService.build({
        title: i18n.t('messages.legal.title'),
        description: i18n.t('messages.legal.title'),
        locale,
        path: localePath(locale, '/legal'),
        alternates: settings.legal_html_en ? { fr: '/legal', en: '/en/legal' } : null,
      }),
    })
  }
}
