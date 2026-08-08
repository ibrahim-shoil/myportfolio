import { useState } from 'react'
import './AboutEditor.scss'
import useScrollReveal from '../hooks/useScrollReveal'
import { useLang } from '../i18n/LanguageContext'
import { STRINGS, t } from '../i18n/strings'

const Icon = {
  edit: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
  motion: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none"/></svg>,
  info: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  script: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  design: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>,
  adobe: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>,
  code: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
}

const ICON_KEYS = ['edit', 'motion', 'info', 'script', 'design', 'adobe', 'code']

const VISIBLE_COUNT = 4

export default function AboutEditor() {
  const { lang } = useLang()
  const [showAll, setShowAll] = useState(false)
  const skills = STRINGS.about.skills[lang] || STRINGS.about.skills.en
  const visible = showAll ? skills : skills.slice(0, VISIBLE_COUNT)
  const ref = useScrollReveal()
  const paragraphs = STRINGS.about.paragraphs[lang] || STRINGS.about.paragraphs.en

  return (
    <section id="about" className="about" ref={ref}>
      <div className="about-container">
        <span className="section-eyebrow reveal-on-scroll">{t(STRINGS.about.eyebrow, lang)}</span>
        <h2 className="section-title reveal-on-scroll">{t(STRINGS.about.title, lang)}</h2>
        <div className="about-content">
          <div className="about-text reveal-on-scroll">
            {paragraphs.map((p, i) => (
              <p key={i}>{i === 0 ? <>{lang === 'en' ? <>I&apos;m <strong>Ibrahim</strong> — </> : <>أنا <strong>إبراهيم شُعيل</strong> — </>}{p}</> : p}</p>
            ))}

            <div className="about-skills">
              <h3>{t(STRINGS.about.skillsTitle, lang)}</h3>
              <div className="skills-grid">
                {visible.map((skill, i) => (
                  <div
                    key={skill.title}
                    className="skill-item"
                    style={{ '--reveal-delay': `${i * 70}ms` }}
                  >
                    <span className="skill-icon" aria-hidden="true">{Icon[ICON_KEYS[i]]}</span>
                    <div>
                      <h4>{skill.title}</h4>
                      <p>{skill.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              {skills.length > VISIBLE_COUNT && (
                <button className="skills-toggle" onClick={() => setShowAll(prev => !prev)}>
                  {showAll ? t(STRINGS.about.showLess, lang) : `${t(STRINGS.about.showMore, lang)} (${skills.length - VISIBLE_COUNT})`}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
