






export const LANGS = ['en', 'ar']
export const DEFAULT_LANG = 'en'

export function isValidLang(lang) {
  return LANGS.includes(lang)
}





export function pick(obj, lang) {
  if (!obj) return ''
  if (typeof obj === 'string') return obj
  return obj[lang] || obj[DEFAULT_LANG] || obj.ar || obj.en || ''
}




export function pickList(obj, lang) {
  if (!obj) return []
  if (Array.isArray(obj)) return obj
  return obj[lang] || obj[DEFAULT_LANG] || obj.ar || obj.en || []
}
