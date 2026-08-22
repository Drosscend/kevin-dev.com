import { useForm, usePage } from '@inertiajs/react'
import { type FormEvent } from 'react'
import { client } from '~/client'
import AdminPage from '~/components/admin/admin_page'
import LocaleTabsList, { translationStatus, useAdminLocale } from '~/components/admin/locale_tabs'
import FieldError from '~/components/field_error'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Tabs, TabsContent } from '~/components/ui/tabs'
import { Textarea } from '~/components/ui/textarea'
import { type InertiaProps } from '~/types'
import type { Locale } from '#types/i18n'
import type { Data } from '@generated/data'

type HomeAdminProps = InertiaProps<{
  settings: Data.Pages.HomeSettings
}>

function SettingsTextarea({
  field,
  label,
  value,
  onChange,
}: {
  field: keyof Data.Pages.HomeSettings
  label: string
  value: string
  onChange: (value: string) => void
}) {
  const { errors } = usePage().props

  return (
    <div className="space-y-2">
      <Label htmlFor={field}>{label}</Label>
      <Textarea
        id={field}
        rows={2}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <FieldError errors={errors} field={field} />
    </div>
  )
}

/**
 * The translated blocks of the homepage for one locale. Both tabs get
 * the same fields; the location stays out, it is shared.
 */
function HomeContents({
  locale,
  settings,
  onChange,
}: {
  locale: Locale
  settings: Data.Pages.HomeSettings
  onChange: (field: keyof Data.Pages.HomeSettings, value: string) => void
}) {
  const rolesField = locale === 'fr' ? 'heroRolesFr' : 'heroRolesEn'
  const nowField = locale === 'fr' ? 'nowFr' : 'nowEn'
  const fallbackHint =
    locale === 'en' ? ' Laissé vide, le bloc français est servi aux deux langues.' : ''

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Hero</CardTitle>
          <CardDescription>
            Les métiers s’affichent sous ton nom, un par ligne. Laisser vide pour masquer la ligne.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsTextarea
            field={rolesField}
            label="Métiers (un par ligne)"
            value={settings[rolesField]}
            onChange={(value) => onChange(rolesField, value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>En ce moment</CardTitle>
          <CardDescription>
            Texte brut affiché dans le bloc « En ce moment ». Laisser vide pour masquer la section.
            {fallbackHint}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsTextarea
            field={nowField}
            label="En ce moment"
            value={settings[nowField]}
            onChange={(value) => onChange(nowField, value)}
          />
        </CardContent>
      </Card>
    </>
  )
}

export default function HomeAdmin({ settings }: HomeAdminProps) {
  const { errors } = usePage().props
  const form = useForm(settings)
  const { locale, setLocale, focusErrors } = useAdminLocale('home')

  const englishValues = [form.data.heroRolesEn, form.data.nowEn]

  function submit(event: FormEvent) {
    event.preventDefault()
    form.put(client.urlFor('admin.home.update'), { preserveScroll: true, onError: focusErrors })
  }

  return (
    <Tabs value={locale} onValueChange={setLocale} className="contents">
      <AdminPage
        title="Accueil"
        action={<LocaleTabsList status={translationStatus(englishValues)} />}
      >
        <form onSubmit={submit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Général</CardTitle>
              <CardDescription>Affiché tel quel dans les deux langues.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-sm space-y-2">
                <Label htmlFor="heroLocation">Localisation</Label>
                <Input
                  id="heroLocation"
                  value={form.data.heroLocation}
                  onChange={(event) => form.setData('heroLocation', event.target.value)}
                />
                <FieldError errors={errors} field="heroLocation" />
              </div>
            </CardContent>
          </Card>

          <TabsContent value="fr" className="space-y-6">
            <HomeContents
              locale="fr"
              settings={form.data}
              onChange={(field, value) => form.setData(field, value)}
            />
          </TabsContent>
          <TabsContent value="en" className="space-y-6">
            <HomeContents
              locale="en"
              settings={form.data}
              onChange={(field, value) => form.setData(field, value)}
            />
          </TabsContent>

          <Button type="submit" disabled={form.processing}>
            Enregistrer
          </Button>
        </form>
      </AdminPage>
    </Tabs>
  )
}
