import { router } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import { ChipButton, ChipList } from '~/components/chip'
import { LinkArrow, ListingList, ListingRow } from '~/components/content_link'
import { PageHeader } from '~/components/page_header'
import Seo, { type SeoMeta } from '~/components/seo'
import { localePath } from '~/lib/locale'

type ArticleCard = {
  slug: string
  title: string
  summary: string
  publishedAt: string | null
  readingTimeLabel: string
  category: { slug: string; name: string } | null
  tags: { slug: string; name: string }[]
  coverUrl: string | null
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
    clearTag: string
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

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 pb-24 md:pb-32">
      <Seo meta={meta} />

      <PageHeader title={labels.title} />

      {categories.length > 0 && (
        <ChipList className="-mt-4">
          <ChipButton onClick={() => filterByCategory(null)} active={!filters.category}>
            {labels.allCategories}
          </ChipButton>
          {categories.map((category) => (
            <ChipButton
              key={category.slug}
              onClick={() => filterByCategory(category.slug)}
              active={filters.category === category.slug}
            >
              {category.name}
            </ChipButton>
          ))}
        </ChipList>
      )}

      {filters.tag && (
        <p className="text-muted-foreground mt-8 font-mono text-[13px]">
          #{filters.tag}{' '}
          <Link
            href={pageUrl(base, { category: filters.category, tag: null }, 1)}
            className="hover:text-primary ml-1 transition-colors"
            aria-label={labels.clearTag}
          >
            ×
          </Link>
        </p>
      )}

      {articles.length === 0 ? (
        <p className="text-muted-foreground">{labels.empty}</p>
      ) : (
        <div className="mt-12">
          <ListingList>
            {articles.map((article) => (
              <ListingRow
                key={article.slug}
                href={`${base}/${article.slug}`}
                title={article.title}
                summary={article.summary}
                thumbnailUrl={article.coverUrl}
                meta={
                  <>
                    <span>
                      {article.publishedAt} · {article.readingTimeLabel}
                    </span>
                    {article.category && (
                      <Link
                        href={pageUrl(base, { category: article.category.slug, tag: null }, 1)}
                        className="hover:text-primary tracking-wider uppercase transition-colors"
                      >
                        {article.category.name}
                      </Link>
                    )}
                  </>
                }
                footer={
                  article.tags.length > 0 && (
                    <p className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[13px]">
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
                  )
                }
              />
            ))}
          </ListingList>
        </div>
      )}

      {pagination.lastPage > 1 && (
        <nav className="mt-12 flex max-w-[760px] items-center justify-between text-sm">
          {pagination.currentPage > 1 ? (
            <Link
              href={pageUrl(base, filters, pagination.currentPage - 1)}
              className="group hover:text-primary font-medium transition-colors"
            >
              <LinkArrow direction="back" /> {labels.previous}
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
              className="group hover:text-primary font-medium transition-colors"
            >
              {labels.next} <LinkArrow />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  )
}
