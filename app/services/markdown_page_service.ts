import SettingsService from '#services/settings_service'
import Markdown from '#shared/content/markdown'

/**
 * The pages whose whole content is a markdown blob kept in the
 * settings table, as opposed to the entries of a content model.
 */
type MarkdownPage = 'cv' | 'legal'

type MarkdownPageContents = { fr: string; en: string }

export async function readMarkdownPage(page: MarkdownPage): Promise<MarkdownPageContents> {
  const settings = await SettingsService.getMany([`${page}_markdown_fr`, `${page}_markdown_en`])

  return { fr: settings[`${page}_markdown_fr`], en: settings[`${page}_markdown_en`] }
}

/**
 * Stores both locales along with the HTML the public page serves as
 * is. An empty markdown clears the source and the rendering, which
 * sends the visitor back to the other locale.
 */
export async function saveMarkdownPage(page: MarkdownPage, contents: MarkdownPageContents) {
  for (const locale of ['fr', 'en'] as const) {
    const markdown = contents[locale]

    await SettingsService.set(`${page}_markdown_${locale}`, markdown)
    await SettingsService.set(
      `${page}_html_${locale}`,
      markdown.trim() === '' ? '' : await Markdown.render(markdown)
    )
  }
}
