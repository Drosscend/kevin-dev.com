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
    privacy: string
  }
  meta: SeoMeta
}

export default function Contact({ locale, labels, meta }: ContactProps) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 pb-24 md:pb-32">
      <Seo meta={meta} />
      <div className="max-w-lg">
        <h1 className="text-3xl font-bold md:text-4xl">{labels.title}</h1>
        <p className="text-muted-foreground mt-4">{labels.intro}</p>

        <Form
          route={locale === 'en' ? 'en.contact.store' : 'contact.store'}
          className="mt-12 space-y-7"
          resetOnSuccess
        >
          {({ errors, processing }) => (
            <>
              <div className="space-y-2.5">
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

              <div className="space-y-2.5">
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

              <div className="space-y-2.5">
                <Label htmlFor="message">{labels.message}</Label>
                <textarea
                  name="message"
                  id="message"
                  className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:bg-input/30 min-h-40 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] md:text-sm"
                  aria-invalid={errors.message ? true : undefined}
                />
                {errors.message && <p className="text-destructive text-sm">{errors.message}</p>}
              </div>

              {/* Honeypot: invisible to humans, tempting for bots */}
              <div className="absolute -left-[5000px]" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input type="text" name="website" id="website" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="space-y-5 pt-2">
                <Button
                  type="submit"
                  disabled={processing}
                  className="hover:bg-primary h-auto rounded-lg px-5 py-2.5 transition-opacity hover:opacity-90"
                >
                  {labels.submit}
                </Button>

                <p className="text-muted-foreground text-xs">{labels.privacy}</p>
              </div>
            </>
          )}
        </Form>
      </div>
    </div>
  )
}
