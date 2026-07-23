import {
  CalendarDays,
  CodeXml,
  ExternalLink,
  FileText,
  GitBranch,
  MonitorPlay,
  Package,
  Presentation,
  Store,
  Video,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '~/lib/utils'

export type ExternalLinkRef = { label: string; url: string; type: string }

/** Icon per link type, covering both project and talk link types. */
const ICONS: Record<string, LucideIcon> = {
  github: GitBranch,
  demo: MonitorPlay,
  release: Package,
  store: Store,
  paper: FileText,
  slides: Presentation,
  video: Video,
  event: CalendarDays,
  code: CodeXml,
}

const VARIANTS = {
  prominent: 'text-primary font-medium hover:underline',
  subtle: 'text-muted-foreground hover:text-primary transition-colors',
}

/**
 * Row of outgoing links, each icon telling the kind of destination. Types
 * without an icon of their own fall back to the generic external link one.
 * The "subtle" variant steps back behind the title of a listing row.
 */
export default function ExternalLinkList({
  links,
  variant = 'prominent',
  className,
}: {
  links: ExternalLinkRef[]
  variant?: keyof typeof VARIANTS
  className?: string
}) {
  if (links.length === 0) {
    return null
  }

  return (
    <p className={cn('flex flex-wrap items-center gap-x-5 gap-y-2 text-sm', className)}>
      {links.map((link) => {
        const Icon = ICONS[link.type] ?? ExternalLink

        return (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className={cn('inline-flex items-center gap-1.5', VARIANTS[variant])}
          >
            <Icon className="size-3.5 shrink-0" />
            {link.label}
          </a>
        )
      })}
    </p>
  )
}
