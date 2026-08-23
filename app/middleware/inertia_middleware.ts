import BaseInertiaMiddleware from '@adonisjs/inertia/inertia_middleware'
import { DateTime } from 'luxon'
import UserTransformer from '#app/identity/transformers/user_transformer'
import ContactMessage from '#contact/models/contact_message'
import { type Locale, toLocale } from '#types/i18n'
import en from '../../resources/lang/en/messages.json' with { type: 'json' }
import fr from '../../resources/lang/fr/messages.json' with { type: 'json' }
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

const MESSAGES = { fr, en } satisfies Record<Locale, typeof fr>

export default class InertiaMiddleware extends BaseInertiaMiddleware {
  share(ctx: HttpContext) {
    /**
     * The share method is called everytime an Inertia page is rendered. In
     * certain cases, a page may get rendered before the session middleware
     * or the auth middleware are executed. For example: During a 404 request.
     *
     * In that case, we must always assume that HttpContext is not fully hydrated
     * with all the properties
     */
    const { auth }: Partial<HttpContext> = ctx
    const locale = toLocale(ctx.i18n.locale)

    /**
     * Data shared with all Inertia pages. Make sure you are using
     * transformers for rich data-types like Models.
     */
    return {
      errors: ctx.inertia.always(this.getValidationErrors(ctx)),
      user: ctx.inertia.always(auth?.user ? UserTransformer.transform(auth.user) : undefined),
      locale: ctx.inertia.always(locale),
      year: ctx.inertia.always(DateTime.now().year),
      messages: ctx.inertia.once(() => MESSAGES[locale], { key: `messages.${locale}` }),
      /**
       * Unread contact messages, displayed as a badge in the admin
       * sidebar. Only computed for authenticated (admin) requests.
       */
      unreadMessages: async () => {
        if (!auth?.user) {
          return undefined
        }
        const row = await ContactMessage.query()
          .whereNull('read_at')
          .count('* as total')
          .firstOrFail()
        return Number(row.$extras.total)
      },
    }
  }

  /**
   * Flash bag of the current response. Like the shared props, it may be
   * built before the session middleware ran, so nothing is assumed to
   * be hydrated on the context.
   */
  flash(ctx: HttpContext) {
    const { session }: Partial<HttpContext> = ctx
    const success: string | undefined = session?.flashMessages.get('success')
    const error: string | undefined = session?.flashMessages.get('error')

    return { success, error }
  }

  async handle(ctx: HttpContext, next: NextFn) {
    await this.init(ctx)

    const output = await next()
    this.dispose(ctx)

    return output
  }
}

declare module '@adonisjs/inertia/types' {
  type MiddlewareSharedProps = InferSharedProps<InertiaMiddleware>
  export interface SharedProps extends MiddlewareSharedProps {}
}
