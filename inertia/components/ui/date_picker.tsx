import * as React from 'react'
import { CalendarIcon } from 'lucide-react'

import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { formatFrDate } from '~/lib/dates'

type DatePickerProps = {
  id?: string
  value: string | null
  onChange: (value: string | null) => void
  placeholder?: string
  clearable?: boolean
  className?: string
}

function pad(value: number) {
  return String(value).padStart(2, '0')
}

/** Read a "YYYY-MM-DD" string as a local date, avoiding UTC off-by-one. */
function parse(value: string | null) {
  if (!value) return null
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
  if (!match) return null
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
}

/**
 * Reusable date-only picker: the shadcn calendar with no time controls.
 * Value and onChange speak "YYYY-MM-DD", matching the DATE_PATTERN the
 * server validates, so it drops in for a native date input.
 */
export function DatePicker({
  id,
  value,
  onChange,
  placeholder = 'Choisir une date',
  clearable = true,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const parsed = parse(value)

  function selectDay(day: Date | undefined) {
    if (!day) {
      onChange(null)
      return
    }
    onChange(`${day.getFullYear()}-${pad(day.getMonth() + 1)}-${pad(day.getDate())}`)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          id={id}
          className={cn(
            'w-full justify-start px-3 text-left font-normal',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="size-4 opacity-70" />
          {value ? formatFrDate(value) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          autoFocus
          selected={parsed ?? undefined}
          defaultMonth={parsed ?? undefined}
          onSelect={selectDay}
        />
        {clearable && (
          <div className="flex justify-end border-t p-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => {
                onChange(null)
                setOpen(false)
              }}
            >
              Effacer
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
