import { Link } from '@adonisjs/inertia/react'
import Seo, { type SeoMeta } from '~/components/seo'
import { localePath, otherLocalePath } from '~/lib/locale'

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
  const to = (path: string) => localePath(locale, path)
  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    items: technologies.filter((technology) => technology.category === category),
  })).filter((group) => group.items.length > 0)

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 pb-24 md:pb-32">
      <Seo meta={meta} />
      <div className="mb-12 flex items-baseline justify-between gap-4">
        <h1 className="text-3xl font-bold md:text-4xl">{labels.title}</h1>
        <Link
          href={otherLocalePath(locale, '/technologies')}
          className="text-muted-foreground hover:text-primary font-mono text-xs tracking-wider uppercase transition-colors"
        >
          {locale === 'en' ? 'FR' : 'EN'}
        </Link>
      </div>

      {grouped.length === 0 && <p className="text-muted-foreground">{labels.empty}</p>}

      <div className="space-y-14">
        {grouped.map((group) => (
          <section key={group.category}>
            <h2 className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
              {labels.categories[group.category]}
            </h2>
            <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((technology) => (
                <Link
                  key={technology.slug}
                  href={to(`/technologies/${technology.slug}`)}
                  className="group bg-card hover:border-primary flex items-start gap-4 rounded-lg border p-6 transition-[border-color,transform] hover:-translate-y-0.5 motion-reduce:transform-none"
                >
                  {technology.logoUrl && (
                    <img
                      src={technology.logoUrl}
                      alt=""
                      className="size-9 shrink-0 rounded object-contain"
                      loading="lazy"
                    />
                  )}
                  <div className="min-w-0">
                    <h3 className="font-semibold">{technology.name}</h3>
                    {technology.description && (
                      <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                        {technology.description}
                      </p>
                    )}
                    <p className="text-muted-foreground mt-3 font-mono text-xs">
                      {technology.projectsCount} projet(s)
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
