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

  // Retro skin: English-only UI. The /editor/ar routes still exist (their
  // prerendered SEO shells keep Arabic indexed), and pages also carry hidden
  // Arabic text for Arabic search — but the visible app renders English.
  const lang = DEFAULT_LANG
  const dir = 'ltr'
  const isAr = false

  // Reflect language onto the document element (lang/dir).
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dir
    return () => {
      document.documentElement.lang = 'en'
      document.documentElement.dir = 'ltr'
    }
  }, [lang, dir])

  // Persist the chosen language (used by the bare-/editor redirect).
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, langParam === 'ar' ? 'ar' : 'en')
  }, [langParam])

  // Language switching is disabled while the retro English skin is active.
  const toggleLang = () => {}

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
