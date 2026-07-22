import { Link } from '@adonisjs/inertia/react'
import { ExternalLink } from 'lucide-react'
import { LinkArrow } from '~/components/content_link'
import Seo, { type SeoMeta } from '~/components/seo'
import { localePath, otherLocalePath } from '~/lib/locale'

type TalkCard = {
  slug: string
  title: string
  summary: string
  eventName: string
  eventDate: string
  city: string
  upcoming: boolean
  links: { label: string; url: string; type: string }[]
  technologies: { slug: string; name: string }[]
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
      <div className="mb-12 flex items-baseline justify-between gap-4">
        <h1 className="text-3xl font-bold md:text-4xl">{labels.title}</h1>
        <Link
          href={otherLocalePath(locale, '/talks')}
          className="text-muted-foreground hover:text-primary font-mono text-xs tracking-wider uppercase transition-colors"
        >
          {locale === 'en' ? 'FR' : 'EN'}
        </Link>
      </div>

      {talks.length === 0 ? (
        <p className="text-muted-foreground">{labels.empty}</p>
      ) : (
        <ul className="max-w-[760px] space-y-10">
          {talks.map((talk) => (
            <li key={talk.slug} className="border-l-2 pl-6">
              <p className="text-muted-foreground flex flex-wrap items-center gap-x-2.5 font-mono text-[13px]">
                <span>{talk.eventDate}</span>
                <span aria-hidden>·</span>
                <span>{talk.eventName}</span>
                {talk.city && (
                  <>
                    <span aria-hidden>·</span>
                    <span>{talk.city}</span>
                  </>
                )}
                {talk.upcoming && (
                  <span className="text-primary tracking-wider uppercase">{labels.upcoming}</span>
                )}
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                <Link
                  href={to(`/talks/${talk.slug}`)}
                  className="group hover:text-primary transition-colors"
                >
                  {talk.title} <LinkArrow />
                </Link>
              </h2>

              {talk.summary && <p className="text-muted-foreground mt-2">{talk.summary}</p>}

              {talk.technologies.length > 0 && (
                <p className="text-muted-foreground mt-3 flex flex-wrap gap-x-2.5 gap-y-1 font-mono text-xs">
                  {talk.technologies.map((technology) => (
                    <span key={technology.slug}>{technology.name}</span>
                  ))}
                </p>
              )}

              {talk.links.length > 0 && (
                <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
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
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
