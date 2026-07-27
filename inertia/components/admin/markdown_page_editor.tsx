import { type FormEvent, type ReactNode } from 'react'
import { useForm } from '@inertiajs/react'
import { client } from '~/client'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Tabs, TabsContent } from '~/components/ui/tabs'
import AdminPage from '~/components/admin/admin_page'
import LocaleTabsList, { translationStatus, useAdminLocale } from '~/components/admin/locale_tabs'
import MarkdownEditor from '~/components/admin/markdown_editor'

const FALLBACK_HINT = 'Laissée vide, la page affiche un message d’absence de traduction.'

/**
 * Full admin page of a site page whose content is a single markdown
 * blob: the CV and the legal notice. The two locales share one editor
 * behind the language switch, and `children` takes whatever else the
 * page carries, such as the CV PDF.
 */
export default function MarkdownPageEditor({
  scope,
  title,
  description,
  fr,
  en,
  route,
  children,
}: {
  scope: string
  title: string
  description: string
  fr: string
  en: string
  route: Parameters<typeof client.urlFor>[0]
  children?: ReactNode
}) {
  const form = useForm({ fr, en })
  const { locale, setLocale } = useAdminLocale(scope)

  function submit(event: FormEvent) {
    event.preventDefault()
    form.put(client.urlFor(route), { preserveScroll: true })
  }

  return (
    <Tabs value={locale} onValueChange={setLocale} className="contents">
      <AdminPage
        title={title}
        action={<LocaleTabsList status={translationStatus([form.data.en])} />}
      >
        {children}

        <form onSubmit={submit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contenu</CardTitle>
              <CardDescription>
                {description}
                {locale === 'en' ? ` ${FALLBACK_HINT}` : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TabsContent value="fr">
                <MarkdownEditor
                  id={`${scope}-fr`}
                  label="Contenu français"
                  value={form.data.fr}
                  onChange={(value) => form.setData('fr', value)}
                />
              </TabsContent>
              <TabsContent value="en">
                <MarkdownEditor
                  id={`${scope}-en`}
                  label="Contenu anglais"
                  value={form.data.en}
                  onChange={(value) => form.setData('en', value)}
                />
              </TabsContent>
            </CardContent>
          </Card>

          <Button type="submit" disabled={form.processing}>
            Enregistrer
          </Button>
        </form>
      </AdminPage>
    </Tabs>
  )
}
