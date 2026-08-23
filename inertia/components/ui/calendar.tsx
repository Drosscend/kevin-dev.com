import { fr } from 'date-fns/locale'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import * as React from 'react'
import { DayPicker, getDefaultClassNames } from 'react-day-picker'
import { buttonVariants } from '~/components/ui/button'
import { cn } from '~/lib/utils'

/**
 * shadcn calendar wired for react-day-picker v10, forced to the French
 * locale so weekday and month names read "lun."/"juillet". Selection is
 * marked on the day button through aria-selected, which keeps the filled
 * primary look independent of the parent cell.
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaults = getDefaultClassNames()

  return (
    <DayPicker
      locale={fr}
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: cn('relative flex flex-col gap-4 sm:flex-row', defaults.months),
        month: cn('flex flex-col gap-4', defaults.month),
        month_caption: cn('flex h-9 items-center justify-center', defaults.month_caption),
        caption_label: cn('text-sm font-medium', defaults.caption_label),
        nav: cn('absolute inset-x-0 top-0 flex items-center justify-between', defaults.nav),
        button_previous: cn(
          buttonVariants({ variant: 'outline' }),
          'size-7 bg-transparent p-0 opacity-60 hover:opacity-100',
          defaults.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: 'outline' }),
          'size-7 bg-transparent p-0 opacity-60 hover:opacity-100',
          defaults.button_next
        ),
        month_grid: cn('w-full border-collapse', defaults.month_grid),
        weekdays: cn('flex', defaults.weekdays),
        weekday: cn(
          'text-muted-foreground w-8 text-[0.8rem] font-normal capitalize',
          defaults.weekday
        ),
        week: cn('mt-2 flex w-full', defaults.week),
        day: cn('size-8 p-0 text-center text-sm', defaults.day),
        day_button: cn(
          buttonVariants({ variant: 'ghost' }),
          'size-8 rounded-md p-0 font-normal',
          'aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:hover:bg-primary aria-selected:hover:text-primary-foreground',
          defaults.day_button
        ),
        today: cn('[&:not(.rdp-selected)]:text-primary font-semibold', defaults.today),
        outside: cn('text-muted-foreground opacity-60', defaults.outside),
        disabled: cn('text-muted-foreground opacity-50', defaults.disabled),
        hidden: cn('invisible', defaults.hidden),
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClassName, ...chevronProps }) =>
          orientation === 'left' ? (
            <ChevronLeftIcon className={cn('size-4', chevronClassName)} {...chevronProps} />
          ) : (
            <ChevronRightIcon className={cn('size-4', chevronClassName)} {...chevronProps} />
          ),
      }}
      {...props}
    />
  )
}

export { Calendar }
