import { ListingList, ListingRow } from '~/components/content_link'
import { BackLink } from '~/components/page_header'
import Seo, { type SeoMeta } from '~/components/seo'
import { localePath } from '~/lib/locale'

type Entry = { slug: string; title: string; summary: string; coverUrl: string | null }

type TechnologyShowProps = {
  locale: 'fr' | 'en'
  technology: {
    slug: string
    name: string
    category: string
    logoUrl: string | null
    description: string
    projects: Entry[]
    articles: Entry[]
    talks: Entry[]
  }
  labels: {
    backToList: string
    usedIn: string
    writtenAbout: string
    spokenAbout: string
    unused: string
  }
  meta: SeoMeta
}

/** Listing of the entries a technology is attached to, on either side. */
function UsageSection({
  title,
  entries,
  href,
}: {
  title: string
  entries: Entry[]
  href: (slug: string) => string
}) {
  if (entries.length === 0) {
    return null
  }

  return (
    <section className="mt-14">
      <h2 className="text-muted-foreground font-mono text-xs tracking-wider uppercase">{title}</h2>
      <div className="mt-8">
        <ListingList>
          {entries.map((entry) => (
            <ListingRow
              key={entry.slug}
              href={href(entry.slug)}
              title={entry.title}
              summary={entry.summary}
              thumbnailUrl={entry.coverUrl}
              heading="h3"
            />
          ))}
        </ListingList>
      </div>
    </section>
  )
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

        <UsageSection
          title={labels.usedIn}
          entries={technology.projects}
          href={(slug) => to(`/projects/${slug}`)}
        />

        <UsageSection
          title={labels.writtenAbout}
          entries={technology.articles}
          href={(slug) => to(`/blog/${slug}`)}
        />

        <UsageSection
          title={labels.spokenAbout}
          entries={technology.talks}
          href={(slug) => to(`/talks/${slug}`)}
        />

        {technology.projects.length === 0 &&
          technology.articles.length === 0 &&
          technology.talks.length === 0 && (
            <p className="text-muted-foreground mt-14">{labels.unused}</p>
          )}
      </div>
    </div>
  )
}
