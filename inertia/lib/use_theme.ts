import { useSyncExternalStore } from 'react'

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  return () => observer.disconnect()
}

function readTheme(): 'light' | 'dark' {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

/**
 * The theme currently applied to the document, for components that
 * cannot follow the `dark` class through CSS alone. The server always
 * sees light: the class is set before paint by the root layout script.
 */
export function useTheme() {
  return useSyncExternalStore(subscribe, readTheme, () => 'light' as const)
}
