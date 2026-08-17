import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import RetroChrome from './RetroChrome'
import VideoPlayer from './VideoPlayer'
import './EditorRetro.scss'
import videosData from '../../data/videos.json'
import collectionsData from '../../data/collections.json'
import galleryData from '../../data/gallery.json'
import { useInquiry } from '../hooks/useInquiry'
import { lockBodyScroll } from '../utils/scrollLock'
import { pick } from '../i18n/data'

function IconShare() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
  )
}

/**
 * The real editor home, fully rebuilt in the 2010 structure:
 * header tabs + hero/terminal + main column cards + sidebar + badges footer.
 */
export default function EditorRetro() {
  const { openInquiry } = useInquiry()
  const [copiedSlug, setCopiedSlug] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  useEffect(() => {
    document.title = 'ishoil // video editor & motion designer'
  }, [])

  const featured = videosData.find(v => v.featured) || videosData[0]
  const videos = videosData
  const series = collectionsData

  const getRatio = (v) => {
    if (!v?.width || !v?.height) return 'landscape'
    const r = v.width / v.height
    if (r < 0.8) return 'portrait'
    if (r > 1.3) return 'landscape'
    return 'square'
  }

  const share = useCallback(async (video) => {
    const url = `${window.location.origin}/editor/en/v/${video.slug}`
    try {
      if (navigator.share) {
        await navigator.share({ title: video.title.en, url })
        return
      }
    } catch { /* fall through to clipboard */ }
    try {
      await navigator.clipboard.writeText(url)
      setCopiedSlug(video.slug)
      setTimeout(() => setCopiedSlug(s => (s === video.slug ? null : s)), 2000)
    } catch { /* clipboard blocked */ }
  }, [])

  // Lightbox keyboard + shared scroll lock
  useEffect(() => {
    if (lightboxIndex === null) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setLightboxIndex(null)
      if (e.key === 'ArrowLeft') setLightboxIndex(i => (i === null ? null : (i - 1 + galleryData.length) % galleryData.length))
      if (e.key === 'ArrowRight') setLightboxIndex(i => (i === null ? null : (i + 1) % galleryData.length))
    }
    document.addEventListener('keydown', onKey)
    const unlock = lockBodyScroll()
    return () => {
      document.removeEventListener('keydown', onKey)
      unlock()
    }
  }, [lightboxIndex])

  return (
    <RetroChrome active="home">
      {/* Hidden Arabic index for Arabic search (UI stays English) */}
      <div className="sr-ar" lang="ar" dir="rtl" aria-hidden="true">
        {videos.map(v => <p key={`ar-${v.slug}`}>{v.title?.ar} — {v.description?.ar}</p>)}
      </div>

      {/* Hero + terminal */}
      <section className="er-hero er-hero-noterm">
        <div className="er-hero-text">
          <h1 className="er-h1">
            Ibrahim Soliman <span className="er-h1-sub">cuts stories for a living</span>
          </h1>
          <p className="er-tagline">
            Video editor and motion designer. Editorial motion, infographics,
            animated maps, and short-form that holds attention. Pick a clip below
            or hit hire me and tell me what you are making.
          </p>
          <div className="er-hero-actions">
            <a className="rc-btn rc-btn-green" href="#videos">Watch the work</a>
            <button type="button" className="rc-btn" onClick={() => openInquiry()}>Hire me</button>
          </div>
        </div>

      </section>

      <div className="er-columns">
        {/* Main column */}
        <div className="er-content">
          {/* Featured */}
          {featured && (
            <section className="rc-card" id="featured">
              <h2 className="rc-h2"><span className="rc-h2-gloss">Featured cut</span></h2>
              <div className="er-featured">
                <div className="er-featured-player">
                  <VideoPlayer
                    key={featured.slug}
                    src={featured.src}
                    poster={featured.poster}
                    ratio={getRatio(featured)}
                  />
                </div>
                <div className="er-featured-meta">
                  <span className="er-cat">{featured.category.en}</span>
                  <h3 className="er-featured-title">{featured.title.en}</h3>
                  <p className="er-featured-desc">{featured.description.en}</p>
                  <div className="er-row-actions">
                    <button type="button" className="rc-btn rc-btn-green" onClick={() => share(featured)}>
                      <IconShare /> {copiedSlug === featured.slug ? 'Link copied' : 'Share video'}
                    </button>
                    <Link className="rc-btn" to={`/editor/en/v/${featured.slug}`}>Open page</Link>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Videos list — 2010 blog-post rows */}
          <section className="rc-card" id="videos">
            <h2 className="rc-h2"><span className="rc-h2-gloss">My videos</span></h2>
            <ul className="er-videos">
              {videos.map(v => (
                <li key={v.slug} className="er-video">
                  <Link to={`/editor/en/v/${v.slug}`} className="er-video-thumb">
                    {v.poster
                      ? <img src={v.poster} alt={v.title.en} width={v.width} height={v.height} loading="lazy" />
                      : <span className="er-video-empty" aria-hidden="true" />}
                  </Link>
                  <div className="er-video-body">
                    <h3 className="er-video-title">
                      <Link to={`/editor/en/v/${v.slug}`}>{v.title.en}</Link>
                    </h3>
                    <p className="er-video-desc">{v.description.en}</p>
                    <div className="er-video-meta">
                      <span className="er-video-date">{v.category.en}</span>
                      <button type="button" className="er-video-share" onClick={() => share(v)}>
                        <IconShare /> {copiedSlug === v.slug ? 'copied' : 'share'}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Series */}
          <section className="rc-card" id="series">
            <h2 className="rc-h2"><span className="rc-h2-gloss">Series</span></h2>
            <ul className="er-series">
              {series.map(c => (
                <li key={c.slug}>
                  <Link to={`/editor/en/c/${c.slug}`}>
                    <strong>{c.title.en}</strong>
                    <span className="er-series-count">{c.videos.length} parts — {c.description.en}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Gallery */}
          <section className="rc-card" id="gallery">
            <h2 className="rc-h2"><span className="rc-h2-gloss">Gallery</span></h2>
            <div className="er-gallery">
              {galleryData.map((item, i) => (
                <button
                  key={item.src}
                  type="button"
                  className="er-gallery-item"
                  onClick={() => setLightboxIndex(i)}
                  aria-label={`View ${pick(item.title, 'en')}`}
                >
                  <img src={item.src} alt={pick(item.title, 'en')} width={item.width} height={item.height} loading="lazy" />
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="er-sidebar">
          <section className="rc-card" id="about">
            <h2 className="rc-h2"><span className="rc-h2-gloss">About me</span></h2>
            <div className="er-avatar-row">
              <span className="er-avatar">IS</span>
              <div>
                <p className="er-side-name">Ibrahim A. Soliman</p>
                <p className="er-side-loc">Cairo, Egypt</p>
                <p className="er-side-status"><span className="er-status-dot" /> available for work</p>
              </div>
            </div>
            <button type="button" className="rc-btn rc-btn-green er-side-btn" onClick={() => openInquiry()}>
              Request a service
            </button>
            <a className="rc-btn er-side-btn" href="https://wa.me/2001123994906">WhatsApp</a>
            <a className="rc-btn er-side-btn" href="mailto:ishoil@icloud.com">Email me</a>
          </section>

          <section className="rc-card">
            <h2 className="rc-h2"><span className="rc-h2-gloss">Tag Cloud</span></h2>
            <p className="er-cloud">
              <span className="er-c5">editing</span> <span className="er-c3">motion</span>{' '}
              <span className="er-c4">kinetic type</span> <span className="er-c2">maps</span>{' '}
              <span className="er-c5">premiere</span> <span className="er-c1">scripting</span>{' '}
              <span className="er-c3">infographics</span> <span className="er-c4">after effects</span>{' '}
              <span className="er-c2">reels</span> <span className="er-c3">ffmpeg</span>{' '}
              <span className="er-c1">thumbnails</span> <span className="er-c4">explainers</span>
            </p>
          </section>

          <section className="rc-card">
            <h2 className="rc-h2"><span className="rc-h2-gloss">Lifestream</span></h2>
            <ul className="er-stream">
              <li><span className="er-src">render</span> exported the new reel <span className="er-when">2h ago</span></li>
              <li><span className="er-src er-src-tw">twitter</span> Cut is done. Coffee is empty. <span className="er-when">5h ago</span></li>
              <li><span className="er-src">ae</span> 47 comps rendered overnight <span className="er-when">now</span></li>
              <li><span className="er-src">github</span> pushed SEO shells <span className="er-when">1d ago</span></li>
            </ul>
          </section>

          <section className="rc-card">
            <h2 className="rc-h2"><span className="rc-h2-gloss">Elsewhere</span></h2>
            <ul className="er-links">
              <li><a href="https://github.com/ibrahim-shoil" target="_blank" rel="noopener noreferrer">github.com/ibrahim-shoil</a></li>
              <li><a href="https://wa.me/2001123994906">WhatsApp</a></li>
              <li><Link to="/editor/en/v/pricing-perceived-value">latest video</Link></li>
              <li><Link to="/">about this site</Link></li>
            </ul>
          </section>
          <span id="contact" aria-hidden="true" />
        </aside>
      </div>

      {/* Gallery lightbox */}
      {lightboxIndex !== null && galleryData[lightboxIndex] && (
        <div className="er-lightbox" onClick={() => setLightboxIndex(null)}>
          <button type="button" className="er-lb-close" aria-label="Close" onClick={() => setLightboxIndex(null)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <button
            type="button"
            className="er-lb-nav er-lb-prev"
            aria-label="Previous"
            onClick={e => { e.stopPropagation(); setLightboxIndex(i => (i - 1 + galleryData.length) % galleryData.length) }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <figure className="er-lb-figure" onClick={e => e.stopPropagation()}>
            <img
              src={galleryData[lightboxIndex].src}
              alt={pick(galleryData[lightboxIndex].title, 'en')}
              width={galleryData[lightboxIndex].width}
              height={galleryData[lightboxIndex].height}
            />
            <figcaption>
              {pick(galleryData[lightboxIndex].title, 'en')}
              <span className="er-lb-count">{lightboxIndex + 1} / {galleryData.length}</span>
            </figcaption>
          </figure>
          <button
            type="button"
            className="er-lb-nav er-lb-next"
            aria-label="Next"
            onClick={e => { e.stopPropagation(); setLightboxIndex(i => (i + 1) % galleryData.length) }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      )}
    </RetroChrome>
  )
}
