import ArticleContent from '~/components/article_content'

type LegalProps = {
  locale: 'fr' | 'en'
  contentHtml: string
  labels: {
    title: string
    empty: string
  }
}

export default function Legal({ contentHtml, labels }: LegalProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-6 py-10">
      <h1 className="text-3xl font-bold tracking-tight">{labels.title}</h1>

      {contentHtml ? (
        <ArticleContent html={contentHtml} />
      ) : (
        <p className="text-muted-foreground">{labels.empty}</p>
      )}
    </div>
  )
}
