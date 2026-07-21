import { Form } from '@adonisjs/inertia/react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import Seo, { type SeoMeta } from '~/components/seo'

type ContactProps = {
  locale: 'fr' | 'en'
  labels: {
    title: string
    intro: string
    name: string
    email: string
    message: string
    submit: string
  }
  meta: SeoMeta
}

export default function Contact({ locale, labels, meta }: ContactProps) {
  return (
    <div className="mx-auto max-w-xl space-y-8 px-6 py-10">
      <Seo meta={meta} />
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{labels.title}</h1>
        <p className="text-muted-foreground">{labels.intro}</p>
      </div>

      <Form
        route={locale === 'en' ? 'en.contact.store' : 'contact.store'}
        className="space-y-4"
        resetOnSuccess
      >
        {({ errors, processing }) => (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">{labels.name}</Label>
              <Input
                type="text"
                name="name"
                id="name"
                autoComplete="name"
                aria-invalid={errors.name ? true : undefined}
              />
              {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{labels.email}</Label>
              <Input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                aria-invalid={errors.email ? true : undefined}
              />
              {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">{labels.message}</Label>
              <textarea
                name="message"
                id="message"
                className="border-input min-h-40 w-full rounded-md border bg-transparent px-3 py-2 text-sm"
                aria-invalid={errors.message ? true : undefined}
              />
              {errors.message && <p className="text-destructive text-sm">{errors.message}</p>}
            </div>

            {/* Honeypot: invisible to humans, tempting for bots */}
            <div className="absolute -left-[5000px]" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input type="text" name="website" id="website" tabIndex={-1} autoComplete="off" />
            </div>

            <Button type="submit" disabled={processing}>
              {labels.submit}
            </Button>
          </>
        )}
      </Form>
    </div>
  )
}
