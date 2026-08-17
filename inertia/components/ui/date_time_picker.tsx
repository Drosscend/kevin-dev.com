import * as React from 'react'
import { CalendarIcon, Clock } from 'lucide-react'

import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Select } from '~/components/ui/select'
import { formatFrDateTime } from '~/lib/dates'

type DateTimePickerProps = {
  id?: string
  value: string | null
  onChange: (value: string | null) => void
}

const HOURS = Array.from({ length: 24 }, (_, index) => pad(index))
const MINUTES = Array.from({ length: 60 }, (_, index) => pad(index))

function pad(value: number) {
  return String(value).padStart(2, '0')
}

function parseValue(value: string | null) {
  if (!value) {
    return null
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

/** Build the "YYYY-MM-DDTHH:mm" string the server expects, in local time. */
function compose(day: Date, hours: string, minutes: string) {
  return `${day.getFullYear()}-${pad(day.getMonth() + 1)}-${pad(day.getDate())}T${hours}:${minutes}`
}

/**
 * Reusable date and time picker: a shadcn calendar for the day plus two
 * 24-hour selects for the time, so the value never depends on the OS
 * regional format (no AM/PM). Value and onChange speak the same
 * "YYYY-MM-DDTHH:mm" string used everywhere else in the admin, which makes
 * it a drop-in replacement for a native datetime-local input.
 */
export function DateTimePicker({ id, value, onChange }: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false)

  const parsed = parseValue(value)

  // Time kept aside only while no day is picked yet; once a value exists it is
  // the single source of truth for the hour and minute shown.
  const [pendingHours, setPendingHours] = React.useState('09')
  const [pendingMinutes, setPendingMinutes] = React.useState('00')
  const hours = parsed ? pad(parsed.getHours()) : pendingHours
  const minutes = parsed ? pad(parsed.getMinutes()) : pendingMinutes

  function selectDay(day: Date | undefined) {
    onChange(day ? compose(day, hours, minutes) : null)
  }

  function changeTime(nextHours: string, nextMinutes: string) {
    if (parsed) {
      onChange(compose(parsed, nextHours, nextMinutes))
    } else {
      setPendingHours(nextHours)
      setPendingMinutes(nextMinutes)
    }
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
            !value && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="size-4 opacity-70" />
          {value ? formatFrDateTime(value) : 'Choisir une date'}
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
        <div className="flex items-center gap-2 border-t p-3">
          <Clock className="text-muted-foreground size-4 shrink-0" />
          <Select
            aria-label="Heures"
            className="h-8 w-auto pr-7 pl-2"
            value={hours}
            onChange={(event) => changeTime(event.target.value, minutes)}
          >
            {HOURS.map((hour) => (
              <option key={hour} value={hour}>
                {hour}
              </option>
            ))}
          </Select>
          <span className="text-muted-foreground">:</span>
          <Select
            aria-label="Minutes"
            className="h-8 w-auto pr-7 pl-2"
            value={minutes}
            onChange={(event) => changeTime(hours, event.target.value)}
          >
            {MINUTES.map((minute) => (
              <option key={minute} value={minute}>
                {minute}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex items-center justify-between gap-2 border-t p-3">
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
          <Button type="button" size="sm" onClick={() => setOpen(false)}>
            Terminé
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
