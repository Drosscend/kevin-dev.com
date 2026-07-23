import { ExternalLink } from 'lucide-react'
import { ListingList, ListingRow } from '~/components/content_link'
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
  links: { label: string; url: string; type: string }[]
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
                  {talk.links.length > 0 && (
                    <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                      {talk.links.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 transition-colors"
                        >
                          <ExternalLink className="size-3.5" />
                          {link.label}
                        </a>
                      ))}
                    </p>
                  )}
                </>
              }
            />
          ))}
        </ListingList>
      )}
    </div>
  )
}
