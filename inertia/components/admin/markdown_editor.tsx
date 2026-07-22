import {
  type ChangeEvent,
  type ClipboardEvent,
  type DragEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Dialog } from 'radix-ui'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import ArticleContent from '~/components/article_content'
import { fetchMarkdownPreview, uploadMediaImage } from '~/lib/admin'

/**
 * Markdown textarea with inline image upload (drag-and-drop or
 * paste, alt text asked through a dialog before uploading to the
 * media library) and an optional side-by-side server-rendered
 * preview, refreshed with a debounce while typing.
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
  // Monotonic counter so a stale preview response never overwrites a
  // newer one.
  const previewRequestRef = useRef(0)

  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewHtml, setPreviewHtml] = useState('')
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [altText, setAltText] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    if (!previewOpen) {
      return
    }
    // Bumping the counter invalidates any in-flight request so a
    // stale response can never repaint the panel.
    const requestId = ++previewRequestRef.current
    const empty = value.trim() === ''
    const timer = window.setTimeout(
      async () => {
        if (empty) {
          setPreviewHtml('')
          return
        }
        const html = await fetchMarkdownPreview(value)
        if (html !== null && requestId === previewRequestRef.current) {
          setPreviewHtml(html)
        }
      },
      empty ? 0 : 1000
    )
    return () => window.clearTimeout(timer)
  }, [value, previewOpen])

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
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setPreviewOpen((open) => !open)}
        >
          {previewOpen ? 'Masquer l’aperçu' : 'Aperçu'}
        </Button>
      </div>

      <div className={previewOpen ? 'grid gap-4 lg:grid-cols-2' : ''}>
        <textarea
          ref={textareaRef}
          id={id}
          rows={rows}
          className="border-input min-h-60 w-full rounded-md border bg-transparent px-3 py-2 font-mono text-sm disabled:opacity-50"
          value={value}
          disabled={uploading}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value)}
          onPaste={handlePaste}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
        />
        {previewOpen && (
          <div className="bg-card min-h-60 overflow-x-auto rounded-md border px-4 py-3">
            {previewHtml !== '' && value.trim() !== '' ? (
              <ArticleContent html={previewHtml} />
            ) : (
              <p className="text-muted-foreground text-sm">
                L’aperçu s’affichera ici pendant la saisie.
              </p>
            )}
          </div>
        )}
      </div>

      {uploading && <p className="text-muted-foreground text-sm">Envoi de l’image…</p>}
      {uploadError && <p className="text-destructive text-sm">{uploadError}</p>}

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
