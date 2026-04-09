import { useState, useEffect, useRef, useCallback } from 'react'
import './Projects.scss'
import useScrollReveal from '../hooks/useScrollReveal'

const IconExternalLink = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
)
const IconDownload = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
)

const PROJECTS = [
  {
    slug: 'tecbamin',
    name: 'Tecbamin',
    description: 'Arabic tech content platform with articles, phone database, and auto-scraping pipelines.',
    longDescription: 'Comprehensive Arabic tech platform featuring content aggregation, phone specifications database, automated article publishing, and SEO optimization.',
    problem: 'Managing Arabic tech content with real-time data from multiple sources',
    solution: 'Built Flask-based platform with automated scraping pipelines, MySQL database, and Redis caching',
    stack: ['Python', 'Flask', 'MySQL', 'Redis', 'SQLAlchemy', 'Gunicorn'],
    architecture: 'Flask backend with SQLAlchemy ORM. MySQL for database. Redis for caching and rate limiting. Automated scrapers for content ingestion. SEO optimization with structured data. Arabic content with RTL support.',
    link: 'https://tecbamin.com',
    featured: true
  },
  {
    slug: 'playcredits',
    name: 'PlayCredits',
    description: 'Game credits marketplace with bilingual support, payment integration, and admin panel.',
    longDescription: 'Modern marketplace for game credits with full Arabic/English support, Stripe integration, email notifications, and comprehensive admin dashboard.',
    problem: 'Secure digital credits distribution with fraud prevention and real-time tracking',
    solution: 'Developed full-stack marketplace with NestJS backend, Next.js frontend, and payment processing',
    stack: ['Next.js 14', 'NestJS', 'TypeScript', 'PostgreSQL', 'Prisma', 'Redis', 'Stripe'],
    architecture: 'Next.js App Router with TypeScript frontend. NestJS backend with Prisma ORM. PostgreSQL for data persistence. Redis for caching. Stripe for payments. Resend for emails.',
    link: 'https://www.playcredits.store/en',
    featured: true
  },
  {
    slug: 'airbamin',
    name: 'Airbamin',
    description: 'Cross-platform file transfer: iPhone/Android to Windows with 70MB/s speeds. Working on iOS support and screen mirroring.',
    longDescription: 'Cross-platform file transfer application enabling direct mobile-to-PC file sharing without cloud storage. Published on Windows Store with 70MB/s transfer speeds.',
    problem: 'File transfer from iPhone/Android to Windows for 4K video editing was slow and consumed internet. Needed a fast, free, and private solution.',
    solution: 'Built cross-platform app using P2P technology. Enable mobile hotspot, connect PC, transfer files directly at 70MB/s. No internet, no cloud, 100% private.',
    stack: ['Java', 'JavaFX', 'P2P', 'HTTP Server', 'Hotspot Transfer', 'Windows Store', 'Android', 'iOS'],
    architecture: 'Java desktop app using JavaFX for UI. HTTP server for file serving. Direct P2P connection via mobile hotspot to PC. Supports iPhone and Android to Windows. Currently developing Android to iOS transfers and screen mirroring features.',
    link: 'https://tecbamin.com/airbamin',
    featured: true
  },
  {
    slug: 'ishoil',
    name: 'ishoil.me',
    description: 'Personal portfolio with terminal interface and modern design.',
    longDescription: 'Professional portfolio website showcasing full-stack projects with both traditional navigation and interactive terminal interface.',
    problem: 'Portfolio site that demonstrates full-stack engineering capability without typical template aesthetics',
    solution: 'Built React portfolio with SCSS theming, dual navigation modes, and responsive design',
    stack: ['React', 'Vite', 'SCSS', 'Nginx'],
    architecture: 'React SPA with Vite build system. SCSS for styling with light/dark themes. Component-based architecture. Progressive enhancement for accessibility.',
    link: '#bruh',
    featured: false
  },
  {
    slug: 'rtl-toggle',
    name: 'RTL Toggle',
    description: 'Chrome extension adding a floating button to toggle text direction between RTL/LTR on any website.',
    longDescription: 'A Chrome extension that adds a floating button to any website, allowing users to toggle the page text direction between RTL (Right-to-Left) and LTR (Left-to-Right) with one click. Works on all sites including ChatGPT and Gemini.',
    problem: 'Many websites with hardcoded dir attributes make it difficult for users who need RTL text direction. No easy way to toggle direction on popular sites.',
    solution: 'Built Chrome extension using Manifest V3 with MutationObserver to override hardcoded dir attributes. Stores preference per website using chrome.storage API.',
    stack: ['JavaScript', 'CSS', 'Chrome Extension Manifest V3', 'chrome.storage API', 'MutationObserver'],
    architecture: 'Chrome Extension Manifest V3 architecture. Content script injected into all pages. Floating button UI with CSS. MutationObserver watches for DOM changes and overrides dir attributes. chrome.storage.local saves preferences per domain. No external dependencies or tracking.',
    link: 'https://chromewebstore.google.com/detail/fekmelecjjbpkifkecoeffilfnaljlkj?utm_source=item-share-cb',
    featured: false
  },
  {
    slug: 'captionflow',
    name: 'CaptionFlow',
    featured: true,
    description: 'An After Effects ScriptUI panel that imports SRT subtitle files and creates text layers automatically — one per sentence or one per word.',
    problem: 'Manually placing subtitle text layers in After Effects is tedious and error-prone, especially for long videos with dozens of caption blocks.',
    solution: 'CaptionFlow reads any standard SRT file and places every caption as a properly timed text layer in the active composition. It supports sentence mode (one layer per subtitle block) and word-by-word mode (one layer per word with proportional timing). A built-in Caption Editor lets you browse, edit text, and adjust timing of existing layers without leaving After Effects.',
    stack: ['After Effects', 'ExtendScript', 'ScriptUI', 'SRT'],
    download: 'https://ishoil.me/downloads/AutoCaptions.jsx',
  },
  {
    slug: 'textburst',
    name: 'Text Burst',
    featured: false,
    description: 'An After Effects ScriptUI panel that splits a single text layer into separate layers — one per character, word, or line — while preserving position and supporting Arabic RTL text.',
    problem: 'Animating individual words or characters in After Effects requires manually duplicating and trimming text layers, which is repetitive and slow — especially with Arabic or mixed-direction text.',
    solution: 'Text Burst automates the split in one click. It offers two modes: Expressions mode hides the other words using an AE text animator expression, keeping the full sentence shape and exact position; No-Expressions mode gives each layer tight bounds matching only its own word, with an approximate position calculation. Both modes correctly handle right-to-left (Arabic/Hebrew) text. The panel is fully bilingual (English / Arabic) with a live language toggle.',
    stack: ['After Effects', 'ExtendScript', 'ScriptUI', 'RTL'],
    download: 'https://ishoil.me/downloads/TextBurst.jsx',
  }
]

const FEATURED = PROJECTS.filter(p => p.featured)

export default function Projects() {
  const [downloadCounts, setDownloadCounts] = useState({})
  const [spotlightIndex, setSpotlightIndex] = useState(0)
  const [expandedSlug, setExpandedSlug] = useState(null)
  const gridRef = useScrollReveal()
  const touchStartX = useRef(null)
  const touchStartY = useRef(null)

  const toggleExpand = (slug) => {
    setExpandedSlug(prev => prev === slug ? null : slug)
  }

  const isExpanded = (slug) => expandedSlug === slug

  const goToSlide = useCallback((index) => {
    setSpotlightIndex((index + FEATURED.length) % FEATURED.length)
  }, [])

  useEffect(() => {
    fetch('/api/downloads')
      .then(res => res.json())
      .then(data => setDownloadCounts(data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (FEATURED.length <= 1) return
    const timer = setInterval(() => {
      setSpotlightIndex(prev => (prev + 1) % FEATURED.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const handleDownload = async (project) => {
    const fileName = project.download.split('/').pop()
    try {
      const res = await fetch(`/api/downloads/${encodeURIComponent(fileName)}`, { method: 'POST' })
      const data = await res.json()
      if (data.counts) setDownloadCounts(prev => ({ ...prev, ...data.counts }))
    } catch {}
    window.open(project.download, '_blank')
  }

  return (
    <section id="projects" className="projects">
      <div className="projects-container" ref={gridRef}>
        <h2 className="section-title reveal-on-scroll">Projects</h2>

        {FEATURED.length > 0 && (
          <div
            className="spotlight reveal-on-scroll"
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0].clientX
              touchStartY.current = e.touches[0].clientY
            }}
            onTouchEnd={(e) => {
              if (touchStartX.current === null) return
              const deltaX = touchStartX.current - e.changedTouches[0].clientX
              const deltaY = touchStartY.current - e.changedTouches[0].clientY
              if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 0) goToSlide(spotlightIndex + 1)
                else goToSlide(spotlightIndex - 1)
              }
              touchStartX.current = null
              touchStartY.current = null
            }}
          >
            <div className="spotlight-row">
              {FEATURED.length > 1 && (
                <button
                  className="spotlight-arrow spotlight-arrow-prev"
                  onClick={() => goToSlide(spotlightIndex - 1)}
                  aria-label="Previous project"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
              )}
              <div className="spotlight-content">
                <span className="spotlight-label">Featured Project</span>
                <h3>{FEATURED[spotlightIndex].name}</h3>
                <p>{FEATURED[spotlightIndex].description}</p>
                <div className="spotlight-links">
                  {FEATURED[spotlightIndex].link && (
                    <a href={FEATURED[spotlightIndex].link} target="_blank" rel="noopener noreferrer" className="spotlight-link">
                      <IconExternalLink /> Explore
                    </a>
                  )}
                  {FEATURED[spotlightIndex].download && (
                    <button onClick={() => handleDownload(FEATURED[spotlightIndex])} className="spotlight-link">
                      <IconDownload /> Download
                    </button>
                  )}
                </div>
              </div>
              {FEATURED.length > 1 && (
                <button
                  className="spotlight-arrow spotlight-arrow-next"
                  onClick={() => goToSlide(spotlightIndex + 1)}
                  aria-label="Next project"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              )}
            </div>
            {FEATURED.length > 1 && (
              <div className="spotlight-dots">
                {FEATURED.map((_, i) => (
                  <button
                    key={i}
                    className={`spotlight-dot ${i === spotlightIndex ? 'active' : ''}`}
                    onClick={() => goToSlide(i)}
                    aria-label={`Go to project ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="projects-grid">
          {PROJECTS.map((project, index) => {
            const fileName = project.download?.split('/').pop()
            const count = fileName ? downloadCounts[fileName] : null

            return (
              <div
                key={project.slug}
                className={`project-card reveal-on-scroll ${project.featured ? 'featured' : ''}`}
                style={{ '--reveal-delay': `${index * 100}ms` }}
              >
                <div className="project-header">
                  <h3 className="project-name">{project.name}</h3>
                  {project.featured && <span className="project-badge">Featured</span>}
                </div>
                <p className="project-description">{project.description}</p>
                {isExpanded(project.slug) && (
                  <div className="project-details">
                    <div className="project-section">
                      <h4>Problem</h4>
                      <p>{project.problem}</p>
                    </div>
                    <div className="project-section">
                      <h4>Solution</h4>
                      <p>{project.solution}</p>
                    </div>
                    <div className="project-section">
                      <h4>Tech Stack</h4>
                      <div className="tech-stack">
                        {project.stack.map(tech => (
                          <span key={tech} className="tech-tag">{tech}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div className="project-actions">
                  <button onClick={() => toggleExpand(project.slug)} className="project-btn project-btn-toggle">
                    {isExpanded(project.slug) ? 'Show less' : 'Show more'}
                  </button>
                  {project.link && project.link === '#bruh' && (
                    <button onClick={() => new Audio('/Bruh.mp3').play()} className="project-btn">
                      <IconExternalLink /> Visit
                    </button>
                  )}
                  {project.link && project.link !== '#bruh' && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-btn">
                      <IconExternalLink /> Visit
                    </a>
                  )}
                  {project.download && (
                    <button onClick={() => handleDownload(project)} className="project-btn project-btn-download">
                      <IconDownload /> Download
                    </button>
                  )}
                  {count != null && count > 0 && (
                    <span className="download-badge"><IconDownload /> {count}</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
