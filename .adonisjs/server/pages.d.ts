import '@adonisjs/inertia/types'

import type React from 'react'
import type { Prettify } from '@adonisjs/core/types/common'

type ExtractProps<T> =
  T extends React.FC<infer Props>
    ? Prettify<Omit<Props, 'children'>>
    : T extends React.Component<infer Props>
      ? Prettify<Omit<Props, 'children'>>
      : never

declare module '@adonisjs/inertia/types' {
  export interface InertiaPages {
    'admin/articles/form': ExtractProps<(typeof import('../../inertia/pages/admin/articles/form.tsx'))['default']>
    'admin/articles/index': ExtractProps<(typeof import('../../inertia/pages/admin/articles/index.tsx'))['default']>
    'admin/categories': ExtractProps<(typeof import('../../inertia/pages/admin/categories.tsx'))['default']>
    'admin/dashboard': ExtractProps<(typeof import('../../inertia/pages/admin/dashboard.tsx'))['default']>
    'admin/home': ExtractProps<(typeof import('../../inertia/pages/admin/home.tsx'))['default']>
    'admin/media': ExtractProps<(typeof import('../../inertia/pages/admin/media.tsx'))['default']>
    'admin/messages': ExtractProps<(typeof import('../../inertia/pages/admin/messages.tsx'))['default']>
    'admin/pages': ExtractProps<(typeof import('../../inertia/pages/admin/pages.tsx'))['default']>
    'admin/projects/form': ExtractProps<(typeof import('../../inertia/pages/admin/projects/form.tsx'))['default']>
    'admin/projects/index': ExtractProps<(typeof import('../../inertia/pages/admin/projects/index.tsx'))['default']>
    'admin/security': ExtractProps<(typeof import('../../inertia/pages/admin/security.tsx'))['default']>
    'admin/talks/form': ExtractProps<(typeof import('../../inertia/pages/admin/talks/form.tsx'))['default']>
    'admin/talks/index': ExtractProps<(typeof import('../../inertia/pages/admin/talks/index.tsx'))['default']>
    'admin/technologies': ExtractProps<(typeof import('../../inertia/pages/admin/technologies.tsx'))['default']>
    'auth/login': ExtractProps<(typeof import('../../inertia/pages/auth/login.tsx'))['default']>
    'auth/verify': ExtractProps<(typeof import('../../inertia/pages/auth/verify.tsx'))['default']>
    'blog/index': ExtractProps<(typeof import('../../inertia/pages/blog/index.tsx'))['default']>
    'blog/show': ExtractProps<(typeof import('../../inertia/pages/blog/show.tsx'))['default']>
    'contact': ExtractProps<(typeof import('../../inertia/pages/contact.tsx'))['default']>
    'cv': ExtractProps<(typeof import('../../inertia/pages/cv.tsx'))['default']>
    'errors/not_found': ExtractProps<(typeof import('../../inertia/pages/errors/not_found.tsx'))['default']>
    'errors/server_error': ExtractProps<(typeof import('../../inertia/pages/errors/server_error.tsx'))['default']>
    'home': ExtractProps<(typeof import('../../inertia/pages/home.tsx'))['default']>
    'legal': ExtractProps<(typeof import('../../inertia/pages/legal.tsx'))['default']>
    'portfolio/index': ExtractProps<(typeof import('../../inertia/pages/portfolio/index.tsx'))['default']>
    'portfolio/show': ExtractProps<(typeof import('../../inertia/pages/portfolio/show.tsx'))['default']>
    'talks/index': ExtractProps<(typeof import('../../inertia/pages/talks/index.tsx'))['default']>
    'talks/show': ExtractProps<(typeof import('../../inertia/pages/talks/show.tsx'))['default']>
    'technologies/index': ExtractProps<(typeof import('../../inertia/pages/technologies/index.tsx'))['default']>
    'technologies/show': ExtractProps<(typeof import('../../inertia/pages/technologies/show.tsx'))['default']>
  }
}
