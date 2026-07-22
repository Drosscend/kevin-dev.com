import { ListingList, ListingRow } from '~/components/content_link'
import { PageHeader } from '~/components/page_header'
import Seo, { type SeoMeta } from '~/components/seo'
import { localePath } from '~/lib/locale'

type TechnologyCard = {
  slug: string
  name: string
  category: 'langage' | 'framework' | 'outil' | 'infra'
  logoUrl: string | null
  description: string
  projectsLabel: string
}

type TechnologiesIndexProps = {
  locale: 'fr' | 'en'
  technologies: TechnologyCard[]
  labels: {
    title: string
    empty: string
    categories: Record<TechnologyCard['category'], string>
  }
  meta: SeoMeta
}

const CATEGORY_ORDER: TechnologyCard['category'][] = ['langage', 'framework', 'outil', 'infra']

export default function TechnologiesIndex({
  locale,
  technologies,
  labels,
  meta,
}: TechnologiesIndexProps) {
  const to = (path: string) => localePath(locale, path)
  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    items: technologies.filter((technology) => technology.category === category),
  })).filter((group) => group.items.length > 0)

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 pb-24 md:pb-32">
      <Seo meta={meta} />
      <PageHeader title={labels.title} />

      {grouped.length === 0 && <p className="text-muted-foreground">{labels.empty}</p>}

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
                    meta={technology.projectsLabel}
                    heading="h3"
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
