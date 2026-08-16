import type { ReactNode } from 'react'
import { cn } from '~/lib/utils'

/**
 * Placeholder taking the room a listing or a document would have filled,
 * on the width ListingList sets so both share the same left edge.
 */
export function EmptyState({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'text-muted-foreground max-w-[760px] rounded-lg border border-dashed px-6 py-16 text-center',
        className
      )}
    >
      {children}
    </p>
  )
}
