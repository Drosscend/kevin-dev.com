import { ListingList, ListingRow } from '~/components/content_link'
import { PageHeader } from '~/components/page_header'
import Seo, { type SeoMeta } from '~/components/seo'
import StatusBadge from '~/components/status_badge'
import { TechnologyNames, type TechnologyRef } from '~/components/technology_list'
import { localePath } from '~/lib/locale'

type ProjectCard = {
  slug: string
  title: string
  summary: string
  coverUrl: string | null
  period: string | null
  ongoing: boolean
  technologies: TechnologyRef[]
}

type PortfolioIndexProps = {
  locale: 'fr' | 'en'
  projects: ProjectCard[]
  labels: { title: string; empty: string; ongoing: string }
  meta: SeoMeta
}

export default function PortfolioIndex({ locale, projects, labels, meta }: PortfolioIndexProps) {
  const to = (path: string) => localePath(locale, path)

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 pb-24 md:pb-32">
      <Seo meta={meta} />
      <PageHeader title={labels.title} />

      {projects.length === 0 ? (
        <p className="text-muted-foreground">{labels.empty}</p>
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
                (project.period || project.ongoing) && (
                  <>
                    {project.period && <span>{project.period}</span>}
                    {project.ongoing && <StatusBadge>{labels.ongoing}</StatusBadge>}
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
      )}
    </div>
  )
}
