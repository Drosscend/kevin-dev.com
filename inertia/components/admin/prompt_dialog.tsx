import { useState } from 'react'
import { Dialog } from 'radix-ui'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

/**
 * Dialog body, mounted only while the dialog is open so the field
 * always starts from a fresh `initialValue`.
 */
function PromptForm({
  title,
  description,
  placeholder,
  initialValue,
  confirmLabel,
  pending,
  onConfirm,
}: {
  title: string
  description: string
  placeholder?: string
  initialValue: string
  confirmLabel: string
  pending: boolean
  onConfirm: (value: string) => void
}) {
  const [value, setValue] = useState(initialValue)
  const empty = value.trim() === ''

  function confirm() {
    if (!empty) {
      onConfirm(value.trim())
    }
  }

  return (
    <Dialog.Content className="bg-popover fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 space-y-4 rounded-lg border p-6 shadow-lg">
      <Dialog.Title className="font-semibold">{title}</Dialog.Title>
      <Dialog.Description className="text-muted-foreground text-sm">
        {description}
      </Dialog.Description>
      <Input
        autoFocus
        value={value}
        placeholder={placeholder}
        disabled={pending}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            confirm()
          }
        }}
      />
      <div className="flex justify-end gap-3">
        <Dialog.Close asChild>
          <Button type="button" variant="outline" size="sm">
            Annuler
          </Button>
        </Dialog.Close>
        <Button type="button" size="sm" disabled={empty || pending} onClick={confirm}>
          {confirmLabel}
        </Button>
      </div>
    </Dialog.Content>
  )
}

/**
 * Single-field modal asking for one value before an editor action
 * (an image alt text, a link target…).
 */
export default function PromptDialog({
  open,
  initialValue = '',
  pending = false,
  onCancel,
  ...props
}: {
  open: boolean
  title: string
  description: string
  placeholder?: string
  initialValue?: string
  confirmLabel: string
  pending?: boolean
  onCancel: () => void
  onConfirm: (value: string) => void
}) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          onCancel()
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <PromptForm initialValue={initialValue} pending={pending} {...props} />
      </Dialog.Portal>
    </Dialog.Root>
  )
}
