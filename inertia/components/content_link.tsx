import { Link } from '@adonisjs/inertia/react'
import type { ReactNode } from 'react'
import { useHoverPreview, type PreviewContent } from '~/components/hover_preview'
import { cn } from '~/lib/utils'

/**
 * Arrow marking a block as a link. It inherits the surrounding colour and
 * slides right when the ancestor carrying `group` is hovered.
 */
export function LinkArrow({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-block transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none',
        className
      )}
    >
      →
    </span>
  )
}

/** Vertical list of LinkRow entries, separated by hairlines. */
export function LinkList({ children }: { children: ReactNode }) {
  return <ul className="max-w-[720px] divide-y border-y">{children}</ul>
}

/**
 * One entry of a LinkList: title, optional accent badge, optional metadata
 * line, and the trailing arrow shared with LinkCard. A `preview` opts the
 * row into the card that follows the cursor.
 */
export function LinkRow({
  href,
  title,
  badge,
  meta,
  preview,
}: {
  href: string
  title: string
  badge?: string
  meta?: ReactNode
  preview?: PreviewContent
}) {
  const hoverPreview = useHoverPreview()
  const hoverHandlers = preview && {
    onMouseEnter: (event: { clientX: number; clientY: number }) =>
      hoverPreview.show(preview, event.clientX, event.clientY),
    onMouseMove: (event: { clientX: number; clientY: number }) =>
      hoverPreview.move(event.clientX, event.clientY),
    onMouseLeave: hoverPreview.hide,
  }

  return (
    <li>
      <Link
        href={href}
        {...hoverHandlers}
        className="group grid grid-cols-[1fr_auto] items-center gap-x-6 px-1 py-4"
      >
        <span>
          <span className="group-hover:text-primary font-medium transition-colors">{title}</span>
          {badge && (
            <span className="text-primary ml-2.5 font-mono text-[11px] tracking-wider uppercase">
              {badge}
            </span>
          )}
          {meta && (
            <span className="text-muted-foreground mt-1 block font-mono text-[13px]">{meta}</span>
          )}
        </span>
        <LinkArrow className="text-primary" />
      </Link>
    </li>
  )
}

/**
 * Card carrying the same link affordances as LinkRow. Passing `coverUrl`,
 * even as null, opts into the cover area; null renders the placeholder.
 */
export function LinkCard({
  href,
  title,
  summary,
  coverUrl,
  meta,
  heading: Heading = 'h3',
}: {
  href: string
  title: string
  summary?: string
  coverUrl?: string | null
  meta?: ReactNode
  heading?: 'h2' | 'h3'
}) {
  return (
    <Link
      href={href}
      className="group bg-card hover:border-primary flex flex-col overflow-hidden rounded-lg border transition-[border-color,transform] hover:-translate-y-0.5 motion-reduce:transform-none"
    >
      {coverUrl !== undefined &&
        (coverUrl ? (
          <img src={coverUrl} alt="" className="aspect-video w-full object-cover" loading="lazy" />
        ) : (
          <div className="bg-muted aspect-video w-full" />
        ))}
      <div className="flex grow flex-col p-6">
        <Heading className="group-hover:text-primary font-semibold transition-colors">
          {title}
        </Heading>
        {summary && <p className="text-muted-foreground mt-2 line-clamp-3 text-sm">{summary}</p>}
        {meta && (
          <p className="text-muted-foreground mt-4 flex flex-wrap gap-x-2.5 gap-y-1 font-mono text-xs">
            {meta}
          </p>
        )}
        <span className="text-primary mt-auto pt-4 text-sm">
          <LinkArrow />
        </span>
      </div>
    </Link>
  )
}
