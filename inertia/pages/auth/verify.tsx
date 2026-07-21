import { Form } from '@adonisjs/inertia/react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

export default function Verify() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Vérification</CardTitle>
          <CardDescription>
            Entrez le code à 6 chiffres de votre application d’authentification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form route="admin.totp.store" className="space-y-4">
            {({ errors, processing }) => (
              <>
                <div className="space-y-2">
                  <Label htmlFor="code">Code TOTP</Label>
                  <Input
                    type="text"
                    name="code"
                    id="code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    autoFocus
                    aria-invalid={errors.code ? true : undefined}
                  />
                  {errors.code && <p className="text-destructive text-sm">{errors.code}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={processing}>
                  Vérifier
                </Button>
              </>
            )}
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
