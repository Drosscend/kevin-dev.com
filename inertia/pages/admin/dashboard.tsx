import { Link } from '@adonisjs/inertia/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

interface DashboardProps {
  totpEnabled: boolean
  mediaCount: number
  unreadMessages: number
}

export default function Dashboard({ totpEnabled, mediaCount, unreadMessages }: DashboardProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Médias</CardDescription>
            <CardTitle className="text-3xl">{mediaCount}</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            images dans la bibliothèque
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Messages non lus</CardDescription>
            <CardTitle className="text-3xl">{unreadMessages}</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            <Link route="admin.messages.index" className="underline">
              voir la boîte de réception
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
