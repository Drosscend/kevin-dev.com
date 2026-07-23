import { ExternalLink } from 'lucide-react'
import ArticleContent from '~/components/article_content'
import { BackLink } from '~/components/page_header'
import Seo, { type SeoMeta } from '~/components/seo'
import StatusBadge from '~/components/status_badge'
import { TechnologySection, type TechnologyRef } from '~/components/technology_list'
import { localePath } from '~/lib/locale'

type TalksShowProps = {
  locale: 'fr' | 'en'
  isDraftPreview: boolean
  talk: {
    slug: string
    title: string
    summary: string
    contentHtml: string
    coverUrl: string | null
    eventName: string
    eventDate: string
    city: string
    upcoming: boolean
    links: { label: string; url: string; type: string }[]
    technologies: TechnologyRef[]
  }
  hasOtherLocale: boolean
  labels: {
    backToList: string
    draft: string
    upcoming: string
    technologies: string
  }
  meta: SeoMeta
}

export default function TalksShow({ locale, isDraftPreview, talk, labels, meta }: TalksShowProps) {
  const to = (path: string) => localePath(locale, path)

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 pb-24 md:pb-32">
      <Seo meta={meta} />
      <div className="mx-auto max-w-[720px] space-y-10">
        {isDraftPreview && (
          <p className="border-destructive text-destructive rounded-lg border px-4 py-2.5 text-sm">
            {labels.draft}
          </p>
        )}

        <div className="text-sm">
          <BackLink href={to('/talks')} label={labels.backToList} />
        </div>

        <header>
          <h1 className="text-3xl font-bold md:text-4xl">{talk.title}</h1>
          <p className="text-muted-foreground mt-3 flex flex-wrap items-center gap-x-2.5 font-mono text-[13px]">
            <span>{talk.eventDate}</span>
            <span aria-hidden>·</span>
            <span>{talk.eventName}</span>
            {talk.city && (
              <>
                <span aria-hidden>·</span>
                <span>{talk.city}</span>
              </>
            )}
            {talk.upcoming && <StatusBadge>{labels.upcoming}</StatusBadge>}
          </p>
          {talk.links.length > 0 && (
            <p className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {talk.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary inline-flex items-center gap-1.5 font-medium hover:underline"
                >
                  <ExternalLink className="size-3.5" />
                  {link.label}
                </a>
              ))}
            </p>
          )}
        </header>

        {talk.coverUrl && <img src={talk.coverUrl} alt="" className="w-full rounded-lg border" />}

        <ArticleContent html={talk.contentHtml} />

        <TechnologySection
          locale={locale}
          title={labels.technologies}
          technologies={talk.technologies}
        />
      </div>
    </div>
  )
}
