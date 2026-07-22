import { Link } from '@adonisjs/inertia/react'
import { ExternalLink } from 'lucide-react'
import ArticleContent from '~/components/article_content'
import { BackLink } from '~/components/page_header'
import Seo, { type SeoMeta } from '~/components/seo'
import { localePath } from '~/lib/locale'

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
  labels,
  meta,
}: PortfolioShowProps) {
  const to = (path: string) => localePath(locale, path)

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 pb-24 md:pb-32">
      <Seo meta={meta} />
      <div className="mx-auto max-w-[720px] space-y-10">
        {isDraftPreview && (
          <p className="border-destructive text-destructive rounded-lg border px-4 py-2.5 text-sm">
            {labels.draft}
          </p>
        )}

        <div className="text-sm">
          <BackLink href={to('/projects')} label={labels.backToList} />
        </div>

        <header>
          <h1 className="text-3xl font-bold md:text-4xl">{project.title}</h1>
          {(project.startedAt || project.endedAt) && (
            <p className="text-muted-foreground mt-3 font-mono text-[13px]">
              {project.startedAt}
              {project.endedAt ? ` → ${project.endedAt}` : ''}
            </p>
          )}
          {project.links.length > 0 && (
            <p className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {project.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary inline-flex items-center gap-1.5 font-medium hover:underline"
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
          <section className="border-t pt-8">
            <h2 className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
              {labels.technologies}
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2.5">
              {project.technologies.map((technology) => (
                <li key={technology.slug}>
                  <Link
                    href={to(`/technologies/${technology.slug}`)}
                    className="bg-card hover:border-primary hover:text-primary inline-block rounded-full border px-4 py-1.5 text-sm transition-colors"
                  >
                    {technology.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {project.articles.length > 0 && (
          <section className="border-t pt-8">
            <h2 className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
              {labels.relatedArticles}
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {project.articles.map((article) => (
                <li key={article.slug}>
                  <Link
                    href={to(`/blog/${article.slug}`)}
                    className="hover:text-primary font-medium transition-colors"
                  >
                    {article.title} <span aria-hidden>→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}
