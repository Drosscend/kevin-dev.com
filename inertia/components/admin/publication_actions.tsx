import { Button } from '~/components/ui/button'
import ConfirmButton from '~/components/admin/confirm_button'

export type PublicationStatus = 'draft' | 'published' | 'archived'

/**
 * Actions offered by a content form, driven by what the entry has
 * already been through. Once its URL has been public, going back to
 * draft is no longer proposed: it would turn a live page into a bare
 * 404, so withdrawing it from the site is the way out.
 */
export default function PublicationActions({
  status,
  hasBeenOnline,
  processing,
  onSave,
}: {
  status: PublicationStatus
  hasBeenOnline: boolean
  processing: boolean
  onSave: (status: PublicationStatus) => void
}) {
  if (!hasBeenOnline) {
    return (
      <>
        <Button
          type="button"
          variant="outline"
          disabled={processing}
          onClick={() => onSave('draft')}
        >
          Enregistrer en brouillon
        </Button>
        <Button type="button" disabled={processing} onClick={() => onSave('published')}>
          Publier
        </Button>
      </>
    )
  }

  if (status === 'archived') {
    return (
      <>
        <Button
          type="button"
          variant="outline"
          disabled={processing}
          onClick={() => onSave('archived')}
        >
          Enregistrer
        </Button>
        <Button type="button" disabled={processing} onClick={() => onSave('published')}>
          Remettre en ligne
        </Button>
      </>
    )
  }

  return (
    <>
      <ConfirmButton
        trigger={
          <Button type="button" variant="outline" disabled={processing}>
            Retirer du site
          </Button>
        }
        title="Retirer du site"
        description="La page disparaît du site et de son sommaire. Son adresse répondra « contenu retiré » au lieu d’une page introuvable, et tu pourras la remettre en ligne à tout moment."
        confirmLabel="Retirer"
        onConfirm={() => onSave('archived')}
      />
      <Button type="button" disabled={processing} onClick={() => onSave('published')}>
        Mettre à jour
      </Button>
    </>
  )
}
