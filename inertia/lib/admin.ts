import { toast } from 'sonner'

export type TranslationValues = {
  title: string
  summary: string
  contentMarkdown: string
}

export const EMPTY_TRANSLATION: TranslationValues = { title: '', summary: '', contentMarkdown: '' }

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function xsrfToken() {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : ''
}

/**
 * Renders Markdown through the server pipeline (same output as the
 * public pages). Returns null and shows a toast when the request
 * fails (network error, expired CSRF token…).
 */
export async function fetchMarkdownPreview(markdown: string): Promise<string | null> {
  try {
    const response = await fetch('/admin/articles/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken() },
      body: JSON.stringify({ markdown }),
    })
    if (!response.ok) {
      toast.error('Aperçu indisponible, rechargez la page et réessayez')
      return null
    }
    const { html } = await response.json()
    return html
  } catch {
    toast.error('Aperçu indisponible, vérifiez votre connexion')
    return null
  }
}
