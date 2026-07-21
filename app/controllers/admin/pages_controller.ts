import { existsSync, statSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'
import type { HttpContext } from '@adonisjs/core/http'
import SettingsService from '#services/settings_service'
import MarkdownService from '#services/markdown_service'
import { pagesValidator } from '#validators/contact'
import { CV_PDF_PATH } from '#controllers/cv_controller'

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

    const pdfPath = CV_PDF_PATH()
    const pdfExists = existsSync(pdfPath)

    return inertia.render('admin/pages', {
      cvFr: settings.cv_markdown_fr,
      cvEn: settings.cv_markdown_en,
      legalFr: settings.legal_markdown_fr,
      legalEn: settings.legal_markdown_en,
      pdf: pdfExists
        ? {
            size: statSync(pdfPath).size,
            updatedAt: statSync(pdfPath).mtime.toISOString(),
          }
        : null,
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

    const path = CV_PDF_PATH()
    await mkdir(dirname(path), { recursive: true })
    await file.move(dirname(path), { name: 'cv.pdf', overwrite: true })

    session.flash('success', 'CV PDF mis à jour')
    response.redirect().toRoute('admin.pages')
  }
}
