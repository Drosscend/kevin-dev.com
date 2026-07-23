import type { PublicationStatus } from '~/components/admin/publication_actions'

/**
 * Publication status badge shared by admin lists. Green dot for
 * published entries, amber dot for scheduled ones (published status
 * with a future date), red dot for entries withdrawn from the site,
 * hollow dot for drafts.
 */
export default function StatusBadge({
  status,
  detail,
  scheduled = false,
}: {
  status: PublicationStatus
  detail?: string | null
  scheduled?: boolean
}) {
  if (status === 'archived') {
    return (
      <span className="text-muted-foreground inline-flex items-center gap-1.5 text-sm">
        <span aria-hidden className="bg-destructive size-2 rounded-full" />
        Retiré du site
      </span>
    )
  }

  if (status !== 'published') {
    return (
      <span className="text-muted-foreground inline-flex items-center gap-1.5 text-sm">
        <span aria-hidden className="border-muted-foreground size-2 rounded-full border" />
        Brouillon
      </span>
    )
  }

  return (
    <span className="text-muted-foreground inline-flex items-center gap-1.5 text-sm">
      <span
        aria-hidden
        className={
          scheduled ? 'size-2 rounded-full bg-amber-500' : 'size-2 rounded-full bg-emerald-500'
        }
      />
      {scheduled
        ? `Programmé${detail ? ` le ${detail}` : ''}`
        : `Publié${detail ? ` le ${detail}` : ''}`}
    </span>
  )
}
