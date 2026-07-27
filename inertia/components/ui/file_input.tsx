import { useRef, useState, type ComponentProps } from 'react'
import { cn } from '~/lib/utils'

/**
 * File picker whose button carries the interface language. The native
 * control cannot be relabelled ("Choose File" follows the browser
 * locale, not the page), so it is hidden behind a real button while
 * staying a plain form field: label association, keyboard focus and
 * form submission are unchanged.
 */
export function FileInput({
  className,
  onChange,
  ...props
}: Omit<ComponentProps<'input'>, 'type'> & { className?: string }) {
  const input = useRef<HTMLInputElement>(null)
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <input
        ref={input}
        type="file"
        className="peer sr-only"
        onChange={(event) => {
          setSelected(event.target.files?.[0]?.name ?? null)
          onChange?.(event)
        }}
        {...props}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => input.current?.click()}
        className={cn(
          'h-9 shrink-0 rounded-md border border-input bg-transparent px-3 text-sm font-medium shadow-xs transition-[color,box-shadow]',
          'hover:bg-accent hover:text-accent-foreground dark:bg-input/30',
          'peer-focus-visible:border-ring peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50'
        )}
      >
        Choisir un fichier
      </button>
      <span className="text-muted-foreground min-w-0 truncate text-sm">
        {selected ?? 'Aucun fichier sélectionné'}
      </span>
    </div>
  )
}
