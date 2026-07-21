import { Button } from '~/components/ui/button'

export default function Home() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center gap-8 px-6 text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">kevin-dev.com</h1>
        <p className="text-muted-foreground text-lg">
          Socle AdonisJS 7 + Inertia React (SSR) + Tailwind CSS 4 + shadcn/ui. Blog, portfolio et CV
          arrivent dans les prochaines phases.
        </p>
      </div>

      <div className="flex gap-4">
        <Button asChild>
          <a href="https://docs.adonisjs.com" target="_blank" rel="noreferrer">
            Docs AdonisJS
          </a>
        </Button>
        <Button asChild variant="outline">
          <a href="/health">/health</a>
        </Button>
      </div>
    </div>
  )
}
