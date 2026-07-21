import type { HttpContext } from '@adonisjs/core/http'
import drive from '@adonisjs/drive/services/main'
import SettingsService from '#services/settings_service'
import SeoService from '#services/seo_service'
import type { Locale } from '#types/i18n'

export const CV_PDF_KEY = 'cv/cv.pdf'

export default class CvController {
  async show({ inertia, i18n }: HttpContext) {
    const locale = i18n.locale as Locale
    const settings = await SettingsService.getMany(['cv_html_fr', 'cv_html_en'])
    const contentHtml = locale === 'en' ? settings.cv_html_en : settings.cv_html_fr

    return inertia.render('cv', {
      locale,
      contentHtml,
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
        path: locale === 'en' ? '/en/cv' : '/cv',
        alternates: settings.cv_html_en ? { fr: '/cv', en: '/en/cv' } : null,
        jsonLd: [SeoService.person()],
      }),
    })
  }

  async pdf({ response }: HttpContext) {
    const disk = drive.use()
    if (!(await disk.exists(CV_PDF_KEY))) {
      return response.notFound('Not found')
    }

    response.header('content-type', 'application/pdf')
    response.header('content-disposition', 'attachment; filename="CV-Kevin-Veronesi.pdf"')
    return response.stream(await disk.getStream(CV_PDF_KEY))
  }
}
