import ArticleContent from '~/components/article_content'
import ExternalLinkList, { type ExternalLinkRef } from '~/components/external_link_list'
import { BackLink } from '~/components/page_header'
import PreviewBanner, { type PreviewMode } from '~/components/preview_banner'
import Seo, { type SeoMeta } from '~/components/seo'
import StatusBadge from '~/components/status_badge'
import { TechnologySection, type TechnologyRef } from '~/components/technology_list'
import { localePath } from '~/lib/locale'

type TalksShowProps = {
  locale: 'fr' | 'en'
  preview: PreviewMode
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
    links: ExternalLinkRef[]
    technologies: TechnologyRef[]
  }
  hasOtherLocale: boolean
  labels: {
    backToList: string
    draft: string
    archived: string
    upcoming: string
    technologies: string
  }
  meta: SeoMeta
}

export default function TalksShow({ locale, preview, talk, labels, meta }: TalksShowProps) {
  const to = (path: string) => localePath(locale, path)

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 pb-24 md:pb-32">
      <Seo meta={meta} />
      <div className="mx-auto max-w-[720px] space-y-10">
        {preview && <PreviewBanner label={labels[preview]} />}

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
          <ExternalLinkList links={talk.links} className="mt-5" />
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
