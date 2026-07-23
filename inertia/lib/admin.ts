import { client } from '~/client'

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

export type UploadedMedia = { id: number; alt: string; url: string }

/**
 * Uploads an image to the media library through the JSON endpoint
 * used by the markdown editor. Resolves with the created media on
 * success, or a French error message on validation/network failure.
 */
export async function uploadMediaImage(
  file: File,
  alt: string
): Promise<{ media: UploadedMedia } | { error: string }> {
  const body = new FormData()
  body.append('file', file)
  body.append('alt', alt)

  try {
    const response = await fetch(client.urlFor('admin.media.upload'), {
      method: 'POST',
      headers: { 'X-XSRF-TOKEN': xsrfToken() },
      body,
    })
    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as {
        errors?: Record<string, string | string[]>
      } | null
      const firstError = payload?.errors ? Object.values(payload.errors).flat()[0] : null
      return { error: typeof firstError === 'string' ? firstError : 'Téléversement impossible' }
    }
    return { media: (await response.json()) as UploadedMedia }
  } catch {
    return { error: 'Téléversement impossible, vérifiez votre connexion' }
  }
}
