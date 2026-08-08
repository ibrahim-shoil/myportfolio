/**
 * Bilingual data helpers.
 *
 * Text fields in data/*.json are objects like { en, ar }.
 * `pick` returns the right string for the active language, with a safe fallback.
 */

export const LANGS = ['en', 'ar']
export const DEFAULT_LANG = 'en'

export function isValidLang(lang) {
  return LANGS.includes(lang)
}

/**
 * Pick a localized string from a { en, ar } object.
 * Falls back to the other language, then to an empty string.
 */
export function pick(obj, lang) {
  if (!obj) return ''
  if (typeof obj === 'string') return obj
  return obj[lang] || obj[DEFAULT_LANG] || obj.ar || obj.en || ''
}

/**
 * Pick a localized array from a { en: [], ar: [] } object.
 */
export function pickList(obj, lang) {
  if (!obj) return []
  if (Array.isArray(obj)) return obj
  return obj[lang] || obj[DEFAULT_LANG] || obj.ar || obj.en || []
}
