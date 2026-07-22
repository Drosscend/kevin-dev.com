import { type Data } from '@generated/data'
import { toast, Toaster } from 'sonner'
import { usePage } from '@inertiajs/react'
import { type ReactElement, useEffect, useState } from 'react'
import { Form, Link } from '@adonisjs/inertia/react'
import {
  LayoutDashboard,
  Home,
  Image,
  Menu,
  ShieldCheck,
  LogOut,
  Newspaper,
  FolderOpen,
  Tags,
  FolderGit2,
  Cpu,
  FileText,
  Inbox,
  X,
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import ThemeToggle from '~/components/theme_toggle'
import { cn } from '~/lib/utils'

const navigation = [
  {
    route: 'admin.dashboard',
    path: '/admin',
    exact: true,
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  { route: 'admin.home.index', path: '/admin/home', label: 'Accueil', icon: Home },
  { route: 'admin.articles.index', path: '/admin/articles', label: 'Articles', icon: Newspaper },
  {
    route: 'admin.categories.index',
    path: '/admin/categories',
    label: 'Catégories',
    icon: FolderOpen,
  },
  { route: 'admin.tags.index', path: '/admin/tags', label: 'Tags', icon: Tags },
  { route: 'admin.projects.index', path: '/admin/projects', label: 'Projets', icon: FolderGit2 },
  {
    route: 'admin.technologies.index',
    path: '/admin/technologies',
    label: 'Technologies',
    icon: Cpu,
  },
  { route: 'admin.media.index', path: '/admin/media', label: 'Médias', icon: Image },
  { route: 'admin.pages.index', path: '/admin/pages', label: 'Pages', icon: FileText },
  { route: 'admin.messages.index', path: '/admin/messages', label: 'Messages', icon: Inbox },
  { route: 'admin.security', path: '/admin/security', label: 'Sécurité', icon: ShieldCheck },
] as const

function UnreadBadge({ count }: { count: number }) {
  if (count === 0) {
    return null
  }
  return (
    <span className="bg-primary text-primary-foreground ml-auto rounded-full px-1.5 py-0.5 text-[11px] leading-none font-semibold">
      {count}
    </span>
  )
}

export default function AdminLayout({ children }: { children: ReactElement<Data.SharedProps> }) {
  const { url } = usePage()
  const [mobileOpen, setMobileOpen] = useState(false)
  const currentPath = url.split('?')[0]
  const unread = (children.props as { unreadMessages?: number }).unreadMessages ?? 0

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

  const sidebar = (
    <>
      <div className="flex h-14 items-center justify-between border-b px-4">
        <Link route="home" className="font-display font-semibold tracking-tight">
          kevin-dev.com
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="lg:hidden"
          aria-label="Fermer le menu"
          onClick={() => setMobileOpen(false)}
        >
          <X className="size-4" />
        </Button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {navigation.map(({ route, path, label, icon: Icon, ...item }) => {
          const active =
            'exact' in item && item.exact ? currentPath === path : currentPath.startsWith(path)
          return (
            <Link
              key={route}
              route={route}
              onClick={() => setMobileOpen(false)}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-accent text-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <Icon className="size-4" />
              {label}
              {route === 'admin.messages.index' && <UnreadBadge count={unread} />}
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-3">
        <div className="text-muted-foreground mb-2 flex items-center justify-between px-3 text-xs">
          <span className="truncate">{children.props.user?.email}</span>
          <ThemeToggle />
        </div>
        <Form route="admin.logout">
          <Button type="submit" variant="ghost" size="sm" className="w-full justify-start gap-2">
            <LogOut className="size-4" />
            Déconnexion
          </Button>
        </Form>
      </div>
    </>
  )

  return (
    <div className="min-h-screen lg:flex">
      {/* Mobile top bar */}
      <header className="flex h-14 items-center justify-between border-b px-4 lg:hidden">
        <Link route="home" className="font-display font-semibold tracking-tight">
          kevin-dev.com
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label="Ouvrir le menu"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="size-4" />
          {unread > 0 && <UnreadBadge count={unread} />}
        </Button>
      </header>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          aria-hidden
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'bg-background fixed inset-y-0 left-0 z-50 flex w-56 flex-col border-r transition-transform lg:static lg:translate-x-0 lg:transition-none',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebar}
      </aside>

      <main className="flex-1 p-4 sm:p-8">{children}</main>
      <Toaster position="top-center" richColors />
    </div>
  )
}
