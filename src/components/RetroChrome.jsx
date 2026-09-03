import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './RetroChrome.scss'
import useActiveSection from '../hooks/useActiveSection'






export default function RetroChrome({ children, active = 'home', bare = false, noNav = false, profile = 'editor' }) {



  const tab = (id, label, to) => (
    <Link className={`rc-tab ${activeTab === id ? 'rc-tab-active' : ''}`} to={to} onClick={() => handleTabClick(id)}>{label}</Link>
  )

  const base = profile === 'dev' ? '/dev' : '/editor/en'



  const sectionIds = profile === 'dev'
    ? ['top', 'about', 'projects']
    : ['top', 'about', 'videos', 'series', 'gallery']
  const trackSections = active === 'home'


  const activeSection = useActiveSection(trackSections ? sectionIds : [], 64)
  const currentActive = activeSection === 'top' ? 'home' : activeSection


  const [clickedTab, setClickedTab] = useState(null)
  const clickTimer = useRef(null)
  const handleTabClick = (id) => {
    setClickedTab(id)
    if (clickTimer.current) clearTimeout(clickTimer.current)
    clickTimer.current = setTimeout(() => setClickedTab(null), 1200)
  }
  useEffect(() => () => { if (clickTimer.current) clearTimeout(clickTimer.current) }, [])

  const activeTab = clickedTab || (trackSections && currentActive) || active

  const links = profile === 'dev'
    ? [
        tab('home', 'home', `${base}#top`),
        tab('about', 'about', `${base}#about`),
        tab('projects', 'projects', `${base}#projects`),
      ]
    : [
        tab('home', 'home', `${base}#top`),
        tab('about', 'about', `${base}#about`),
        tab('videos', 'videos', `${base}#videos`),
        tab('series', 'series', `${base}#series`),
        tab('gallery', 'gallery', `${base}#gallery`),
      ]

  const logo = (
    <>
      ishoil<span>.me</span>
      <i className="rc-beta">beta</i>
    </>
  )

  return (
    <div className="rc">
      <header className="rc-header">
        <div className="rc-wrap rc-header-in">
          {bare || noNav
            ? <span className="rc-logo">{logo}</span>
            : <Link to="/" className="rc-logo">{logo}</Link>}
          {!bare && !noNav && (
            <nav className="rc-nav" aria-label="Site">
              {links}
            </nav>
          )}
        </div>
      </header>

      <div className="rc-wrap rc-page" id="top">
        {children}
      </div>

      <footer className="rc-footer">
        <div className="rc-wrap">
          <div className="rc-badges" aria-hidden="true">
            <span className="rc-badge">React 19</span>
            <span className="rc-badge rc-badge-vite">Vite 7</span>
            <span className="rc-badge rc-badge-scss">SCSS</span>
            <span className="rc-badge rc-badge-nginx">served by Nginx</span>
          </div>
          {bare ? (
            <p className="rc-footer-text">
              (c) 2026 Ibrahim A. Soliman // portfolio preview for Upwork
            </p>
          ) : (
            <p className="rc-footer-text">
              (c) 2026 Ibrahim A. Soliman //
              <a href="https://github.com/ibrahim-shoil" target="_blank" rel="noopener noreferrer"> GitHub</a> //
              <a href="mailto:ishoil@icloud.com"> ishoil@icloud.com</a>
            </p>
          )}
        </div>
      </footer>
    </div>
  )
}
