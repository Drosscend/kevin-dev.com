import { defineConfig } from '@adonisjs/inertia'

const inertiaConfig = defineConfig({
  /**
   * Server-side rendering options.
   */
  ssr: {
    /**
     * Toggle SSR mode for Inertia pages.
     */
    enabled: true,

    /**
     * Entry file used by the SSR server build.
     */
    entrypoint: 'inertia/ssr.tsx',

    /**
     * Admin pages sit behind auth and have no SEO value, so they
     * are rendered client-side only.
     */
    pages: (_, page) => !page.startsWith('admin/'),
  },
})

export default inertiaConfig
