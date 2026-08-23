import { Link } from '@adonisjs/inertia/react'
import { localePath } from '#types/i18n'
import ArticleContent from '~/components/article_content'
import Lightbox from '~/components/lightbox'
import { BackLink } from '~/components/page_header'
import PreviewBanner from '~/components/preview_banner'
import ReadingLayout from '~/components/reading_layout'
import Seo, { type SeoMeta } from '~/components/seo'
import TableOfContents from '~/components/table_of_contents'
import { TechnologySection } from '~/components/technology_list'
import { type InertiaProps } from '~/types'
import type { PreviewMode } from '#types/content'
import type { Data } from '@generated/data'

type BlogShowProps = InertiaProps<{
  preview: PreviewMode
  article: Data.Blog.ArticleDetail
  hasOtherLocale: boolean
  meta: SeoMeta
}>

export default function BlogShow({ locale, preview, article, messages, meta }: BlogShowProps) {
  const base = localePath(locale, '/blog')

  return (
    <>
      <Seo meta={meta} />

      <ReadingLayout
        aside={<TableOfContents html={article.contentHtml} />}
      >
        {preview && <PreviewBanner preview={preview} className="mb-10" />}

        <div className="text-sm">
          <BackLink href={base} label={messages.blog.backToList} />
        </div>

        <header className="mt-12">
          <h1 className="text-3xl font-bold md:text-4xl">{article.title}</h1>
          <p className="text-muted-foreground mt-4 font-mono text-[13px]">
            {article.publishedAt && (
              <>
                {messages.blog.publishedOn} {article.publishedAt} ·{' '}
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

        <Lightbox className="mt-10">
          <ArticleContent html={article.contentHtml} />
        </Lightbox>

        <TechnologySection
          className="mt-12"
          locale={locale}
          title={messages.blog.technologies}
          technologies={article.technologies}
        />
      </ReadingLayout>
    </>
  )
}
