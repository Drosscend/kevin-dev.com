import { localePath, type Locale } from '#types/i18n'
import { ListingList, ListingRow } from '~/components/content_link'
import ExternalLinkList from '~/components/external_link_list'
import { BackLink } from '~/components/page_header'
import ReadingLayout from '~/components/reading_layout'
import Seo, { type SeoMeta } from '~/components/seo'
import type { Data } from '@generated/data'

type TechnologyShowProps = {
  locale: Locale
  technology: Data.Technologies.TechnologyDetail
  labels: {
    backToList: string
    docs: string
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
  entries: Data.Technologies.TechnologyDetail['projects']
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
    <>
      <Seo meta={meta} />
      <ReadingLayout>
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
            {technology.docsUrl && (
              <ExternalLinkList
                links={[{ label: labels.docs, url: technology.docsUrl, type: 'docs' }]}
                className="mt-3"
              />
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
      </ReadingLayout>
    </>
  )
}
