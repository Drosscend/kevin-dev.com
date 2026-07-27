/**
 * French count and noun: only two or more takes the plural, so zero
 * reads "0 brouillon". Pass the plural form whenever appending an "s"
 * to the whole phrase would be wrong ("codes restants").
 */
export function plural(count: number, singular: string, pluralForm = `${singular}s`) {
  return `${count} ${count > 1 ? pluralForm : singular}`
}
