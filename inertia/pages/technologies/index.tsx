import { TECHNOLOGY_CATEGORIES } from '#types/content'
import { ListingList, ListingRow } from '~/components/content_link'
import { EmptyState } from '~/components/empty_state'
import ExternalLinkList from '~/components/external_link_list'
import { PageHeader } from '~/components/page_header'
import Seo, { type SeoMeta } from '~/components/seo'
import { useLocalePath } from '~/lib/locale'
import { type InertiaProps } from '~/types'
import type { Data } from '@generated/data'

type TechnologiesIndexProps = InertiaProps<{
  technologies: Data.Technologies.TechnologyCard[]
  meta: SeoMeta
}>

export default function TechnologiesIndex({
  technologies,
  messages,
  meta,
}: TechnologiesIndexProps) {
  const to = useLocalePath()
  const grouped = TECHNOLOGY_CATEGORIES.map((category) => ({
    category,
    items: technologies.filter((technology) => technology.category === category),
  })).filter((group) => group.items.length > 0)

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 pb-24 md:pb-32">
      <Seo meta={meta} />
      <PageHeader title={messages.technologies.title} />

      {grouped.length === 0 && <EmptyState>{messages.technologies.empty}</EmptyState>}

      <div className="space-y-14">
        {grouped.map((group) => (
          <section key={group.category}>
            <h2 className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
              {messages.technologies.categories[group.category]}
            </h2>
            <div className="mt-5">
              <ListingList>
                {group.items.map((technology) => (
                  <ListingRow
                    key={technology.slug}
                    href={to(`/technologies/${technology.slug}`)}
                    title={technology.name}
                    summary={technology.description}
                    thumbnailUrl={technology.logoUrl}
                    thumbnail="logo"
                    meta={technology.usageLabel}
                    heading="h3"
                    footer={
                      technology.docsUrl && (
                        <ExternalLinkList
                          links={[
                            {
                              label: messages.technologies.docs,
                              url: technology.docsUrl,
                              type: 'docs',
                            },
                          ]}
                          variant="subtle"
                        />
                      )
                    }
                  />
                ))}
              </ListingList>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
