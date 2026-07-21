import { type Data } from '@generated/data'
import { toast, Toaster } from 'sonner'
import { usePage } from '@inertiajs/react'
import { type ReactElement, useEffect } from 'react'
import { Link } from '@adonisjs/inertia/react'

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
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <Toaster position="top-center" richColors />
    </>
  )
}
