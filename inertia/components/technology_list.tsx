import type { Locale } from '#types/i18n'
import { ChipLink, ChipList } from '~/components/chip'
import { localePath } from '~/lib/locale'
import { cn } from '~/lib/utils'

export type TechnologyRef = { slug: string; name: string }

/**
 * Technologies of a listing row, named on the same monospaced rhythm as
 * the metadata line above the title.
 */
export function TechnologyNames({ technologies }: { technologies: TechnologyRef[] }) {
  if (technologies.length === 0) {
    return null
  }

  return (
    <p className="text-muted-foreground flex flex-wrap gap-x-2.5 gap-y-1 font-mono text-[13px]">
      {technologies.map((technology) => (
        <span key={technology.slug}>{technology.name}</span>
      ))}
    </p>
  )
}

/**
 * Closing section of a detail page, each technology opening its own
 * page. Renders nothing when the entry carries no technology.
 */
export function TechnologySection({
  locale,
  title,
  technologies,
  className,
}: {
  locale: Locale
  title: string
  technologies: TechnologyRef[]
  className?: string
}) {
  if (technologies.length === 0) {
    return null
  }

  return (
    <section className={cn('border-t pt-8', className)}>
      <h2 className="text-muted-foreground font-mono text-xs tracking-wider uppercase">{title}</h2>
      <ChipList className="mt-4">
        {technologies.map((technology) => (
          <ChipLink
            key={technology.slug}
            href={localePath(locale, `/technologies/${technology.slug}`)}
          >
            {technology.name}
          </ChipLink>
        ))}
      </ChipList>
    </section>
  )
}
