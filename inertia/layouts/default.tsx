import { type Data } from '@generated/data'
import { Toaster } from 'sonner'
import { type ReactElement } from 'react'
import { Link } from '@adonisjs/inertia/react'
import ThemeToggle from '~/components/theme_toggle'
import { localePath } from '~/lib/locale'
import { useFlashToasts } from '~/lib/use_flash_toasts'

const NAVIGATION = [
  { path: '/projects', label: 'Projets' },
  { path: '/blog', label: 'Blog' },
  { path: '/cv', label: 'CV' },
  { path: '/technologies', label: 'Technos' },
  { path: '/contact', label: 'Contact' },
] as const

export default function Layout({ children }: { children: ReactElement<Data.SharedProps> }) {
  const locale = children.props.locale
  useFlashToasts(children.props.flash)

  return (
    <>
      <header>
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link
            href={localePath(locale, '/')}
            className="font-display font-semibold tracking-tight"
          >
            Kévin Véronési
          </Link>
          <nav className="flex items-center gap-3 sm:gap-5">
            {NAVIGATION.map((item) => (
              <Link
                key={item.path}
                href={localePath(locale, item.path)}
                className="text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t">
        <div className="text-muted-foreground mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-9 text-sm">
          <nav className="flex flex-wrap gap-5">
            {NAVIGATION.map((item) => (
              <Link
                key={item.path}
                href={localePath(locale, item.path)}
                className="hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={localePath(locale, '/legal')}
              className="hover:text-primary transition-colors"
            >
              Mentions légales
            </Link>
          </nav>
          <span>
            © 2026 Kévin Véronési ·{' '}
            <a
              href="https://github.com/Drosscend"
              rel="noopener noreferrer"
              target="_blank"
              className="hover:text-primary transition-colors"
            >
              GitHub
            </a>{' '}
            ·{' '}
            <a
              href="https://www.linkedin.com/in/kveronesi/"
              rel="noopener noreferrer"
              target="_blank"
              className="hover:text-primary transition-colors"
            >
              LinkedIn
            </a>
          </span>
        </div>
      </footer>
      <Toaster position="top-center" richColors />
    </>
  )
}
