import { createContext, useContext, useMemo, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { isValidLang, DEFAULT_LANG } from './data'

const LanguageContext = createContext({
  lang: DEFAULT_LANG,
  dir: 'ltr',
  isAr: false,
  toggleLang: () => {},
})

const STORAGE_KEY = 'editor-lang'

/**
 * Derives the active language from the `/editor/:lang` route param.
 * Persists the user's choice and reflects it onto <html lang/dir>.
 */
export function LanguageProvider({ children }) {
  const { lang: langParam } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const lang = isValidLang(langParam) ? langParam : DEFAULT_LANG
  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  const isAr = lang === 'ar'

  // Reflect language onto the document element (lang/dir).
  // The cleanup restores LTR/en when leaving editor routes (e.g. navigating
  // to / or /dev), so the Arabic RTL never leaks into the dev profile or landing.
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dir
    return () => {
      document.documentElement.lang = 'en'
      document.documentElement.dir = 'ltr'
    }
  }, [lang, dir])

  // Persist the chosen language.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang)
  }, [lang])

  /**
   * Switch language while staying on the same page.
   * Replaces the /editor/<lang> segment of the current path.
   */
  const toggleLang = () => {
    const next = lang === 'en' ? 'ar' : 'en'
    const path = location.pathname
    // path looks like /editor/<lang>... or /editor (legacy)
    let nextPath
    if (path.startsWith('/editor/en') || path.startsWith('/editor/ar')) {
      nextPath = `/editor/${next}` + path.slice(`/editor/${lang}`.length)
    } else {
      // fallback: go to the other language's editor landing
      nextPath = `/editor/${next}`
    }
    navigate(nextPath + location.search + location.hash)
  }

  const value = useMemo(
    () => ({ lang, dir, isAr, toggleLang }),
    // toggleLang is stable enough (closures over lang/location); include deps that change it
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lang, dir, isAr, location.pathname, location.search, location.hash]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLang() {
  return useContext(LanguageContext)
}

/** Read the persisted language choice (used for the bare-/editor redirect). */
export function getPersistedLang() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return isValidLang(v) ? v : null
  } catch {
    return null
  }
}
