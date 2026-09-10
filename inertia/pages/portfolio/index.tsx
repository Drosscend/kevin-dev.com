import { ListingList, ListingRow } from '~/components/content_link'
import { EmptyState } from '~/components/empty_state'
import { PageHeader } from '~/components/page_header'
import { SectionLabel } from '~/components/section_label'
import Seo, { type SeoMeta } from '~/components/seo'
import StatusBadge from '~/components/status_badge'
import { TechnologyNames } from '~/components/technology_list'
import { useLocalePath } from '~/lib/locale'
import { type InertiaProps } from '~/types'
import type { Data } from '@generated/data'

type PortfolioIndexProps = InertiaProps<{
  projects: Data.Portfolio.ProjectCard[]
  meta: SeoMeta
}>

export default function PortfolioIndex({ projects, messages, meta }: PortfolioIndexProps) {
  const to = useLocalePath()
  const featured = projects.filter((project) => project.featured)
  const others = projects.filter((project) => !project.featured)

  /**
   * Featured projects open the page under their own label; without
   * any, the list stays flat.
   */
  const groups =
    featured.length > 0
      ? [
          { key: 'featured', label: messages.portfolio.featured, items: featured },
          { key: 'others', label: messages.portfolio.others, items: others },
        ].filter((group) => group.items.length > 0)
      : [{ key: 'all', label: null, items: projects }]

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 pb-24 md:pb-32">
      <Seo meta={meta} />
      <PageHeader title={messages.portfolio.title} />

      {projects.length === 0 ? (
        <EmptyState>{messages.portfolio.empty}</EmptyState>
      ) : (
        <div className="space-y-14">
          {groups.map((group) => (
            <section key={group.key}>
              {group.label && <SectionLabel as="h2">{group.label}</SectionLabel>}
              <div className={group.label ? 'mt-5' : undefined}>
                <ListingList>
                  {group.items.map((project) => (
                    <ListingRow
                      key={project.slug}
                      href={to(`/projects/${project.slug}`)}
                      title={project.title}
                      summary={project.summary}
                      picture={project.cover}
                      heading={group.label ? 'h3' : 'h2'}
                      meta={
                        (project.period || project.ongoing) && (
                          <>
                            {project.period && <span>{project.period}</span>}
                            {project.ongoing && (
                              <StatusBadge>{messages.portfolio.ongoing}</StatusBadge>
                            )}
                          </>
                        )
                      }
                      footer={
                        project.technologies.length > 0 && (
                          <TechnologyNames technologies={project.technologies} />
                        )
                      }
                    />
                  ))}
                </ListingList>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
