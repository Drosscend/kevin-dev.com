import './css/app.css'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import { TuyauProvider } from '@adonisjs/inertia/react'
import { createInertiaApp, type ResolvedComponent } from '@inertiajs/react'
import { type ReactElement } from 'react'
import { createRoot } from 'react-dom/client'
import { type Data } from '@generated/data'
import AdminLayout from '~/layouts/admin'
import Layout from '~/layouts/default'
import { client } from './client'

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
