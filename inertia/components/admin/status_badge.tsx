/**
 * Publication status badge shared by admin lists. Green dot for
 * published entries (semantic status color), hollow dot for drafts.
 */
export default function StatusBadge({
  status,
  detail,
}: {
  status: 'draft' | 'published'
  detail?: string | null
}) {
  const published = status === 'published'
  return (
    <span className="text-muted-foreground inline-flex items-center gap-1.5 text-sm">
      <span
        aria-hidden
        className={
          published
            ? 'size-2 rounded-full bg-emerald-500'
            : 'border-muted-foreground size-2 rounded-full border'
        }
      />
      {published ? `Publié${detail ? ` le ${detail}` : ''}` : 'Brouillon'}
    </span>
  )
}
