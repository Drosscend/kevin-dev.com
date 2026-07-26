import { Moon, Sun } from 'lucide-react'
import { Button } from '~/components/ui/button'

/**
 * Light/dark theme toggle. The initial theme is applied before
 * paint by an inline script in the root Edge layout (system
 * preference, overridden by the stored choice). Icons are switched
 * with CSS classes, so server and client render the same markup.
 */
export default function ThemeToggle({ label }: { label: string }) {
  function toggle() {
    const isDark = document.documentElement.classList.toggle('dark')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={toggle}
      title={label}
      aria-label={label}
    >
      <Sun className="size-4 dark:hidden" />
      <Moon className="hidden size-4 dark:block" />
    </Button>
  )
}
