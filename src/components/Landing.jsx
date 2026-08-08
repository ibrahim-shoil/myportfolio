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
        <div className="landing-logo">
          <div className="landing-logo-ring" />
          <img src="/is_logo.png" alt="Ibrahim A. Soliman" />
        </div>

        <span className="landing-kicker">Personal portfolio · ishoil</span>
        <h1 className="landing-title">Ibrahim A. Soliman</h1>
        <p className="landing-alias" lang="ar" dir="rtl">إبراهيم شعيل</p>
        <p className="landing-sub">Engineering reliable products and shaping ideas into motion.</p>

        <div className="landing-cards">
          <Link
            to="/dev"
            className="landing-card landing-card-dev motion-surface"
          >
            <div className="landing-card-glow" aria-hidden="true" />
            <div className="landing-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="34" height="34"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            </div>
            <div className="landing-card-body">
              <span className="landing-card-number">01 · Engineering</span>
              <h2>Full-Stack Developer</h2>
              <p>Product engineering, backend systems, DevOps, deployments, and mobile publishing.</p>
              <span className="landing-card-tags"><span>React</span><span>Node.js</span><span>Python</span><span>Docker</span></span>
            </div>
            <span className="landing-card-arrow">
              Open profile
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </span>
          </Link>

          <Link
            to="/editor/en"
            className="landing-card landing-card-editor motion-surface"
          >
            <div className="landing-card-glow" aria-hidden="true" />
            <div className="landing-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="34" height="34"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
            </div>
            <div className="landing-card-body">
              <span className="landing-card-number">02 · Motion</span>
              <h2>Video Editor</h2>
              <p>Editorial motion, video editing, infographics, and visual storytelling.</p>
              <span className="landing-card-tags"><span>Editing</span><span>Motion</span><span>Visuals</span></span>
            </div>
            <span className="landing-card-arrow">
              Open profile
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </span>
          </Link>
        </div>

        <div className="landing-signature" aria-label="Portfolio identity">
          <span>Ibrahim A. Soliman</span><i /><span>ishoil</span><i /><span lang="ar" dir="rtl">إبراهيم شعيل</span>
        </div>
      </div>
    </div>
  )
}
