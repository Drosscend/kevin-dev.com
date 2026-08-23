import { usePage } from '@inertiajs/react'
import { cn } from '~/lib/utils'

/**
 * Tells the signed-in author that the page below is not what the
 * public sees: a draft, or an entry withdrawn from the site.
 */
export default function PreviewBanner({
  preview,
  className,
}: {
  preview: 'draft' | 'archived'
  className?: string
}) {
  const { messages } = usePage().props

  return (
    <p
      className={cn(
        'border-destructive text-destructive rounded-lg border px-4 py-2.5 text-sm',
        className
      )}
    >
      {messages.blog[preview]}
    </p>
  )
}
