import { Link } from '@adonisjs/inertia/react'
import { localePath, type Locale } from '#types/i18n'

export type ErrorPageProps = {
  locale: Locale
  labels: { title: string; backHome: string }
}

/**
 * Shared body of the 404, 410 and 500 pages: the status code as a
 * mute mark, the reason, and the way back. The home link keeps the
 * locale the visited URL asked for.
 */
export default function ErrorPage({ code, locale, labels }: ErrorPageProps & { code: string }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
      <p aria-hidden className="font-display text-7xl font-bold tracking-tight md:text-8xl">
        {code}
      </p>
      <h1 className="mt-4 text-lg">{labels.title}</h1>
      <Link
        href={localePath(locale, '/')}
        className="text-primary mt-8 text-sm font-medium hover:underline"
      >
        {labels.backHome}
      </Link>
    </div>
  )
}
