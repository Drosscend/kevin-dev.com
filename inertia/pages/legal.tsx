import ArticleContent from '~/components/article_content'
import { EmptyState } from '~/components/empty_state'
import Lightbox from '~/components/lightbox'
import ReadingLayout from '~/components/reading_layout'
import Seo, { type SeoMeta } from '~/components/seo'
import { type InertiaProps } from '~/types'

type LegalProps = InertiaProps<{
  contentHtml: string
  meta: SeoMeta
}>

export default function Legal({ contentHtml, messages, meta }: LegalProps) {
  return (
    <>
      <Seo meta={meta} />
      <ReadingLayout>
        <h1 className="text-3xl font-bold md:text-4xl">{messages.legal.title}</h1>

        <Lightbox className="mt-10">
          {contentHtml ? (
            <ArticleContent html={contentHtml} />
          ) : (
            <EmptyState>{messages.legal.empty}</EmptyState>
          )}
        </Lightbox>
      </ReadingLayout>
    </>
  )
}
