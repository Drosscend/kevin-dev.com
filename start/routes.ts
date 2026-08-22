/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

/**
 * One file per capability. The order matters where prefixes overlap:
 * seo owns /blog/rss.xml, which blog would otherwise swallow with
 * /blog/:slug.
 */
import '#app/pages/routes'
import '#app/seo/routes'
import '#app/blog/routes'
import '#app/contact/routes'
import '#app/dashboard/routes'
import '#app/media/routes'
import '#app/portfolio/routes'
import '#app/talks/routes'
import '#app/technologies/routes'
import '#app/identity/routes'
import '#app/shared/routes'
