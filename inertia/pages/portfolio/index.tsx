import { Link } from '@adonisjs/inertia/react'
import Seo, { type SeoMeta } from '~/components/seo'
import { localePath, otherLocalePath } from '~/lib/locale'

type ProjectCard = {
  slug: string
  title: string
  summary: string
  coverUrl: string | null
  featured: boolean
  technologies: { slug: string; name: string }[]
}

type PortfolioIndexProps = {
  locale: 'fr' | 'en'
  projects: ProjectCard[]
  labels: { title: string; empty: string }
  meta: SeoMeta
}

export default function PortfolioIndex({ locale, projects, labels, meta }: PortfolioIndexProps) {
  const to = (path: string) => localePath(locale, path)

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 pb-24 md:pb-32">
      <Seo meta={meta} />
      <div className="mb-12 flex items-baseline justify-between gap-4">
        <h1 className="text-3xl font-bold md:text-4xl">{labels.title}</h1>
        <Link
          href={otherLocalePath(locale, '/projects')}
          className="text-muted-foreground hover:text-primary font-mono text-xs tracking-wider uppercase transition-colors"
        >
          {locale === 'en' ? 'FR' : 'EN'}
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="text-muted-foreground">{labels.empty}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={to(`/projects/${project.slug}`)}
              className="group bg-card hover:border-primary flex flex-col overflow-hidden rounded-lg border transition-[border-color,transform] hover:-translate-y-0.5 motion-reduce:transform-none"
            >
              {project.coverUrl ? (
                <img
                  src={project.coverUrl}
                  alt=""
                  className="aspect-video w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="bg-muted aspect-video w-full" />
              )}
              <div className="flex grow flex-col p-6">
                <h2 className="font-semibold">{project.title}</h2>
                {project.summary && (
                  <p className="text-muted-foreground mt-2 line-clamp-3 text-sm">
                    {project.summary}
                  </p>
                )}
                {project.technologies.length > 0 && (
                  <p className="text-muted-foreground mt-4 flex flex-wrap gap-x-2.5 gap-y-1 font-mono text-xs">
                    {project.technologies.map((technology) => (
                      <span key={technology.slug}>{technology.name}</span>
                    ))}
                  </p>
                )}
                <span aria-hidden className="text-primary mt-auto pt-4 text-sm font-medium">
                  <span className="inline-block transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
