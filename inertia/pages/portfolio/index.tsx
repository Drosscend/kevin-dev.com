import { Link } from '@adonisjs/inertia/react'
import { LinkCard } from '~/components/content_link'
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
            <LinkCard
              key={project.slug}
              href={to(`/projects/${project.slug}`)}
              title={project.title}
              summary={project.summary}
              coverUrl={project.coverUrl}
              heading="h2"
              meta={
                project.technologies.length > 0
                  ? project.technologies.map((technology) => (
                      <span key={technology.slug}>{technology.name}</span>
                    ))
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
