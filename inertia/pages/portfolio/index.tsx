import { localePath } from '#types/i18n'
import { ListingList, ListingRow } from '~/components/content_link'
import { EmptyState } from '~/components/empty_state'
import { PageHeader } from '~/components/page_header'
import Seo, { type SeoMeta } from '~/components/seo'
import StatusBadge from '~/components/status_badge'
import { TechnologyNames } from '~/components/technology_list'
import { type InertiaProps } from '~/types'
import type { Data } from '@generated/data'

type PortfolioIndexProps = InertiaProps<{
  projects: Data.Portfolio.ProjectCard[]
  meta: SeoMeta
}>

export default function PortfolioIndex({ locale, projects, messages, meta }: PortfolioIndexProps) {
  const to = (path: string) => localePath(locale, path)

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 pb-24 md:pb-32">
      <Seo meta={meta} />
      <PageHeader title={messages.portfolio.title} />

      {projects.length === 0 ? (
        <EmptyState>{messages.portfolio.empty}</EmptyState>
      ) : (
        <ListingList>
          {projects.map((project) => (
            <ListingRow
              key={project.slug}
              href={to(`/projects/${project.slug}`)}
              title={project.title}
              summary={project.summary}
              thumbnailUrl={project.coverUrl}
              meta={
                <>
                  <span>
                    {project.period && `${project.period} · `}
                    {project.readingTimeLabel}
                  </span>
                  {project.ongoing && <StatusBadge>{messages.portfolio.ongoing}</StatusBadge>}
                </>
              }
              footer={
                project.technologies.length > 0 && (
                  <TechnologyNames technologies={project.technologies} />
                )
              }
            />
          ))}
        </ListingList>
      )}
    </div>
  )
}
