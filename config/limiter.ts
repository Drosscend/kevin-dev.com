import { defineConfig, stores } from '@adonisjs/limiter'
import type { InferLimiters } from '@adonisjs/limiter/types'

/**
 * Store mémoire : suffisant tant que l'app tourne dans un
 * conteneur unique (VPS Dokploy).
 */
const limiterConfig = defineConfig({
  default: 'memory',

  stores: {
    memory: stores.memory({}),
  },
})

export default limiterConfig

declare module '@adonisjs/limiter/types' {
  export interface LimitersList extends InferLimiters<typeof limiterConfig> {}
}
