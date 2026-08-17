import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import './Landing.scss'

export default function Landing() {
  useEffect(() => {
    document.title = 'Ibrahim A. Soliman (ishoil) | إبراهيم شعيل'
    return () => { document.title = 'Ibrahim A. Soliman' }
  }, [])

  return (
    <div className="landing">
      <div className="landing-bg" aria-hidden="true">
        <div className="landing-orb landing-orb-1" />
        <div className="landing-orb landing-orb-2" />
        <div className="landing-grid" />
      </div>

      <div className="landing-inner">
        <header className="landing-head">
          <div className="landing-logo">
            <img src="/is_logo.png" alt="Ibrahim A. Soliman" width="1089" height="2037" />
          </div>
          <div>
            <span className="landing-kicker">Personal portfolio · ishoil</span>
            <h1 className="landing-title">Ibrahim A. Soliman</h1>
            <p className="landing-alias" lang="ar" dir="rtl">إبراهيم شعيل</p>
          </div>
        </header>

        <p className="landing-sub">
          Engineering reliable products and shaping ideas into motion.
          Choose the profile you are here for.
        </p>

        <nav className="landing-choice" aria-label="Choose a profile">
          <Link to="/dev" className="choice-panel choice-panel-dev motion-surface">
            <span className="choice-glow" aria-hidden="true" />
            <span className="choice-kicker">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              Developer
            </span>
            <h2>Full-Stack Development</h2>
            <p>Product engineering, backend systems, DevOps, deployments, and mobile publishing.</p>
            <span className="choice-tools">React · Node.js · Python · Docker</span>
            <span className="choice-open">
              Open profile
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </span>
          </Link>

          <Link to="/editor/en" className="choice-panel choice-panel-editor motion-surface">
            <span className="choice-glow" aria-hidden="true" />
            <span className="choice-kicker">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
              Video Editor
            </span>
            <h2>Video Editing &amp; Motion</h2>
            <p>Editorial motion, video editing, infographics, and visual storytelling.</p>
            <span className="choice-tools">Editing · Motion · Visuals</span>
            <span className="choice-open">
              Open profile
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </span>
          </Link>
        </nav>

        <footer className="landing-signature" aria-label="Portfolio identity">
          <span>Ibrahim A. Soliman</span><i /><span>ishoil</span><i /><span lang="ar" dir="rtl">إبراهيم شعيل</span>
        </footer>
      </div>
    </div>
  )
}
