import { ListingList, ListingRow } from '~/components/content_link'
import { CoverImage } from '~/components/cover_image'
import ExternalLinkList from '~/components/external_link_list'
import { BackLink } from '~/components/page_header'
import ReadingLayout from '~/components/reading_layout'
import { SectionLabel } from '~/components/section_label'
import Seo, { type SeoMeta } from '~/components/seo'
import { useLocalePath } from '~/lib/locale'
import { type InertiaProps } from '~/types'
import type { Data } from '@generated/data'

type TechnologyShowProps = InertiaProps<{
  technology: Data.Technologies.TechnologyDetail
  meta: SeoMeta
}>

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
      <SectionLabel as="h2">{title}</SectionLabel>
      <div className="mt-8">
        <ListingList>
          {entries.map((entry) => (
            <ListingRow
              key={entry.slug}
              href={href(entry.slug)}
              title={entry.title}
              summary={entry.summary}
              picture={entry.cover}
              heading="h3"
            />
          ))}
        </ListingList>
      </div>
    </section>
  )
}

export default function TechnologyShow({ technology, messages, meta }: TechnologyShowProps) {
  const to = useLocalePath()

  return (
    <>
      <Seo meta={meta} />
      <ReadingLayout>
        <div className="text-sm">
          <BackLink href={to('/technologies')} label={messages.technologies.backToList} />
        </div>

        <header className="mt-10 flex items-center gap-5">
          {technology.logo && (
            <CoverImage
              picture={technology.logo}
              sizes="56px"
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
                links={[
                  { label: messages.technologies.docs, url: technology.docsUrl, type: 'docs' },
                ]}
                className="mt-3"
              />
            )}
          </div>
        </header>

        <UsageSection
          title={messages.technologies.usedIn}
          entries={technology.projects}
          href={(slug) => to(`/projects/${slug}`)}
        />

        <UsageSection
          title={messages.technologies.writtenAbout}
          entries={technology.articles}
          href={(slug) => to(`/blog/${slug}`)}
        />

        <UsageSection
          title={messages.technologies.spokenAbout}
          entries={technology.talks}
          href={(slug) => to(`/talks/${slug}`)}
        />

        {technology.projects.length === 0 &&
          technology.articles.length === 0 &&
          technology.talks.length === 0 && (
            <p className="text-muted-foreground mt-14">{messages.technologies.unused}</p>
          )}
      </ReadingLayout>
    </>
  )
}
