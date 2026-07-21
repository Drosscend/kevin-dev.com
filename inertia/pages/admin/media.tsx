import { Form } from '@adonisjs/inertia/react'
import { router } from '@inertiajs/react'
import { Trash2 } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

type MediaItem = {
  id: number
  alt: string
  originalName: string
  width: number
  height: number
  size: number
  url: string
  thumbnailUrl: string
  createdAt: string | null
}

type MediaPageProps = {
  media: MediaItem[]
}

function formatSize(bytes: number) {
  return bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)} Ko`
    : `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

export default function MediaPage({ media }: MediaPageProps) {
  function deleteMedia(item: MediaItem) {
    if (confirm(`Supprimer « ${item.alt} » ? Cette action est définitive.`)) {
      router.delete(`/admin/media/${item.id}`)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Bibliothèque média</h1>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Ajouter une image</CardTitle>
          <CardDescription>
            Réencodée en webp avec variantes responsive. Le texte alternatif est obligatoire.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form route="admin.media.store" className="space-y-4">
            {({ errors, processing }) => (
              <>
                <div className="space-y-2">
                  <Label htmlFor="file">Image</Label>
                  <Input type="file" name="file" id="file" accept="image/*" />
                  {errors.file && <p className="text-destructive text-sm">{errors.file}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alt">Texte alternatif</Label>
                  <Input
                    type="text"
                    name="alt"
                    id="alt"
                    placeholder="Description de l'image"
                    aria-invalid={errors.alt ? true : undefined}
                  />
                  {errors.alt && <p className="text-destructive text-sm">{errors.alt}</p>}
                </div>

                <Button type="submit" disabled={processing}>
                  Uploader
                </Button>
              </>
            )}
          </Form>
        </CardContent>
      </Card>

      {media.length === 0 ? (
        <p className="text-muted-foreground text-sm">Aucune image pour l’instant.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {media.map((item) => (
            <Card key={item.id} className="overflow-hidden pt-0">
              <a href={item.url} target="_blank" rel="noreferrer">
                <img
                  src={item.thumbnailUrl}
                  alt={item.alt}
                  className="aspect-video w-full object-cover"
                  loading="lazy"
                />
              </a>
              <CardContent className="space-y-1">
                <p className="truncate text-sm font-medium" title={item.alt}>
                  {item.alt}
                </p>
                <p className="text-muted-foreground truncate text-xs" title={item.originalName}>
                  {item.originalName} — {item.width}×{item.height} — {formatSize(item.size)}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive gap-1 px-2"
                  onClick={() => deleteMedia(item)}
                >
                  <Trash2 className="size-4" />
                  Supprimer
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
