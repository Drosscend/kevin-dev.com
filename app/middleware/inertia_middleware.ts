import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import UserTransformer from '#transformers/user_transformer'
import BaseInertiaMiddleware from '@adonisjs/inertia/inertia_middleware'
import ContactMessage from '#models/contact_message'
import { DEFAULT_LOCALE, type Locale } from '#types/i18n'

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
    const { auth, i18n } = ctx as Partial<HttpContext>

    /**
     * Data shared with all Inertia pages. Make sure you are using
     * transformers for rich data-types like Models.
     */
    return {
      errors: ctx.inertia.always(this.getValidationErrors(ctx)),
      user: ctx.inertia.always(auth?.user ? UserTransformer.transform(auth.user) : undefined),
      locale: ctx.inertia.always((i18n?.locale as Locale | undefined) ?? DEFAULT_LOCALE),
      /**
       * Labels of the header, footer and window controls. They live in the
       * layout, which no controller feeds, so they travel with every page.
       */
      chrome: ctx.inertia.always({
        projects: i18n?.t('messages.nav.projects') ?? 'Projets',
        blog: i18n?.t('messages.nav.blog') ?? 'Blog',
        talks: i18n?.t('messages.nav.talks') ?? 'Interventions',
        cv: i18n?.t('messages.nav.cv') ?? 'CV',
        technologies: i18n?.t('messages.nav.technologies') ?? 'Technos',
        contact: i18n?.t('messages.nav.contact') ?? 'Contact',
        legal: i18n?.t('messages.nav.legal') ?? 'Mentions légales',
        primary: i18n?.t('messages.nav.primary') ?? 'Navigation principale',
        secondary: i18n?.t('messages.nav.secondary') ?? 'Navigation secondaire',
        openMenu: i18n?.t('messages.nav.openMenu') ?? 'Ouvrir le menu',
        closeMenu: i18n?.t('messages.nav.closeMenu') ?? 'Fermer le menu',
        theme: i18n?.t('messages.nav.theme') ?? 'Basculer le thème clair ou sombre',
      }),
      /**
       * Labels of the image viewer. It hangs off the article body, which
       * several pages render without a controller of their own, so like
       * the layout chrome it travels with every page.
       */
      lightbox: ctx.inertia.always({
        open: i18n?.t('messages.lightbox.open') ?? "Agrandir l'image",
        viewer: i18n?.t('messages.lightbox.viewer') ?? "Visionneuse d'images",
        close: i18n?.t('messages.lightbox.close') ?? 'Fermer',
        previous: i18n?.t('messages.lightbox.previous') ?? 'Image précédente',
        next: i18n?.t('messages.lightbox.next') ?? 'Image suivante',
        zoomIn: i18n?.t('messages.lightbox.zoomIn') ?? 'Zoom avant',
        zoomOut: i18n?.t('messages.lightbox.zoomOut') ?? 'Zoom arrière',
        reset: i18n?.t('messages.lightbox.reset') ?? "Taille d'origine",
        hintClose: i18n?.t('messages.lightbox.hintClose') ?? 'fermer',
        hintNavigate: i18n?.t('messages.lightbox.hintNavigate') ?? 'naviguer',
        hintZoom: i18n?.t('messages.lightbox.hintZoom') ?? 'zoomer',
        hintReset: i18n?.t('messages.lightbox.hintReset') ?? 'ajuster',
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
