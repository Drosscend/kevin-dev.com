import { Link } from '@adonisjs/inertia/react'
import { ExternalLink } from 'lucide-react'
import ArticleContent from '~/components/article_content'
import Seo, { type SeoMeta } from '~/components/seo'
import { localePath, otherLocalePath } from '~/lib/locale'

type PortfolioShowProps = {
  locale: 'fr' | 'en'
  isDraftPreview: boolean
  project: {
    slug: string
    title: string
    summary: string
    contentHtml: string
    coverUrl: string | null
    startedAt: string | null
    endedAt: string | null
    links: { label: string; url: string; type: string }[]
    technologies: { slug: string; name: string }[]
    articles: { slug: string; title: string }[]
  }
  hasOtherLocale: boolean
  labels: {
    backToList: string
    draft: string
    technologies: string
    relatedArticles: string
  }
  meta: SeoMeta
}

export default function PortfolioShow({
  locale,
  isDraftPreview,
  project,
  hasOtherLocale,
  labels,
  meta,
}: PortfolioShowProps) {
  const to = (path: string) => localePath(locale, path)

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-6 py-10">
      <Seo meta={meta} />
      {isDraftPreview && (
        <p className="border-destructive text-destructive rounded-md border px-4 py-2 text-sm">
          {labels.draft}
        </p>
      )}

      <div className="flex items-center justify-between gap-4 text-sm">
        <Link href={to('/projects')} className="text-muted-foreground hover:underline">
          {labels.backToList}
        </Link>
        {hasOtherLocale && (
          <Link
            href={otherLocalePath(locale, `/projects/${project.slug}`)}
            className="text-muted-foreground hover:underline"
          >
            {locale === 'en' ? 'FR' : 'EN'}
          </Link>
        )}
      </div>

      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
        {(project.startedAt || project.endedAt) && (
          <p className="text-muted-foreground text-sm">
            {project.startedAt}
            {project.endedAt ? ` → ${project.endedAt}` : ''}
          </p>
        )}
        {project.links.length > 0 && (
          <p className="flex flex-wrap gap-3 text-sm">
            {project.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 underline underline-offset-2"
              >
                <ExternalLink className="size-3.5" />
                {link.label}
              </a>
            ))}
          </p>
        )}
      </header>

      {project.coverUrl && (
        <img src={project.coverUrl} alt="" className="w-full rounded-lg border" />
      )}

      <ArticleContent html={project.contentHtml} />

      {project.technologies.length > 0 && (
        <section className="space-y-2 border-t pt-4">
          <h2 className="text-sm font-semibold">{labels.technologies}</h2>
          <p className="flex flex-wrap gap-2 text-sm">
            {project.technologies.map((technology) => (
              <Link
                key={technology.slug}
                href={to(`/technologies/${technology.slug}`)}
                className="text-muted-foreground hover:underline"
              >
                {technology.name}
              </Link>
            ))}
          </p>
        </section>
      )}

      {project.articles.length > 0 && (
        <section className="space-y-2 border-t pt-4">
          <h2 className="text-sm font-semibold">{labels.relatedArticles}</h2>
          <ul className="space-y-1 text-sm">
            {project.articles.map((article) => (
              <li key={article.slug}>
                <Link href={to(`/blog/${article.slug}`)} className="hover:underline">
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
