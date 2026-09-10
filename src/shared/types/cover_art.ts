/**
 * Stand-in artwork for an entry that has no cover, described as plain
 * figures: the client draws them as SVG nodes with the theme tokens,
 * the server draws the same figures into the social card with the
 * light palette baked in.
 */

export type ArtRole = 'paper' | 'muted' | 'ink' | 'accent' | 'subtle'

export interface ArtRect {
  kind: 'rect'
  x: number
  y: number
  width: number
  height: number
  role: ArtRole
}

export interface ArtText {
  kind: 'text'
  x: number
  y: number
  size: number
  role: ArtRole
  family: 'display' | 'mono'
  value: string
  anchor: 'start' | 'middle'
  opacity?: number
  tracking?: number
}

export type ArtFigure = ArtRect | ArtText

export interface CoverArt {
  width: number
  height: number
  figures: ArtFigure[]
}

export interface CoverArtInput {
  /** `cover` sets the title, `mark` keeps a single initial for small frames. */
  layout: 'cover' | 'mark'
  width: number
  height: number
  title: string
  kicker?: string
  footer?: string
}

/** Frames the client draws a mark into, scaled by CSS to whatever the slot is. */
export const MARK_FRAMES = {
  video: { width: 160, height: 90 },
  square: { width: 96, height: 96 },
}
export type MarkAspect = keyof typeof MARK_FRAMES
/** The size social platforms crop their previews from. */
export const OG_FRAME = { width: 1200, height: 630 }

const MAX_TITLE_LINES = 3
/** Title sizes tried from largest to smallest, as a share of the frame height. */
const TITLE_SCALES = [0.26, 0.21, 0.165, 0.14, 0.12, 0.105]
/** Average advance of Archivo SemiBold, used to break lines without measuring. */
const ADVANCE = 0.5
const LINE_HEIGHT = 1.1
/** Cap height of Archivo, to know where a line of type actually starts. */
const CAP_HEIGHT = 0.72

function initialOf(title: string) {
  return title.trim().charAt(0).toUpperCase() || '?'
}

function wrap(title: string, maxChars: number) {
  const lines: string[] = []
  let current = ''

  for (const word of title.trim().split(/\s+/)) {
    const candidate = current ? `${current} ${word}` : word

    if (candidate.length > maxChars && current) {
      lines.push(current)
      current = word
    } else {
      current = candidate
    }
  }

  if (current) {
    lines.push(current)
  }

  return lines
}

/**
 * Largest size the title holds at: at most three lines, and a block
 * that starts below `ceiling` once stacked up from `bottom`. A short
 * title therefore fills the frame instead of floating in it.
 */
function fitTitle(
  title: string,
  frame: { width: number; height: number; padding: number; bottom: number; ceiling: number }
) {
  const inner = frame.width - frame.padding * 2
  const linesAt = (size: number) => wrap(title, Math.max(6, Math.floor(inner / (size * ADVANCE))))

  for (const scale of TITLE_SCALES) {
    const size = frame.height * scale
    const lines = linesAt(size)
    const top = frame.bottom - (lines.length - 1) * size * LINE_HEIGHT - size * CAP_HEIGHT

    if (lines.length <= MAX_TITLE_LINES && top >= frame.ceiling) {
      return { size, lines }
    }
  }

  const size = frame.height * TITLE_SCALES[TITLE_SCALES.length - 1]

  return { size, lines: linesAt(size).slice(0, MAX_TITLE_LINES) }
}

/** The social card in miniature: the accent rule, and the initial where the title would sit. */
function markFigures(input: CoverArtInput): ArtFigure[] {
  const { width, height } = input
  const padding = width * 0.1

  return [
    { kind: 'rect', x: 0, y: 0, width, height, role: 'paper' },
    {
      kind: 'rect',
      x: padding,
      y: padding,
      width: width * 0.13,
      height: height * 0.04,
      role: 'accent',
    },
    {
      kind: 'text',
      x: padding,
      y: height - padding * 0.9,
      size: height * 0.5,
      role: 'ink',
      family: 'display',
      value: initialOf(input.title),
      anchor: 'start',
    },
  ]
}

function coverFigures(input: CoverArtInput): ArtFigure[] {
  const { width, height } = input
  const padding = width * 0.075
  const ruleHeight = Math.max(2, height * 0.014)
  const kickerSize = Math.max(11, height * 0.052)
  const footerSize = Math.max(11, height * 0.045)
  const figures: ArtFigure[] = [
    { kind: 'rect', x: 0, y: 0, width, height, role: 'paper' },
    {
      kind: 'rect',
      x: padding,
      y: padding,
      width: width * 0.075,
      height: ruleHeight,
      role: 'accent',
    },
  ]

  const kickerBaseline = padding + ruleHeight + kickerSize * 1.6

  if (input.kicker) {
    figures.push({
      kind: 'text',
      x: padding,
      y: kickerBaseline,
      size: kickerSize,
      role: 'subtle',
      family: 'mono',
      value: input.kicker.toUpperCase(),
      anchor: 'start',
      tracking: kickerSize * 0.1,
    })
  }

  const bottom = input.footer ? height - padding - footerSize * 2 : height - padding * 0.9
  const { size, lines } = fitTitle(input.title, {
    width,
    height,
    padding,
    bottom,
    ceiling: input.kicker
      ? kickerBaseline + kickerSize * 0.5
      : padding + ruleHeight + height * 0.06,
  })

  lines.forEach((line, index) => {
    figures.push({
      kind: 'text',
      x: padding,
      y: bottom - (lines.length - 1 - index) * size * LINE_HEIGHT,
      size,
      role: 'ink',
      family: 'display',
      value: line,
      anchor: 'start',
    })
  })

  if (input.footer) {
    figures.push({
      kind: 'text',
      x: padding,
      y: height - padding * 0.75,
      size: footerSize,
      role: 'subtle',
      family: 'mono',
      value: input.footer,
      anchor: 'start',
    })
  }

  return figures
}

export function coverArt(input: CoverArtInput): CoverArt {
  return {
    width: input.width,
    height: input.height,
    figures: input.layout === 'mark' ? markFigures(input) : coverFigures(input),
  }
}
