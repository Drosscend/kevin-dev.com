import { usePage } from '@inertiajs/react'
import { trackEvent } from '~/lib/analytics'

/**
 * Invisible line placed after a piece of content: the first time it
 * scrolls into view, the content counts as read to the end. Keyed on
 * the URL so that moving to another entry watches the line again.
 */
export default function ReadMarker() {
  const { url } = usePage()

  return (
    <div
      key={url}
      aria-hidden
      ref={(node) => {
        if (!node) {
          return
        }

        const observer = new IntersectionObserver(([entry]) => {
          if (entry?.isIntersecting) {
            trackEvent('content-read')
            observer.disconnect()
          }
        })

        observer.observe(node)

        return () => observer.disconnect()
      }}
    />
  )
}
