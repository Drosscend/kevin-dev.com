import { cn } from '~/lib/utils'
import type { Picture } from '#types/content'

/**
 * Cover or logo rendered from its generated variants: `sizes` tells the
 * browser the slot's width so it fetches the variant that fits, and
 * the intrinsic dimensions reserve the frame before the load.
 */
export function CoverImage({
  picture,
  sizes,
  alt = '',
  loading,
  className,
}: {
  picture: Picture
  sizes: string
  alt?: string
  loading?: 'lazy' | 'eager'
  className?: string
}) {
  return (
    <img
      src={picture.src}
      srcSet={picture.srcSet ?? undefined}
      sizes={picture.srcSet ? sizes : undefined}
      width={picture.width ?? undefined}
      height={picture.height ?? undefined}
      alt={alt}
      loading={loading}
      className={className}
    />
  )
}

/**
 * Stand-in for an entry without cover: its initial on the muted
 * ground, so the frame is never empty. Decorative, the title sits
 * next to it.
 */
export function CoverPlaceholder({ title, className }: { title: string; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'bg-muted text-muted-foreground flex items-center justify-center text-2xl',
        className
      )}
    >
      <span className="font-display font-semibold">{title.trim().charAt(0).toUpperCase()}</span>
    </div>
  )
}
