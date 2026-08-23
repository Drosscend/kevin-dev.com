import { Link } from '@adonisjs/inertia/react'
import { usePage } from '@inertiajs/react'
import { MenuIcon, XIcon } from 'lucide-react'
import { type ReactNode, useEffect, useState } from 'react'
import { Toaster } from 'sonner'
import { HoverPreviewProvider } from '~/components/hover_preview'
import LanguageSuggestion from '~/components/language_suggestion'
import ThemeToggle from '~/components/theme_toggle'
import { Button } from '~/components/ui/button'
import { otherLocaleUrl, useLocalePath } from '~/lib/locale'
import { useFlashToasts } from '~/lib/use_flash_toasts'
import { cn } from '~/lib/utils'

/** Order of the header and footer links; labels come from shared props. */
const NAVIGATION = [
  { path: '/projects', label: 'projects' },
  { path: '/blog', label: 'blog' },
  { path: '/talks', label: 'talks' },
  { path: '/cv', label: 'cv' },
  { path: '/technologies', label: 'technologies' },
  { path: '/contact', label: 'contact' },
] as const

export default function Layout({ children }: { children: ReactNode }) {
  const { url, props } = usePage<{ hasOtherLocale?: boolean }>()
  const { locale, messages, year } = props
  const to = useLocalePath()
  const [menuOpen, setMenuOpen] = useState(false)
  const [renderedUrl, setRenderedUrl] = useState(url)
  const currentPath = url.split('?')[0]
  /**
   * Detail pages report whether the entry exists in the other locale;
   * listings always do, so the switch shows unless told otherwise.
   */
  const translated = props.hasOtherLocale ?? true

  useFlashToasts()

  /**
   * Closes the panel on navigation, including history moves that no
   * link click would catch.
   */
  if (url !== renderedUrl) {
    setRenderedUrl(url)
    setMenuOpen(false)
  }

  /**
   * The panel only exists below the "md" breakpoint: closing it on
   * resize keeps the scroll lock from outliving a rotation or a
   * window widened past the breakpoint.
   */
  useEffect(() => {
    if (!menuOpen) {
      return
    }

    const wide = window.matchMedia('(min-width: 48rem)')
    const close = () => setMenuOpen(false)
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
      }
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    wide.addEventListener('change', close)

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
      wide.removeEventListener('change', close)
    }
  }, [menuOpen])

  function isActive(path: string) {
    const href = to(path)
    return currentPath === href || currentPath.startsWith(`${href}/`)
  }

  return (
    <div className="flex min-h-dvh flex-col">
      {translated && (
        <LanguageSuggestion
          targetLocale={locale === 'fr' ? 'en' : 'fr'}
          href={otherLocaleUrl(locale, url)}
        />
      )}

      <header className="bg-background/85 sticky top-0 z-40 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link
            href={to('/')}
            className="font-display font-semibold tracking-tight"
          >
            Kévin Véronési
          </Link>

          <div className="flex items-center gap-1 md:gap-3">
            <nav aria-label={messages.nav.primary} className="hidden items-center gap-5 md:flex">
              {NAVIGATION.map((item) => (
                <Link
                  key={item.path}
                  href={to(item.path)}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                  className={cn(
                    'hover:text-primary text-sm transition-colors',
                    isActive(item.path) ? 'text-primary font-medium' : 'text-muted-foreground'
                  )}
                >
                  {messages.nav[item.label]}
                </Link>
              ))}
            </nav>

            {translated && (
              <Link
                href={otherLocaleUrl(locale, url)}
                className="text-muted-foreground hover:text-primary px-1.5 font-mono text-xs tracking-wider uppercase transition-colors"
              >
                {locale === 'en' ? 'FR' : 'EN'}
              </Link>
            )}

            <ThemeToggle />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-controls="mobile-navigation"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? messages.nav.closeMenu : messages.nav.openMenu}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
            </Button>
          </div>
        </div>

        {menuOpen && (
          <div
            aria-hidden
            className="fixed inset-x-0 top-16 bottom-0 z-40 bg-black/40 md:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}

        <nav
          id="mobile-navigation"
          aria-label={messages.nav.primary}
          hidden={!menuOpen}
          className="bg-background relative z-50 border-b px-6 pt-2 pb-4 md:hidden"
        >
          {NAVIGATION.map((item) => (
            <Link
              key={item.path}
              href={to(item.path)}
              aria-current={isActive(item.path) ? 'page' : undefined}
              className={cn(
                'block rounded-md px-3 py-3 text-base transition-colors',
                isActive(item.path)
                  ? 'bg-accent text-primary font-medium'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              {messages.nav[item.label]}
            </Link>
          ))}
        </nav>
      </header>

      <HoverPreviewProvider>
        <main className="flex-1">{children}</main>
      </HoverPreviewProvider>
      <footer className="border-t">
        <div className="text-muted-foreground mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-9 text-sm">
          <nav aria-label={messages.nav.secondary} className="flex flex-wrap gap-x-5 gap-y-3">
            {NAVIGATION.map((item) => (
              <Link
                key={item.path}
                href={to(item.path)}
                className="hover:text-primary transition-colors"
              >
                {messages.nav[item.label]}
              </Link>
            ))}
            <Link
              href={to('/legal')}
              className="hover:text-primary transition-colors"
            >
              {messages.nav.legal}
            </Link>
          </nav>
          <span>
            © {year} Kévin Véronési ·{' '}
            <a
              href="https://github.com/Drosscend"
              rel="noopener noreferrer"
              target="_blank"
              className="hover:text-primary transition-colors"
            >
              GitHub @Drosscend
            </a>{' '}
            ·{' '}
            <a
              href="https://www.linkedin.com/in/kveronesi/"
              rel="noopener noreferrer"
              target="_blank"
              className="hover:text-primary transition-colors"
            >
              LinkedIn
            </a>{' '}
            ·{' '}
            <a
              href="https://labs.kevin-dev.com"
              rel="noopener noreferrer"
              target="_blank"
              className="hover:text-primary transition-colors"
            >
              Labs
            </a>
          </span>
        </div>
      </footer>
      <Toaster position="top-center" richColors />
    </div>
  )
}
