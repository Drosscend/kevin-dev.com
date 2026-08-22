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

/**
 * Shown under a slug field the server refuses to update, so the three
 * admin forms explain the rule the same way.
 */
export const SLUG_LOCKED_HINT =
  'Le slug est figé depuis la mise en ligne : le modifier casserait l’URL déjà partagée.'

function xsrfToken() {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : ''
}

type UploadedMedia = { id: number; alt: string; url: string }

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
      const payload: { errors?: Record<string, string | string[]> } | null = await response
        .json()
        .catch(() => null)
      const firstError = payload?.errors ? Object.values(payload.errors).flat()[0] : null
      return { error: firstError ?? 'Téléversement impossible' }
    }
    const media: UploadedMedia = await response.json()
    return { media }
  } catch {
    return { error: 'Téléversement impossible, vérifiez votre connexion' }
  }
}
