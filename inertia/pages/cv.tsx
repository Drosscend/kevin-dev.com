import { Download } from 'lucide-react'
import ArticleContent from '~/components/article_content'
import { EmptyState } from '~/components/empty_state'
import Lightbox from '~/components/lightbox'
import ReadingLayout from '~/components/reading_layout'
import Seo, { type SeoMeta } from '~/components/seo'
import { Button } from '~/components/ui/button'
import { type InertiaProps } from '~/types'

type CvProps = InertiaProps<{
  contentHtml: string
  pdfAvailable: boolean
  labels: {
    title: string
    download: string
    empty: string
  }
  meta: SeoMeta
}>

export default function Cv({ contentHtml, pdfAvailable, labels, meta }: CvProps) {
  return (
    <>
      <Seo meta={meta} />
      <ReadingLayout>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold md:text-4xl">{labels.title}</h1>
          {pdfAvailable && (
            <Button asChild size="lg" className="w-full sm:w-auto">
              <a href="/cv.pdf" download>
                <Download aria-hidden className="size-4" />
                {labels.download}
              </a>
            </Button>
          )}
        </div>

        <Lightbox className="mt-10">
          {contentHtml ? (
            <ArticleContent html={contentHtml} />
          ) : (
            <EmptyState>{labels.empty}</EmptyState>
          )}
        </Lightbox>
      </ReadingLayout>
    </>
  )
}
