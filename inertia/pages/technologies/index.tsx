import { Link } from '@adonisjs/inertia/react'
import { TECHNOLOGY_CATEGORIES } from '#types/content'
import { CoverImage, CoverPlaceholder } from '~/components/cover_image'
import { EmptyState } from '~/components/empty_state'
import { PageHeader } from '~/components/page_header'
import { SectionLabel } from '~/components/section_label'
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
            <SectionLabel as="h2">{messages.technologies.categories[group.category]}</SectionLabel>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((technology) => (
                <li key={technology.slug}>
                  <Link
                    href={to(`/technologies/${technology.slug}`)}
                    className="group hover:border-primary bg-card flex h-full items-center gap-3 rounded-lg border p-3 transition-colors"
                  >
                    {technology.logo ? (
                      <CoverImage
                        picture={technology.logo}
                        sizes="40px"
                        loading="lazy"
                        className="size-10 shrink-0 rounded object-contain"
                      />
                    ) : (
                      <CoverPlaceholder
                        title={technology.name}
                        className="size-10 shrink-0 rounded text-base"
                      />
                    )}
                    <div className="min-w-0">
                      <h3 className="group-hover:text-primary truncate font-medium transition-colors">
                        {technology.name}
                      </h3>
                      {technology.usageLabel && (
                        <p className="text-muted-foreground font-mono text-xs">
                          {technology.usageLabel}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
