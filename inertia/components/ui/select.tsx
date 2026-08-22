import { ChevronDown } from 'lucide-react'
import * as React from 'react'
import { cn } from '~/lib/utils'

/**
 * Native select styled like the Input field. Deliberately not the
 * Radix listbox: the browser picker stays available on touch devices
 * and the value is submitted by plain form posts without extra state.
 *
 * The browser paints its own arrow flush against the border and
 * ignores the padding, so the control drops it and draws the chevron
 * itself, on the gutter the other fields use.
 */
function Select({ className, ...props }: React.ComponentProps<'select'>) {
  return (
    <div className="relative">
      <select
        data-slot="select"
        className={cn(
          'h-9 w-full appearance-none rounded-md border border-input bg-transparent py-1 pr-9 pl-3 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30',
          'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
          'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
          className
        )}
        {...props}
      />
      <ChevronDown
        aria-hidden
        className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2"
      />
    </div>
  )
}

export { Select }
