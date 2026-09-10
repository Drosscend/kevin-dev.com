import { useId } from 'react'
import { coverArt, MARK_FRAME, type ArtRole } from '#types/cover_art'
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

const FILL = {
  paper: 'var(--color-card)',
  muted: 'var(--color-muted)',
  ink: 'var(--color-foreground)',
  accent: 'var(--color-primary)',
  subtle: 'var(--color-muted-foreground)',
} satisfies Record<ArtRole, string>

/**
 * Stand-in for an entry without cover, drawn from its slug so the
 * frame is never empty and never twice the same. Decorative: the
 * title is always readable next to it.
 */
export function CoverPlaceholder({
  title,
  seed,
  className,
}: {
  title: string
  seed: string
  className?: string
}) {
  const hatchId = useId()
  const art = coverArt({ layout: 'mark', ...MARK_FRAME, title, seed })

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${art.width} ${art.height}`}
      preserveAspectRatio="xMidYMid slice"
      className={cn('block', className)}
    >
      {art.figures.map((figure, index) => {
        if (figure.kind === 'rect') {
          return (
            <rect
              key={index}
              x={figure.x}
              y={figure.y}
              width={figure.width}
              height={figure.height}
              fill={FILL[figure.role]}
            />
          )
        }

        if (figure.kind === 'hatch') {
          return (
            <g key={index}>
              <defs>
                <pattern
                  id={hatchId}
                  width={figure.step}
                  height={figure.step}
                  patternUnits="userSpaceOnUse"
                  patternTransform={`rotate(${figure.angle})`}
                >
                  <line
                    x1={0}
                    y1={0}
                    x2={0}
                    y2={figure.step}
                    stroke={FILL[figure.role]}
                    strokeWidth={1.2}
                    opacity={figure.opacity}
                  />
                </pattern>
              </defs>
              <rect width={art.width} height={art.height} fill={`url(#${hatchId})`} />
            </g>
          )
        }

        return (
          <text
            key={index}
            x={figure.x}
            y={figure.y}
            fontSize={figure.size}
            textAnchor={figure.anchor}
            letterSpacing={figure.tracking}
            fill={FILL[figure.role]}
            opacity={figure.opacity}
            className={figure.family === 'display' ? 'font-display font-semibold' : 'font-mono'}
          >
            {figure.value}
          </text>
        )
      })}
    </svg>
  )
}
