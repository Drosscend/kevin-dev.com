import type { Ref } from 'react'
import CodeMirror, { EditorView, type ReactCodeMirrorRef } from '@uiw/react-codemirror'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags } from '@lezer/highlight'

/**
 * Token classes rather than inline styles: the palette lives in
 * `editor.css` next to the WYSIWYG one, so both modes follow the
 * same design tokens and switch with the dark theme.
 */
const highlight = HighlightStyle.define([
  { tag: tags.heading1, class: 'cm-md-heading cm-md-h1' },
  { tag: tags.heading2, class: 'cm-md-heading cm-md-h2' },
  { tag: tags.heading3, class: 'cm-md-heading cm-md-h3' },
  { tag: [tags.heading4, tags.heading5, tags.heading6], class: 'cm-md-heading' },
  { tag: tags.strong, class: 'cm-md-strong' },
  { tag: tags.emphasis, class: 'cm-md-emphasis' },
  { tag: tags.strikethrough, class: 'cm-md-strike' },
  { tag: tags.link, class: 'cm-md-link' },
  { tag: tags.url, class: 'cm-md-url' },
  { tag: [tags.monospace, tags.special(tags.string)], class: 'cm-md-code' },
  { tag: tags.quote, class: 'cm-md-quote' },
  { tag: [tags.processingInstruction, tags.contentSeparator], class: 'cm-md-marker' },
  // Languages loaded on demand inside fenced code blocks.
  { tag: [tags.keyword, tags.modifier, tags.self], class: 'cm-code-keyword' },
  { tag: [tags.string, tags.regexp], class: 'cm-code-string' },
  { tag: [tags.comment, tags.lineComment, tags.blockComment], class: 'cm-code-comment' },
  { tag: [tags.number, tags.bool, tags.null, tags.atom], class: 'cm-code-number' },
  { tag: [tags.function(tags.variableName), tags.propertyName], class: 'cm-code-function' },
  { tag: [tags.typeName, tags.className, tags.tagName], class: 'cm-code-type' },
  { tag: [tags.operator, tags.punctuation, tags.bracket], class: 'cm-code-punctuation' },
  { tag: [tags.attributeName, tags.definition(tags.variableName)], class: 'cm-code-attribute' },
])

const EXTENSIONS = [
  markdown({ base: markdownLanguage, codeLanguages: languages }),
  syntaxHighlighting(highlight),
  EditorView.lineWrapping,
]

/**
 * Raw markdown pane: the same text stored in database, syntax
 * coloured by CodeMirror with lazily loaded grammars for fenced
 * code blocks.
 */
export default function MarkdownSource({
  ref,
  id,
  value,
  placeholder,
  onChange,
}: {
  ref?: Ref<ReactCodeMirrorRef>
  id: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
}) {
  return (
    <CodeMirror
      ref={ref}
      id={id}
      value={value}
      placeholder={placeholder}
      extensions={EXTENSIONS}
      onChange={onChange}
      indentWithTab={false}
      basicSetup={{
        lineNumbers: false,
        foldGutter: false,
        highlightActiveLine: false,
        highlightActiveLineGutter: false,
        autocompletion: false,
        bracketMatching: false,
        closeBrackets: false,
        indentOnInput: false,
      }}
      className="markdown-source"
    />
  )
}
