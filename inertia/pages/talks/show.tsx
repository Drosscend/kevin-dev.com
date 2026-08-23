import { localePath } from '#types/i18n'
import ArticleContent from '~/components/article_content'
import ExternalLinkList from '~/components/external_link_list'
import Lightbox from '~/components/lightbox'
import { BackLink } from '~/components/page_header'
import PreviewBanner from '~/components/preview_banner'
import ReadingLayout from '~/components/reading_layout'
import Seo, { type SeoMeta } from '~/components/seo'
import StatusBadge from '~/components/status_badge'
import { TechnologySection } from '~/components/technology_list'
import { type InertiaProps } from '~/types'
import type { PreviewMode } from '#types/content'
import type { Data } from '@generated/data'

type TalksShowProps = InertiaProps<{
  preview: PreviewMode
  talk: Data.Talks.TalkDetail
  hasOtherLocale: boolean
  meta: SeoMeta
}>

export default function TalksShow({ locale, preview, talk, messages, meta }: TalksShowProps) {
  const to = (path: string) => localePath(locale, path)

  return (
    <>
      <Seo meta={meta} />
      <ReadingLayout className="space-y-10">
        {preview && <PreviewBanner preview={preview} />}

        <div className="text-sm">
          <BackLink href={to('/talks')} label={messages.talks.backToList} />
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
            <span aria-hidden>·</span>
            <span>{talk.readingTimeLabel}</span>
            {talk.upcoming && <StatusBadge>{messages.talks.upcoming}</StatusBadge>}
          </p>
          <ExternalLinkList links={talk.links} className="mt-5" />
        </header>

        <Lightbox className="space-y-10">
          {talk.coverUrl && <img src={talk.coverUrl} alt="" className="w-full rounded-lg border" />}

          <ArticleContent html={talk.contentHtml} />
        </Lightbox>

        <TechnologySection
          locale={locale}
          title={messages.talks.technologies}
          technologies={talk.technologies}
        />
      </ReadingLayout>
    </>
  )
}
