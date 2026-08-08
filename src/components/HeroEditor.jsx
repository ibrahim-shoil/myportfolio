import { useState, useEffect } from 'react'
import './HeroEditor.scss'
import { useLang } from '../i18n/LanguageContext'
import { STRINGS, t } from '../i18n/strings'

const ROLES = {
  en: ['Video Editor', 'Motion Designer', 'Visual Storyteller', 'Content Creator'],
  ar: ['مونتير فيديو', 'مصمم موشن', 'صانع محتوى بصري', 'صانع محتوى'],
}

function useTypewriter(words, { typeSpeed = 90, deleteSpeed = 40, pause = 1600 } = {}) {
  const [wordIndex, setWordIndex] = useState(0)
  const [text, setText] = useState('')
  const [phase, setPhase] = useState('typing')

  useEffect(() => {
    if (words.length === 0) return
    const current = words[wordIndex % words.length]

    let delay = typeSpeed

    if (phase === 'typing') {
      if (text.length < current.length) {
        delay = typeSpeed
        const tt = setTimeout(() => setText(current.slice(0, text.length + 1)), delay)
        return () => clearTimeout(tt)
      }
      const tt = setTimeout(() => setPhase('pausing'), pause)
      return () => clearTimeout(tt)
    }

    if (phase === 'pausing') {
      const tt = setTimeout(() => setPhase('deleting'), pause)
      return () => clearTimeout(tt)
    }

    if (text.length > 0) {
      delay = deleteSpeed
      const tt = setTimeout(() => setText(current.slice(0, text.length - 1)), delay)
      return () => clearTimeout(tt)
    }
    // Keep the boundary transition timer-driven so this effect never forces
    // a synchronous cascading render.
    const tt = setTimeout(() => {
      setPhase('typing')
      setWordIndex(i => i + 1)
    }, 0)
    return () => clearTimeout(tt)
  }, [text, phase, wordIndex, words, typeSpeed, deleteSpeed, pause])

  return text
}

export default function HeroEditor() {
  const { lang } = useLang()
  const words = ROLES[lang] || ROLES.en
  const typed = useTypewriter(words, lang === 'ar' ? { typeSpeed: 75, deleteSpeed: 35 } : {})

  return (
    <section id="home" className="hero-editor">
      <div className="hero-bg" aria-hidden="true">
        <div className="aurora aurora-1" />
        <div className="aurora aurora-2" />
        <div className="aurora aurora-3" />
        <div className="hero-grid" />
      </div>

      <div className="hero-container">
        <div className="hero-avatar">
          <div className="hero-avatar-ring" />
          <img src="/is_logo.png" alt="Ibrahim A. Soliman logo" />
        </div>

        <h1 className="hero-title">
          {t(STRINGS.name, lang)}
        </h1>

        <p className="hero-rotator">
          <span className="hero-rotator-label">{t(STRINGS.hero.imA, lang)}</span>
          <span className="hero-rotator-text" aria-live="polite">
            {typed}
            <span className="hero-cursor" />
          </span>
        </p>

        <p className="hero-description">
          {t(STRINGS.hero.description, lang)}
        </p>

        <div className="hero-actions">
          <a href="#videos" className="btn btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
            {t(STRINGS.hero.viewWork, lang)}
          </a>
          <a href="#about" className="btn btn-secondary">
            {t(STRINGS.hero.aboutMe, lang)}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
        </div>

        <div className="hero-motion-timeline" aria-hidden="true">
          <span className="hero-motion-track">
            <i /><i /><i /><i /><i />
          </span>
          <span className="hero-motion-playhead" />
        </div>
      </div>
    </section>
  )
}
