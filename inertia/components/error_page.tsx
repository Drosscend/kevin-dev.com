import { Link } from '@adonisjs/inertia/react'
import { usePage } from '@inertiajs/react'
import { useLocalePath } from '~/lib/locale'
import { type Messages } from '~/types'

/**
 * Shared body of the 404, 410 and 500 pages: the status code as a
 * mute mark, the reason, and the way back. The home link keeps the
 * locale the visited URL asked for.
 */
export default function ErrorPage({
  code,
  reason,
}: {
  code: string
  reason: keyof Messages['errors']
}) {
  const { messages } = usePage().props
  const to = useLocalePath()

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
      <p aria-hidden className="font-display text-7xl font-bold tracking-tight md:text-8xl">
        {code}
      </p>
      <h1 className="mt-4 text-lg">{messages.errors[reason]}</h1>
      <Link href={to('/')} className="text-primary mt-8 text-sm font-medium hover:underline">
        {messages.errors.backHome}
      </Link>
    </div>
  )
}
