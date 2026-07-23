import { type ClipboardEvent, type DragEvent, useEffect, useRef, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from '@tiptap/markdown'
import { Image } from '@tiptap/extension-image'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import { TableKit } from '@tiptap/extension-table'
import { Placeholder } from '@tiptap/extensions'
import type { ReactCodeMirrorRef } from '@uiw/react-codemirror'
import { Code2, Pilcrow } from 'lucide-react'
import { Label } from '~/components/ui/label'
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle_group'
import { ErrorText } from '~/components/field_error'
import MarkdownSource from '~/components/admin/markdown_source'
import MarkdownToolbar from '~/components/admin/markdown_toolbar'
import PromptDialog from '~/components/admin/prompt_dialog'
import { uploadMediaImage } from '~/lib/admin'

const PLACEHOLDER = 'Rédigez le contenu…'

const EXTENSIONS = [
  StarterKit.configure({
    link: { openOnClick: false, autolink: true },
  }),
  Markdown,
  Image,
  TaskList,
  TaskItem.configure({ nested: true }),
  TableKit.configure({ table: { resizable: true } }),
  Placeholder.configure({ placeholder: PLACEHOLDER }),
]

type Mode = 'rich' | 'source'

/**
 * Markdown field with two interchangeable views over the same
 * value: a rich text surface backed by Tiptap (native shortcuts,
 * toolbar, live rendering) and a syntax coloured markdown source.
 * Images can be dropped or pasted in either view: the alt text is
 * asked for, the file goes to the media library and the resulting
 * markdown lands at the caret.
 */
export default function MarkdownEditor({
  id,
  label,
  value,
  onChange,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}) {
  const sourceRef = useRef<ReactCodeMirrorRef>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  // Last markdown this component pushed out, so an incoming `value`
  // that only echoes our own edit never resets the editor.
  const emittedRef = useRef(value)

  const [mode, setMode] = useState<Mode>('rich')
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [linkOpen, setLinkOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const editor = useEditor({
    extensions: EXTENSIONS,
    content: value,
    contentType: 'markdown',
    editorProps: {
      attributes: {
        id,
        class: 'typeset min-h-80 px-4 py-3 focus:outline-none',
      },
      handleKeyDown: (_view, event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
          event.preventDefault()
          setLinkOpen(true)
          return true
        }
        return false
      },
    },
    onUpdate: ({ editor: instance }) => {
      const markdown = instance.getMarkdown()
      emittedRef.current = markdown
      onChange(markdown)
    },
  })

  useEffect(() => {
    if (!editor || mode !== 'rich' || value === emittedRef.current) {
      return
    }
    // The value changed outside of the editor (form reset, locale
    // switch): reload the document without echoing it back.
    emittedRef.current = value
    editor.commands.setContent(value, { contentType: 'markdown', emitUpdate: false })
  }, [editor, mode, value])

  function updateSource(markdown: string) {
    emittedRef.current = markdown
    onChange(markdown)
  }

  function changeMode(next: string) {
    if (next === '' || next === mode) {
      return
    }
    if (next === 'rich') {
      editor?.commands.setContent(value, { contentType: 'markdown', emitUpdate: false })
      emittedRef.current = value
    }
    setMode(next as Mode)
  }

  function insertImage(alt: string, url: string) {
    if (mode === 'rich') {
      editor?.chain().focus().setImage({ src: url, alt }).run()
      return
    }
    const view = sourceRef.current?.view
    if (view) {
      view.dispatch(view.state.replaceSelection(`![${alt}](${url})`))
      view.focus()
    }
  }

  async function confirmUpload(alt: string) {
    if (!pendingFile) {
      return
    }
    setUploading(true)
    const result = await uploadMediaImage(pendingFile, alt)
    setUploading(false)
    setPendingFile(null)

    if ('error' in result) {
      setUploadError(result.error)
      return
    }
    setUploadError(null)
    insertImage(result.media.alt, result.media.url)
  }

  function confirmLink(href: string) {
    setLinkOpen(false)
    editor?.chain().focus().extendMarkRange('link').setLink({ href }).run()
  }

  function captureImage(file: File | undefined) {
    if (file?.type.startsWith('image/')) {
      setUploadError(null)
      setPendingFile(file)
    }
  }

  function handlePaste(event: ClipboardEvent) {
    const file = [...event.clipboardData.files].find((item) => item.type.startsWith('image/'))
    if (file) {
      event.preventDefault()
      event.stopPropagation()
      captureImage(file)
    }
  }

  function handleDrop(event: DragEvent) {
    const file = [...event.dataTransfer.files].find((item) => item.type.startsWith('image/'))
    if (file) {
      event.preventDefault()
      event.stopPropagation()
      captureImage(file)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <Label htmlFor={id}>{label}</Label>
        <ToggleGroup
          type="single"
          size="sm"
          variant="outline"
          value={mode}
          onValueChange={changeMode}
        >
          <ToggleGroupItem
            value="rich"
            className="px-3"
            aria-label="Édition enrichie"
            title="Édition enrichie"
          >
            <Pilcrow />
            Texte
          </ToggleGroupItem>
          <ToggleGroupItem
            value="source"
            className="px-3"
            aria-label="Source markdown"
            title="Source markdown"
          >
            <Code2 />
            Markdown
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div
        data-mode={mode}
        className="bg-card focus-within:border-ring focus-within:ring-ring/50 overflow-hidden rounded-md border transition-[color,box-shadow] focus-within:ring-[3px]"
        onPasteCapture={handlePaste}
        onDropCapture={handleDrop}
        onDragOver={(event) => event.preventDefault()}
      >
        {mode === 'rich' ? (
          <>
            {editor && (
              <MarkdownToolbar
                editor={editor}
                onLink={() => setLinkOpen(true)}
                onImage={() => fileInputRef.current?.click()}
              />
            )}
            <EditorContent editor={editor} className="markdown-rich" />
          </>
        ) : (
          <MarkdownSource
            ref={sourceRef}
            id={id}
            value={value}
            placeholder={PLACEHOLDER}
            onChange={updateSource}
          />
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          captureImage(event.target.files?.[0])
          event.target.value = ''
        }}
      />

      {uploading && <p className="text-muted-foreground text-sm">Envoi de l’image…</p>}
      {uploadError && <ErrorText>{uploadError}</ErrorText>}

      <PromptDialog
        open={pendingFile !== null}
        title="Texte alternatif"
        description="Décrivez l’image pour l’accessibilité avant de l’insérer."
        confirmLabel="Insérer"
        pending={uploading}
        onCancel={() => setPendingFile(null)}
        onConfirm={(alt) => void confirmUpload(alt)}
      />

      <PromptDialog
        open={linkOpen}
        title="Lien"
        description="Adresse du lien appliqué à la sélection."
        placeholder="https://exemple.fr"
        initialValue={editor?.getAttributes('link').href ?? ''}
        confirmLabel="Appliquer"
        onCancel={() => setLinkOpen(false)}
        onConfirm={confirmLink}
      />
    </div>
  )
}
