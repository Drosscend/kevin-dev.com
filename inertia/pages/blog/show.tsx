import { Link } from '@adonisjs/inertia/react'
import ArticleContent from '~/components/article_content'
import Seo, { type SeoMeta } from '~/components/seo'

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
  }
  meta: SeoMeta
}

export default function BlogShow({
  locale,
  isDraftPreview,
  article,
  hasOtherLocale,
  labels,
  meta,
}: BlogShowProps) {
  const base = locale === 'en' ? '/en/blog' : '/blog'
  const otherBase = locale === 'en' ? '/blog' : '/en/blog'

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-6 py-10">
      <Seo meta={meta} />
      {isDraftPreview && (
        <p className="border-destructive text-destructive rounded-md border px-4 py-2 text-sm">
          {labels.draft}
        </p>
      )}

      <div className="flex items-center justify-between gap-4 text-sm">
        <Link href={base} className="text-muted-foreground hover:underline">
          {labels.backToList}
        </Link>
        {hasOtherLocale && (
          <Link
            href={`${otherBase}/${article.slug}`}
            className="text-muted-foreground hover:underline"
          >
            {locale === 'en' ? 'FR' : 'EN'}
          </Link>
        )}
      </div>

      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">{article.title}</h1>
        <p className="text-muted-foreground text-sm">
          {article.publishedAt && (
            <>
              {labels.publishedOn} {article.publishedAt} ·{' '}
            </>
          )}
          {article.readingTimeLabel}
          {article.category && (
            <>
              {' · '}
              <Link href={`${base}?category=${article.category.slug}`} className="hover:underline">
                {article.category.name}
              </Link>
            </>
          )}
        </p>
      </header>

      <ArticleContent html={article.contentHtml} />

      {article.tags.length > 0 && (
        <p className="flex flex-wrap gap-2 border-t pt-4 text-sm">
          {article.tags.map((tag) => (
            <Link
              key={tag.slug}
              href={`${base}?tag=${tag.slug}`}
              className="text-muted-foreground hover:underline"
            >
              #{tag.name}
            </Link>
          ))}
        </p>
      )}
    </div>
  )
}
