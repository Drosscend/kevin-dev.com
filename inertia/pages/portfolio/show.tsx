import { Link } from '@adonisjs/inertia/react'
import ArticleContent from '~/components/article_content'
import { LinkArrow } from '~/components/content_link'
import ExternalLinkList from '~/components/external_link_list'
import Lightbox from '~/components/lightbox'
import { BackLink } from '~/components/page_header'
import PreviewBanner from '~/components/preview_banner'
import ReadingLayout from '~/components/reading_layout'
import Seo, { type SeoMeta } from '~/components/seo'
import StatusBadge from '~/components/status_badge'
import TableOfContents from '~/components/table_of_contents'
import { TechnologySection } from '~/components/technology_list'
import { useLocalePath } from '~/lib/locale'
import { type InertiaProps } from '~/types'
import type { PreviewMode } from '#types/content'
import type { Data } from '@generated/data'

type PortfolioShowProps = InertiaProps<{
  preview: PreviewMode
  project: Data.Portfolio.ProjectDetail
  hasOtherLocale: boolean
  meta: SeoMeta
}>

export default function PortfolioShow({
  preview,
  project,
  messages,
  meta,
}: PortfolioShowProps) {
  const to = useLocalePath()

  return (
    <>
      <Seo meta={meta} />
      <ReadingLayout className="space-y-10" aside={<TableOfContents html={project.contentHtml} />}>
        {preview && <PreviewBanner preview={preview} />}

        <div className="text-sm">
          <BackLink href={to('/projects')} label={messages.portfolio.backToList} />
        </div>

        <header>
          <h1 className="text-3xl font-bold md:text-4xl">{project.title}</h1>
          <p className="text-muted-foreground mt-3 flex flex-wrap items-center gap-x-2.5 font-mono text-[13px]">
            {(project.startedAt || project.endedAt) && (
              <>
                <span>
                  {project.startedAt}
                  {/* oxlint-disable-next-line project-style/no-ui-arrow */}
                  {project.endedAt ? ` → ${project.endedAt}` : ''}
                </span>
                <span aria-hidden>·</span>
              </>
            )}
            <span>{project.readingTimeLabel}</span>
            {project.ongoing && <StatusBadge>{messages.portfolio.ongoing}</StatusBadge>}
          </p>
          <ExternalLinkList links={project.links} className="mt-5" />
        </header>

        <Lightbox className="space-y-10">
          {project.coverUrl && (
            <img src={project.coverUrl} alt="" className="w-full rounded-lg border" />
          )}

          <ArticleContent html={project.contentHtml} />
        </Lightbox>

        <TechnologySection
          title={messages.portfolio.technologies}
          technologies={project.technologies}
        />

        {project.articles.length > 0 && (
          <section className="border-t pt-8">
            <h2 className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
              {messages.portfolio.relatedArticles}
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {project.articles.map((article) => (
                <li key={article.slug}>
                  <Link
                    href={to(`/blog/${article.slug}`)}
                    className="group hover:text-primary font-medium transition-colors"
                  >
                    {article.title} <LinkArrow />
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
