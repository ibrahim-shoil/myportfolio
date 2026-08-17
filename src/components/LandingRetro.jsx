import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import RetroChrome from './RetroChrome'
import './LandingRetro.scss'

/**
 * Root page in the 2010 skin: a quiet intro and the two profile doors
 * as glossy cards, inside the shared site chrome.
 */
export default function LandingRetro() {
  useEffect(() => {
    document.title = 'ishoil // developer & video editor'
    return () => { document.title = 'Ibrahim A. Soliman' }
  }, [])

  return (
    <RetroChrome noNav>
      <section className="lr-hero">
        <div className="lr-logo">
          <img src="/is_logo.png" alt="Ibrahim A. Soliman" width="1089" height="2037" />
        </div>
        <div className="lr-hero-text">
          <h1 className="lr-h1">
            Ibrahim Soliman <span className="lr-h1-sub">builds things that work</span>
          </h1>
          <p className="lr-tagline">
            One person, two crafts: reliable software end to end, and video
            that holds attention. Pick a door.
          </p>
        </div>
      </section>

      <div className="lr-doors">
        <section className="rc-card lr-door">
          <span className="lr-door-kicker">Video Editor &amp; Motion Designer</span>
          <h2 className="lr-door-title">The Cutting Room</h2>
          <p className="lr-door-desc">
            Editorial motion, infographics, animated maps, and short-form edits.
            Watch the work, share it, or request a service.
          </p>
          <div className="lr-door-actions">
            <Link className="rc-btn rc-btn-green" to="/editor/en">Enter the portfolio</Link>
          </div>
        </section>

        <section className="rc-card lr-door">
          <span className="lr-door-kicker">Full-Stack Developer &amp; DevOps</span>
          <h2 className="lr-door-title">The Engineer</h2>
          <p className="lr-door-desc">
            React frontends, Node and Python backends, Docker and Nginx
            infrastructure, shipped and monitored.
          </p>
          <div className="lr-door-actions">
            <Link className="rc-btn" to="/dev">Enter the profile</Link>
          </div>
        </section>
      </div>
    </RetroChrome>
  )
}
