import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import { TuyauProvider } from '@adonisjs/inertia/react'
import { createInertiaApp, type ResolvedComponent } from '@inertiajs/react'
import { type ReactElement } from 'react'
import ReactDOMServer from 'react-dom/server'
import { type Data } from '@generated/data'
import { client } from '~/client'
import AdminLayout from '~/layouts/admin'
import Layout from '~/layouts/default'

const appName = 'kevin-dev.com'

export default function render(page: any) {
  return createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    title: (title) => (title ? `${title} · ${appName}` : appName),
    resolve: async (name) => {
      const resolved = await resolvePageComponent(
        `./pages/${name}.tsx`,
        import.meta.glob<{ default: ResolvedComponent }>('./pages/**/*.tsx', { eager: true }),
        (resolvedPage: ReactElement<Data.SharedProps>) =>
          name.startsWith('admin/') ? (
            <AdminLayout children={resolvedPage} />
          ) : (
            <Layout children={resolvedPage} />
          )
      )

      return resolved.default
    },
    setup: ({ App, props }) => {
      return (
        <TuyauProvider client={client}>
          <App {...props} />
        </TuyauProvider>
      )
    },
  })
}
