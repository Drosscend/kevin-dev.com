import Setting from '#models/setting'

/**
 * Key/value store backed by the settings table (CV content, legal
 * page content, CV PDF metadata…).
 */
export default class SettingsService {
  static async get(key: string, fallback = '') {
    const setting = await Setting.findBy('key', key)
    return setting?.value ?? fallback
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
