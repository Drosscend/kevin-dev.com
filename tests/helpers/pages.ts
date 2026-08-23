import type { SeoMeta } from '#types/seo'
import type { Data } from '../../.adonisjs/client/data.js'
import type { ApiResponse } from '@japa/api-client'

/**
 * Props of a rendered page, on top of what the middleware shares with
 * every one of them. The Japa client hands the props back as an open
 * record, so the component assertion is what ties them to a contract.
 */
function pageProps<Props>(response: ApiResponse, component: string): Data.SharedProps & Props {
  response.assertInertiaComponent(component)

  // SAFETY: the assertion above already failed the test unless the
  // response carries the props of that component.
  return response.inertiaProps as Data.SharedProps & Props
}

export function homePage(response: ApiResponse) {
  return pageProps<{
    technologies: { slug: string }[]
    hiddenTechnologies: number
    latestArticles: Data.Pages.HomeArticle[]
    talks: Data.Pages.HomeTalk[]
    meta: SeoMeta
  }>(response, 'home')
}

export function articleListPage(response: ApiResponse) {
  return pageProps<{ articles: Data.Blog.ArticleCard[] }>(response, 'blog/index')
}

export function articlePage(response: ApiResponse) {
  return pageProps<{ article: Data.Blog.ArticleDetail; meta: SeoMeta }>(response, 'blog/show')
}

export function projectListPage(response: ApiResponse) {
  return pageProps<{ projects: Data.Portfolio.ProjectCard[] }>(response, 'portfolio/index')
}

export function projectPage(response: ApiResponse) {
  return pageProps<{ project: Data.Portfolio.ProjectDetail }>(response, 'portfolio/show')
}

export function talkListPage(response: ApiResponse) {
  return pageProps<{ talks: Data.Talks.TalkCard[] }>(response, 'talks/index')
}

export function talkPage(response: ApiResponse) {
  return pageProps<{ talk: Data.Talks.TalkDetail }>(response, 'talks/show')
}

export function technologyListPage(response: ApiResponse) {
  return pageProps<{ technologies: Data.Technologies.TechnologyCard[]; meta: SeoMeta }>(
    response,
    'technologies/index'
  )
}

export function technologyPage(response: ApiResponse) {
  return pageProps<{
    technology: Data.Technologies.TechnologyDetail
    meta: SeoMeta
  }>(response, 'technologies/show')
}

export function notFoundPage(response: ApiResponse) {
  return pageProps(response, 'errors/not_found')
}

export function adminArticleFormPage(response: ApiResponse) {
  return pageProps<{ article: Data.Blog.ArticleForm | null }>(response, 'admin/articles/form')
}

export function contactPage(response: ApiResponse) {
  return pageProps<{ contentHtml: string }>(response, 'contact')
}

export function cvPage(response: ApiResponse) {
  return pageProps<{ contentHtml: string }>(response, 'cv')
}

export function legalPage(response: ApiResponse) {
  return pageProps<{ contentHtml: string }>(response, 'legal')
}
