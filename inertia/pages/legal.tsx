import ArticleContent from '~/components/article_content'
import { EmptyState } from '~/components/empty_state'
import Lightbox from '~/components/lightbox'
import Seo, { type SeoMeta } from '~/components/seo'

type LegalProps = {
  contentHtml: string
  labels: {
    title: string
    empty: string
  }
  meta: SeoMeta
}

export default function Legal({ contentHtml, labels, meta }: LegalProps) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 pb-24 md:pb-32">
      <Seo meta={meta} />
      <div className="mx-auto max-w-[720px]">
        <h1 className="text-3xl font-bold md:text-4xl">{labels.title}</h1>

        <Lightbox className="mt-10">
          {contentHtml ? (
            <ArticleContent html={contentHtml} />
          ) : (
            <EmptyState>{labels.empty}</EmptyState>
          )}
        </Lightbox>
      </div>
    </div>
  )
}
