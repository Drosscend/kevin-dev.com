import { useCallback, useEffect, useRef, useState } from 'react'

type DraftEnvelope = { savedAt: string; data: unknown }

/**
 * Reads a stored draft and keeps it only when it differs from the
 * data the page loaded with (otherwise there is nothing to restore).
 */
function detectDraft(key: string, currentSerialized: string): Date | null {
  if (typeof window === 'undefined') {
    return null
  }
  const raw = window.localStorage.getItem(key)
  if (raw === null) {
    return null
  }
  try {
    const envelope = JSON.parse(raw) as DraftEnvelope
    if (JSON.stringify(envelope.data) === currentSerialized) {
      return null
    }
    return new Date(envelope.savedAt)
  } catch {
    return null
  }
}

/**
 * Persists form data to localStorage (key `draft:{storageKey}`) with
 * a 1s debounce so an accidental navigation never loses work. On
 * mount, detects a leftover draft that differs from the loaded data
 * and lets the caller restore or discard it; autosaving is suspended
 * while that choice is pending so the draft is not overwritten.
 */
export function useDraftAutosave<T>({
  storageKey,
  data,
  restore,
}: {
  storageKey: string
  data: T
  restore: (data: T) => void
}) {
  const key = `draft:${storageKey}`
  const serialized = JSON.stringify(data)

  const [draftSavedAt] = useState(() => detectDraft(key, serialized))
  const [hasDraft, setHasDraft] = useState(draftSavedAt !== null)

  const timerRef = useRef<number | null>(null)
  const restoreRef = useRef(restore)
  useEffect(() => {
    restoreRef.current = restore
  })

  useEffect(() => {
    if (typeof window === 'undefined' || hasDraft) {
      return
    }
    timerRef.current = window.setTimeout(() => {
      const envelope: DraftEnvelope = {
        savedAt: new Date().toISOString(),
        data: JSON.parse(serialized),
      }
      window.localStorage.setItem(key, JSON.stringify(envelope))
    }, 1000)
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
      }
    }
  }, [key, serialized, hasDraft])

  const restoreDraft = useCallback(() => {
    const raw = typeof window === 'undefined' ? null : window.localStorage.getItem(key)
    if (raw !== null) {
      try {
        restoreRef.current((JSON.parse(raw) as DraftEnvelope).data as T)
      } catch {
        window.localStorage.removeItem(key)
      }
    }
    setHasDraft(false)
  }, [key])

  const discardDraft = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key)
    }
    setHasDraft(false)
  }, [key])

  const clearDraft = useCallback(() => {
    if (typeof window === 'undefined') {
      return
    }
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
    }
    window.localStorage.removeItem(key)
  }, [key])

  return { hasDraft, draftSavedAt, restoreDraft, discardDraft, clearDraft }
}
