import i18nManager from '@adonisjs/i18n/services/main'
import BaseInertiaMiddleware from '@adonisjs/inertia/inertia_middleware'
import UserTransformer from '#app/identity/transformers/user_transformer'
import ContactMessage from '#contact/models/contact_message'
import type { Locale } from '#types/i18n'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

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
    const { auth } = ctx as Partial<HttpContext>
    const { i18n } = ctx
    const otherLocale = i18nManager.locale(i18n.locale === 'fr' ? 'en' : 'fr')

    /**
     * Data shared with all Inertia pages. Make sure you are using
     * transformers for rich data-types like Models.
     */
    return {
      errors: ctx.inertia.always(this.getValidationErrors(ctx)),
      user: ctx.inertia.always(auth?.user ? UserTransformer.transform(auth.user) : undefined),
      locale: ctx.inertia.always(i18n.locale as Locale),
      /**
       * Labels of the header, footer and window controls. They live in the
       * layout, which no controller feeds, so they travel with every page.
       */
      chrome: ctx.inertia.always({
        projects: i18n.t('messages.nav.projects'),
        blog: i18n.t('messages.nav.blog'),
        talks: i18n.t('messages.nav.talks'),
        cv: i18n.t('messages.nav.cv'),
        technologies: i18n.t('messages.nav.technologies'),
        contact: i18n.t('messages.nav.contact'),
        legal: i18n.t('messages.nav.legal'),
        primary: i18n.t('messages.nav.primary'),
        secondary: i18n.t('messages.nav.secondary'),
        openMenu: i18n.t('messages.nav.openMenu'),
        closeMenu: i18n.t('messages.nav.closeMenu'),
        theme: i18n.t('messages.nav.theme'),
        otherLanguage: otherLocale.t('messages.nav.otherLanguage'),
        otherLanguageDismiss: otherLocale.t('messages.nav.otherLanguageDismiss'),
      }),
      /**
       * Labels of the image viewer. It hangs off the article body, which
       * several pages render without a controller of their own, so like
       * the layout chrome it travels with every page.
       */
      lightbox: ctx.inertia.always({
        open: i18n.t('messages.lightbox.open'),
        viewer: i18n.t('messages.lightbox.viewer'),
        close: i18n.t('messages.lightbox.close'),
        previous: i18n.t('messages.lightbox.previous'),
        next: i18n.t('messages.lightbox.next'),
        zoomIn: i18n.t('messages.lightbox.zoomIn'),
        zoomOut: i18n.t('messages.lightbox.zoomOut'),
        reset: i18n.t('messages.lightbox.reset'),
        hintClose: i18n.t('messages.lightbox.hintClose'),
        hintNavigate: i18n.t('messages.lightbox.hintNavigate'),
        hintZoom: i18n.t('messages.lightbox.hintZoom'),
        hintReset: i18n.t('messages.lightbox.hintReset'),
      }),
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
    const { session } = ctx as Partial<HttpContext>

    return {
      success: session?.flashMessages.get('success') as string | undefined,
      error: session?.flashMessages.get('error') as string | undefined,
    }
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
