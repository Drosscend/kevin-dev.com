import { Link } from '@adonisjs/inertia/react'
import ArticleContent from '~/components/article_content'
import { BackLink } from '~/components/page_header'
import PreviewBanner, { type PreviewMode } from '~/components/preview_banner'
import ReadingLayout from '~/components/reading_layout'
import Seo, { type SeoMeta } from '~/components/seo'
import TableOfContents from '~/components/table_of_contents'
import { TechnologySection, type TechnologyRef } from '~/components/technology_list'
import { localePath } from '~/lib/locale'

type BlogShowProps = {
  locale: 'fr' | 'en'
  preview: PreviewMode
  article: {
    slug: string
    title: string
    summary: string
    contentHtml: string
    publishedAt: string | null
    readingTimeLabel: string
    category: { slug: string; name: string } | null
    technologies: TechnologyRef[]
  }
  hasOtherLocale: boolean
  labels: {
    publishedOn: string
    draft: string
    archived: string
    backToList: string
    technologies: string
    contents: string
  }
  meta: SeoMeta
}

export default function BlogShow({ locale, preview, article, labels, meta }: BlogShowProps) {
  const base = localePath(locale, '/blog')

  return (
    <>
      <Seo meta={meta} />

      <ReadingLayout aside={<TableOfContents html={article.contentHtml} label={labels.contents} />}>
        {preview && <PreviewBanner label={labels[preview]} className="mb-10" />}

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

        <TechnologySection
          className="mt-12"
          locale={locale}
          title={labels.technologies}
          technologies={article.technologies}
        />
      </ReadingLayout>
    </>
  )
}
