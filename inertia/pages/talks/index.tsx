import { localePath } from '#types/i18n'
import { ListingList, ListingRow } from '~/components/content_link'
import { EmptyState } from '~/components/empty_state'
import ExternalLinkList from '~/components/external_link_list'
import { PageHeader } from '~/components/page_header'
import Seo, { type SeoMeta } from '~/components/seo'
import StatusBadge from '~/components/status_badge'
import { TechnologyNames } from '~/components/technology_list'
import { type InertiaProps } from '~/types'
import type { Data } from '@generated/data'

type TalksIndexProps = InertiaProps<{
  talks: Data.Talks.TalkCard[]
  meta: SeoMeta
}>

export default function TalksIndex({ locale, talks, messages, meta }: TalksIndexProps) {
  const to = (path: string) => localePath(locale, path)

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 pb-24 md:pb-32">
      <Seo meta={meta} />
      <PageHeader title={messages.talks.title} />

      {talks.length === 0 ? (
        <EmptyState>{messages.talks.empty}</EmptyState>
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
                    {talk.city && ` · ${talk.city}`} · {talk.readingTimeLabel}
                  </span>
                  {talk.upcoming && <StatusBadge>{messages.talks.upcoming}</StatusBadge>}
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
