import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.get('/health', [controllers.shared.HealthChecks, 'handle']).as('health')

/**
 * URLs of earlier versions of the site that search engines still rank.
 * Each line is meant to be deleted once its URL has dropped out of the
 * indexes, checked in the Search Console. Added on 2026-08-18.
 */
router.on('/assets/pdf/Véronési_Kévin_CV.pdf').redirectToPath('/cv.pdf', { status: 301 })
router.on('/pages_supp/mentions_légales/').redirectToPath('/legal', { status: 301 })
