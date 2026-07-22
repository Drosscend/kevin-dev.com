import { Link } from '@adonisjs/inertia/react'
import Seo, { type SeoMeta } from '~/components/seo'
import { localePath, otherLocalePath } from '~/lib/locale'

type TechnologyShowProps = {
  locale: 'fr' | 'en'
  technology: {
    slug: string
    name: string
    category: string
    logoUrl: string | null
    description: string
    projects: { slug: string; title: string; summary: string }[]
  }
  labels: {
    backToList: string
    usedIn: string
    noProjects: string
  }
  meta: SeoMeta
}

export default function TechnologyShow({ locale, technology, labels, meta }: TechnologyShowProps) {
  const to = (path: string) => localePath(locale, path)

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 pb-24 md:pb-32">
      <Seo meta={meta} />
      <div className="mx-auto max-w-[720px]">
        <div className="flex items-baseline justify-between gap-4 text-sm">
          <Link
            href={to('/technologies')}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            {labels.backToList}
          </Link>
          <Link
            href={otherLocalePath(locale, `/technologies/${technology.slug}`)}
            className="text-muted-foreground hover:text-primary font-mono text-xs tracking-wider uppercase transition-colors"
          >
            {locale === 'en' ? 'FR' : 'EN'}
          </Link>
        </div>

        <header className="mt-10 flex items-center gap-5">
          {technology.logoUrl && (
            <img
              src={technology.logoUrl}
              alt=""
              className="size-14 shrink-0 rounded object-contain"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold md:text-4xl">{technology.name}</h1>
            {technology.description && (
              <p className="text-muted-foreground mt-2">{technology.description}</p>
            )}
          </div>
        </header>

        <section className="mt-14">
          <h2 className="text-2xl font-semibold">{labels.usedIn}</h2>
          {technology.projects.length === 0 ? (
            <p className="text-muted-foreground mt-4 text-sm">{labels.noProjects}</p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {technology.projects.map((project) => (
                <Link
                  key={project.slug}
                  href={to(`/projects/${project.slug}`)}
                  className="group bg-card hover:border-primary flex flex-col rounded-lg border p-6 transition-[border-color,transform] hover:-translate-y-0.5 motion-reduce:transform-none"
                >
                  <h3 className="font-semibold">{project.title}</h3>
                  {project.summary && (
                    <p className="text-muted-foreground mt-2 line-clamp-3 text-sm">
                      {project.summary}
                    </p>
                  )}
                  <span aria-hidden className="text-primary mt-auto pt-4 text-sm font-medium">
                    <span className="inline-block transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
