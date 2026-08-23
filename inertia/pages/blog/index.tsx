import { Link } from '@adonisjs/inertia/react'
import { router } from '@inertiajs/react'
import { ChipButton, ChipList } from '~/components/chip'
import { LinkArrow, ListingList, ListingRow } from '~/components/content_link'
import { EmptyState } from '~/components/empty_state'
import { PageHeader } from '~/components/page_header'
import Seo, { type SeoMeta } from '~/components/seo'
import { TechnologyNames } from '~/components/technology_list'
import { useLocalePath } from '~/lib/locale'
import { type InertiaProps } from '~/types'
import type { Data } from '@generated/data'

type BlogIndexProps = InertiaProps<{
  filters: { category: string | null }
  articles: Data.Blog.ArticleCard[]
  pagination: { currentPage: number; lastPage: number }
  categories: { slug: string; name: string }[]
  meta: SeoMeta
}>

/**
 * Listing URL carrying the active filter and page. Client-side twin
 * of listQueryString in the blog controller, which builds the same
 * query string for redirects and canonical URLs.
 */
function pageUrl(base: string, filters: { category: string | null }, page: number) {
  const params = new URLSearchParams()

  if (filters.category) {
    params.set('category', filters.category)
  }

  if (page > 1) {
    params.set('page', String(page))
  }
  const query = params.toString()
  return query ? `${base}?${query}` : base
}

export default function BlogIndex({
  filters,
  articles,
  pagination,
  categories,
  messages,
  meta,
}: BlogIndexProps) {
  const base = useLocalePath()('/blog')

  function filterByCategory(slug: string | null) {
    router.get(pageUrl(base, { category: slug }, 1), {}, { preserveState: true })
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 pb-24 md:pb-32">
      <Seo meta={meta} />

      <PageHeader title={messages.blog.title} />

      {categories.length > 0 && (
        <ChipList className="-mt-4">
          <ChipButton onClick={() => filterByCategory(null)} active={!filters.category}>
            {messages.blog.allCategories}
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

      {articles.length === 0 ? (
        <EmptyState className="mt-12">{messages.blog.empty}</EmptyState>
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
                  <span>
                    {article.publishedAt} · {article.readingTimeLabel}
                    {article.category && (
                      <>
                        {' · '}
                        <Link
                          href={pageUrl(base, { category: article.category.slug }, 1)}
                          className="hover:text-primary tracking-wider uppercase transition-colors"
                        >
                          {article.category.name}
                        </Link>
                      </>
                    )}
                  </span>
                }
                footer={
                  article.technologies.length > 0 && (
                    <TechnologyNames technologies={article.technologies} />
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
              <LinkArrow direction="back" /> {messages.blog.previous}
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
              {messages.blog.next} <LinkArrow />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  )
}
