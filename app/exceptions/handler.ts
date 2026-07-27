import app from '@adonisjs/core/services/app'
import i18nManager from '@adonisjs/i18n/services/main'
import { type HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import type { StatusPageRange, StatusPageRenderer } from '@adonisjs/core/types/http'
import { localeFromPath } from '#types/i18n'

function isUniqueViolation(error: unknown): error is { code: string; detail?: string } {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === '23505'
}

/**
 * Title and home link of an error page, in the locale the visited URL
 * asked for.
 */
function errorLabels(ctx: HttpContext, key: 'notFound' | 'gone' | 'server') {
  const locale = localeFromPath(ctx.request.url())
  const i18n = ctx.i18n ?? i18nManager.locale(locale)

  return {
    locale,
    labels: {
      title: i18n.t(`messages.errors.${key}`),
      backHome: i18n.t('messages.errors.backHome'),
    },
  }
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

  /**
   * Status pages is a collection of error code range and a callback
   * to return the HTML contents to send as a response.
   *
   * An unknown URL never reaches the router, so no i18n instance is
   * attached to the context: the locale is read back from the path.
   *
   * A server error keeps its stack trace outside production, where the
   * absent range lets the debug renderer take over.
   */
  protected statusPages: Record<StatusPageRange, StatusPageRenderer> = {
    '404': (_, ctx) => ctx.inertia.render('errors/not_found', errorLabels(ctx, 'notFound')),
    '410': (_, ctx) => ctx.inertia.render('errors/gone', errorLabels(ctx, 'gone')),
    ...(app.inProduction
      ? {
          '500..599': (_: unknown, ctx: HttpContext) =>
            ctx.inertia.render('errors/server_error', errorLabels(ctx, 'server')),
        }
      : {}),
  }

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
