import { Link } from '@adonisjs/inertia/react'
import { Plus } from 'lucide-react'
import AdminPage from '~/components/admin/admin_page'
import { ContentList, ContentListRow } from '~/components/admin/content_list'
import EmptyState from '~/components/admin/empty_state'
import AccentBadge from '~/components/status_badge'
import { Button } from '~/components/ui/button'
import { type InertiaProps } from '~/types'
import type { Data } from '@generated/data'

type TalksIndexProps = InertiaProps<{
  talks: Data.Talks.TalkRow[]
}>

export default function TalksIndex({ talks }: TalksIndexProps) {
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
        <ContentList>
          {talks.map((talk) => (
            <ContentListRow
              key={talk.id}
              kind="talks"
              entry={talk}
              trailing={talk.upcoming && <AccentBadge>À venir</AccentBadge>}
              meta={
                <>
                  {talk.eventDate} · {talk.eventName}
                  {talk.city ? `, ${talk.city}` : ''}
                  {talk.hasEnglish ? ' · FR + EN' : ' · FR'}
                </>
              }
            />
          ))}
        </ContentList>
      )}
    </AdminPage>
  )
}
