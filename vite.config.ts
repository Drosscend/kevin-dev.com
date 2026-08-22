import adonisjs from '@adonisjs/vite/client'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    react(),
    /**
     * The React compiler memoizes components and hooks at build time.
     * The preset filters on the code itself, so it covers the hooks
     * living in .ts files as well as the components.
     */
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
    adonisjs({
      entryPoints: ['inertia/app.tsx'],
      serverEntryPoints: ['inertia/ssr.tsx'],
      reload: ['resources/views/**/*.edge'],
    }),
  ],

  /**
   * Define aliases for importing modules from
   * your frontend code
   */
  resolve: {
    alias: {
      '~/': `${import.meta.dirname}/inertia/`,
      '#types': `${import.meta.dirname}/src/shared/types/`,
      '@generated': `${import.meta.dirname}/.adonisjs/client/`,
    },
  },

  server: {
    watch: {
      ignored: ['**/storage/**', '**/tmp/**'],
    },
  },
})
