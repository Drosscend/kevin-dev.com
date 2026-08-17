import { localePath, type Locale } from '#types/i18n'
import { ChipLink, ChipList } from '~/components/chip'
import { cn } from '~/lib/utils'

export type TechnologyRef = { slug: string; name: string }

/**
 * Technologies of a listing row, named on the same monospaced rhythm as
 * the metadata line above the title, and separated by the same middle
 * dot so two names never read as one.
 */
export function TechnologyNames({ technologies }: { technologies: TechnologyRef[] }) {
  if (technologies.length === 0) {
    return null
  }

  return (
    <p className="text-muted-foreground font-mono text-[13px] leading-relaxed">
      {technologies.map((technology) => technology.name).join(' · ')}
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
