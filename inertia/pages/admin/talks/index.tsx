import { Link, useRouter } from '@adonisjs/inertia/react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '~/components/ui/button'
import AdminPage from '~/components/admin/admin_page'
import ConfirmButton from '~/components/admin/confirm_button'
import PreviewLink from '~/components/admin/preview_link'
import EmptyState from '~/components/admin/empty_state'
import StatusBadge from '~/components/admin/status_badge'
import type { PublicationStatus } from '~/components/admin/publication_actions'

type TalkRow = {
  id: number
  slug: string
  title: string
  hasEnglish: boolean
  status: PublicationStatus
  eventName: string
  eventDate: string
  city: string
  upcoming: boolean
  publishedAt: string | null
  scheduled: boolean
}

type TalksIndexProps = {
  talks: TalkRow[]
}

export default function TalksIndex({ talks }: TalksIndexProps) {
  const router = useRouter()

  return (
    <AdminPage
      title="Interventions"
      action={
        <Button asChild>
          <Link route="admin.talks.create">
            <Plus className="size-4" />
            Nouvelle intervention
          </Link>
        </Button>
      }
    >
      {talks.length === 0 ? (
        <EmptyState>Aucune intervention pour l’instant.</EmptyState>
      ) : (
        <ul className="divide-y border-y">
          {talks.map((talk) => (
            <li
              key={talk.id}
              className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
            >
              <div className="min-w-0">
                <span className="flex items-center gap-2">
                  <Link
                    route="admin.talks.edit"
                    routeParams={{ id: talk.id }}
                    className="hover:text-primary font-medium transition-colors"
                  >
                    {talk.title}
                  </Link>
                  {talk.upcoming && (
                    <span className="text-primary font-mono text-[11px] tracking-wider uppercase">
                      À venir
                    </span>
                  )}
                </span>
                <p className="text-muted-foreground truncate font-mono text-xs">
                  {talk.eventDate} · {talk.eventName}
                  {talk.city ? `, ${talk.city}` : ''}
                  {talk.hasEnglish ? ' · FR + EN' : ' · FR'}
                </p>
              </div>
              <div className="flex items-center justify-between gap-3 sm:shrink-0 sm:justify-end">
                <StatusBadge
                  status={talk.status}
                  detail={talk.publishedAt}
                  scheduled={talk.scheduled}
                />
                <span className="flex items-center gap-3">
                  <PreviewLink kind="talks" slug={talk.slug} title={talk.title} />
                  <ConfirmButton
                    description={`Supprimer « ${talk.title} » ? Cette action est définitive.`}
                    onConfirm={() =>
                      router.visit(
                        { route: 'admin.talks.destroy', routeParams: { id: talk.id } },
                        { preserveScroll: true }
                      )
                    }
                    trigger={
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        aria-label={`Supprimer ${talk.title}`}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    }
                  />
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AdminPage>
  )
}
