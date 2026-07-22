import { Link } from '@adonisjs/inertia/react'
import { ExternalLink, Plus } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import AdminPage from '~/components/admin/admin_page'

interface DashboardProps {
  totpEnabled: boolean
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
  href,
}: {
  label: string
  value: number
  detail?: string
  href: string
}) {
  return (
    <Link href={href} className="group">
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

export default function Dashboard({ totpEnabled, stats }: DashboardProps) {
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
          href="/admin/articles"
        />
        <StatCard
          label="Projets publiés"
          value={stats.projectsPublished}
          detail={`${stats.projectsDraft} brouillon(s)`}
          href="/admin/projects"
        />
        <StatCard
          label="Médias"
          value={stats.mediaCount}
          detail="images dans la bibliothèque"
          href="/admin/media"
        />
        <StatCard
          label="Messages non lus"
          value={stats.unreadMessages}
          detail="boîte de réception"
          href="/admin/messages"
        />
      </div>
    </AdminPage>
  )
}
