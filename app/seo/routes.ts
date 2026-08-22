import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.get('/sitemap.xml', [controllers.seo.Sitemap, 'execute']).as('seo.sitemap')
router.get('/robots.txt', [controllers.seo.Robots, 'execute']).as('seo.robots')
router.get('/.well-known/security.txt', [controllers.seo.SecurityTxt, 'execute']).as('seo.security')
router.get('/blog/rss.xml', [controllers.seo.Feed, 'execute']).as('seo.rss')
router.get('/en/blog/rss.xml', [controllers.seo.Feed, 'execute']).as('en.seo.rss')

/**
 * Markdown endpoints for LLM consumers. Content pages get their .md
 * variant through the regular blog/portfolio controllers (a ".md"
 * slug suffix switches the response to the stored Markdown).
 */
router.get('/llms.txt', [controllers.seo.Llms, 'execute']).as('llms.index')
router.get('/cv.md', [controllers.seo.CvMarkdown, 'execute']).as('llms.cv')
router.get('/en/cv.md', [controllers.seo.CvMarkdown, 'execute']).as('en.llms.cv')
router.get('/legal.md', [controllers.seo.LegalMarkdown, 'execute']).as('llms.legal')
router.get('/en/legal.md', [controllers.seo.LegalMarkdown, 'execute']).as('en.llms.legal')
