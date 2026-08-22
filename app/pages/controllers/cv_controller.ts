import drive from '@adonisjs/drive/services/main'
import SeoService from '#app/shared/seo_service'
import { CV_PDF_KEY } from '#pages/cv_document'
import Settings from '#pages/repositories/settings_repository'
import { localePath, type Locale } from '#types/i18n'
import type { HttpContext } from '@adonisjs/core/http'

export default class CvController {
  async render({ inertia, i18n }: HttpContext) {
    const locale = i18n.locale as Locale
    const settings = await Settings.getMany(['cv_html_fr', 'cv_html_en'])

    return inertia.render('cv', {
      contentHtml: locale === 'en' ? settings.cv_html_en : settings.cv_html_fr,
      pdfAvailable: await drive.use().exists(CV_PDF_KEY),
      labels: {
        title: i18n.t('messages.cv.title'),
        download: i18n.t('messages.cv.download'),
        empty: i18n.t('messages.cv.empty'),
      },
      meta: SeoService.build({
        title: i18n.t('messages.cv.title'),
        description: i18n.t('messages.cv.metaDescription'),
        locale,
        path: localePath(locale, '/cv'),
        alternates: settings.cv_html_en ? { fr: '/cv', en: '/en/cv' } : null,
        jsonLd: [SeoService.person(i18n.t('messages.home.jobTitle'))],
      }),
    })
  }
}
