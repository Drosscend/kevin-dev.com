import { ListingList, ListingRow } from '~/components/content_link'
import { BackLink } from '~/components/page_header'
import Seo, { type SeoMeta } from '~/components/seo'
import { localePath } from '~/lib/locale'

type TechnologyShowProps = {
  locale: 'fr' | 'en'
  technology: {
    slug: string
    name: string
    category: string
    logoUrl: string | null
    description: string
    projects: { slug: string; title: string; summary: string; coverUrl: string | null }[]
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
    <div className="mx-auto max-w-5xl px-6 py-16 pb-24 md:pb-32">
      <Seo meta={meta} />
      <div className="mx-auto max-w-[720px]">
        <div className="text-sm">
          <BackLink href={to('/technologies')} label={labels.backToList} />
        </div>

        <header className="mt-10 flex items-center gap-5">
          {technology.logoUrl && (
            <img
              src={technology.logoUrl}
              alt=""
              className="size-14 shrink-0 rounded object-contain"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold md:text-4xl">{technology.name}</h1>
            {technology.description && (
              <p className="text-muted-foreground mt-2">{technology.description}</p>
            )}
          </div>
        </header>

        <section className="mt-14">
          <h2 className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
            {labels.usedIn}
          </h2>
          {technology.projects.length === 0 ? (
            <p className="text-muted-foreground mt-4">{labels.noProjects}</p>
          ) : (
            <div className="mt-8">
              <ListingList>
                {technology.projects.map((project) => (
                  <ListingRow
                    key={project.slug}
                    href={to(`/projects/${project.slug}`)}
                    title={project.title}
                    summary={project.summary}
                    thumbnailUrl={project.coverUrl}
                    heading="h3"
                  />
                ))}
              </ListingList>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
