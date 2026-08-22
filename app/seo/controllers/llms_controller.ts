import Llms, { MARKDOWN_CONTENT_TYPE } from '#seo/llms'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * Markdown endpoints for LLM consumers: /llms.txt indexes the
 * published content; the .md variants of blog and portfolio pages
 * are dispatched from their regular controllers.
 */
export default class LlmsController {
  async execute({ response }: HttpContext) {
    response.header('content-type', MARKDOWN_CONTENT_TYPE)

    return Llms.index()
  }
}
