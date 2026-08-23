import { usePage } from '@inertiajs/react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MinusIcon,
  PlusIcon,
  ScanIcon,
  XIcon,
} from 'lucide-react'
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type WheelEvent as ReactWheelEvent,
} from 'react'
import { createPortal } from 'react-dom'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'
import { type Messages } from '~/types'

type Labels = Messages['lightbox']

type Slide = { src: string; alt: string; caption: string }

/** Zoom state of the viewed image: factor, then translation in screen pixels. */
type View = { scale: number; x: number; y: number }

const FIT: View = { scale: 1, x: 0, y: 0 }
const MAX_SCALE = 6
/** Factor applied by a single zoom step: button, key or wheel notch. */
const ZOOM_STEP = 1.4
const DOUBLE_CLICK_SCALE = 2.5
/** Horizontal travel, in pixels, that turns a drag into a slide change. */
const SWIPE_DISTANCE = 60
/** Pointer travel tolerated before a click stops counting as a click. */
const CLICK_SLOP = 4

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

/** A linked image keeps its link instead of zooming. */

/** The closest matching ancestor of an event target, when it is one. */
function closest(target: EventTarget | null, selector: string) {
  return target instanceof Element ? target.closest(selector) : null
}

function zoomable(image: HTMLImageElement) {
  return !image.closest('a')
}

function imagesOf(root: HTMLElement) {
  return [...root.querySelectorAll('img')].filter(zoomable)
}

function slideOf(image: HTMLImageElement): Slide {
  return {
    src: image.currentSrc || image.src,
    alt: image.alt,
    caption: image.title || image.alt || '',
  }
}

/**
 * Makes every image of the wrapped block open full screen when clicked.
 * The images of one block form one gallery, so a project cover and the
 * pictures of its article are browsed together when both sit inside.
 * Content images arrive as server-rendered HTML, so the button
 * affordances are written to the DOM and clicks are caught by bubbling
 * rather than bound to each node.
 */
export default function Lightbox({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  const { lightbox } = usePage().props.messages
  const container = useRef<HTMLDivElement>(null)
  const opener = useRef<HTMLImageElement | null>(null)
  const [gallery, setGallery] = useState<{ slides: Slide[]; start: number } | null>(null)

  useEffect(() => {
    const root = container.current

    if (!root) {
      return
    }

    const images = imagesOf(root)
    images.forEach((image) => {
      image.tabIndex = 0
      image.setAttribute('role', 'button')
      image.setAttribute(
        'aria-label',
        image.alt ? `${lightbox.open} : ${image.alt}` : lightbox.open
      )
      image.classList.add('cursor-zoom-in')
    })

    return () => {
      images.forEach((image) => {
        image.removeAttribute('tabindex')
        image.removeAttribute('role')
        image.removeAttribute('aria-label')
        image.classList.remove('cursor-zoom-in')
      })
    }
  })

  function open(image: HTMLImageElement) {
    const root = container.current

    if (!root) {
      return
    }

    const images = imagesOf(root)
    opener.current = image
    setGallery({ slides: images.map(slideOf), start: Math.max(0, images.indexOf(image)) })
  }

  function target(event: ReactMouseEvent | ReactKeyboardEvent) {
    const image = closest(event.target, 'img')
    return image instanceof HTMLImageElement && zoomable(image) ? image : null
  }

  function onClick(event: ReactMouseEvent<HTMLDivElement>) {
    const image = target(event)

    if (image) {
      open(image)
    }
  }

  function onKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return
    }

    const image = target(event)

    if (image) {
      event.preventDefault()
      open(image)
    }
  }

  /**
   * Hands the focus back to the image that was opened, once the overlay
   * holding it has actually left the DOM.
   */
  useEffect(() => {
    if (!gallery) {
      opener.current?.focus()
    }
  }, [gallery])

  return (
    <>
      <div ref={container} className={className} onClick={onClick} onKeyDown={onKeyDown}>
        {children}
      </div>
      {gallery && (
        <Viewer
          slides={gallery.slides}
          start={gallery.start}
          labels={lightbox}
          onClose={() => setGallery(null)}
        />
      )}
    </>
  )
}

/**
 * The overlay itself. Mounted only once an image is opened, so it never
 * renders on the server. Dark whatever the site theme: the image is the
 * only thing meant to carry colour here.
 */
function Viewer({
  slides,
  start,
  labels,
  onClose,
}: {
  slides: Slide[]
  start: number
  labels: Labels
  onClose: () => void
}) {
  const [index, setIndex] = useState(start)
  const [view, setView] = useState<View>(FIT)
  const [gesturing, setGesturing] = useState(false)
  const overlay = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const picture = useRef<HTMLImageElement>(null)
  /** Mirror of the view state, readable synchronously from pointer handlers. */
  const applied = useRef<View>(FIT)
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const drag = useRef<{ x: number; y: number; view: View; moved: boolean } | null>(null)
  const pinch = useRef<{ distance: number; scale: number } | null>(null)
  const slide = slides[index]
  const many = slides.length > 1

  /**
   * Commits a view, keeping the image from being dragged off the stage.
   */
  function apply(next: View) {
    const box = stage.current?.getBoundingClientRect()
    const node = picture.current
    let bounded = next

    if (box && node && next.scale > 1) {
      const limitX = Math.max(0, (node.offsetWidth * next.scale - box.width) / 2)
      const limitY = Math.max(0, (node.offsetHeight * next.scale - box.height) / 2)
      bounded = {
        scale: next.scale,
        x: clamp(next.x, -limitX, limitX),
        y: clamp(next.y, -limitY, limitY),
      }
    }

    applied.current = bounded
    setView(bounded)
  }

  /**
   * Zooms to a factor while holding the given screen point still. Without
   * a point the stage centre is used, which is what the buttons and the
   * keyboard want.
   */
  function zoomTo(scale: number, originX?: number, originY?: number) {
    const box = stage.current?.getBoundingClientRect()
    const bounded = clamp(scale, 1, MAX_SCALE)

    if (!box || bounded === 1) {
      apply(FIT)
      return
    }

    const centreX = box.left + box.width / 2
    const centreY = box.top + box.height / 2
    const anchorX = (originX ?? centreX) - centreX
    const anchorY = (originY ?? centreY) - centreY
    const current = applied.current
    const ratio = bounded / current.scale

    apply({
      scale: bounded,
      x: anchorX + (current.x - anchorX) * ratio,
      y: anchorY + (current.y - anchorY) * ratio,
    })
  }

  /** Every slide change starts over from a fitted, centred image. */
  function goTo(target: number) {
    setIndex(target)
    applied.current = FIT
    setView(FIT)
  }

  function go(step: number) {
    if (slides.length > 1) {
      goTo((index + step + slides.length) % slides.length)
    }
  }

  /**
   * Keyboard control, plus a focus loop so tabbing stays in the overlay.
   * The overlay holds the focus while it is open, so the keys are read
   * from it rather than from the document. Every focusable element it
   * holds is a button.
   */
  function onKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Tab') {
      const buttons = [...(overlay.current?.querySelectorAll<HTMLElement>('button') ?? [])]

      if (buttons.length === 0) {
        return
      }

      event.preventDefault()
      const position = buttons.findIndex((button) => button === document.activeElement)
      const step = event.shiftKey ? -1 : 1
      buttons[(position + step + buttons.length) % buttons.length].focus()
      return
    }

    const actions = new Map<string, () => void>([
      ['Escape', onClose],
      ['ArrowLeft', () => go(-1)],
      ['ArrowRight', () => go(1)],
      ['Home', () => goTo(0)],
      ['End', () => goTo(slides.length - 1)],
      ['+', () => zoomTo(applied.current.scale * ZOOM_STEP)],
      ['=', () => zoomTo(applied.current.scale * ZOOM_STEP)],
      ['-', () => zoomTo(applied.current.scale / ZOOM_STEP)],
      ['0', () => apply(FIT)],
    ])

    const action = actions.get(event.key)

    if (action) {
      event.preventDefault()
      action()
    }
  }

  /**
   * The page cannot scroll while the overlay is open, so the wheel is
   * free to drive the zoom without cancelling the event.
   */
  function onWheel(event: ReactWheelEvent<HTMLDivElement>) {
    const factor = event.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP
    zoomTo(applied.current.scale * factor, event.clientX, event.clientY)
  }

  useEffect(() => {
    const scroll = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    overlay.current?.focus()

    return () => {
      document.body.style.overflow = scroll
    }
  }, [])

  /** A navigation would leave the overlay hanging over the next page. */
  useEffect(() => {
    document.addEventListener('inertia:start', onClose)

    return () => document.removeEventListener('inertia:start', onClose)
  }, [onClose])

  /** Neighbours are fetched ahead so browsing does not flash. */
  useEffect(() => {
    ;[slides[index - 1], slides[index + 1]].forEach((neighbour) => {
      if (neighbour) {
        new Image().src = neighbour.src
      }
    })
  }, [index, slides])

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (closest(event.target, 'button')) {
      return
    }

    stage.current?.setPointerCapture(event.pointerId)
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })

    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()]
      pinch.current = { distance: Math.hypot(b.x - a.x, b.y - a.y), scale: applied.current.scale }
      drag.current = null
      return
    }

    drag.current = { x: event.clientX, y: event.clientY, view: applied.current, moved: false }
    setGesturing(true)
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(event.pointerId)) {
      return
    }

    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })

    if (pinch.current && pointers.current.size >= 2) {
      const [a, b] = [...pointers.current.values()]
      const distance = Math.hypot(b.x - a.x, b.y - a.y)
      const scale = pinch.current.scale * (distance / pinch.current.distance)
      zoomTo(scale, (a.x + b.x) / 2, (a.y + b.y) / 2)
      return
    }

    const state = drag.current

    if (!state) {
      return
    }

    const dx = event.clientX - state.x
    const dy = event.clientY - state.y

    if (Math.abs(dx) > CLICK_SLOP || Math.abs(dy) > CLICK_SLOP) {
      state.moved = true
    }

    if (state.view.scale > 1) {
      apply({ scale: state.view.scale, x: state.view.x + dx, y: state.view.y + dy })
    }
  }

  function onPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    pointers.current.delete(event.pointerId)

    if (pointers.current.size < 2) {
      pinch.current = null
    }

    const state = drag.current
    drag.current = null
    setGesturing(false)

    if (!state) {
      return
    }

    const dx = event.clientX - state.x
    const dy = event.clientY - state.y

    // Fitted image: a horizontal throw browses the gallery.
    if (state.view.scale === 1 && Math.abs(dx) > SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy)) {
      go(dx < 0 ? 1 : -1)
      return
    }

    // A plain click beside the image closes, like any modal backdrop.
    if (!state.moved && !closest(event.target, 'img')) {
      onClose()
    }
  }

  function onDoubleClick(event: ReactMouseEvent<HTMLImageElement>) {
    zoomTo(applied.current.scale > 1 ? 1 : DOUBLE_CLICK_SCALE, event.clientX, event.clientY)
  }

  return createPortal(
    <div
      ref={overlay}
      role="dialog"
      aria-modal="true"
      aria-label={labels.viewer}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-50 flex flex-col bg-neutral-950/95 text-white outline-none backdrop-blur-sm"
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <span className="font-mono text-xs tabular-nums text-white/50">
          {many && `${index + 1} / ${slides.length}`}
        </span>

        <div className="flex items-center gap-1">
          <ViewerButton
            label={labels.zoomOut}
            disabled={view.scale <= 1}
            onClick={() => zoomTo(applied.current.scale / ZOOM_STEP)}
          >
            <MinusIcon />
          </ViewerButton>
          <span className="w-14 text-center font-mono text-xs tabular-nums text-white/50">
            {Math.round(view.scale * 100)} %
          </span>
          <ViewerButton
            label={labels.zoomIn}
            disabled={view.scale >= MAX_SCALE}
            onClick={() => zoomTo(applied.current.scale * ZOOM_STEP)}
          >
            <PlusIcon />
          </ViewerButton>
          <ViewerButton label={labels.reset} disabled={view.scale === 1} onClick={() => apply(FIT)}>
            <ScanIcon />
          </ViewerButton>
          <ViewerButton label={labels.close} onClick={onClose}>
            <XIcon />
          </ViewerButton>
        </div>
      </div>

      <div
        ref={stage}
        className="relative flex-1 touch-none overflow-hidden"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
      >
        <img
          ref={picture}
          src={slide.src}
          alt={slide.alt}
          draggable={false}
          onDoubleClick={onDoubleClick}
          style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}
          className={cn(
            'absolute inset-0 m-auto max-h-full max-w-full object-contain select-none',
            gesturing
              ? 'cursor-grabbing'
              : 'transition-transform duration-200 motion-reduce:transition-none',
            !gesturing && (view.scale > 1 ? 'cursor-grab' : 'cursor-zoom-in')
          )}
        />

        {many && (
          <>
            <ViewerButton
              label={labels.previous}
              onClick={() => go(-1)}
              className="absolute top-1/2 left-2 size-11 -translate-y-1/2 sm:left-4"
            >
              <ChevronLeftIcon className="size-6" />
            </ViewerButton>
            <ViewerButton
              label={labels.next}
              onClick={() => go(1)}
              className="absolute top-1/2 right-2 size-11 -translate-y-1/2 sm:right-4"
            >
              <ChevronRightIcon className="size-6" />
            </ViewerButton>
          </>
        )}
      </div>

      <div className="space-y-3 px-4 py-4">
        {slide.caption && (
          <p className="mx-auto max-w-[70ch] text-center text-sm text-white/70">{slide.caption}</p>
        )}
        <p
          aria-hidden
          className="hidden flex-wrap items-center justify-center gap-x-4 gap-y-2 font-mono text-[11px] text-white/40 md:flex"
        >
          <Shortcut keys="Esc" label={labels.hintClose} />
          {many && <Shortcut keys="← →" label={labels.hintNavigate} />}
          <Shortcut keys="+ / -" label={labels.hintZoom} />
          <Shortcut keys="0" label={labels.hintReset} />
        </p>
      </div>
    </div>,
    document.body
  )
}

function ViewerButton({
  label,
  className,
  children,
  ...props
}: {
  label: string
  className?: string
  children: ReactNode
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      title={label}
      aria-label={label}
      className={cn(
        'text-white/70 hover:bg-white/15 hover:text-white disabled:opacity-25',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
}

function Shortcut({ keys, label }: { keys: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <kbd className="rounded border border-white/20 px-1.5 py-0.5">{keys}</kbd>
      {label}
    </span>
  )
}
