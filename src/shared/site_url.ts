import env from '#start/env'

/** Absolute URL of a path on the public site. */
export function absoluteUrl(path: string) {
  const base = env.get('APP_URL').replace(/\/$/, '')

  return `${base}${path}`
}
