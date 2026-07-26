import { cn } from '~/lib/utils'

export type PreviewMode = 'draft' | 'archived' | null

/**
 * Tells the signed-in author that the page below is not what the
 * public sees: a draft, or an entry withdrawn from the site.
 */
export default function PreviewBanner({ label, className }: { label: string; className?: string }) {
  return (
    <p
      className={cn(
        'border-destructive text-destructive rounded-lg border px-4 py-2.5 text-sm',
        className
      )}
    >
      {label}
    </p>
  )
}
