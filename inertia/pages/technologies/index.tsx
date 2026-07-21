import { Link } from '@adonisjs/inertia/react'
import Seo, { type SeoMeta } from '~/components/seo'

type TechnologyCard = {
  slug: string
  name: string
  category: 'langage' | 'framework' | 'outil' | 'infra'
  logoUrl: string | null
  description: string
  projectsCount: number
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
  const base = locale === 'en' ? '/en' : ''
  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    items: technologies.filter((technology) => technology.category === category),
  })).filter((group) => group.items.length > 0)

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-6 py-10">
      <Seo meta={meta} />
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{labels.title}</h1>
        <Link
          href={locale === 'en' ? '/technologies' : '/en/technologies'}
          className="text-muted-foreground text-sm hover:underline"
        >
          {locale === 'en' ? 'FR' : 'EN'}
        </Link>
      </div>

      {grouped.length === 0 && <p className="text-muted-foreground">{labels.empty}</p>}

      {grouped.map((group) => (
        <section key={group.category} className="space-y-4">
          <h2 className="text-xl font-semibold">{labels.categories[group.category]}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((technology) => (
              <Link
                key={technology.slug}
                href={`${base}/technologies/${technology.slug}`}
                className="group flex items-start gap-3 rounded-lg border p-4 transition-shadow hover:shadow-md"
              >
                {technology.logoUrl && (
                  <img
                    src={technology.logoUrl}
                    alt=""
                    className="size-10 rounded object-contain"
                    loading="lazy"
                  />
                )}
                <div className="min-w-0 space-y-1">
                  <h3 className="font-semibold group-hover:underline">{technology.name}</h3>
                  {technology.description && (
                    <p className="text-muted-foreground line-clamp-2 text-sm">
                      {technology.description}
                    </p>
                  )}
                  <p className="text-muted-foreground text-xs">
                    {technology.projectsCount} projet(s)
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
