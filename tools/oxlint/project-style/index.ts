import { eslintCompatPlugin } from '@oxlint/plugins'
import { noAppImportInCoreRule } from './rules/no_app_import_in_core.ts'
import { noBackendImportInFrontendRule } from './rules/no_backend_import_in_frontend.ts'
import { noEmDashRule } from './rules/no_em_dash.ts'
import { noReactCompilerHooksRule } from './rules/no_react_compiler_hooks.ts'
import { noUiArrowRule } from './rules/no_ui_arrow.ts'
import { preferAdonisjsInertiaComponentRule } from './rules/prefer_adonisjs_inertia_component.ts'

/**
 * Project invariants that CLAUDE.md states in prose and that no shared
 * config can know about. Every rule here guards a boundary a reviewer
 * would otherwise have to catch by eye.
 */
const projectStylePlugin = eslintCompatPlugin({
  meta: { name: 'project-style' },
  rules: {
    'no-app-import-in-core': noAppImportInCoreRule,
    'no-backend-import-in-frontend': noBackendImportInFrontendRule,
    'no-em-dash': noEmDashRule,
    'no-react-compiler-hooks': noReactCompilerHooksRule,
    'no-ui-arrow': noUiArrowRule,
    'prefer-adonisjs-inertia-component': preferAdonisjsInertiaComponentRule,
  },
})

export default projectStylePlugin
