import { cn } from '~/lib/utils'
import type { ReactNode } from 'react'

/**
 * Small uppercase monospaced label that opens a section or a block:
 * the eyebrow every public page uses above a list or a heading.
 */
export function SectionLabel({
  as: Tag = 'p',
  className,
  children,
}: {
  as?: 'p' | 'h2' | 'h3'
  className?: string
  children: ReactNode
}) {
  return (
    <Tag
      className={cn('text-muted-foreground font-mono text-xs tracking-wider uppercase', className)}
    >
      {children}
    </Tag>
  )
}
