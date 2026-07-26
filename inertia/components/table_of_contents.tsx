import { useCallback, useMemo, useSyncExternalStore, type MouseEvent } from 'react'
import { cn } from '~/lib/utils'

type Heading = { id: string; text: string; level: number }

/**
 * Distance from the top at which a heading counts as current. It sits just
 * below where an anchor jump parks its target, so following a link marks
 * the entry that was clicked rather than the one above it.
 */
const ACTIVE_OFFSET = 120

/** Below two entries a summary carries no more information than the page itself. */
const MINIMUM_HEADINGS = 2

const HEADING_PATTERN = /<h([23])\s+id="([^"]*)"[^>]*>([\s\S]*?)<\/h\1>/g
const TAG_PATTERN = /<[^>]*>/g
const ENTITY_PATTERN = /&(#x[\da-f]+|#\d+|[a-z]+);/gi
const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
}

function decodeEntities(text: string) {
  return text.replace(ENTITY_PATTERN, (match, entity: string) => {
    if (entity.startsWith('#x') || entity.startsWith('#X')) {
      return String.fromCodePoint(Number.parseInt(entity.slice(2), 16))
    }
    if (entity.startsWith('#')) {
      return String.fromCodePoint(Number(entity.slice(1)))
    }
    return NAMED_ENTITIES[entity.toLowerCase()] ?? match
  })
}

/**
 * Reads the outline out of the stored article HTML rather than the rendered
 * DOM, so the summary is part of the server-rendered page. Headings are
 * slugged when the Markdown is rendered, so every id already exists.
 */
function parseHeadings(html: string): Heading[] {
  return [...html.matchAll(HEADING_PATTERN)].map(([, level, id, inner]) => ({
    id: decodeEntities(id),
    text: decodeEntities(inner.replace(TAG_PATTERN, '')).trim(),
    level: Number(level),
  }))
}

/**
 * Last heading scrolled past, so the summary marks the section being read.
 * The bottom of the page always resolves to the last heading, which a short
 * final section would never reach on its own.
 */
function currentHeading(headings: Heading[]) {
  if (headings.length === 0) {
    return null
  }

  if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 2) {
    return headings[headings.length - 1].id
  }

  const passed = headings.filter((heading) => {
    const element = document.getElementById(heading.id)
    return element !== null && element.getBoundingClientRect().top <= ACTIVE_OFFSET
  })

  return passed.at(-1)?.id ?? headings[0].id
}

function useActiveHeading(headings: Heading[]) {
  const subscribe = useCallback((notify: () => void) => {
    window.addEventListener('scroll', notify, { passive: true })
    window.addEventListener('resize', notify)

    return () => {
      window.removeEventListener('scroll', notify)
      window.removeEventListener('resize', notify)
    }
  }, [])

  return useSyncExternalStore(
    subscribe,
    () => currentHeading(headings),
    () => headings[0]?.id ?? null
  )
}

/**
 * Scrolls to a heading instead of letting the browser follow the fragment.
 * Headings are slugged from their own text, so on a French article most ids
 * carry accents, and a percent-encoded fragment such as "#le-co%C3%BBt" is
 * not resolved back to its element. The hash is still written to the URL so
 * the anchor stays shareable, and modified clicks keep their native meaning.
 */
function scrollToHeading(event: MouseEvent<HTMLAnchorElement>, id: string) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return
  }

  const target = document.getElementById(id)
  if (!target) {
    return
  }

  event.preventDefault()
  target.scrollIntoView()
  window.history.pushState(null, '', `#${encodeURIComponent(id)}`)
}

/**
 * Summary of an article, built from its own headings. Renders nothing when
 * the content is too flat to be worth navigating.
 */
export default function TableOfContents({ html, label }: { html: string; label: string }) {
  const headings = useMemo(() => parseHeadings(html), [html])
  const active = useActiveHeading(headings)

  if (headings.length < MINIMUM_HEADINGS) {
    return null
  }

  return (
    <nav aria-label={label}>
      <p className="text-muted-foreground font-mono text-xs tracking-wider uppercase">{label}</p>
      <ul className="mt-4 border-l text-[13px]">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${encodeURIComponent(heading.id)}`}
              onClick={(event) => scrollToHeading(event, heading.id)}
              aria-current={active === heading.id ? 'true' : undefined}
              className={cn(
                '-ml-px block border-l-2 py-1.5 leading-snug transition-colors',
                heading.level === 3 ? 'pl-7' : 'pl-4',
                active === heading.id
                  ? 'border-primary text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground border-transparent'
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
