import { Link, useRouter } from '@adonisjs/inertia/react'
import { Trash2Icon } from 'lucide-react'
import ConfirmButton from '~/components/admin/confirm_button'
import PreviewLink, { type PreviewKind } from '~/components/admin/preview_link'
import StatusBadge from '~/components/admin/status_badge'
import { Button } from '~/components/ui/button'
import type { PublicationStatus } from '#types/content'
import type { ReactNode } from 'react'

export type ContentListEntry = {
  id: number
  slug: string
  title: string
  status: PublicationStatus
  publishedAt: string | null
  scheduled: boolean
}

export function ContentList({ children }: { children: ReactNode }) {
  return <ul className="divide-y border-y">{children}</ul>
}

/**
 * One row of an admin content listing: title linking to the editor,
 * a metadata line, then the publication badge, the public preview and
 * a confirmed delete. `leading` and `trailing` decorate the title
 * (featured star, upcoming label).
 */
export function ContentListRow({
  kind,
  entry,
  meta,
  leading,
  trailing,
}: {
  kind: PreviewKind
  entry: ContentListEntry
  meta: ReactNode
  leading?: ReactNode
  trailing?: ReactNode
}) {
  const router = useRouter()

  return (
    <li className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <span className="flex items-center gap-2">
          {leading}
          <Link
            route={`admin.${kind}.edit`}
            routeParams={{ id: entry.id }}
            className="hover:text-primary font-medium transition-colors"
          >
            {entry.title}
          </Link>
          {trailing}
        </span>
        <p className="text-muted-foreground truncate font-mono text-xs">{meta}</p>
      </div>
      <div className="flex items-center justify-between gap-3 sm:shrink-0 sm:justify-end">
        <StatusBadge status={entry.status} detail={entry.publishedAt} scheduled={entry.scheduled} />
        <span className="flex items-center gap-3">
          <PreviewLink kind={kind} slug={entry.slug} title={entry.title} />
          <ConfirmButton
            description={`Supprimer « ${entry.title} » ? Cette action est définitive.`}
            onConfirm={() =>
              router.visit(
                { route: `admin.${kind}.destroy`, routeParams: { id: entry.id } },
                { preserveScroll: true }
              )
            }
            trigger={
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive"
                aria-label={`Supprimer ${entry.title}`}
              >
                <Trash2Icon className="size-4" />
              </Button>
            }
          />
        </span>
      </div>
    </li>
  )
}
