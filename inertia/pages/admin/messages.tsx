import { router } from '@inertiajs/react'
import { Mail, MailOpen, Trash2 } from 'lucide-react'
import { Button } from '~/components/ui/button'
import AdminPage from '~/components/admin/admin_page'
import ConfirmButton from '~/components/admin/confirm_button'
import EmptyState from '~/components/admin/empty_state'
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

  return (
    <AdminPage title="Messages" className="max-w-3xl">
      {messages.length === 0 ? (
        <EmptyState>Aucun message pour l’instant.</EmptyState>
      ) : (
        <ul className="divide-y border-y">
          {messages.map((message) => (
            <li
              key={message.id}
              className={cn(
                'space-y-2 py-4',
                !message.isRead && 'bg-accent/40 -mx-3 rounded-md px-3'
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">
                    {!message.isRead && (
                      <span className="bg-primary mr-2 inline-block size-2 rounded-full" />
                    )}
                    {message.name}{' '}
                    <a
                      href={`mailto:${message.email}`}
                      className="text-muted-foreground hover:text-primary font-normal transition-colors"
                    >
                      &lt;{message.email}&gt;
                    </a>
                  </p>
                  <p className="text-muted-foreground font-mono text-xs">{message.createdAt}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    title={message.isRead ? 'Marquer non lu' : 'Marquer lu'}
                    onClick={() => toggleRead(message)}
                  >
                    {message.isRead ? <Mail className="size-4" /> : <MailOpen className="size-4" />}
                  </Button>
                  <ConfirmButton
                    description={`Supprimer le message de ${message.name} ? Cette action est définitive.`}
                    onConfirm={() =>
                      router.delete(`/admin/messages/${message.id}`, { preserveScroll: true })
                    }
                    trigger={
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        aria-label={`Supprimer le message de ${message.name}`}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    }
                  />
                </div>
              </div>
              <p className="text-sm whitespace-pre-wrap">{message.body}</p>
            </li>
          ))}
        </ul>
      )}
    </AdminPage>
  )
}
