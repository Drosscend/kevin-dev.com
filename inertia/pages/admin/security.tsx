import { Form } from '@adonisjs/inertia/react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

interface SecurityProps {
  totpEnabled: boolean
  qrCode: string | null
  secret: string | null
}

export default function Security({ totpEnabled, qrCode, secret }: SecurityProps) {
  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Sécurité</h1>

      {totpEnabled ? (
        <Card>
          <CardHeader>
            <CardTitle>Double authentification active</CardTitle>
            <CardDescription>
              Un code TOTP est demandé à chaque connexion. La désactiver supprime le secret : il
              faudra re-scanner un QR code pour la réactiver.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form route="admin.security.destroy">
              {({ processing }) => (
                <Button type="submit" variant="destructive" disabled={processing}>
                  Désactiver la 2FA
                </Button>
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
                    {errors.code && <p className="text-destructive text-sm">{errors.code}</p>}
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
    </div>
  )
}
