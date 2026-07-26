import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

export type PreviewContent = {
  imageUrl?: string | null
  summary?: string
  meta?: string
}

type PreviewApi = {
  show: (content: PreviewContent, x: number, y: number) => void
  move: (x: number, y: number) => void
  hide: () => void
}

const INERT: PreviewApi = { show: () => {}, move: () => {}, hide: () => {} }

const HoverPreviewContext = createContext<PreviewApi>(INERT)

/**
 * Handlers driving the floating preview. Outside a provider, or on
 * devices without a fine pointer, they are inert.
 */
export function useHoverPreview() {
  return useContext(HoverPreviewContext)
}

const CURSOR_GAP = 18
const EDGE_MARGIN = 8
/** Fraction of the remaining distance covered per frame; the card trails the cursor. */
const FOLLOW = 0.22
const FADE = 0.24
/** Degrees of tilt per pixel of horizontal cursor speed, and its cap. */
const TILT_PER_PIXEL = 0.22
const MAX_TILT = 7

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Renders a single card that follows the cursor above the hovered row.
 * Position, opacity and tilt are written straight to the DOM from a
 * rAF loop, so cursor movement never re-renders the tree.
 */
export function HoverPreviewProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<PreviewContent | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const tiltRef = useRef<HTMLDivElement>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const motion = useRef({ x: 0, y: 0, progress: 0, tilt: 0 })
  const visible = useRef(false)
  const frame = useRef(0)
  /** Null until the first client effect settles the media queries. */
  const enabled = useRef<boolean | null>(null)
  const reduced = useRef(false)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => {
      enabled.current = fine.matches
      reduced.current = still.matches
    }

    sync()
    fine.addEventListener('change', sync)
    still.addEventListener('change', sync)

    return () => {
      fine.removeEventListener('change', sync)
      still.removeEventListener('change', sync)
      cancelAnimationFrame(frame.current)
    }
  }, [])

  const api = useMemo<PreviewApi>(() => {
    function apply() {
      const card = cardRef.current
      if (!card) {
        return
      }

      const state = motion.current
      const width = card.offsetWidth
      const height = card.offsetHeight
      const x = clamp(
        state.x,
        EDGE_MARGIN + width / 2,
        Math.max(EDGE_MARGIN + width / 2, window.innerWidth - EDGE_MARGIN - width / 2)
      )
      // Below the cursor instead, when the card would overflow the top edge.
      const fitsAbove = state.y - CURSOR_GAP - height > EDGE_MARGIN
      const y = fitsAbove ? state.y - CURSOR_GAP : state.y + CURSOR_GAP + height

      card.style.opacity = String(state.progress)
      card.style.transform =
        `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)` +
        ` translate(-50%, -100%) scale(${(0.94 + 0.06 * state.progress).toFixed(3)})`

      if (tiltRef.current) {
        tiltRef.current.style.transform = `rotate(${state.tilt.toFixed(2)}deg)`
      }
    }

    function tick() {
      const state = motion.current
      const target = pointer.current
      const follow = reduced.current ? 1 : FOLLOW
      const step = target.x - state.x

      state.x += step * follow
      state.y += (target.y - state.y) * follow
      state.progress += ((visible.current ? 1 : 0) - state.progress) * (reduced.current ? 1 : FADE)
      state.tilt = reduced.current ? 0 : clamp(step * follow * TILT_PER_PIXEL, -MAX_TILT, MAX_TILT)

      apply()

      if (!visible.current && state.progress < 0.01) {
        frame.current = 0
        setContent(null)
        return
      }

      frame.current = requestAnimationFrame(tick)
    }

    function start() {
      if (frame.current === 0) {
        frame.current = requestAnimationFrame(tick)
      }
    }

    return {
      show(next, x, y) {
        // An entry with nothing to preview would only flash an empty frame.
        if (enabled.current === false || !(next.imageUrl || next.summary || next.meta)) {
          return
        }

        // A fresh card snaps to the cursor; swapping rows keeps the trail.
        if (!visible.current) {
          motion.current.x = x
          motion.current.y = y
          motion.current.tilt = 0
        }

        pointer.current = { x, y }
        visible.current = true
        setContent(next)
        start()
      },
      move(x, y) {
        pointer.current = { x, y }
      },
      hide() {
        visible.current = false
        start()
      },
    }
  }, [])

  /**
   * A page swap replaces the hovered row without firing mouseleave, so the
   * card would otherwise outlive the list it belongs to.
   */
  useEffect(() => {
    const dismiss = () => api.hide()

    document.addEventListener('inertia:start', dismiss)

    return () => document.removeEventListener('inertia:start', dismiss)
  }, [api])

  return (
    <HoverPreviewContext.Provider value={api}>
      {children}
      {content && (
        <div
          ref={cardRef}
          aria-hidden
          className="pointer-events-none fixed top-0 left-0 z-50 w-[264px] opacity-0 will-change-transform"
        >
          <div
            ref={tiltRef}
            className="bg-card overflow-hidden rounded-lg border shadow-lg shadow-black/5"
          >
            {content.imageUrl && (
              <img src={content.imageUrl} alt="" className="aspect-video w-full object-cover" />
            )}
            {(content.summary || content.meta) && (
              <div className="p-4">
                {content.summary && (
                  <p className="text-muted-foreground line-clamp-3 text-[13px] leading-relaxed">
                    {content.summary}
                  </p>
                )}
                {content.meta && (
                  <p className="text-muted-foreground mt-3 font-mono text-[11px] tracking-wider uppercase">
                    {content.meta}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </HoverPreviewContext.Provider>
  )
}
