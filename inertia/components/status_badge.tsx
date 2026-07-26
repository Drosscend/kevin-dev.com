import type { ReactNode } from 'react'
import { cn } from '~/lib/utils'

/**
 * Accent label marking the state of an entry next to its title or its
 * metadata line, such as an upcoming talk or an ongoing project.
 */
export default function StatusBadge({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span className={cn('text-primary font-mono text-[11px] tracking-wider uppercase', className)}>
      {children}
    </span>
  )
}
