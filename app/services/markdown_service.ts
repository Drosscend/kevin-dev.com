import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeSlug from 'rehype-slug'
import rehypeShiki from '@shikijs/rehype'
import rehypeStringify from 'rehype-stringify'

const WORDS_PER_MINUTE = 200

/**
 * Renders Markdown to HTML: GFM syntax, slugged headings, and code
 * blocks highlighted by shiki with dual light/dark themes. Articles
 * store the resulting HTML, so nothing is rendered at request time
 * on the public site.
 */
export default class MarkdownService {
  static #processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeShiki, {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: 'light',
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
