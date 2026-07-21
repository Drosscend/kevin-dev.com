import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import rehypeSlug from 'rehype-slug'
import rehypeShiki from '@shikijs/rehype'
import rehypeStringify from 'rehype-stringify'
import type { Root, Element, Text } from 'hast'

const WORDS_PER_MINUTE = 200

/**
 * Turns ```mermaid code fences into <div class="mermaid"> nodes that
 * carry the raw diagram source. They bypass shiki and are rendered
 * into SVG diagrams client-side, only on pages that contain them.
 */
function rehypeMermaid() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (node.tagName !== 'pre' || !parent || index === undefined) {
        return
      }

      const code = node.children.find(
        (child): child is Element => child.type === 'element' && child.tagName === 'code'
      )
      const classes = (code?.properties?.className ?? []) as string[]
      if (!code || !classes.includes('language-mermaid')) {
        return
      }

      const source = code.children
        .filter((child): child is Text => child.type === 'text')
        .map((child) => child.value)
        .join('')

      parent.children[index] = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['mermaid'] },
        children: [{ type: 'text', value: source }],
      }
    })
  }
}

/**
 * GitHub-style sanitize schema extended for the pipeline's own
 * output: mermaid containers and language-tagged code blocks.
 * Sanitize runs before slug and shiki, so their generated markup
 * (heading ids, inline styles) is preserved.
 */
const sanitizeSchema: typeof defaultSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    div: [...(defaultSchema.attributes?.div ?? []), ['className', 'mermaid']],
    code: [...(defaultSchema.attributes?.code ?? []), ['className', /^language-/]],
  },
}

/**
 * Renders Markdown to HTML: GFM syntax, slugged headings, mermaid
 * diagram blocks, and code blocks highlighted by shiki with dual
 * light/dark themes and a data-language attribute (used by the
 * client toolbar for copy/download). The tree is sanitized before
 * rendering, so raw HTML and unsafe attributes never reach the
 * stored output. Articles store the resulting HTML, so nothing is
 * rendered at request time on the public site.
 */
export default class MarkdownService {
  static #processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeMermaid)
    .use(rehypeSanitize, sanitizeSchema)
    .use(rehypeSlug)
    .use(rehypeShiki, {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: 'light',
      transformers: [
        {
          pre(node) {
            node.properties['data-language'] = this.options.lang
          },
        },
      ],
    })
    .use(rehypeStringify)

  static async render(markdown: string) {
    const file = await this.#processor.process(markdown)
    return String(file)
  }

  /**
   * Estimated reading time in minutes, never below one minute.
   */
  static readingTime(markdown: string) {
    const words = markdown.split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
  }
}
