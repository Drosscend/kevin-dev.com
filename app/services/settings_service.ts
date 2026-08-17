import Setting from '#models/setting'

/**
 * Key/value store backed by the settings table: markdown pages (CV,
 * legal notice) and the homepage blocks.
 */
export default class SettingsService {
  static async get(key: string) {
    const setting = await Setting.findBy('key', key)
    return setting?.value ?? ''
  }

  static async getMany(keys: string[]) {
    const settings = await Setting.query().whereIn('key', keys)
    return Object.fromEntries(
      keys.map((key) => [key, settings.find((setting) => setting.key === key)?.value ?? ''])
    )
  }

  static async set(key: string, value: string) {
    await Setting.updateOrCreate({ key }, { key, value })
  }
}
