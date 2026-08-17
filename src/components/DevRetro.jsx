import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import RetroChrome from './RetroChrome'
import './DevRetro.scss'
import { useInquiry } from '../hooks/useInquiry'

const PROJECTS = [
  {
    name: 'Tecbamin',
    description: 'Arabic tech content platform with articles, phone database, and auto-scraping pipelines.',
    stack: 'Python · Flask · MySQL · Redis',
    link: 'https://tecbamin.com',
  },
  {
    name: 'PlayCredits',
    description: 'Game credits marketplace with bilingual support, payment integration, and admin panel.',
    stack: 'Next.js · NestJS · TypeScript · PostgreSQL · Stripe',
    link: 'https://www.playcredits.store/en',
  },
  {
    name: 'Airbamin',
    description: 'Cross-platform file transfer: iPhone/Android to Windows at 70MB/s, no cloud. Published on the Windows Store.',
    stack: 'Java · JavaFX · P2P',
    link: 'https://tecbamin.com/airbamin',
  },
  {
    name: 'ishoil.me',
    description: 'This very site: two profiles, one design system, prerendered SEO shells, and a video pipeline with instant playback.',
    stack: 'React · Vite · Nginx · Node',
    link: '/editor/en',
  },
  {
    name: 'RTL Toggle',
    description: 'Chrome extension adding a floating button to toggle text direction between RTL/LTR on any website.',
    stack: 'JavaScript · Manifest V3',
    link: 'https://chromewebstore.google.com/detail/fekmelecjjbpkifkecoeffilfnaljlkj',
  },
]

// Downloadable tools get a distinct, unmistakable treatment
const DOWNLOADS = [
  {
    name: 'CaptionFlow',
    description: 'After Effects panel that imports SRT subtitles and creates timed text layers — per sentence or per word.',
    stack: 'ExtendScript · ScriptUI',
    file: 'AutoCaptions.jsx',
    size: '24 KB',
    href: '/downloads/AutoCaptions.jsx',
    page: '/dev/tools/captionflow',
  },
  {
    name: 'Text Burst',
    description: 'After Effects panel that splits a text layer into one layer per character, word, or line — with Arabic RTL support.',
    stack: 'ExtendScript · ScriptUI',
    file: 'TextBurst.jsx',
    size: '14 KB',
    href: '/downloads/TextBurst.jsx',
    page: '/dev/tools/textburst',
  },
]

/**
 * Developer profile in the 2010 card system, with a terminal-styled
 * hire card that composes a prefilled email brief.
 */
export default function DevRetro() {
  const { openInquiry } = useInquiry()

  useEffect(() => {
    document.title = 'ishoil // full-stack developer & devops'
  }, [])

  return (
    <RetroChrome profile="dev" active="home">
      {/* Hero */}
      <section className="er-hero er-hero-noterm" id="top">
        <div className="er-hero-text">
          <h1 className="er-h1">
            Ibrahim Soliman <span className="er-h1-sub">builds things that work</span>
          </h1>
          <p className="er-tagline">
            Full-stack engineer and DevOps practitioner. Python, Node.js and
            React on the surface; Docker, Nginx and monitoring underneath.
            I also write After Effects tooling when the render queue asks nicely.
          </p>
          <div className="er-hero-actions">
            <button type="button" className="rc-btn rc-btn-green" onClick={() => openInquiry({ url: '/dev', title: 'Programmer profile' })}>Hire me</button>
            <a className="rc-btn" href="https://github.com/ibrahim-shoil" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a className="rc-btn" href="mailto:ishoil@icloud.com">Email me</a>
          </div>
        </div>
      </section>

      {/* About + toolchain */}
      <section className="rc-card" id="about">
        <h2 className="rc-h2"><span className="rc-h2-gloss">About</span></h2>
        <div className="er-avatar-row">
          <span className="er-avatar">IS</span>
          <div>
            <p className="er-side-name">Ibrahim A. Soliman</p>
            <p className="er-side-loc">Cairo, Egypt</p>
            <p className="er-side-status"><span className="er-status-dot" /> available for work</p>
          </div>
        </div>
        <ul className="dr-stack">
          <li><span className="dr-k">languages</span> Python, JavaScript, TypeScript, SQL, Java</li>
          <li><span className="dr-k">frontend</span> React, Next.js, Vite, SCSS</li>
          <li><span className="dr-k">backend</span> Node.js, NestJS, Flask</li>
          <li><span className="dr-k">ops</span> Docker, Nginx, PM2, Linux, GitHub Actions</li>
          <li><span className="dr-k">media</span> Premiere Pro, After Effects, FFmpeg, ExtendScript</li>
        </ul>
      </section>

      {/* Projects */}
      <section className="rc-card" id="projects">
        <h2 className="rc-h2"><span className="rc-h2-gloss">Projects</span></h2>
        <ul className="er-videos rsp-related">
          {PROJECTS.map((p, i) => (
            <li key={p.name} className="er-video dr-project">
              <a
                className="dr-row"
                href={p.link}
                target={p.link.startsWith('http') ? '_blank' : undefined}
                rel={p.link.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                <span className="dr-num">{String(i + 1).padStart(2, '0')}</span>
                <div className="er-video-body">
                  <h3 className="er-video-title">{p.name}</h3>
                  <p className="er-video-desc">{p.description}</p>
                  <div className="er-video-meta">
                    <span className="er-video-date">{p.stack}</span>
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Downloads — visually distinct from links */}
      <section className="rc-card">
        <h2 className="rc-h2"><span className="rc-h2-gloss">Free downloads</span></h2>
        <p className="dr-downloads-hint">After Effects tools. Free, no signup — click to download the .jsx file.</p>
        <ul className="dr-downloads">
          {DOWNLOADS.map((d) => (
            <li key={d.file} className="dr-download">
              <div className="er-video-body">
                <h3 className="er-video-title dr-dl-name">
                  <Link to={d.page}>{d.name}</Link>
                </h3>
                <p className="er-video-desc">{d.description}</p>
                <span className="er-video-date">{d.stack}</span>
              </div>
              <div className="dr-dl-side">
                <a className="dr-dl-btn" href={d.href} download>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  <span className="dr-dl-file" dir="ltr">{d.file}</span>
                  <span className="dr-dl-size">{d.size}</span>
                </a>
                <Link className="dr-dl-page" to={d.page}>tool page and install guide</Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Contact — same modal as the editor page */}
      <section className="rc-card" id="contact">
        <h2 className="rc-h2"><span className="rc-h2-gloss">Hire me</span></h2>
        <p className="er-video-desc" style={{ maxWidth: 560 }}>
          Full-stack development, DevOps, automation, or After Effects tooling.
          Same form as the editor profile — it reaches me on Telegram directly.
        </p>
        <div className="rsp-actions dr-contact-actions">
          <button type="button" className="rc-btn rc-btn-green" onClick={() => openInquiry({ url: '/dev', title: 'Programmer profile' })}>
            Request a service
          </button>
          <a className="rc-btn" href="https://wa.me/2001123994906">WhatsApp</a>
          <a className="rc-btn" href="mailto:ishoil@icloud.com">Email</a>
        </div>
      </section>
        </RetroChrome>
  )
}
