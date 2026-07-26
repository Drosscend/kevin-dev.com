import { useEffect } from 'react'
import { usePage } from '@inertiajs/react'
import { toast } from 'sonner'

type Flash = { error?: string; success?: string }

/**
 * Shows the flash messages of the current response as toasts, and
 * clears the previous ones on navigation.
 *
 * The dependency on the flash object matters: without it the effect
 * runs after every render, so any unrelated state change in the
 * layout (opening the mobile menu, for instance) would replay the
 * message the visitor already dismissed.
 */
export function useFlashToasts(flash: Flash) {
  const { url } = usePage()

  useEffect(() => {
    toast.dismiss()
  }, [url])

  useEffect(() => {
    if (flash.error) {
      toast.error(flash.error)
    }
    if (flash.success) {
      toast.success(flash.success)
    }
  }, [flash])
}
