import { Form, Link } from '@adonisjs/inertia/react'
import { usePage } from '@inertiajs/react'
import {
  type LucideIcon,
  LayoutDashboardIcon,
  HomeIcon,
  ImageIcon,
  MenuIcon,
  MilestoneIcon,
  ScaleIcon,
  ShieldCheckIcon,
  LogOutIcon,
  NewspaperIcon,
  FolderOpenIcon,
  FolderGit2Icon,
  MicIcon,
  CpuIcon,
  FileTextIcon,
  InboxIcon,
  XIcon,
} from 'lucide-react'
import { type ReactElement, type ReactNode, useState } from 'react'
import { Toaster } from 'sonner'
import { type Data } from '@generated/data'
import { client } from '~/client'
import ThemeToggle from '~/components/theme_toggle'
import { Button } from '~/components/ui/button'
import { useFlashToasts } from '~/lib/use_flash_toasts'
import { cn } from '~/lib/utils'

/**
 * The dashboard stands above the groups, and is the only entry
 * matched exactly: its path is the "/admin" prefix every other one
 * starts with.
 */
const DASHBOARD = {
  route: 'admin.dashboard',
  label: 'Dashboard',
  icon: LayoutDashboardIcon,
} as const

/**
 * The rest of the sidebar, grouped by what an entry edits: the items
 * of a content model, the site pages that exist on their own, and the
 * administration of the instance. Paths are resolved from the route
 * registry, so a renamed URL can never desync the active highlight.
 */
const NAVIGATION = [
  {
    label: 'Contenu',
    items: [
      { route: 'admin.articles.index', label: 'Articles', icon: NewspaperIcon },
      { route: 'admin.categories.index', label: 'Catégories', icon: FolderOpenIcon },
      { route: 'admin.projects.index', label: 'Projets', icon: FolderGit2Icon },
      { route: 'admin.talks.index', label: 'Interventions', icon: MicIcon },
      { route: 'admin.technologies.index', label: 'Technologies', icon: CpuIcon },
      { route: 'admin.media.index', label: 'Médias', icon: ImageIcon },
    ],
  },
  {
    label: 'Pages du site',
    items: [
      { route: 'admin.home.index', label: 'Accueil', icon: HomeIcon },
      { route: 'admin.timeline.index', label: 'Parcours', icon: MilestoneIcon },
      { route: 'admin.cv.index', label: 'CV', icon: FileTextIcon },
      { route: 'admin.legal.index', label: 'Mentions légales', icon: ScaleIcon },
    ],
  },
  {
    label: 'Administration',
    items: [
      { route: 'admin.messages.index', label: 'Messages', icon: InboxIcon },
      { route: 'admin.security', label: 'Sécurité', icon: ShieldCheckIcon },
    ],
  },
] as const

type NavRoute = Parameters<typeof client.urlFor>[0]

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

function NavLink({
  route,
  label,
  icon: Icon,
  active,
  onNavigate,
  children,
}: {
  route: NavRoute
  label: string
  icon: LucideIcon
  active: boolean
  onNavigate: () => void
  children?: ReactNode
}) {
  return (
    <Link
      route={route}
      onClick={onNavigate}
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
      {children}
    </Link>
  )
}

export default function AdminLayout({ children }: { children: ReactElement<Data.SharedProps> }) {
  const { url } = usePage()
  const [mobileOpen, setMobileOpen] = useState(false)
  const currentPath = url.split('?')[0]
  const unread = children.props.unreadMessages ?? 0
  const closeMobile = () => setMobileOpen(false)

  useFlashToasts()

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
          onClick={closeMobile}
        >
          <XIcon className="size-4" />
        </Button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        <NavLink
          {...DASHBOARD}
          active={currentPath === client.urlFor(DASHBOARD.route)}
          onNavigate={closeMobile}
        />

        {NAVIGATION.map((group) => (
          <div key={group.label} className="flex flex-col gap-1">
            <p className="text-muted-foreground px-3 pt-4 pb-1 text-xs font-medium">
              {group.label}
            </p>
            {group.items.map((item) => (
              <NavLink
                key={item.route}
                {...item}
                active={currentPath.startsWith(client.urlFor(item.route))}
                onNavigate={closeMobile}
              >
                {item.route === 'admin.messages.index' && <UnreadBadge count={unread} />}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="border-t p-3">
        <div className="text-muted-foreground mb-2 flex items-center justify-between px-3 text-xs">
          <span className="truncate">{children.props.user?.email}</span>
          <ThemeToggle />
        </div>
        <Form route="admin.logout">
          <Button type="submit" variant="ghost" size="sm" className="w-full justify-start gap-2">
            <LogOutIcon className="size-4" />
            Déconnexion
          </Button>
        </Form>
      </div>
    </>
  )

  return (
    <div className="min-h-screen lg:flex">
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
          <MenuIcon className="size-4" />
          {unread > 0 && <UnreadBadge count={unread} />}
        </Button>
      </header>

      {mobileOpen && (
        <div
          aria-hidden
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeMobile}
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
