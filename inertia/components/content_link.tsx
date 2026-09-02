import { Link } from '@adonisjs/inertia/react'
import { CoverImage, CoverPlaceholder } from '~/components/cover_image'
import { useHoverPreview, type PreviewContent } from '~/components/hover_preview'
import StatusBadge from '~/components/status_badge'
import { cn } from '~/lib/utils'
import type { Picture } from '#types/content'
import type { ReactNode } from 'react'

/**
 * Arrow marking a block as a link. It inherits the surrounding colour and
 * slides away from the text when the ancestor carrying `group` is hovered.
 */
export function LinkArrow({
  className,
  direction = 'forward',
}: {
  className?: string
  direction?: 'forward' | 'back'
}) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-block transition-transform motion-reduce:transform-none',
        direction === 'back' ? 'group-hover:-translate-x-0.5' : 'group-hover:translate-x-0.5',
        className
      )}
    >
      {direction === 'back' ? '←' : '→'}
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
          {badge && <StatusBadge className="ml-2.5">{badge}</StatusBadge>}
          {meta && (
            <span className="text-muted-foreground mt-1 block font-mono text-[13px]">{meta}</span>
          )}
        </span>
        <LinkArrow className="text-primary" />
      </Link>
    </li>
  )
}

/** Vertical list of ListingRow entries, on the rhythm LinkList sets. */
export function ListingList({ children }: { children: ReactNode }) {
  return <ul className="max-w-[760px] divide-y border-y">{children}</ul>
}

/**
 * Full entry of an index page: thumbnail, metadata line, linked title,
 * summary, and a free footer for technologies or external links. Only the title
 * and the thumbnail are clickable, so the metadata and footer remain free
 * to hold links of their own.
 *
 * Passing `picture`, even as null, opts into the image column; null
 * renders the placeholder that keeps every row aligned. A cover sits
 * above the text on narrow screens and beside it from `sm` up; the
 * "logo" variant holds a small square that stays beside the text and
 * lets artwork breathe instead of cropping it.
 */
export function ListingRow({
  href,
  title,
  picture,
  thumbnail = 'cover',
  meta,
  summary,
  footer,
  heading: Heading = 'h2',
}: {
  href: string
  title: string
  picture?: Picture | null
  thumbnail?: 'cover' | 'logo'
  meta?: ReactNode
  summary?: string
  footer?: ReactNode
  heading?: 'h2' | 'h3'
}) {
  const logo = thumbnail === 'logo'
  const frame = logo ? 'size-16 rounded-md border' : 'aspect-video w-full rounded-md border sm:w-32'

  return (
    <li>
      <article className={cn('flex gap-5 py-7', !logo && 'flex-col sm:flex-row')}>
        {picture !== undefined && (
          <Link href={href} aria-hidden tabIndex={-1} className="shrink-0">
            {picture ? (
              <CoverImage
                picture={picture}
                sizes={logo ? '64px' : '(min-width: 640px) 128px, 100vw'}
                loading="lazy"
                className={cn(frame, logo ? 'object-contain p-2' : 'object-cover')}
              />
            ) : (
              <CoverPlaceholder title={title} className={cn(frame, logo && 'text-xl')} />
            )}
          </Link>
        )}
        <div className="min-w-0">
          {meta && (
            <p className="text-muted-foreground flex flex-wrap items-center gap-x-2.5 font-mono text-[13px]">
              {meta}
            </p>
          )}
          <Heading className="mt-2 text-xl font-semibold">
            <Link href={href} className="group hover:text-primary transition-colors">
              {title} <LinkArrow />
            </Link>
          </Heading>
          {summary && <p className="text-muted-foreground mt-2">{summary}</p>}
          {footer && <div className="mt-3">{footer}</div>}
        </div>
      </article>
    </li>
  )
}
