import { useRouter } from '@adonisjs/inertia/react'
import { MailIcon, MailOpenIcon, Trash2Icon } from 'lucide-react'
import AdminPage from '~/components/admin/admin_page'
import ConfirmButton from '~/components/admin/confirm_button'
import EmptyState from '~/components/admin/empty_state'
import { Button } from '~/components/ui/button'
import { formatFrDateTime } from '~/lib/dates'
import { cn } from '~/lib/utils'
import { type InertiaProps } from '~/types'
import type { Data } from '@generated/data'

type MessagesProps = InertiaProps<{
  messages: Data.Contact.ContactMessage[]
}>

export default function Messages({ messages }: MessagesProps) {
  const router = useRouter()

  function toggleRead(message: Data.Contact.ContactMessage) {
    router.visit(
      { route: 'admin.messages.read', routeParams: { id: message.id } },
      { preserveScroll: true }
    )
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
                      <>
                        <span className="bg-primary mr-2 inline-block size-2 rounded-full" />
                        <span className="sr-only">Non lu : </span>
                      </>
                    )}
                    {message.name}{' '}
                    <a
                      href={`mailto:${message.email}`}
                      className="text-muted-foreground hover:text-primary font-normal transition-colors"
                    >
                      &lt;{message.email}&gt;
                    </a>
                  </p>
                  <p className="text-muted-foreground font-mono text-xs">
                    {formatFrDateTime(message.createdAt)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    title={message.isRead ? 'Marquer non lu' : 'Marquer lu'}
                    aria-label={message.isRead ? 'Marquer non lu' : 'Marquer lu'}
                    onClick={() => toggleRead(message)}
                  >
                    {message.isRead ? (
                      <MailIcon className="size-4" />
                    ) : (
                      <MailOpenIcon className="size-4" />
                    )}
                  </Button>
                  <ConfirmButton
                    description={`Supprimer le message de ${message.name} ? Cette action est définitive.`}
                    onConfirm={() =>
                      router.visit(
                        { route: 'admin.messages.destroy', routeParams: { id: message.id } },
                        { preserveScroll: true }
                      )
                    }
                    trigger={
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        aria-label={`Supprimer le message de ${message.name}`}
                      >
                        <Trash2Icon className="size-4" />
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
