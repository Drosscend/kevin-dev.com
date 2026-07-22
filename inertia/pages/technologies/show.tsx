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
    <div className="mx-auto max-w-3xl space-y-8 px-6 py-10">
      <Seo meta={meta} />
      <div className="flex items-center justify-between gap-4 text-sm">
        <Link href={to('/technologies')} className="text-muted-foreground hover:underline">
          {labels.backToList}
        </Link>
        <Link
          href={otherLocalePath(locale, `/technologies/${technology.slug}`)}
          className="text-muted-foreground hover:underline"
        >
          {locale === 'en' ? 'FR' : 'EN'}
        </Link>
      </div>

      <header className="flex items-center gap-4">
        {technology.logoUrl && (
          <img src={technology.logoUrl} alt="" className="size-14 rounded object-contain" />
        )}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{technology.name}</h1>
          {technology.description && (
            <p className="text-muted-foreground mt-1">{technology.description}</p>
          )}
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">{labels.usedIn}</h2>
        {technology.projects.length === 0 ? (
          <p className="text-muted-foreground text-sm">{labels.noProjects}</p>
        ) : (
          <div className="space-y-4">
            {technology.projects.map((project) => (
              <article key={project.slug} className="space-y-1">
                <h3 className="font-semibold">
                  <Link href={to(`/projects/${project.slug}`)} className="hover:underline">
                    {project.title}
                  </Link>
                </h3>
                {project.summary && (
                  <p className="text-muted-foreground text-sm">{project.summary}</p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
