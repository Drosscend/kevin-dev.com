import { Link } from '@adonisjs/inertia/react'
import { ExternalLink, FileText } from 'lucide-react'
import ArticleContent from '~/components/article_content'
import { BackLink } from '~/components/page_header'
import ReadingLayout from '~/components/reading_layout'
import Seo, { type SeoMeta } from '~/components/seo'
import StatusBadge from '~/components/status_badge'
import TableOfContents from '~/components/table_of_contents'
import { TechnologySection, type TechnologyRef } from '~/components/technology_list'
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
    ongoing: boolean
    links: { label: string; url: string; type: string }[]
    technologies: TechnologyRef[]
    articles: { slug: string; title: string }[]
  }
  hasOtherLocale: boolean
  labels: {
    backToList: string
    draft: string
    ongoing: string
    technologies: string
    relatedArticles: string
    contents: string
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
    <>
      <Seo meta={meta} />
      <ReadingLayout
        className="space-y-10"
        aside={<TableOfContents html={project.contentHtml} label={labels.contents} />}
      >
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
          {(project.startedAt || project.endedAt || project.ongoing) && (
            <p className="text-muted-foreground mt-3 flex flex-wrap items-center gap-x-2.5 font-mono text-[13px]">
              <span>
                {project.startedAt}
                {project.endedAt ? ` → ${project.endedAt}` : ''}
              </span>
              {project.ongoing && <StatusBadge>{labels.ongoing}</StatusBadge>}
            </p>
          )}
          {project.links.length > 0 && (
            <p className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {project.links.map((link) => {
                const Icon = link.type === 'paper' ? FileText : ExternalLink
                return (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary inline-flex items-center gap-1.5 font-medium hover:underline"
                  >
                    <Icon className="size-3.5" />
                    {link.label}
                  </a>
                )
              })}
            </p>
          )}
        </header>

        {project.coverUrl && (
          <img src={project.coverUrl} alt="" className="w-full rounded-lg border" />
        )}

        <ArticleContent html={project.contentHtml} />

        <TechnologySection
          locale={locale}
          title={labels.technologies}
          technologies={project.technologies}
        />

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
      </ReadingLayout>
    </>
  )
}
