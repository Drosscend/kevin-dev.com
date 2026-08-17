import { configApp } from '@adonisjs/eslint-config'
import { react } from '@adonisjs/eslint-config/react'

export default configApp(...react, {
  files: ['inertia/**/*.{ts,tsx}'],
  rules: {
    // app/types holds dependency-free values (locales, content enums)
    // that the client imports through the matching Vite alias.
    '@adonisjs/no-backend-import-in-frontend': ['error', { allowed: ['#types/*'] }],
  },
})
