import { Link } from '@adonisjs/inertia/react'
import { X } from 'lucide-react'
import { useState, useSyncExternalStore } from 'react'
import { type Locale } from '#types/i18n'
import { Button } from '~/components/ui/button'

const DISMISSED_KEY = 'language-suggestion-dismissed'

const NO_SUBSCRIPTION = () => () => {}

function readPreferredLocale() {
  return localStorage.getItem(DISMISSED_KEY) ? '' : navigator.language.slice(0, 2).toLowerCase()
}

/**
 * Offers the other language rather than redirecting to it, which search
 * engines advise against. Resolved client-side, so the served HTML
 * stays identical whatever the request headers ask for.
 */
export default function LanguageSuggestion({
  targetLocale,
  href,
  label,
  dismissLabel,
}: {
  targetLocale: Locale
  href: string
  label: string
  dismissLabel: string
}) {
  const [dismissed, setDismissed] = useState(false)
  const preferred = useSyncExternalStore(NO_SUBSCRIPTION, readPreferredLocale, () => '')

  if (dismissed || preferred !== targetLocale) {
    return null
  }

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, '1')
    setDismissed(true)
  }

  return (
    <div className="bg-muted/60 border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-2">
        <Link
          href={href}
          lang={targetLocale}
          className="hover:text-primary text-sm underline underline-offset-4 transition-colors"
        >
          {label}
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={dismiss}
          aria-label={dismissLabel}
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  )
}
