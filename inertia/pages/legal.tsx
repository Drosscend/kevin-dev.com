import ArticleContent from '~/components/article_content'
import Seo, { type SeoMeta } from '~/components/seo'

type LegalProps = {
  locale: 'fr' | 'en'
  contentHtml: string
  labels: {
    title: string
    empty: string
  }
  meta: SeoMeta
}

export default function Legal({ contentHtml, labels, meta }: LegalProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-6 py-10">
      <Seo meta={meta} />
      <h1 className="text-3xl font-bold tracking-tight">{labels.title}</h1>

      {contentHtml ? (
        <ArticleContent html={contentHtml} />
      ) : (
        <p className="text-muted-foreground">{labels.empty}</p>
      )}
    </div>
  )
}
