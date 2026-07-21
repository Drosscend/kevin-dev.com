import { router } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import Seo, { type SeoMeta } from '~/components/seo'

type ArticleCard = {
  slug: string
  title: string
  summary: string
  publishedAt: string | null
  readingTimeLabel: string
  category: { slug: string; name: string } | null
  tags: { slug: string; name: string }[]
}

type BlogIndexProps = {
  locale: 'fr' | 'en'
  filters: { category: string | null; tag: string | null }
  articles: ArticleCard[]
  pagination: { currentPage: number; lastPage: number; total: number }
  categories: { slug: string; name: string }[]
  labels: {
    title: string
    empty: string
    allCategories: string
    previous: string
    next: string
  }
  meta: SeoMeta
}

function pageUrl(
  base: string,
  filters: { category: string | null; tag: string | null },
  page: number
) {
  const params = new URLSearchParams()
  if (filters.category) params.set('category', filters.category)
  if (filters.tag) params.set('tag', filters.tag)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${base}?${query}` : base
}

export default function BlogIndex({
  locale,
  filters,
  articles,
  pagination,
  categories,
  labels,
  meta,
}: BlogIndexProps) {
  const base = locale === 'en' ? '/en/blog' : '/blog'

  function filterByCategory(slug: string | null) {
    router.get(pageUrl(base, { category: slug, tag: filters.tag }, 1), {}, { preserveState: true })
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-6 py-10">
      <Seo meta={meta} />
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{labels.title}</h1>
        <div className="flex items-center gap-3">
          <Link
            href={locale === 'en' ? '/blog' : '/en/blog'}
            className="text-muted-foreground text-sm hover:underline"
          >
            {locale === 'en' ? 'FR' : 'EN'}
          </Link>
          <select
            className="border-input h-9 rounded-md border bg-transparent px-3 text-sm"
            value={filters.category ?? ''}
            onChange={(event) => filterByCategory(event.target.value || null)}
          >
            <option value="">{labels.allCategories}</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filters.tag && (
        <p className="text-muted-foreground text-sm">
          #{filters.tag} —{' '}
          <Link
            href={pageUrl(base, { category: filters.category, tag: null }, 1)}
            className="underline"
          >
            ×
          </Link>
        </p>
      )}

      {articles.length === 0 ? (
        <p className="text-muted-foreground">{labels.empty}</p>
      ) : (
        <div className="space-y-8">
          {articles.map((article) => (
            <article key={article.slug} className="space-y-2">
              <h2 className="text-xl font-semibold">
                <Link href={`${base}/${article.slug}`} className="hover:underline">
                  {article.title}
                </Link>
              </h2>
              <p className="text-muted-foreground text-sm">
                {article.publishedAt} · {article.readingTimeLabel}
                {article.category && (
                  <>
                    {' · '}
                    <Link
                      href={pageUrl(base, { category: article.category.slug, tag: null }, 1)}
                      className="hover:underline"
                    >
                      {article.category.name}
                    </Link>
                  </>
                )}
              </p>
              {article.summary && <p>{article.summary}</p>}
              {article.tags.length > 0 && (
                <p className="flex flex-wrap gap-2 text-sm">
                  {article.tags.map((tag) => (
                    <Link
                      key={tag.slug}
                      href={pageUrl(base, { category: filters.category, tag: tag.slug }, 1)}
                      className="text-muted-foreground hover:underline"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </p>
              )}
            </article>
          ))}
        </div>
      )}

      {pagination.lastPage > 1 && (
        <nav className="flex items-center justify-between border-t pt-4 text-sm">
          {pagination.currentPage > 1 ? (
            <Link
              href={pageUrl(base, filters, pagination.currentPage - 1)}
              className="hover:underline"
            >
              {labels.previous}
            </Link>
          ) : (
            <span />
          )}
          <span className="text-muted-foreground">
            {pagination.currentPage} / {pagination.lastPage}
          </span>
          {pagination.currentPage < pagination.lastPage ? (
            <Link
              href={pageUrl(base, filters, pagination.currentPage + 1)}
              className="hover:underline"
            >
              {labels.next}
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  )
}
