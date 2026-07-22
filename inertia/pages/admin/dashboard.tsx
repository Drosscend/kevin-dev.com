import { Link } from '@adonisjs/inertia/react'
import { ExternalLink, Plus } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import AdminPage from '~/components/admin/admin_page'

interface DashboardProps {
  totpEnabled: boolean
  umami: {
    pageviews: number
    visitors: number
    topPages: { path: string; views: number }[]
  } | null
  stats: {
    articlesPublished: number
    articlesDraft: number
    projectsPublished: number
    projectsDraft: number
    mediaCount: number
    unreadMessages: number
  }
}

function StatCard({
  label,
  value,
  detail,
  route,
}: {
  label: string
  value: number
  detail?: string
  route:
    'admin.articles.index' | 'admin.projects.index' | 'admin.media.index' | 'admin.messages.index'
}) {
  return (
    <Link route={route} className="group">
      <Card className="group-hover:border-primary h-full transition-colors">
        <CardHeader>
          <CardDescription>{label}</CardDescription>
          <CardTitle className="text-3xl">{value}</CardTitle>
        </CardHeader>
        {detail && <CardContent className="text-muted-foreground text-sm">{detail}</CardContent>}
      </Card>
    </Link>
  )
}

export default function Dashboard({ totpEnabled, umami, stats }: DashboardProps) {
  return (
    <AdminPage
      title="Dashboard"
      action={
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link route="admin.articles.create">
              <Plus className="size-4" />
              Nouvel article
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link route="admin.projects.create">
              <Plus className="size-4" />
              Nouveau projet
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <a href="/" target="_blank" rel="noreferrer">
              <ExternalLink className="size-4" />
              Voir le site
            </a>
          </Button>
        </div>
      }
    >
      {!totpEnabled && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">2FA non configurée</CardTitle>
            <CardDescription>
              L’admin est exposée publiquement : activez la double authentification depuis la{' '}
              <Link route="admin.security" className="underline">
                page Sécurité
              </Link>
              .
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Articles publiés"
          value={stats.articlesPublished}
          detail={`${stats.articlesDraft} brouillon(s)`}
          route="admin.articles.index"
        />
        <StatCard
          label="Projets publiés"
          value={stats.projectsPublished}
          detail={`${stats.projectsDraft} brouillon(s)`}
          route="admin.projects.index"
        />
        <StatCard
          label="Médias"
          value={stats.mediaCount}
          detail="images dans la bibliothèque"
          route="admin.media.index"
        />
        <StatCard
          label="Messages non lus"
          value={stats.unreadMessages}
          detail="boîte de réception"
          route="admin.messages.index"
        />
      </div>

      {umami && (
        <Card>
          <CardHeader>
            <CardTitle>Visites — 30 derniers jours</CardTitle>
            <CardDescription>
              {umami.pageviews} pages vues · {umami.visitors} visiteur(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {umami.topPages.map((page) => (
                <li key={page.path} className="flex items-baseline justify-between gap-4 py-2">
                  <span className="truncate font-mono text-sm">{page.path}</span>
                  <span className="text-muted-foreground shrink-0 text-sm">
                    {page.views} vue(s)
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </AdminPage>
  )
}
