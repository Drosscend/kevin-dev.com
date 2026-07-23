import { Link } from '@adonisjs/inertia/react'
import ArticleContent from '~/components/article_content'
import { BackLink } from '~/components/page_header'
import ReadingLayout from '~/components/reading_layout'
import Seo, { type SeoMeta } from '~/components/seo'
import TableOfContents from '~/components/table_of_contents'
import { localePath } from '~/lib/locale'

type BlogShowProps = {
  locale: 'fr' | 'en'
  isDraftPreview: boolean
  article: {
    slug: string
    title: string
    summary: string
    contentHtml: string
    publishedAt: string | null
    readingTimeLabel: string
    category: { slug: string; name: string } | null
    tags: { slug: string; name: string }[]
  }
  hasOtherLocale: boolean
  labels: {
    publishedOn: string
    draft: string
    backToList: string
    contents: string
  }
  meta: SeoMeta
}

export default function BlogShow({ locale, isDraftPreview, article, labels, meta }: BlogShowProps) {
  const base = localePath(locale, '/blog')

  return (
    <>
      <Seo meta={meta} />

      <ReadingLayout aside={<TableOfContents html={article.contentHtml} label={labels.contents} />}>
        {isDraftPreview && (
          <p className="border-destructive text-destructive mb-10 rounded-lg border px-4 py-2.5 text-sm">
            {labels.draft}
          </p>
        )}

        <div className="text-sm">
          <BackLink href={base} label={labels.backToList} />
        </div>

        <header className="mt-12">
          <h1 className="text-3xl font-bold md:text-4xl">{article.title}</h1>
          <p className="text-muted-foreground mt-4 font-mono text-[13px]">
            {article.publishedAt && (
              <>
                {labels.publishedOn} {article.publishedAt} ·{' '}
              </>
            )}
            {article.readingTimeLabel}
            {article.category && (
              <>
                {' · '}
                <Link
                  href={`${base}?category=${article.category.slug}`}
                  className="hover:text-primary uppercase tracking-wider transition-colors"
                >
                  {article.category.name}
                </Link>
              </>
            )}
          </p>
        </header>

        <div className="mt-10">
          <ArticleContent html={article.contentHtml} />
        </div>

        {article.tags.length > 0 && (
          <p className="mt-12 flex flex-wrap gap-x-3 gap-y-1 border-t pt-6 font-mono text-[13px]">
            {article.tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`${base}?tag=${tag.slug}`}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                #{tag.name}
              </Link>
            ))}
          </p>
        )}
      </ReadingLayout>
    </>
  )
}
