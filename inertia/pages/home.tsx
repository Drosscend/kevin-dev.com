import { Link } from '@adonisjs/inertia/react'
import Seo, { type SeoMeta } from '~/components/seo'
import { localePath } from '~/lib/locale'

type HomeProps = {
  locale: 'fr' | 'en'
  latestArticles: { slug: string; title: string; summary: string }[]
  featuredProjects: { slug: string; title: string; summary: string; coverUrl: string | null }[]
  labels: {
    intro: string
    latestArticles: string
    featuredProjects: string
    allArticles: string
    allProjects: string
  }
  meta: SeoMeta
}

export default function Home({
  locale,
  latestArticles,
  featuredProjects,
  labels,
  meta,
}: HomeProps) {
  const to = (path: string) => localePath(locale, path)

  return (
    <div className="mx-auto max-w-5xl space-y-14 px-6 py-12">
      <Seo meta={meta} />

      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Kévin Véronési</h1>
        <p className="text-muted-foreground max-w-2xl text-lg">{labels.intro}</p>
      </section>

      {featuredProjects.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-semibold">{labels.featuredProjects}</h2>
            <Link href={to('/projects')} className="text-muted-foreground text-sm hover:underline">
              {labels.allProjects}
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
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
                <div className="space-y-1 p-4">
                  <h3 className="font-semibold group-hover:underline">{project.title}</h3>
                  {project.summary && (
                    <p className="text-muted-foreground line-clamp-2 text-sm">{project.summary}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {latestArticles.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-semibold">{labels.latestArticles}</h2>
            <Link href={to('/blog')} className="text-muted-foreground text-sm hover:underline">
              {labels.allArticles}
            </Link>
          </div>
          <div className="space-y-4">
            {latestArticles.map((article) => (
              <article key={article.slug}>
                <h3 className="font-semibold">
                  <Link href={to(`/blog/${article.slug}`)} className="hover:underline">
                    {article.title}
                  </Link>
                </h3>
                {article.summary && (
                  <p className="text-muted-foreground text-sm">{article.summary}</p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
