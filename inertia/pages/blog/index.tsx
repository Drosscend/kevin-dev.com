import { router } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import Seo, { type SeoMeta } from '~/components/seo'
import { localePath, otherLocalePath } from '~/lib/locale'

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

/**
 * Listing URL carrying the active filters and page. Client-side twin
 * of listQueryString in the blog controller, which builds the same
 * query string for redirects and canonical URLs.
 */
function pageUrl(
  base: string,
  filters: { category: string | null; tag: string | null },
  page: number
) {
  const params = new URLSearchParams()
  if (filters.category) {
    params.set('category', filters.category)
  }
  if (filters.tag) {
    params.set('tag', filters.tag)
  }
  if (page > 1) {
    params.set('page', String(page))
  }
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
  const base = localePath(locale, '/blog')

  function filterByCategory(slug: string | null) {
    router.get(pageUrl(base, { category: slug, tag: filters.tag }, 1), {}, { preserveState: true })
  }

  const pillClass = (active: boolean) =>
    active
      ? 'border-primary bg-primary text-primary-foreground rounded-full border px-4 py-1.5 text-sm transition-colors'
      : 'bg-card hover:border-primary hover:text-primary rounded-full border px-4 py-1.5 text-sm transition-colors'

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 pb-24 md:pb-32">
      <Seo meta={meta} />

      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-3xl font-bold md:text-4xl">{labels.title}</h1>
        <Link
          href={otherLocalePath(locale, '/blog')}
          className="text-muted-foreground hover:text-primary font-mono text-[13px] transition-colors"
        >
          {locale === 'en' ? 'FR' : 'EN'}
        </Link>
      </div>

      {categories.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => filterByCategory(null)}
            className={pillClass(!filters.category)}
          >
            {labels.allCategories}
          </button>
          {categories.map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => filterByCategory(category.slug)}
              className={pillClass(filters.category === category.slug)}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      {filters.tag && (
        <p className="text-muted-foreground mt-8 font-mono text-[13px]">
          #{filters.tag}{' '}
          <Link
            href={pageUrl(base, { category: filters.category, tag: null }, 1)}
            className="hover:text-primary ml-1 transition-colors"
            aria-label="×"
          >
            ×
          </Link>
        </p>
      )}

      {articles.length === 0 ? (
        <p className="text-muted-foreground mt-12">{labels.empty}</p>
      ) : (
        <ul className="mt-12 max-w-[720px] divide-y border-y">
          {articles.map((article) => (
            <li key={article.slug}>
              <article className="py-7">
                <p className="text-muted-foreground font-mono text-[13px]">
                  {article.publishedAt} · {article.readingTimeLabel}
                  {article.category && (
                    <>
                      {' · '}
                      <Link
                        href={pageUrl(base, { category: article.category.slug, tag: null }, 1)}
                        className="hover:text-primary uppercase tracking-wider transition-colors"
                      >
                        {article.category.name}
                      </Link>
                    </>
                  )}
                </p>
                <h2 className="mt-2 text-xl font-semibold">
                  <Link
                    href={`${base}/${article.slug}`}
                    className="group hover:text-primary transition-colors"
                  >
                    {article.title}{' '}
                    <span
                      aria-hidden
                      className="inline-block transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none"
                    >
                      →
                    </span>
                  </Link>
                </h2>
                {article.summary && (
                  <p className="text-muted-foreground mt-2 text-sm">{article.summary}</p>
                )}
                {article.tags.length > 0 && (
                  <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[13px]">
                    {article.tags.map((tag) => (
                      <Link
                        key={tag.slug}
                        href={pageUrl(base, { category: filters.category, tag: tag.slug }, 1)}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        #{tag.name}
                      </Link>
                    ))}
                  </p>
                )}
              </article>
            </li>
          ))}
        </ul>
      )}

      {pagination.lastPage > 1 && (
        <nav className="mt-12 flex max-w-[720px] items-center justify-between text-sm">
          {pagination.currentPage > 1 ? (
            <Link
              href={pageUrl(base, filters, pagination.currentPage - 1)}
              className="hover:text-primary font-medium transition-colors"
            >
              {labels.previous}
            </Link>
          ) : (
            <span />
          )}
          <span className="text-muted-foreground font-mono text-[13px]">
            {pagination.currentPage} / {pagination.lastPage}
          </span>
          {pagination.currentPage < pagination.lastPage ? (
            <Link
              href={pageUrl(base, filters, pagination.currentPage + 1)}
              className="hover:text-primary font-medium transition-colors"
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
