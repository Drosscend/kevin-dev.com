import { useState } from 'react'
import { Check, ImageIcon, Search } from 'lucide-react'
import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'

export type MediaPickerItem = {
  id: number
  alt: string
  originalName: string
  thumbnailUrl: string
}

type MediaPickerProps = {
  media: MediaPickerItem[]
  value: number | null
  onChange: (id: number | null) => void
  id?: string
}

function Thumbnail({
  item,
  className,
  fit = 'cover',
}: {
  item: MediaPickerItem
  className?: string
  fit?: 'cover' | 'contain'
}) {
  return (
    <img
      src={item.thumbnailUrl}
      alt={item.alt}
      className={cn(fit === 'contain' ? 'bg-muted object-contain' : 'object-cover', className)}
      loading="lazy"
    />
  )
}

/**
 * Searchable image gallery for cover fields: opens a modal grid of
 * thumbnails, filters the already-loaded list by label or original
 * filename, and previews the current pick inline. Shared by every
 * content form so the selector stays identical everywhere.
 */
export function MediaPicker({ media, value, onChange, id }: MediaPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const selected = value === null ? null : (media.find((item) => item.id === value) ?? null)

  const needle = search.trim().toLowerCase()
  const results =
    needle === ''
      ? media
      : media.filter(
          (item) =>
            item.alt.toLowerCase().includes(needle) ||
            item.originalName.toLowerCase().includes(needle)
        )

  function openPicker() {
    setSearch('')
    setOpen(true)
  }

  function pick(mediaId: number) {
    onChange(mediaId)
    setOpen(false)
  }

  return (
    <div className="space-y-2">
      {selected ? (
        <div className="flex items-center gap-3 rounded-md border p-2">
          <Thumbnail item={selected} className="size-14 shrink-0 rounded" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium" title={selected.alt}>
              {selected.alt}
            </p>
            <p className="text-muted-foreground truncate text-xs" title={selected.originalName}>
              {selected.originalName}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button type="button" variant="outline" size="sm" onClick={openPicker}>
              Changer
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={() => onChange(null)}
            >
              Retirer
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          id={id}
          variant="outline"
          className="text-muted-foreground h-auto w-full justify-start gap-2 border-dashed py-3"
          onClick={openPicker}
        >
          <ImageIcon className="size-4" />
          Choisir une image
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Bibliothèque : images</DialogTitle>
            <DialogDescription>
              Cliquez sur un élément pour le sélectionner. Recherche par libellé ou nom de fichier.
            </DialogDescription>
          </DialogHeader>

          <div className="relative">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              autoFocus
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher une image…"
              className="pl-9"
            />
          </div>

          {results.length === 0 ? (
            <p className="text-muted-foreground py-10 text-center text-sm">
              Aucune image ne correspond.
            </p>
          ) : (
            <div className="max-h-[55vh] overflow-y-auto p-1">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {results.map((item) => {
                  const isActive = item.id === value
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => pick(item.id)}
                      className={cn(
                        'group focus-visible:ring-ring relative overflow-hidden rounded-md border text-left transition focus-visible:ring-2 focus-visible:outline-none',
                        isActive ? 'border-primary ring-primary ring-2' : 'hover:border-primary/50'
                      )}
                    >
                      <Thumbnail item={item} fit="contain" className="aspect-video w-full" />
                      {isActive && (
                        <span className="bg-primary text-primary-foreground absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full">
                          <Check className="size-3.5" />
                        </span>
                      )}
                      <span className="block truncate px-2 py-1.5 text-xs" title={item.alt}>
                        {item.alt}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
