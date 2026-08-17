import { Link } from '@adonisjs/inertia/react'
import { LinkArrow } from '~/components/content_link'

/** Link back to a listing, mirroring LinkArrow on the leading side. */
export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group text-muted-foreground hover:text-primary transition-colors">
      <LinkArrow direction="back" /> {label}
    </Link>
  )
}

/** Title of a listing page; the locale switch lives in the header. */
export function PageHeader({ title }: { title: string }) {
  return <h1 className="mb-12 text-3xl font-bold md:text-4xl">{title}</h1>
}
