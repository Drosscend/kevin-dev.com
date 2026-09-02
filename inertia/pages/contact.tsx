import { Form } from '@adonisjs/inertia/react'
import FieldError, { fieldAria } from '~/components/field_error'
import ReadingLayout from '~/components/reading_layout'
import Seo, { type SeoMeta } from '~/components/seo'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { type InertiaProps } from '~/types'

type ContactProps = InertiaProps<{
  meta: SeoMeta
}>

export default function Contact({ locale, messages, meta }: ContactProps) {
  return (
    <>
      <Seo meta={meta} />
      <ReadingLayout>
        <h1 className="text-3xl font-bold md:text-4xl">{messages.contact.title}</h1>
        <p className="text-muted-foreground mt-4">{messages.contact.intro}</p>

        <Form
          route={locale === 'en' ? 'en.contact.store' : 'contact.store'}
          className="mt-12 space-y-7"
          resetOnSuccess
        >
          {({ errors, processing }) => (
            <>
              <div className="space-y-2.5">
                <Label htmlFor="name">{messages.contact.name}</Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="name"
                  {...fieldAria(errors, 'name')}
                />
                <FieldError errors={errors} field="name" />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="email">{messages.contact.email}</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  {...fieldAria(errors, 'email')}
                />
                <FieldError errors={errors} field="email" />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="message">{messages.contact.message}</Label>
                <Textarea
                  name="message"
                  id="message"
                  className="min-h-40"
                  {...fieldAria(errors, 'message')}
                />
                <FieldError errors={errors} field="message" />
              </div>

              {/* Honeypot: invisible to humans, tempting for bots */}
              <div className="absolute -left-[5000px]" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input type="text" name="website" id="website" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="space-y-5 pt-2">
                <Button type="submit" size="lg" disabled={processing}>
                  {messages.contact.submit}
                </Button>

                <p className="text-muted-foreground text-xs">{messages.contact.privacy}</p>
              </div>
            </>
          )}
        </Form>
      </ReadingLayout>
    </>
  )
}
