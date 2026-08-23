import { type Editor, useEditorState } from '@tiptap/react'
import {
  BoldIcon,
  CodeIcon,
  CodeSquareIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ImagePlusIcon,
  ItalicIcon,
  Link2Icon,
  ListIcon,
  ListOrderedIcon,
  ListTodoIcon,
  MinusIcon,
  QuoteIcon,
  Redo2Icon,
  StrikethroughIcon,
  TableIcon,
  Undo2Icon,
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { Toggle } from '~/components/ui/toggle'
import type { LucideIcon } from 'lucide-react'

type MarkState = {
  bold: boolean
  italic: boolean
  strike: boolean
  code: boolean
  h1: boolean
  h2: boolean
  h3: boolean
  bulletList: boolean
  orderedList: boolean
  taskList: boolean
  blockquote: boolean
  codeBlock: boolean
  link: boolean
}

type ToggleItem = {
  state: keyof MarkState
  label: string
  shortcut: string
  icon: LucideIcon
  run: (editor: Editor) => void
}

/**
 * Toggles grouped the way the markdown syntax is: inline marks,
 * headings, lists, then blocks. Each one mirrors a native Tiptap
 * shortcut, shown in the tooltip so the keyboard stays the fast path.
 */
const TOGGLE_GROUPS: ToggleItem[][] = [
  [
    {
      state: 'bold',
      label: 'Gras',
      shortcut: 'Ctrl+B',
      icon: BoldIcon,
      run: (editor) => editor.chain().focus().toggleBold().run(),
    },
    {
      state: 'italic',
      label: 'Italique',
      shortcut: 'Ctrl+I',
      icon: ItalicIcon,
      run: (editor) => editor.chain().focus().toggleItalic().run(),
    },
    {
      state: 'strike',
      label: 'Barré',
      shortcut: 'Ctrl+Maj+S',
      icon: StrikethroughIcon,
      run: (editor) => editor.chain().focus().toggleStrike().run(),
    },
    {
      state: 'code',
      label: 'Code en ligne',
      shortcut: 'Ctrl+E',
      icon: CodeIcon,
      run: (editor) => editor.chain().focus().toggleCode().run(),
    },
  ],
  [
    {
      state: 'h1',
      label: 'Titre 1',
      shortcut: 'Ctrl+Alt+1',
      icon: Heading1Icon,
      run: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      state: 'h2',
      label: 'Titre 2',
      shortcut: 'Ctrl+Alt+2',
      icon: Heading2Icon,
      run: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      state: 'h3',
      label: 'Titre 3',
      shortcut: 'Ctrl+Alt+3',
      icon: Heading3Icon,
      run: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
  ],
  [
    {
      state: 'bulletList',
      label: 'Liste à puces',
      shortcut: 'Ctrl+Maj+8',
      icon: ListIcon,
      run: (editor) => editor.chain().focus().toggleBulletList().run(),
    },
    {
      state: 'orderedList',
      label: 'Liste numérotée',
      shortcut: 'Ctrl+Maj+7',
      icon: ListOrderedIcon,
      run: (editor) => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      state: 'taskList',
      label: 'Liste de tâches',
      shortcut: 'Ctrl+Maj+9',
      icon: ListTodoIcon,
      run: (editor) => editor.chain().focus().toggleTaskList().run(),
    },
  ],
  [
    {
      state: 'blockquote',
      label: 'Citation',
      shortcut: 'Ctrl+Maj+B',
      icon: QuoteIcon,
      run: (editor) => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      state: 'codeBlock',
      label: 'Bloc de code',
      shortcut: 'Ctrl+Alt+C',
      icon: CodeSquareIcon,
      run: (editor) => editor.chain().focus().toggleCodeBlock().run(),
    },
  ],
]

export default function MarkdownToolbar({
  editor,
  onLink,
  onImage,
}: {
  editor: Editor
  onLink: () => void
  onImage: () => void
}) {
  const state = useEditorState({
    editor,
    selector: ({ editor: instance }): MarkState & { canUndo: boolean; canRedo: boolean } => ({
      bold: instance.isActive('bold'),
      italic: instance.isActive('italic'),
      strike: instance.isActive('strike'),
      code: instance.isActive('code'),
      h1: instance.isActive('heading', { level: 1 }),
      h2: instance.isActive('heading', { level: 2 }),
      h3: instance.isActive('heading', { level: 3 }),
      bulletList: instance.isActive('bulletList'),
      orderedList: instance.isActive('orderedList'),
      taskList: instance.isActive('taskList'),
      blockquote: instance.isActive('blockquote'),
      codeBlock: instance.isActive('codeBlock'),
      link: instance.isActive('link'),
      canUndo: instance.can().undo(),
      canRedo: instance.can().redo(),
    }),
  })

  return (
    <div className="flex flex-wrap items-center gap-1 border-b px-2 py-1.5">
      {TOGGLE_GROUPS.map((group, index) => (
        <div key={group[0].state} className="flex items-center gap-0.5">
          {index > 0 && <Separator orientation="vertical" className="mr-1 h-5" />}
          {group.map(({ state: key, label, shortcut, icon: Icon, run }) => (
            <Toggle
              key={key}
              size="sm"
              aria-label={label}
              title={`${label} (${shortcut})`}
              pressed={state[key]}
              onPressedChange={() => run(editor)}
            >
              <Icon />
            </Toggle>
          ))}
        </div>
      ))}

      <Separator orientation="vertical" className="mx-1 h-5" />

      <Toggle
        size="sm"
        aria-label="Lien"
        title="Lien (Ctrl+K)"
        pressed={state.link}
        onPressedChange={onLink}
      >
        <Link2Icon />
      </Toggle>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Image"
        title="Insérer une image"
        onClick={onImage}
      >
        <ImagePlusIcon />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Tableau"
        title="Insérer un tableau"
        onClick={() =>
          editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
        }
      >
        <TableIcon />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Séparateur"
        title="Séparateur horizontal"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <MinusIcon />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-5" />

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Annuler"
        title="Annuler (Ctrl+Z)"
        disabled={!state.canUndo}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo2Icon />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Rétablir"
        title="Rétablir (Ctrl+Maj+Z)"
        disabled={!state.canRedo}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo2Icon />
      </Button>
    </div>
  )
}
