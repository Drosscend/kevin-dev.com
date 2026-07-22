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
    const { session, auth, i18n } = ctx as Partial<HttpContext>

    /**
     * Fetching the first error from the flash messages
     */
    const error = session?.flashMessages.get('error') as string
    const success = session?.flashMessages.get('success') as string

    /**
     * Data shared with all Inertia pages. Make sure you are using
     * transformers for rich data-types like Models.
     */
    return {
      errors: ctx.inertia.always(this.getValidationErrors(ctx)),
      flash: ctx.inertia.always({
        error,
        success,
      }),
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
