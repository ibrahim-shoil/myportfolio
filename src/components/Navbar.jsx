import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.scss'
import useScrollProgress from '../hooks/useScrollProgress'
import useActiveSection from '../hooks/useActiveSection'
import { useLang } from '../i18n/LanguageContext'
import { STRINGS, t } from '../i18n/strings'
import { lockBodyScroll } from '../utils/scrollLock'

const NAV_PROFILES = {
  dev: {
    switchLabel: 'Video Editor',
    switchTo: '/editor',
    links: [
      { nameKey: 'home', href: '#home', id: 'home' },
      { nameKey: 'about', href: '#about', id: 'about' },
      { nameKey: 'projects', href: '#projects', id: 'projects' },
      { nameKey: 'social', href: '#social', id: 'social' },
      { nameKey: 'contact', href: '#contact', id: 'contact' },
    ],
    linkNames: { home: 'Home', about: 'About', projects: 'Projects', social: 'Content', contact: 'Contact' },
  },
  editor: {
    links: [
      { nameKey: 'home', href: '#home', id: 'home' },
      { nameKey: 'about', href: '#about', id: 'about' },
      { nameKey: 'videos', href: '#videos', id: 'videos' },
      { nameKey: 'series', href: '#series', id: 'series' },
      { nameKey: 'gallery', href: '#gallery', id: 'gallery' },
      { nameKey: 'social', href: '#social', id: 'social' },
      { nameKey: 'contact', href: '#contact', id: 'contact' },
    ],
  },
}

export default function Navbar({ theme, toggleTheme, profile = 'dev' }) {
  const { lang, toggleLang } = useLang()
  const config = NAV_PROFILES[profile]
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const progress = useScrollProgress()
  const ids = config.links.map(l => l.id)
  const activeSection = useActiveSection(ids)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when the mobile menu is open (shared, reference-counted).
  useEffect(() => {
    if (!mobileOpen) return undefined
    return lockBodyScroll()
  }, [mobileOpen])

  const linkName = (key) => {
    if (profile === 'editor') return t(STRINGS.nav[key], lang)
    return config.linkNames[key]
  }

  const switchLabel = profile === 'dev' ? 'Video Editor' : t(STRINGS.nav.switchToDev, lang)
  const switchTo = profile === 'dev' ? '/editor' : '/dev'

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} navbar-profile-${profile}`}>
      <div className="navbar-progress" style={{ transform: `scaleX(${progress / 100})` }} />

      <div className="navbar-container">
        <Link to="/" className="navbar-logo" aria-label={lang === 'ar' ? 'الرئيسية' : 'Home'}>
          <img src="/is_logo.png" alt="IS" />
        </Link>

        <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          {config.links.map(link => (
            <a
              key={link.nameKey}
              href={link.href}
              className={`navbar-link ${activeSection === link.id ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {linkName(link.nameKey)}
            </a>
          ))}

          {profile === 'editor' && (
            <button
              className="navbar-lang"
              onClick={() => { toggleLang(); setMobileOpen(false) }}
              aria-label={lang === 'ar' ? 'تغيير اللغة' : 'Switch language'}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              {t(STRINGS.nav.langLabel, lang)}
            </button>
          )}

          <Link
            to={switchTo}
            className="navbar-switch"
            onClick={() => setMobileOpen(false)}
            aria-label={lang === 'ar' ? `الانتقال إلى ملف ${switchLabel}` : `Switch to ${switchLabel} profile`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>
            {switchLabel}
          </Link>

          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={lang === 'ar' ? 'تغيير المظهر' : 'Toggle theme'}
          >
            {theme === 'dark' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
            <span>{theme === 'dark' ? t(STRINGS.nav.themeLight, lang) : t(STRINGS.nav.themeDark, lang)}</span>
          </button>
        </div>

        <button
          className={`mobile-toggle ${mobileOpen ? 'open' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={lang === 'ar' ? 'فتح أو إغلاق القائمة' : 'Toggle menu'}
          aria-expanded={mobileOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  )
}
