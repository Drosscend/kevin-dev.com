import { Link } from '@adonisjs/inertia/react'

export default function Gone() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
      <p aria-hidden className="font-display text-7xl font-bold tracking-tight md:text-8xl">
        410
      </p>
      <h1 className="mt-4 text-lg">This content has been withdrawn</h1>
      <Link href="/" className="text-primary mt-8 text-sm font-medium hover:underline">
        Back to home
      </Link>
    </div>
  )
}
