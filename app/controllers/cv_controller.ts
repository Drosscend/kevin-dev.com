import { existsSync } from 'node:fs'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import SettingsService from '#services/settings_service'
import type { Locale } from '#types/i18n'

export const CV_PDF_PATH = () => app.makePath('storage', 'cv', 'cv.pdf')

export default class CvController {
  async show({ inertia, i18n }: HttpContext) {
    const locale = i18n.locale as Locale
    const settings = await SettingsService.getMany(['cv_html_fr', 'cv_html_en'])
    const contentHtml = locale === 'en' ? settings.cv_html_en : settings.cv_html_fr

    return inertia.render('cv', {
      locale,
      contentHtml,
      pdfAvailable: existsSync(CV_PDF_PATH()),
      labels: {
        title: i18n.t('messages.cv.title'),
        download: i18n.t('messages.cv.download'),
        empty: i18n.t('messages.cv.empty'),
      },
    })
  }

  async pdf({ response }: HttpContext) {
    const path = CV_PDF_PATH()
    if (!existsSync(path)) {
      return response.notFound('Not found')
    }

    response.header('content-disposition', 'attachment; filename="CV-Kevin-Veronesi.pdf"')
    return response.download(path)
  }
}
