import MarkdownPageEditor from '~/components/admin/markdown_page_editor'
import { type InertiaProps } from '~/types'

type LegalProps = InertiaProps<{
  fr: string
  en: string
}>

export default function Legal({ fr, en }: LegalProps) {
  return (
    <MarkdownPageEditor
      scope="legal"
      title="Mentions légales"
      description="Contenu Markdown de la page /legal."
      fr={fr}
      en={en}
      route="admin.legal.update"
    />
  )
}
