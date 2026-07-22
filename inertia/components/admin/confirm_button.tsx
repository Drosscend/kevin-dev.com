import { type ReactNode } from 'react'
import { AlertDialog } from 'radix-ui'
import { Button } from '~/components/ui/button'

/**
 * Destructive action guarded by a confirmation dialog. Replaces the
 * native confirm() so deletions share one consistent, accessible UI.
 */
export default function ConfirmButton({
  trigger,
  title = 'Confirmer la suppression',
  description,
  confirmLabel = 'Supprimer',
  onConfirm,
}: {
  trigger: ReactNode
  title?: string
  description: string
  confirmLabel?: string
  onConfirm: () => void
}) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <AlertDialog.Content className="bg-popover fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 space-y-4 rounded-lg border p-6 shadow-lg">
          <AlertDialog.Title className="font-semibold">{title}</AlertDialog.Title>
          <AlertDialog.Description className="text-muted-foreground text-sm">
            {description}
          </AlertDialog.Description>
          <div className="flex justify-end gap-3">
            <AlertDialog.Cancel asChild>
              <Button type="button" variant="outline" size="sm">
                Annuler
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button type="button" variant="destructive" size="sm" onClick={onConfirm}>
                {confirmLabel}
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
