import env from '#start/env'
import logger from '@adonisjs/core/services/logger'

export interface UmamiStats {
  pageviews: number
  visitors: number
  topPages: { path: string; views: number }[]
}

interface UmamiConfig {
  apiUrl: string
  username: string
  password: string
  websiteId: string
}

const TOKEN_TTL_MS = 50 * 60 * 1000
const FETCH_TIMEOUT_MS = 4000
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000

/**
 * Reads visit statistics from a self-hosted Umami instance for the
 * admin dashboard. Fully optional: without the UMAMI_API_* env vars
 * (or on any API failure) it returns null and the dashboard hides
 * the stats card.
 */
export default class UmamiService {
  /**
   * Access token reused across dashboard loads, refreshed shortly
   * before the hour-long Umami token expires.
   */
  static #cachedToken: { value: string; expiresAt: number } | null = null

  static #config(): UmamiConfig | null {
    const apiUrl = env.get('UMAMI_API_URL')
    const username = env.get('UMAMI_API_USERNAME')
    const password = env.get('UMAMI_API_PASSWORD')
    const websiteId = env.get('UMAMI_WEBSITE_ID')

    if (!apiUrl || !username || !password || !websiteId) {
      return null
    }
    return { apiUrl: apiUrl.replace(/\/$/, ''), username, password, websiteId }
  }

  static async #login({ apiUrl, username, password }: UmamiConfig) {
    if (this.#cachedToken && this.#cachedToken.expiresAt > Date.now()) {
      return this.#cachedToken.value
    }

    const response = await fetch(`${apiUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username, password }),
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })
    if (!response.ok) {
      throw new Error(`Umami login failed (${response.status})`)
    }

    const { token } = (await response.json()) as { token: string }
    this.#cachedToken = { value: token, expiresAt: Date.now() + TOKEN_TTL_MS }
    return token
  }

  static async statsLast30Days(): Promise<UmamiStats | null> {
    const config = this.#config()
    if (!config) {
      return null
    }

    try {
      const token = await this.#login(config)
      const endAt = Date.now()
      const range = `startAt=${endAt - THIRTY_DAYS_MS}&endAt=${endAt}`
      const headers = { authorization: `Bearer ${token}` }
      const websiteBase = `${config.apiUrl}/api/websites/${config.websiteId}`

      const [statsResponse, pagesResponse] = await Promise.all([
        fetch(`${websiteBase}/stats?${range}`, {
          headers,
          signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        }),
        fetch(`${websiteBase}/metrics?type=path&limit=5&${range}`, {
          headers,
          signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        }),
      ])
      if (!statsResponse.ok || !pagesResponse.ok) {
        // A stale token gets a retry on the next dashboard load
        this.#cachedToken = null
        throw new Error(`Umami API error (${statsResponse.status}/${pagesResponse.status})`)
      }

      const stats = (await statsResponse.json()) as {
        pageviews: number
        visitors: number
      }
      const pages = (await pagesResponse.json()) as { x: string; y: number }[]

      return {
        pageviews: stats.pageviews,
        visitors: stats.visitors,
        topPages: pages.map((page) => ({ path: page.x, views: page.y })),
      }
    } catch (error) {
      logger.warn({ err: error }, 'Umami stats unavailable')
      return null
    }
  }
}
