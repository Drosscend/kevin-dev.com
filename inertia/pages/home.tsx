import { Link } from '@adonisjs/inertia/react'
import { Download } from 'lucide-react'
import { LinkArrow, LinkList, LinkRow } from '~/components/content_link'
import { Button } from '~/components/ui/button'
import Seo, { type SeoMeta } from '~/components/seo'
import { localePath } from '~/lib/locale'

type HomeProps = {
  locale: 'fr' | 'en'
  now: string | null
  roles: string[]
  location: string | null
  cvPdfAvailable: boolean
  latestArticles: {
    slug: string
    title: string
    summary: string
    publishedAt: string | null
    coverUrl: string | null
  }[]
  featuredProjects: {
    slug: string
    title: string
    summary: string
    coverUrl: string | null
    technologies: string[]
  }[]
  talks: {
    slug: string
    title: string
    eventName: string
    eventDate: string
    city: string
    upcoming: boolean
    summary: string
    coverUrl: string | null
  }[]
  technologies: { slug: string; name: string }[]
  timeline: { period: string; title: string; place: string }[]
  labels: {
    downloadCv: string
    contactMe: string
    photoAlt: string
    now: string
    featuredProjects: string
    latestArticles: string
    allArticles: string
    allProjects: string
    timeline: string
    stack: string
    allTechnologies: string
    talks: string
    allTalks: string
    upcomingTalk: string
  }
  meta: SeoMeta
}

function SectionHead({ title, more }: { title: string; more?: { href: string; label: string } }) {
  return (
    <div className="mb-10 flex items-baseline justify-between gap-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {more && (
        <Link
          href={more.href}
          className="group text-muted-foreground hover:text-primary text-sm transition-colors"
        >
          {more.label} <LinkArrow />
        </Link>
      )}
    </div>
  )
}

export default function Home({
  locale,
  now,
  roles,
  location,
  cvPdfAvailable,
  latestArticles,
  featuredProjects,
  talks,
  technologies,
  timeline,
  labels,
  meta,
}: HomeProps) {
  const to = (path: string) => localePath(locale, path)

  return (
    <div className="mx-auto max-w-5xl px-6">
      <Seo meta={meta} />

      <section className="grid items-center gap-12 py-16 md:grid-cols-[1fr_300px] md:gap-16 md:py-24">
        <div>
          <h1 className="text-5xl font-bold md:text-6xl">Kévin Véronési</h1>
          {roles.length > 0 && (
            <ul className="mt-7 space-y-1.5 text-lg font-medium">
              {roles.map((role) => (
                <li key={role} className="flex items-center gap-3">
                  <span aria-hidden className="bg-primary h-0.5 w-[18px]" />
                  {role}
                </li>
              ))}
            </ul>
          )}
          {location && <p className="text-muted-foreground mt-6 text-sm">{location}</p>}
          <div className="mt-10 flex flex-wrap gap-3.5">
            <Button asChild size="lg">
              {cvPdfAvailable ? (
                <a href="/cv.pdf">
                  <Download className="size-4" />
                  {labels.downloadCv}
                </a>
              ) : (
                <Link href={to('/cv')}>
                  <Download className="size-4" />
                  {labels.downloadCv}
                </Link>
              )}
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={to('/contact')}>{labels.contactMe}</Link>
            </Button>
          </div>
        </div>
        <img
          src="/images/portrait.webp"
          srcSet="/images/portrait-small.webp 360w, /images/portrait.webp 720w"
          sizes="(min-width: 768px) 300px, 260px"
          alt={labels.photoAlt}
          width={720}
          height={960}
          className="w-full max-w-[260px] rounded-lg object-cover md:max-w-[300px] md:justify-self-end"
        />
      </section>

      {now && (
        <section className="pb-24 md:pb-28">
          <div className="border-primary max-w-[620px] border-l-2 pl-6">
            <p className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
              {labels.now}
            </p>
            <p className="mt-2">{now}</p>
          </div>
        </section>
      )}

      {featuredProjects.length > 0 && (
        <section className="pb-24 md:pb-28">
          <SectionHead
            title={labels.featuredProjects}
            more={{ href: to('/projects'), label: labels.allProjects }}
          />
          <LinkList>
            {featuredProjects.map((project) => (
              <LinkRow
                key={project.slug}
                href={to(`/projects/${project.slug}`)}
                title={project.title}
                meta={project.technologies.join(' · ')}
                preview={{ imageUrl: project.coverUrl, summary: project.summary }}
              />
            ))}
          </LinkList>
        </section>
      )}

      {latestArticles.length > 0 && (
        <section className="pb-24 md:pb-28">
          <SectionHead
            title={labels.latestArticles}
            more={{ href: to('/blog'), label: labels.allArticles }}
          />
          <LinkList>
            {latestArticles.map((article) => (
              <LinkRow
                key={article.slug}
                href={to(`/blog/${article.slug}`)}
                title={article.title}
                meta={article.publishedAt}
                preview={{ imageUrl: article.coverUrl, summary: article.summary }}
              />
            ))}
          </LinkList>
        </section>
      )}

      <section className="pb-24 md:pb-28">
        <SectionHead title={labels.timeline} />
        <ul className="max-w-2xl space-y-9">
          {timeline.map((entry) => (
            <li key={entry.period} className="grid gap-1 sm:grid-cols-[140px_1fr] sm:gap-6">
              <span className="text-muted-foreground pt-0.5 font-mono text-[13px]">
                {entry.period}
              </span>
              <div>
                <p className="font-medium">{entry.title}</p>
                <p className="text-muted-foreground text-sm">{entry.place}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {technologies.length > 0 && (
        <section className="pb-24 md:pb-28">
          <SectionHead
            title={labels.stack}
            more={{ href: to('/technologies'), label: labels.allTechnologies }}
          />
          <ul className="flex max-w-[720px] flex-wrap gap-2.5">
            {technologies.map((technology) => (
              <li key={technology.slug}>
                <Link
                  href={to(`/technologies/${technology.slug}`)}
                  className="bg-card hover:border-primary hover:text-primary inline-block rounded-full border px-4 py-1.5 text-sm transition-colors"
                >
                  {technology.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {talks.length > 0 && (
        <section className="pb-24 md:pb-32">
          <SectionHead title={labels.talks} more={{ href: to('/talks'), label: labels.allTalks }} />
          <LinkList>
            {talks.map((talk) => (
              <LinkRow
                key={talk.slug}
                href={to(`/talks/${talk.slug}`)}
                title={talk.title}
                badge={talk.upcoming ? labels.upcomingTalk : undefined}
                meta={`${talk.eventName} · ${talk.eventDate}`}
                preview={{
                  imageUrl: talk.coverUrl,
                  summary: talk.summary,
                  meta: talk.city || undefined,
                }}
              />
            ))}
          </LinkList>
        </section>
      )}
    </div>
  )
}
