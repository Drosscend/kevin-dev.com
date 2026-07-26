import { useEffect, useRef } from 'react'
import { cn } from '~/lib/utils'

const DOWNLOAD_EXTENSIONS: Record<string, string> = {
  ts: 'ts',
  tsx: 'tsx',
  js: 'js',
  jsx: 'jsx',
  json: 'json',
  sh: 'sh',
  bash: 'sh',
  css: 'css',
  html: 'html',
  sql: 'sql',
  py: 'py',
  yaml: 'yml',
  yml: 'yml',
  md: 'md',
}

const COPY_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'
const CHECK_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M20 6 9 17l-5-5"/></svg>'
const DOWNLOAD_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'

function toolbarButton(icon: string, title: string, onClick: () => void) {
  const button = document.createElement('button')
  button.type = 'button'
  button.title = title
  button.innerHTML = icon
  button.className =
    'rounded-md border border-neutral-300 bg-white/80 p-1.5 text-neutral-600 opacity-0 transition-opacity hover:bg-white group-hover:opacity-100 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-300'
  button.addEventListener('click', onClick)
  return button
}

function enhanceCodeBlock(pre: HTMLPreElement) {
  if (pre.dataset.enhanced === 'true') {
    return
  }
  pre.dataset.enhanced = 'true'

  const language = pre.dataset.language ?? ''
  const code = () => pre.querySelector('code')?.textContent ?? ''

  const toolbar = document.createElement('div')
  toolbar.className = 'absolute top-2 right-2 flex gap-1'

  const copyButton = toolbarButton(COPY_ICON, 'Copier', async () => {
    await navigator.clipboard.writeText(code())
    copyButton.innerHTML = CHECK_ICON
    setTimeout(() => {
      copyButton.innerHTML = COPY_ICON
    }, 1500)
  })
  toolbar.appendChild(copyButton)

  toolbar.appendChild(
    toolbarButton(DOWNLOAD_ICON, 'Télécharger', () => {
      const extension = DOWNLOAD_EXTENSIONS[language] ?? 'txt'
      const blob = new Blob([code()], { type: 'text/plain;charset=utf-8' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `snippet.${extension}`
      link.click()
      URL.revokeObjectURL(link.href)
    })
  )

  const wrapper = document.createElement('div')
  wrapper.className = 'group relative'
  pre.replaceWith(wrapper)
  wrapper.append(pre, toolbar)
}

/**
 * Renders pre-rendered article HTML and progressively enhances it:
 * a copy/download toolbar on shiki code blocks, and lazy client-side
 * rendering of mermaid diagram blocks into SVG.
 */
export default function ArticleContent({ html, className }: { html: string; className?: string }) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = container.current
    if (!root) {
      return
    }

    root.querySelectorAll<HTMLPreElement>('pre[data-language]').forEach(enhanceCodeBlock)

    const diagrams = [...root.querySelectorAll<HTMLElement>('.mermaid:not([data-processed])')]
    if (diagrams.length > 0) {
      import('mermaid').then(({ default: mermaid }) => {
        mermaid.initialize({ startOnLoad: false, theme: 'neutral' })
        mermaid.run({ nodes: diagrams })
      })
    }
  }, [html])

  return (
    <div
      ref={container}
      className={cn('typeset', className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
