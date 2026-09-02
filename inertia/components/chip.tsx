import { Link } from '@adonisjs/inertia/react'
import { cn } from '~/lib/utils'
import type { ReactNode } from 'react'

const CHIP = 'rounded-full border px-4 py-1.5 text-sm transition-colors'

const VARIANTS = {
  default: 'bg-card hover:border-primary hover:text-primary',
  active: 'border-primary bg-primary text-primary-foreground',
  muted: 'text-muted-foreground border-dashed hover:border-primary hover:text-primary',
}

/** Wrapping row of chips, used for technology lists and filter bars. */
export function ChipList({ children, className }: { children: ReactNode; className?: string }) {
  return <ul className={cn('flex flex-wrap gap-2.5', className)}>{children}</ul>
}

/**
 * Chip pointing to a page. The "muted" variant marks a chip that opens a
 * longer list rather than naming a single entry; `active` marks the
 * page currently shown, for filter bars made of links.
 */
export function ChipLink({
  href,
  variant = 'default',
  active = false,
  ariaLabel,
  children,
}: {
  href: string
  variant?: 'default' | 'muted'
  active?: boolean
  ariaLabel?: string
  children: ReactNode
}) {
  return (
    <li>
      <Link
        href={href}
        aria-label={ariaLabel}
        aria-current={active ? 'page' : undefined}
        className={cn('inline-block', CHIP, active ? VARIANTS.active : VARIANTS[variant])}
      >
        {children}
      </Link>
    </li>
  )
}

/** Chip toggling a filter in place; `active` marks the current selection. */
export function ChipButton({
  onClick,
  active = false,
  children,
}: {
  onClick: () => void
  active?: boolean
  children: ReactNode
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={cn(CHIP, active ? VARIANTS.active : VARIANTS.default)}
      >
        {children}
      </button>
    </li>
  )
}
