import rehypeShiki from '@shikijs/rehype'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

const WORDS_PER_MINUTE = 200

/**
 * GitHub-style sanitize schema extended for the pipeline's own
 * output: language-tagged code blocks. Sanitize runs before slug and
 * shiki, so their generated markup (heading ids, inline styles) is
 * preserved. Footnote ids already carry the "user-content-" prefix
 * from remark-rehype; sanitize must not prefix them a second time or
 * the reference links would no longer match their targets.
 */
const sanitizeSchema: typeof defaultSchema = {
  ...defaultSchema,
  clobberPrefix: '',
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code ?? []), ['className', /^language-/]],
  },
}

/**
 * Renders Markdown to HTML: GFM syntax, slugged headings, and code
 * blocks highlighted by shiki with dual light/dark themes and a
 * data-language attribute (used by the client toolbar for
 * copy/download). The tree is sanitized before rendering, so raw HTML
 * and unsafe attributes never reach the stored output. Articles store
 * the resulting HTML, so nothing is rendered at request time on the
 * public site.
 */
export default class MarkdownService {
  static #processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
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
