import { Form } from '@adonisjs/inertia/react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import FieldError from '~/components/field_error'

export default function Login() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Administration</CardTitle>
          <CardDescription>Connectez-vous pour accéder à l’admin</CardDescription>
        </CardHeader>
        <CardContent>
          <Form route="admin.login.store" className="space-y-4">
            {({ errors, processing }) => (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="username"
                    aria-invalid={errors.email ? true : undefined}
                  />
                  <FieldError errors={errors} field="email" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    autoComplete="current-password"
                    aria-invalid={errors.password ? true : undefined}
                  />
                  <FieldError errors={errors} field="password" />
                </div>

                <Button type="submit" className="w-full" disabled={processing}>
                  Se connecter
                </Button>
              </>
            )}
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
