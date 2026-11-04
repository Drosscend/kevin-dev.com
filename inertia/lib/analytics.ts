type AnalyticsEvents = {
  'contact-submit': undefined
  'cv-download': { placement: 'home' | 'cv' }
  'profile-link': { network: 'github' | 'linkedin' | 'labs' }
  'external-link': { type: string; placement: 'project' | 'talk' | 'technology' }
  'content-read': undefined
}

type EventData = Exclude<AnalyticsEvents[keyof AnalyticsEvents], undefined>

declare global {
  interface Window {
    umami?: { track: (name: string, data?: EventData) => void }
  }
}

/**
 * Sends a custom event to Umami. The tracker loads deferred and may be
 * blocked, so a missing `window.umami` simply drops the event.
 */
export function trackEvent<Name extends keyof AnalyticsEvents>(
  name: Name,
  ...[data]: AnalyticsEvents[Name] extends undefined ? [] : [AnalyticsEvents[Name]]
) {
  window.umami?.track(name, data)
}

/**
 * The Umami tracker skips every hit while this key is set, which keeps
 * the admin's own browsing, public pages included, out of the numbers.
 */
export function excludeThisBrowser() {
  localStorage.setItem('umami.disabled', '1')
}
