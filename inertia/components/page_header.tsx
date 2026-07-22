import { Link } from '@adonisjs/inertia/react'
import type { ReactNode } from 'react'
import { LinkArrow } from '~/components/content_link'

/** Link back to a listing, mirroring LinkArrow on the leading side. */
export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group text-muted-foreground hover:text-primary transition-colors">
      <LinkArrow direction="back" /> {label}
    </Link>
  )
}

/**
 * Title row of a listing page. The locale switch lives in the header,
 * so this only carries the heading and anything a page adds beside it.
 */
export function PageHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mb-12 flex items-baseline justify-between gap-4">
      <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
      {children}
    </div>
  )
}
