import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import './Landing.scss'

export default function Landing() {
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Ibrahim A. Soliman — Developer & Video Editor'
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

        <h1 className="landing-title">Ibrahim A. Soliman</h1>
        <p className="landing-sub">Two crafts, one person. Choose where you want to go.</p>

        <div className="landing-cards">
          <button
            className="landing-card landing-card-dev"
            onClick={() => navigate('/dev')}
          >
            <div className="landing-card-glow" aria-hidden="true" />
            <div className="landing-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="34" height="34"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            </div>
            <div className="landing-card-body">
              <h2>Developer</h2>
              <p>Full-stack engineering, DevOps, mobile apps, and production systems.</p>
            </div>
            <span className="landing-card-arrow">
              Enter
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </span>
          </button>

          <button
            className="landing-card landing-card-editor"
            onClick={() => navigate('/editor')}
          >
            <div className="landing-card-glow" aria-hidden="true" />
            <div className="landing-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="34" height="34"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
            </div>
            <div className="landing-card-body">
              <h2>Video Editor</h2>
              <p>Motion graphics, editing, infographics, and visual storytelling for clients.</p>
            </div>
            <span className="landing-card-arrow">
              Enter
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </span>
          </button>
        </div>

        <p className="landing-foot">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          ishoil@icloud.com
        </p>
      </div>
    </div>
  )
}
