import { type Data } from '@generated/data'
import { toast, Toaster } from 'sonner'
import { usePage } from '@inertiajs/react'
import { type ReactElement, useEffect } from 'react'
import { Link } from '@adonisjs/inertia/react'
import ThemeToggle from '~/components/theme_toggle'

export default function Layout({ children }: { children: ReactElement<Data.SharedProps> }) {
  const { url } = usePage()

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
          <Link route="home" className="font-semibold tracking-tight">
            kevin-dev.com
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link route="blog.index" className="hover:underline">
              Blog
            </Link>
            <Link route="projects.index" className="hover:underline">
              Portfolio
            </Link>
            <Link route="technologies.index" className="hover:underline">
              Technos
            </Link>
            <Link route="cv.show" className="hover:underline">
              CV
            </Link>
            <Link route="contact.show" className="hover:underline">
              Contact
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="text-muted-foreground border-t py-6 text-center text-xs">
        <Link route="legal.show" className="hover:underline">
          Mentions légales
        </Link>
      </footer>
      <Toaster position="top-center" richColors />
    </>
  )
}
