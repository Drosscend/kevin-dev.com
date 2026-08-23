import { type HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import type { StatusPageRange, StatusPageRenderer } from '@adonisjs/core/types/http'

function isUniqueViolation(error: unknown): error is { code: string; detail?: string } {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === '23505'
}

/**
 * Postgres names the offending columns in the error detail, e.g.
 * "Key (slug)=(my-post) already exists.". The constraint name cannot
 * be parsed instead: table names contain underscores too, so
 * "contact_messages_email_unique" is ambiguous. Composite keys list
 * several columns and the first one is the field to point at.
 */
export function violatedField(detail: string | undefined) {
  return detail?.match(/^Key \(([^)]+)\)=/)?.[1].split(', ')[0] ?? 'slug'
}

/**
 * Status pages is a collection of error code range and a callback
 * to return the HTML contents to send as a response.
 *
 * A server error keeps its stack trace outside production, where the
 * absent range lets the debug renderer take over.
 */
const STATUS_PAGES: Record<StatusPageRange, StatusPageRenderer> = {
  '404': (_, ctx) => ctx.inertia.render('errors/not_found', {}),
  '410': (_, ctx) => ctx.inertia.render('errors/gone', {}),
}

if (app.inProduction) {
  STATUS_PAGES['500..599'] = (_, ctx) => ctx.inertia.render('errors/server_error', {})
}

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * A missing or withdrawn page is an expected outcome rather than a
   * bug, so its status page renders in development too: it is the only
   * way to see what a visitor sees.
   */
  protected renderStatusPages = true

  protected statusPages = STATUS_PAGES

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    /**
     * A unique-constraint violation that slipped past the validator
     * (concurrent write) becomes a flashed validation error instead
     * of a 500, reusing the message the validator would have shown.
     */
    if (isUniqueViolation(error) && ctx.session && ctx.request.method() !== 'GET') {
      const fallback = 'Cette valeur est déjà utilisée.'
      const field = violatedField(error.detail)
      const message =
        ctx.i18n?.t('validator.shared.messages.database.unique', {}, fallback) ?? fallback

      ctx.session.flash('errors', { [field]: [message] })
      return ctx.response.redirect().back()
    }

    return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the a third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
