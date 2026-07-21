import { client } from '~/client'
import { type ReactElement } from 'react'
import Layout from '~/layouts/default'
import AdminLayout from '~/layouts/admin'
import { type Data } from '@generated/data'
import ReactDOMServer from 'react-dom/server'
import { createInertiaApp } from '@inertiajs/react'
import { TuyauProvider } from '@adonisjs/inertia/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

const appName = 'kevin-dev.com'

export default function render(page: any) {
  return createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    title: (title) => (title && title !== appName ? `${title} — ${appName}` : appName),
    resolve: (name) => {
      return resolvePageComponent(
        `./pages/${name}.tsx`,
        import.meta.glob('./pages/**/*.tsx', { eager: true }),
        (resolvedPage: ReactElement<Data.SharedProps>) =>
          name.startsWith('admin/') ? (
            <AdminLayout children={resolvedPage} />
          ) : (
            <Layout children={resolvedPage} />
          )
      )
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
