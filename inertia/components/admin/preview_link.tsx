import { Eye } from 'lucide-react'
import { Button } from '~/components/ui/button'

const PUBLIC_BASE = {
  articles: '/blog',
  projects: '/projects',
  talks: '/talks',
} as const

export type PreviewKind = keyof typeof PUBLIC_BASE

type PreviewLinkProps = {
  kind: PreviewKind
  slug: string
  title: string
  showLabel?: boolean
}

/**
 * Opens an entry on its real public URL in a new tab. A draft or a
 * withdrawn entry stays a 404/410 for anonymous visitors, but the
 * signed-in author gets it rendered as a preview.
 */
export default function PreviewLink({ kind, slug, title, showLabel = false }: PreviewLinkProps) {
  return (
    <Button asChild variant="ghost" size="sm">
      <a
        href={`${PUBLIC_BASE[kind]}/${slug}`}
        target="_blank"
        rel="noreferrer"
        aria-label={`Aperçu de ${title}`}
        title="Aperçu sur l’URL publique"
      >
        <Eye className="size-4" />
        {showLabel && 'Aperçu'}
      </a>
    </Button>
  )
}
