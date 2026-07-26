import type { HttpContext } from '@adonisjs/core/http'
import LlmsService, { MARKDOWN_CONTENT_TYPE } from '#services/llms_service'
import type { Locale } from '#types/i18n'

/**
 * Markdown endpoints for LLM consumers: /llms.txt indexes the
 * published content; the .md variants of blog and portfolio pages
 * are dispatched from their regular controllers.
 */
export default class LlmsController {
  async index({ response }: HttpContext) {
    response.header('content-type', MARKDOWN_CONTENT_TYPE)
    return LlmsService.index()
  }

  async cv({ response, i18n }: HttpContext) {
    const markdown = await LlmsService.settingsMarkdown('cv', i18n.locale as Locale)
    if (!markdown) {
      return response.notFound('Not found')
    }
    response.header('content-type', MARKDOWN_CONTENT_TYPE)
    return markdown
  }

  async legal({ response, i18n }: HttpContext) {
    const markdown = await LlmsService.settingsMarkdown('legal', i18n.locale as Locale)
    if (!markdown) {
      return response.notFound('Not found')
    }
    response.header('content-type', MARKDOWN_CONTENT_TYPE)
    return markdown
  }
}
