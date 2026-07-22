import { Download } from 'lucide-react'
import ArticleContent from '~/components/article_content'
import Seo, { type SeoMeta } from '~/components/seo'
import { Button } from '~/components/ui/button'

type CvProps = {
  locale: 'fr' | 'en'
  contentHtml: string
  pdfAvailable: boolean
  labels: {
    title: string
    download: string
    empty: string
  }
  meta: SeoMeta
}

export default function Cv({ contentHtml, pdfAvailable, labels, meta }: CvProps) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 pb-24 md:pb-32">
      <Seo meta={meta} />
      <div className="mx-auto max-w-[720px]">
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

        <div className="mt-10">
          {contentHtml ? (
            <ArticleContent html={contentHtml} />
          ) : (
            <p className="text-muted-foreground">{labels.empty}</p>
          )}
        </div>
      </div>
    </div>
  )
}
