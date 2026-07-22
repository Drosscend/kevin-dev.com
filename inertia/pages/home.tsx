import { Link } from '@adonisjs/inertia/react'
import Seo, { type SeoMeta } from '~/components/seo'
import { localePath } from '~/lib/locale'

type HomeProps = {
  locale: 'fr' | 'en'
  now: string | null
  cvPdfAvailable: boolean
  latestArticles: { slug: string; title: string; summary: string }[]
  featuredProjects: { slug: string; title: string; summary: string; coverUrl: string | null }[]
  technologies: { slug: string; name: string }[]
  timeline: { period: string; title: string; place: string }[]
  labels: {
    roles: string[]
    location: string
    downloadCv: string
    contactMe: string
    photoAlt: string
    now: string
    featuredProjects: string
    viewProject: string
    latestArticles: string
    allArticles: string
    allProjects: string
    timeline: string
    stack: string
    allTechnologies: string
    talks: string
    talksText: string
    talksContact: string
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
          className="text-muted-foreground hover:text-primary text-sm transition-colors"
        >
          {more.label}
        </Link>
      )}
    </div>
  )
}

export default function Home({
  locale,
  now,
  cvPdfAvailable,
  latestArticles,
  featuredProjects,
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
          <ul className="mt-7 space-y-1.5 text-lg font-medium">
            {labels.roles.map((role) => (
              <li key={role} className="flex items-center gap-3">
                <span aria-hidden className="bg-primary h-0.5 w-[18px]" />
                {role}
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground mt-6 text-sm">{labels.location}</p>
          <div className="mt-10 flex flex-wrap gap-3.5">
            {cvPdfAvailable ? (
              <a
                href="/cv.pdf"
                className="bg-primary text-primary-foreground rounded-lg px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
              >
                {labels.downloadCv}
              </a>
            ) : (
              <Link
                href={to('/cv')}
                className="bg-primary text-primary-foreground rounded-lg px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
              >
                {labels.downloadCv}
              </Link>
            )}
            <Link
              href={to('/contact')}
              className="bg-card hover:border-primary hover:text-primary rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors"
            >
              {labels.contactMe}
            </Link>
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <Link
                key={project.slug}
                href={to(`/projects/${project.slug}`)}
                className="group bg-card hover:border-primary rounded-lg border p-6 transition-[border-color,transform] hover:-translate-y-0.5 motion-reduce:transform-none"
              >
                <h3 className="font-semibold">{project.title}</h3>
                {project.summary && (
                  <p className="text-muted-foreground mt-2 line-clamp-3 text-sm">
                    {project.summary}
                  </p>
                )}
                <span className="text-primary mt-4 inline-block text-sm font-medium">
                  {labels.viewProject}{' '}
                  <span
                    aria-hidden
                    className="inline-block transition-transform group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {latestArticles.length > 0 && (
        <section className="pb-24 md:pb-28">
          <SectionHead
            title={labels.latestArticles}
            more={{ href: to('/blog'), label: labels.allArticles }}
          />
          <ul className="max-w-[720px] divide-y border-y">
            {latestArticles.map((article) => (
              <li key={article.slug}>
                <Link
                  href={to(`/blog/${article.slug}`)}
                  className="hover:text-primary flex items-baseline justify-between gap-6 px-1 py-4 transition-colors"
                >
                  <span className="font-medium">{article.title}</span>
                  <span aria-hidden>→</span>
                </Link>
              </li>
            ))}
          </ul>
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

      <section className="pb-24 md:pb-32">
        <SectionHead title={labels.talks} />
        <p className="max-w-[620px]">{labels.talksText}</p>
        <Link
          href={to('/contact')}
          className="text-primary mt-4 inline-block font-medium hover:underline"
        >
          {labels.talksContact}
        </Link>
      </section>
    </div>
  )
}
