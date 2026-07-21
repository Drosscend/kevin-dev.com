import { router } from '@inertiajs/react'
import { Mail, MailOpen, Trash2 } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { cn } from '~/lib/utils'

type Message = {
  id: number
  name: string
  email: string
  body: string
  isRead: boolean
  createdAt: string
}

type MessagesProps = {
  messages: Message[]
}

export default function Messages({ messages }: MessagesProps) {
  function toggleRead(message: Message) {
    router.put(`/admin/messages/${message.id}/read`, {}, { preserveScroll: true })
  }

  function remove(message: Message) {
    if (confirm(`Supprimer le message de ${message.name} ? Cette action est définitive.`)) {
      router.delete(`/admin/messages/${message.id}`, { preserveScroll: true })
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Messages</h1>

      {messages.length === 0 ? (
        <p className="text-muted-foreground text-sm">Aucun message pour l’instant.</p>
      ) : (
        <div className="space-y-2">
          {messages.map((message) => (
            <Card key={message.id} className={cn(!message.isRead && 'border-primary/50')}>
              <CardContent className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">
                      {!message.isRead && (
                        <span className="bg-primary mr-2 inline-block size-2 rounded-full" />
                      )}
                      {message.name}{' '}
                      <a
                        href={`mailto:${message.email}`}
                        className="text-muted-foreground font-normal hover:underline"
                      >
                        &lt;{message.email}&gt;
                      </a>
                    </p>
                    <p className="text-muted-foreground text-xs">{message.createdAt}</p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      title={message.isRead ? 'Marquer non lu' : 'Marquer lu'}
                      onClick={() => toggleRead(message)}
                    >
                      {message.isRead ? (
                        <Mail className="size-4" />
                      ) : (
                        <MailOpen className="size-4" />
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => remove(message)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
