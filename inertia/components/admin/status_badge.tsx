/**
 * Publication status badge shared by admin lists. Green dot for
 * published entries, amber dot for scheduled ones (published status
 * with a future date), hollow dot for drafts.
 */
export default function StatusBadge({
  status,
  detail,
  scheduled = false,
}: {
  status: 'draft' | 'published'
  detail?: string | null
  scheduled?: boolean
}) {
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
