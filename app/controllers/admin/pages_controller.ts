import type { HttpContext } from '@adonisjs/core/http'
import drive from '@adonisjs/drive/services/main'
import SettingsService from '#services/settings_service'
import MarkdownService from '#services/markdown_service'
import { pagesValidator } from '#validators/contact'
import { CV_PDF_KEY } from '#controllers/cv_controller'

/**
 * Renders and stores a settings-backed markdown page in one locale.
 * An empty markdown clears both the source and the rendered HTML.
 */
async function savePage(prefix: 'cv' | 'legal', locale: 'fr' | 'en', markdown: string) {
  await SettingsService.set(`${prefix}_markdown_${locale}`, markdown)
  await SettingsService.set(
    `${prefix}_html_${locale}`,
    markdown.trim() === '' ? '' : await MarkdownService.render(markdown)
  )
}

export default class PagesController {
  async show({ inertia }: HttpContext) {
    const settings = await SettingsService.getMany([
      'cv_markdown_fr',
      'cv_markdown_en',
      'legal_markdown_fr',
      'legal_markdown_en',
    ])

    const disk = drive.use()
    let pdf: { size: number } | null = null
    if (await disk.exists(CV_PDF_KEY)) {
      const metadata = await disk.getMetaData(CV_PDF_KEY)
      pdf = { size: metadata.contentLength }
    }

    return inertia.render('admin/pages', {
      cvFr: settings.cv_markdown_fr,
      cvEn: settings.cv_markdown_en,
      legalFr: settings.legal_markdown_fr,
      legalEn: settings.legal_markdown_en,
      pdf,
    })
  }

  async update({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(pagesValidator)

    await savePage('cv', 'fr', payload.cvFr ?? '')
    await savePage('cv', 'en', payload.cvEn ?? '')
    await savePage('legal', 'fr', payload.legalFr ?? '')
    await savePage('legal', 'en', payload.legalEn ?? '')

    session.flash('success', 'Pages enregistrées')
    response.redirect().toRoute('admin.pages')
  }

  async uploadPdf({ request, response, session }: HttpContext) {
    const file = request.file('pdf', { size: '10mb', extnames: ['pdf'] })

    if (!file || !file.isValid) {
      session.flash('errors', {
        pdf: file?.errors.map((error) => error.message) ?? ['Fichier requis'],
      })
      return response.redirect().back()
    }

    await file.moveToDisk(CV_PDF_KEY)

    session.flash('success', 'CV PDF mis à jour')
    response.redirect().toRoute('admin.pages')
  }
}
