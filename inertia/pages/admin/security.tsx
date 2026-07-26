import { Form } from '@adonisjs/inertia/react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import FieldError from '~/components/field_error'
import AdminPage from '~/components/admin/admin_page'

interface SecurityProps {
  totpEnabled: boolean
  qrCode: string | null
  secret: string | null
  recoveryCodes: string[] | null
  recoveryCodesRemaining: number
}

export default function Security({
  totpEnabled,
  qrCode,
  secret,
  recoveryCodes,
  recoveryCodesRemaining,
}: SecurityProps) {
  return (
    <AdminPage title="Sécurité" className="max-w-xl">
      {recoveryCodes && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Vos codes de secours</CardTitle>
            <CardDescription>
              Notez-les maintenant : ils ne seront plus jamais affichés. Chaque code permet une
              connexion unique si vous perdez l’accès à votre application TOTP.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-2 gap-2 font-mono text-sm">
              {recoveryCodes.map((code) => (
                <li key={code}>{code}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {totpEnabled ? (
        <Card>
          <CardHeader>
            <CardTitle>Double authentification active</CardTitle>
            <CardDescription>
              Un code TOTP est demandé à chaque connexion. La désactiver exige un code valide et
              supprime le secret : il faudra re-scanner un QR code pour la réactiver.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form route="admin.security.destroy" className="space-y-4">
              {({ errors, processing }) => (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="disable-code">Code TOTP actuel</Label>
                    <Input
                      type="text"
                      name="code"
                      id="disable-code"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      aria-invalid={errors.code ? true : undefined}
                    />
                    <FieldError errors={errors} field="code" />
                  </div>
                  <Button type="submit" variant="destructive" disabled={processing}>
                    Désactiver la 2FA
                  </Button>
                </>
              )}
            </Form>
          </CardContent>
        </Card>
      ) : null}

      {totpEnabled ? (
        <Card>
          <CardHeader>
            <CardTitle>Codes de secours</CardTitle>
            <CardDescription>
              {recoveryCodesRemaining} code(s) restant(s). En régénérer un nouveau jeu invalide tous
              les codes précédents.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form route="admin.security.recovery.store" className="space-y-4">
              {({ errors, processing }) => (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="recovery-code">Code TOTP actuel</Label>
                    <Input
                      type="text"
                      name="code"
                      id="recovery-code"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      aria-invalid={errors.recoveryCode ? true : undefined}
                    />
                    <FieldError errors={errors} field="recoveryCode" />
                  </div>
                  <Button type="submit" variant="outline" disabled={processing}>
                    Régénérer les codes de secours
                  </Button>
                </>
              )}
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Activer la double authentification</CardTitle>
            <CardDescription>
              Scannez ce QR code avec votre application (Google Authenticator, Aegis, 2FAS…) puis
              confirmez avec le code à 6 chiffres.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {qrCode && (
              <img src={qrCode} alt="QR code d'enrôlement TOTP" width={200} height={200} />
            )}
            {secret && (
              <p className="text-muted-foreground text-sm">
                Saisie manuelle : <code className="font-mono">{secret}</code>
              </p>
            )}

            <Form route="admin.security.store" className="space-y-4">
              {({ errors, processing }) => (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="code">Code de confirmation</Label>
                    <Input
                      type="text"
                      name="code"
                      id="code"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      aria-invalid={errors.code ? true : undefined}
                    />
                    <FieldError errors={errors} field="code" />
                  </div>

                  <Button type="submit" disabled={processing}>
                    Activer la 2FA
                  </Button>
                </>
              )}
            </Form>
          </CardContent>
        </Card>
      )}
    </AdminPage>
  )
}
