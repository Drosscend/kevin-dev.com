import { TECHNOLOGY_CATEGORIES, type TechnologyCategory } from '#types/content'
import { localePath, type Locale } from '#types/i18n'
import { ListingList, ListingRow } from '~/components/content_link'
import { EmptyState } from '~/components/empty_state'
import ExternalLinkList from '~/components/external_link_list'
import { PageHeader } from '~/components/page_header'
import Seo, { type SeoMeta } from '~/components/seo'
import type { Data } from '@generated/data'

type TechnologiesIndexProps = {
  locale: Locale
  technologies: Data.Technologies.TechnologyCard[]
  labels: {
    title: string
    empty: string
    docs: string
    categories: Record<TechnologyCategory, string>
  }
  meta: SeoMeta
}

export default function TechnologiesIndex({
  locale,
  technologies,
  labels,
  meta,
}: TechnologiesIndexProps) {
  const to = (path: string) => localePath(locale, path)
  const grouped = TECHNOLOGY_CATEGORIES.map((category) => ({
    category,
    items: technologies.filter((technology) => technology.category === category),
  })).filter((group) => group.items.length > 0)

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 pb-24 md:pb-32">
      <Seo meta={meta} />
      <PageHeader title={labels.title} />

      {grouped.length === 0 && <EmptyState>{labels.empty}</EmptyState>}

      <div className="space-y-14">
        {grouped.map((group) => (
          <section key={group.category}>
            <h2 className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
              {labels.categories[group.category]}
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
                          links={[{ label: labels.docs, url: technology.docsUrl, type: 'docs' }]}
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
