import './css/app.css'
import { type ReactElement } from 'react'
import { client } from './client'
import Layout from '~/layouts/default'
import AdminLayout from '~/layouts/admin'
import { type Data } from '@generated/data'
import { createRoot } from 'react-dom/client'
import { createInertiaApp, type ResolvedComponent } from '@inertiajs/react'
import { TuyauProvider } from '@adonisjs/inertia/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

const appName = 'kevin-dev.com'

createInertiaApp({
  title: (title) => (title ? `${title} · ${appName}` : appName),
  resolve: async (name) => {
    const page = await resolvePageComponent(
      `./pages/${name}.tsx`,
      import.meta.glob<{ default: ResolvedComponent }>('./pages/**/*.tsx'),
      (resolvedPage: ReactElement<Data.SharedProps>) =>
        name.startsWith('admin/') ? (
          <AdminLayout children={resolvedPage} />
        ) : (
          <Layout children={resolvedPage} />
        )
    )

    return page.default
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <TuyauProvider client={client}>
        <App {...props} />
      </TuyauProvider>
    )
  },
  progress: {
    color: '#4B5563',
  },
})
