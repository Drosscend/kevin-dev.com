import { Link } from '@adonisjs/inertia/react'
import { type ComponentProps, type ReactNode } from 'react'
import { LinkArrow } from '~/components/content_link'

/**
 * Standard admin page frame: title row with an optional action slot
 * (create button, back link…), then the page content.
 */
export default function AdminPage({
  title,
  action,
  className = 'max-w-4xl',
  children,
}: {
  title: string
  action?: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <div className={`${className} space-y-6`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{title}</h1>
        {action}
      </div>
      {children}
    </div>
  )
}

/** Link back to the listing an admin form was opened from. */
export function AdminBackLink({
  route,
  children,
}: {
  route: NonNullable<ComponentProps<typeof Link>['route']>
  children: ReactNode
}) {
  return (
    <Link
      route={route}
      className="group text-muted-foreground hover:text-primary text-sm transition-colors"
    >
      <LinkArrow direction="back" /> {children}
    </Link>
  )
}
