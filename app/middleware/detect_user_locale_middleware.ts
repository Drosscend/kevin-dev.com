import { type HttpContext, RequestValidator } from '@adonisjs/core/http'
import { I18n } from '@adonisjs/i18n'
import i18nManager from '@adonisjs/i18n/services/main'
import { localeFromPath } from '#types/i18n'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * The "DetectUserLocaleMiddleware" middleware uses i18n service to share
 * a request specific i18n object with the HTTP Context
 */
export default class DetectUserLocaleMiddleware {
  /**
   * Using i18n for validation messages. Applicable to only
   * "request.validateUsing" method calls
   */
  static {
    RequestValidator.messagesProvider = (ctx) => {
      return ctx.i18n.createMessagesProvider()
    }
  }

  /**
   * The locale is carried by the URL: "/en/..." serves English,
   * everything else serves French (the default locale).
   */
  protected getRequestLocale(ctx: HttpContext) {
    return localeFromPath(ctx.request.url())
  }

  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Finding user language
     */
    const language = this.getRequestLocale(ctx)

    /**
     * Assigning i18n property to the HTTP context
     */
    ctx.i18n = i18nManager.locale(language || i18nManager.defaultLocale)

    /**
     * Binding I18n class to the request specific instance of it.
     * Doing so will allow IoC container to resolve an instance
     * of request specific i18n object when I18n class is
     * injected somewhere.
     */
    ctx.containerResolver.bindValue(I18n, ctx.i18n)

    /**
     * Sharing request specific instance of i18n with edge
     * templates.
     *
     * Remove the following block of code, if you are not using
     * edge templates.
     */
    if ('view' in ctx) {
      ctx.view.share({ i18n: ctx.i18n })
    }

    return next()
  }
}

/**
 * Notify TypeScript about i18n property
 */
declare module '@adonisjs/core/http' {
  export interface HttpContext {
    i18n: I18n
  }
}
