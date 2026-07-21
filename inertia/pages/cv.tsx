import { Download } from 'lucide-react'
import { Button } from '~/components/ui/button'
import ArticleContent from '~/components/article_content'

type CvProps = {
  locale: 'fr' | 'en'
  contentHtml: string
  pdfAvailable: boolean
  labels: {
    title: string
    download: string
    empty: string
  }
}

export default function Cv({ contentHtml, pdfAvailable, labels }: CvProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{labels.title}</h1>
        {pdfAvailable && (
          <Button asChild>
            <a href="/cv.pdf">
              <Download className="size-4" />
              {labels.download}
            </a>
          </Button>
        )}
      </div>

      {contentHtml ? (
        <ArticleContent html={contentHtml} />
      ) : (
        <p className="text-muted-foreground">{labels.empty}</p>
      )}
    </div>
  )
}
