import { useId } from 'react'
import { ChipButton, ChipList } from '~/components/chip'
import { Label } from '~/components/ui/label'
import { Switch } from '~/components/ui/switch'

type ToggleOption = { id: number; label: string }

/**
 * Wrapping row of chips used wherever an entry picks several others:
 * technologies of an article, articles of a project. Same control as
 * the public category filters, so a selection reads as the accent
 * rather than as a browser checkbox.
 */
export default function ToggleList({
  options,
  selected,
  onToggle,
  empty,
}: {
  options: ToggleOption[]
  selected: number[]
  onToggle: (id: number) => void
  empty: string
}) {
  if (options.length === 0) {
    return <p className="text-muted-foreground text-sm">{empty}</p>
  }

  return (
    <ChipList>
      {options.map((option) => (
        <ChipButton
          key={option.id}
          active={selected.includes(option.id)}
          onClick={() => onToggle(option.id)}
        >
          {option.label}
        </ChipButton>
      ))}
    </ChipList>
  )
}

/** Standalone on/off setting, with its name to the right. */
export function SwitchField({
  label,
  checked,
  onCheckedChange,
}: {
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  const id = useId()

  return (
    <div className="flex items-center gap-2.5">
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
      <Label htmlFor={id} className="cursor-pointer text-sm font-normal">
        {label}
      </Label>
    </div>
  )
}
