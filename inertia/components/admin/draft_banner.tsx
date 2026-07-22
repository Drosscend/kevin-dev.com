import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'

/**
 * Banner shown at the top of a form when a local draft newer than
 * the loaded data was found, offering to restore or discard it.
 */
export default function DraftBanner({
  savedAt,
  onRestore,
  onDiscard,
}: {
  savedAt: Date | null
  onRestore: () => void
  onDiscard: () => void
}) {
  return (
    <Card className="border-primary/40 py-4">
      <CardContent className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm">
          Brouillon non enregistré
          {savedAt &&
            ` du ${savedAt.toLocaleDateString('fr-FR')} à ${savedAt.toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            })}`}
        </p>
        <div className="flex gap-2">
          <Button type="button" size="sm" onClick={onRestore}>
            Restaurer
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onDiscard}>
            Ignorer
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
