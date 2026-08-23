import SeoService from '#app/shared/seo_service'
import Settings from '#pages/repositories/settings_repository'
import { localePath, toLocale } from '#types/i18n'
import type { HttpContext } from '@adonisjs/core/http'

export default class LegalController {
  async render({ inertia, i18n }: HttpContext) {
    const locale = toLocale(i18n.locale)
    const settings = await Settings.getMany(['legal_html_fr', 'legal_html_en'])

    return inertia.render('legal', {
      contentHtml: locale === 'en' ? settings.legal_html_en : settings.legal_html_fr,
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
