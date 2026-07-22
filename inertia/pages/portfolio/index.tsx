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
    <div className="mx-auto max-w-5xl space-y-8 px-6 py-10">
      <Seo meta={meta} />
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{labels.title}</h1>
        <Link
          href={otherLocalePath(locale, '/projects')}
          className="text-muted-foreground text-sm hover:underline"
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
              className="group overflow-hidden rounded-lg border transition-shadow hover:shadow-md"
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
              <div className="space-y-2 p-4">
                <h2 className="font-semibold group-hover:underline">{project.title}</h2>
                {project.summary && (
                  <p className="text-muted-foreground line-clamp-2 text-sm">{project.summary}</p>
                )}
                {project.technologies.length > 0 && (
                  <p className="text-muted-foreground flex flex-wrap gap-x-2 text-xs">
                    {project.technologies.map((technology) => (
                      <span key={technology.slug}>{technology.name}</span>
                    ))}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
