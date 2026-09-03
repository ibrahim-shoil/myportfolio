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





export function LanguageProvider({ children }) {
  const { lang: langParam } = useParams()
  const navigate = useNavigate()
  const location = useLocation()




  const lang = DEFAULT_LANG
  const dir = 'ltr'
  const isAr = false


  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dir
    return () => {
      document.documentElement.lang = 'en'
      document.documentElement.dir = 'ltr'
    }
  }, [lang, dir])


  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, langParam === 'ar' ? 'ar' : 'en')
  }, [langParam])


  const toggleLang = () => {}

  const value = useMemo(
    () => ({ lang, dir, isAr, toggleLang }),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lang, dir, isAr, location.pathname, location.search, location.hash]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLang() {
  return useContext(LanguageContext)
}


export function getPersistedLang() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return isValidLang(v) ? v : null
  } catch {
    return null
  }
}
