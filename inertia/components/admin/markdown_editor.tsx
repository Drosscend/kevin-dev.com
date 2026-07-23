import { type ChangeEvent, type ClipboardEvent, type DragEvent, useRef, useState } from 'react'
import { Dialog } from 'radix-ui'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { ErrorText } from '~/components/field_error'
import { uploadMediaImage } from '~/lib/admin'

/**
 * Markdown textarea with inline image upload (drag-and-drop or
 * paste, alt text asked through a dialog before uploading to the
 * media library).
 */
export default function MarkdownEditor({
  id,
  label,
  value,
  onChange,
  rows,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  rows?: number
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  // Caret position captured when an image lands, reused after the
  // upload finishes to insert the markdown at that spot.
  const insertionRef = useRef<{ start: number; end: number }>({ start: 0, end: 0 })

  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [altText, setAltText] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  function captureImage(file: File) {
    const textarea = textareaRef.current
    insertionRef.current = {
      start: textarea?.selectionStart ?? value.length,
      end: textarea?.selectionEnd ?? value.length,
    }
    setUploadError(null)
    setAltText('')
    setPendingFile(file)
  }

  function handlePaste(event: ClipboardEvent<HTMLTextAreaElement>) {
    const file = [...event.clipboardData.files].find((item) => item.type.startsWith('image/'))
    if (file) {
      event.preventDefault()
      captureImage(file)
    }
  }

  function handleDrop(event: DragEvent<HTMLTextAreaElement>) {
    const file = [...event.dataTransfer.files].find((item) => item.type.startsWith('image/'))
    if (file) {
      event.preventDefault()
      captureImage(file)
    }
  }

  async function confirmUpload() {
    if (!pendingFile || altText.trim() === '') {
      return
    }
    setUploading(true)
    const result = await uploadMediaImage(pendingFile, altText.trim())
    setUploading(false)
    setPendingFile(null)

    if ('error' in result) {
      setUploadError(result.error)
      return
    }

    // Clamp the captured caret in case the text changed while the
    // dialog was open, then insert and restore the caret after the
    // inserted snippet.
    const snippet = `![${result.media.alt}](${result.media.url})`
    const start = Math.min(insertionRef.current.start, value.length)
    const end = Math.min(Math.max(insertionRef.current.end, start), value.length)
    onChange(value.slice(0, start) + snippet + value.slice(end))
    window.setTimeout(() => {
      const textarea = textareaRef.current
      if (textarea) {
        textarea.focus()
        textarea.setSelectionRange(start + snippet.length, start + snippet.length)
      }
    }, 0)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      <Textarea
        ref={textareaRef}
        id={id}
        rows={rows}
        className="min-h-60 font-mono"
        value={value}
        disabled={uploading}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value)}
        onPaste={handlePaste}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
      />

      {uploading && <p className="text-muted-foreground text-sm">Envoi de l’image…</p>}
      {uploadError && <ErrorText>{uploadError}</ErrorText>}

      <Dialog.Root
        open={pendingFile !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingFile(null)
          }
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
          <Dialog.Content className="bg-popover fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 space-y-4 rounded-lg border p-6 shadow-lg">
            <Dialog.Title className="font-semibold">Texte alternatif</Dialog.Title>
            <Dialog.Description className="text-muted-foreground text-sm">
              Décrivez l’image pour l’accessibilité avant de l’insérer.
            </Dialog.Description>
            <Input
              autoFocus
              value={altText}
              onChange={(event) => setAltText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  void confirmUpload()
                }
              }}
            />
            <div className="flex justify-end gap-3">
              <Dialog.Close asChild>
                <Button type="button" variant="outline" size="sm">
                  Annuler
                </Button>
              </Dialog.Close>
              <Button
                type="button"
                size="sm"
                disabled={altText.trim() === ''}
                onClick={() => void confirmUpload()}
              >
                Insérer
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
