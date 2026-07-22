import { type Data } from '@generated/data'
import { toast, Toaster } from 'sonner'
import { usePage } from '@inertiajs/react'
import { type ReactElement, useEffect } from 'react'
import { Link } from '@adonisjs/inertia/react'
import ThemeToggle from '~/components/theme_toggle'
import { localePath } from '~/lib/locale'

const NAVIGATION = [
  { path: '/blog', label: 'Blog' },
  { path: '/projects', label: 'Portfolio' },
  { path: '/technologies', label: 'Technos' },
  { path: '/cv', label: 'CV' },
  { path: '/contact', label: 'Contact' },
] as const

export default function Layout({ children }: { children: ReactElement<Data.SharedProps> }) {
  const { url } = usePage()
  const locale = children.props.locale

  useEffect(() => {
    toast.dismiss()
  }, [url])

  useEffect(() => {
    if (children.props.flash.error) {
      toast.error(children.props.flash.error)
    }
    if (children.props.flash.success) {
      toast.success(children.props.flash.success)
    }
  })

  return (
    <>
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link href={localePath(locale, '/')} className="font-semibold tracking-tight">
            kevin-dev.com
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            {NAVIGATION.map((item) => (
              <Link
                key={item.path}
                href={localePath(locale, item.path)}
                className="hover:underline"
              >
                {item.label}
              </Link>
            ))}
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="text-muted-foreground border-t py-6 text-center text-xs">
        <Link href={localePath(locale, '/legal')} className="hover:underline">
          Mentions légales
        </Link>
      </footer>
      <Toaster position="top-center" richColors />
    </>
  )
}
