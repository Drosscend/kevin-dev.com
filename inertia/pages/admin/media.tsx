import { Form, useRouter } from '@adonisjs/inertia/react'
import { Copy, FileText, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import FieldError from '~/components/field_error'
import AdminPage from '~/components/admin/admin_page'
import ConfirmButton from '~/components/admin/confirm_button'
import EmptyState from '~/components/admin/empty_state'

type MediaItem = {
  id: number
  alt: string
  originalName: string
  isDocument: boolean
  width: number | null
  height: number | null
  size: number
  url: string
  absoluteUrl: string
  thumbnailUrl: string | null
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

function describe(item: MediaItem) {
  const details = item.isDocument ? 'PDF' : `${item.width}×${item.height}`
  return `${item.originalName} · ${details} · ${formatSize(item.size)}`
}

export default function MediaPage({ media }: MediaPageProps) {
  const router = useRouter()

  async function copyUrl(item: MediaItem) {
    await navigator.clipboard.writeText(item.absoluteUrl)
    toast.success('Lien copié')
  }

  return (
    <AdminPage title="Bibliothèque média" className="max-w-6xl">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Ajouter un fichier</CardTitle>
          <CardDescription>
            Les images sont réencodées en webp avec variantes responsive (10 Mo maximum), les PDF
            sont stockés tels quels (50 Mo maximum). Le libellé est obligatoire.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form route="admin.media.store" className="space-y-4">
            {({ errors, processing }) => (
              <>
                <div className="space-y-2">
                  <Label htmlFor="file">Image ou PDF</Label>
                  <Input type="file" name="file" id="file" accept="image/*,application/pdf" />
                  <FieldError errors={errors} field="file" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alt">Libellé (texte alternatif)</Label>
                  <Input
                    type="text"
                    name="alt"
                    id="alt"
                    placeholder="Description de l'image ou titre du document"
                    aria-invalid={errors.alt ? true : undefined}
                  />
                  <FieldError errors={errors} field="alt" />
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
        <EmptyState>Aucun fichier pour l’instant.</EmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {media.map((item) => (
            <Card key={item.id} className="overflow-hidden pt-0">
              <a href={item.url} target="_blank" rel="noreferrer">
                {item.thumbnailUrl ? (
                  <img
                    src={item.thumbnailUrl}
                    alt={item.alt}
                    className="aspect-video w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span className="bg-muted text-muted-foreground flex aspect-video w-full items-center justify-center">
                    <FileText className="size-10" />
                  </span>
                )}
              </a>
              <CardContent className="space-y-1">
                <p className="truncate text-sm font-medium" title={item.alt}>
                  {item.alt}
                </p>
                <p className="text-muted-foreground truncate text-xs" title={item.originalName}>
                  {describe(item)}
                </p>
                <div className="flex flex-wrap items-center">
                  {item.isDocument && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="gap-1 px-2"
                      onClick={() => copyUrl(item)}
                    >
                      <Copy className="size-4" />
                      Copier le lien
                    </Button>
                  )}
                  <ConfirmButton
                    description={`Supprimer « ${item.alt} » ? Cette action est définitive.`}
                    onConfirm={() =>
                      router.visit({ route: 'admin.media.destroy', routeParams: { id: item.id } })
                    }
                    trigger={
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive gap-1 px-2"
                      >
                        <Trash2 className="size-4" />
                        Supprimer
                      </Button>
                    }
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminPage>
  )
}
