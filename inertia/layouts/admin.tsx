import { type Data } from '@generated/data'
import { toast, Toaster } from 'sonner'
import { usePage } from '@inertiajs/react'
import { type ReactElement, useEffect } from 'react'
import { Form, Link } from '@adonisjs/inertia/react'
import {
  LayoutDashboard,
  Image,
  ShieldCheck,
  LogOut,
  Newspaper,
  FolderOpen,
  Tags,
  FolderGit2,
  Cpu,
} from 'lucide-react'
import { Button } from '~/components/ui/button'

const navigation = [
  { route: 'admin.dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { route: 'admin.articles.index', label: 'Articles', icon: Newspaper },
  { route: 'admin.categories.index', label: 'Catégories', icon: FolderOpen },
  { route: 'admin.tags.index', label: 'Tags', icon: Tags },
  { route: 'admin.projects.index', label: 'Projets', icon: FolderGit2 },
  { route: 'admin.technologies.index', label: 'Technologies', icon: Cpu },
  { route: 'admin.media.index', label: 'Médias', icon: Image },
  { route: 'admin.security', label: 'Sécurité', icon: ShieldCheck },
] as const

export default function AdminLayout({ children }: { children: ReactElement<Data.SharedProps> }) {
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
    <div className="flex min-h-screen">
      <aside className="flex w-56 flex-col border-r">
        <div className="flex h-14 items-center border-b px-4">
          <Link route="home" className="font-semibold tracking-tight">
            kevin-dev.com
          </Link>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          {navigation.map(({ route, label, icon: Icon }) => (
            <Link
              key={route}
              route={route}
              className="hover:bg-accent flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium"
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="border-t p-3">
          <div className="text-muted-foreground mb-2 px-3 text-xs">
            {children.props.user?.email}
          </div>
          <Form route="admin.logout">
            <Button type="submit" variant="ghost" size="sm" className="w-full justify-start gap-2">
              <LogOut className="size-4" />
              Déconnexion
            </Button>
          </Form>
        </div>
      </aside>

      <main className="flex-1 p-8">{children}</main>
      <Toaster position="top-center" richColors />
    </div>
  )
}
