import { defineConfig } from 'oxlint'

export default defineConfig({
  ignorePatterns: [
    '**/.adonisjs/**',
    '**/build/**',
    '**/public/assets/**',
    '**/storage/**',
    'database/schema.ts',
  ],
  plugins: ['typescript', 'unicorn', 'react', 'import'],
  jsPlugins: [{ name: 'project-style', specifier: './tools/oxlint/project-style/index.ts' }],
  settings: {
    react: { version: '19.2.8' },
  },
  rules: {
    'eqeqeq': ['error', 'always'],
    'project-style/blank-line-after-imports': 'error',
    'project-style/blank-line-before-if': 'error',
    'project-style/no-em-dash': 'error',
    'project-style/no-typescript-private': 'error',
    'project-style/no-ui-arrow': 'error',
    // createInertiaApp takes its page component through a children prop.
    'react/no-children-prop': 'off',
    'react/exhaustive-deps': 'warn',
    'react/rules-of-hooks': 'error',
    'react/self-closing-comp': 'error',
    'unicorn/filename-case': ['error', { case: 'snakeCase' }],
    'unicorn/prefer-node-protocol': 'error',
  },
  overrides: [
    {
      files: ['src/**/*.ts'],
      rules: { 'project-style/no-app-import-in-core': 'error' },
    },
    {
      files: ['inertia/**/*.{ts,tsx}'],
      rules: {
        // Only on the client: a constructor-injected type is also a runtime
        // value, so the rule would break the container everywhere else.
        'typescript/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
        'project-style/no-backend-import-in-frontend': 'error',
        'project-style/no-react-compiler-hooks': 'error',
        'project-style/prefer-adonisjs-inertia-component': 'error',
      },
    },
    {
      // LinkArrow draws the navigation arrow of the whole site, the
      // lightbox prints the arrow keys it listens to, and the test
      // guards the same invariant on the translation files.
      files: [
        'inertia/components/content_link.tsx',
        'inertia/components/lightbox.tsx',
        'tests/functional/navigation.spec.ts',
      ],
      rules: { 'project-style/no-ui-arrow': 'off' },
    },
    {
      // Starter kit files, kept diffable with upstream.
      files: ['bin/**', 'ace.js'],
      rules: { 'unicorn/no-useless-spread': 'off' },
    },
  ],
})
