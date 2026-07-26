import { ListingList, ListingRow } from '~/components/content_link'
import ExternalLinkList, { type ExternalLinkRef } from '~/components/external_link_list'
import { PageHeader } from '~/components/page_header'
import Seo, { type SeoMeta } from '~/components/seo'
import StatusBadge from '~/components/status_badge'
import { TechnologyNames, type TechnologyRef } from '~/components/technology_list'
import { localePath } from '~/lib/locale'

type TalkCard = {
  slug: string
  title: string
  summary: string
  eventName: string
  eventDate: string
  city: string
  upcoming: boolean
  links: ExternalLinkRef[]
  technologies: TechnologyRef[]
  coverUrl: string | null
}

type TalksIndexProps = {
  locale: 'fr' | 'en'
  talks: TalkCard[]
  labels: { title: string; empty: string; upcoming: string }
  meta: SeoMeta
}

export default function TalksIndex({ locale, talks, labels, meta }: TalksIndexProps) {
  const to = (path: string) => localePath(locale, path)

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 pb-24 md:pb-32">
      <Seo meta={meta} />
      <PageHeader title={labels.title} />

      {talks.length === 0 ? (
        <p className="text-muted-foreground">{labels.empty}</p>
      ) : (
        <ListingList>
          {talks.map((talk) => (
            <ListingRow
              key={talk.slug}
              href={to(`/talks/${talk.slug}`)}
              title={talk.title}
              summary={talk.summary}
              thumbnailUrl={talk.coverUrl}
              meta={
                <>
                  <span>
                    {talk.eventDate} · {talk.eventName}
                    {talk.city && ` · ${talk.city}`}
                  </span>
                  {talk.upcoming && <StatusBadge>{labels.upcoming}</StatusBadge>}
                </>
              }
              footer={
                <>
                  <TechnologyNames technologies={talk.technologies} />
                  <ExternalLinkList links={talk.links} variant="subtle" className="mt-3" />
                </>
              }
            />
          ))}
        </ListingList>
      )}
    </div>
  )
}
