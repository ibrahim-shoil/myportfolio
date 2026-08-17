import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import './CollectionSharePage.scss'
import './RetroShare.scss'
import VideoPlayer from './VideoPlayer'
import RetroChrome from './RetroChrome'
import { getRelatedVideos } from './MoreWork'
import videosData from '../../data/videos.json'
import collectionsData from '../../data/collections.json'
import { pick } from '../i18n/data'
import { useInquiry } from '../hooks/useInquiry'

export default function CollectionSharePage() {
  const { slug } = useParams()
  const { openInquiry } = useInquiry()
  const collection = collectionsData.find(c => c.slug === slug)
  const [selection, setSelection] = useState({ slug, index: 0 })
  const [copied, setCopied] = useState(false)

  // Resolve video objects for the collection (filter out missing slugs)
  const videos = collection
    ? collection.videos
        .map(s => videosData.find(v => v.slug === s))
        .filter(Boolean)
    : []

  const activeIndex = selection.slug === slug ? selection.index : 0
  const activeVideo = videos[activeIndex]

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = collection ? `${pick(collection.title, 'en')} — Ibrahim A. Soliman` : 'Ibrahim A. Soliman'
    return () => { document.title = 'Ibrahim A. Soliman' }
  }, [collection])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* clipboard blocked */ }
  }

  const getRatio = (v) => {
    if (!v || !v.width || !v.height) return 'landscape'
    const r = v.width / v.height
    if (r < 0.8) return 'portrait'
    if (r > 1.3) return 'landscape'
    return 'square'
  }

  // 404
  if (!collection || videos.length === 0) {
    return (
      <RetroChrome active="series">
        <section className="rc-card rsp-404">
          <h2 className="rc-h2"><span className="rc-h2-gloss">Not found</span></h2>
          <p className="rsp-404-text">This series does not exist. The link may be old.</p>
          <Link className="rc-btn rc-btn-green" to="/editor/en#series">Back to the series</Link>
        </section>
      </RetroChrome>
    )
  }

  const related = getRelatedVideos(activeVideo, 'en', 3)

  return (
    <RetroChrome active="series">
      {/* Hidden Arabic for Arabic search (UI stays English) */}
      {collection.title?.ar && (
        <div className="sr-ar" lang="ar" dir="rtl" aria-hidden="true">
          <h2>{collection.title.ar}</h2>
          <p>{collection.description?.ar}</p>
        </div>
      )}

      {/* Player */}
      <section className="rc-card rsp-player-card">
        <h2 className="rc-h2">
          <span className="rc-h2-gloss">{pick(collection.title, 'en')}</span>
        </h2>
        <span className="rsp-part-badge">
          Part {activeIndex + 1} of {videos.length} — {pick(activeVideo.title, 'en')}
        </span>
        <div className={`vsp-player-wrap vsp-player-wrap-${getRatio(activeVideo)}`}>
          <VideoPlayer
            key={activeVideo.slug}
            src={activeVideo.src}
            poster={activeVideo.poster}
            ratio={getRatio(activeVideo)}
            autoPlay
          />
        </div>
      </section>

      {/* Playlist */}
      <section className="rc-card">
        <h2 className="rc-h2"><span className="rc-h2-gloss">In this series</span></h2>
        <p className="rsp-desc">{pick(collection.description, 'en')}</p>
        <ul className="rsp-playlist">
          {videos.map((v, i) => (
            <li key={v.slug} className={i === activeIndex ? 'rsp-playlist-active' : ''}>
              <a
                href="#top"
                onClick={e => { e.preventDefault(); setSelection({ slug, index: i }); window.scrollTo(0, 0) }}
              >
                <span className="rsp-playlist-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="rsp-playlist-thumb">
                  {v.poster && <img src={v.poster} alt={pick(v.title, 'en')} width={v.width} height={v.height} loading="lazy" />}
                </span>
                <span className="rsp-playlist-meta">
                  <strong>{pick(v.title, 'en')}</strong>
                  <span>{pick(v.category, 'en')}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="rsp-actions">
          <button type="button" className="rc-btn rc-btn-green" onClick={copyLink}>
            {copied ? 'Link copied' : 'Share series'}
          </button>
          <button
            type="button"
            className="rc-btn"
            onClick={() => openInquiry({ url: window.location.href, title: pick(collection.title, 'en') })}
          >
            Request a service
          </button>
        </div>
      </section>

      {/* Related work — same rows as the home page */}
      {related.length > 0 && (
        <section className="rc-card">
          <h2 className="rc-h2"><span className="rc-h2-gloss">More work</span></h2>
          <ul className="er-videos rsp-related">
            {related.map(v => (
              <li key={v.slug} className="er-video">
                <Link to={`/editor/en/v/${v.slug}`} className="er-video-thumb">
                  {v.poster
                    ? <img src={v.poster} alt={pick(v.title, 'en')} width={v.width} height={v.height} loading="lazy" />
                    : <span className="er-video-empty" aria-hidden="true" />}
                </Link>
                <div className="er-video-body">
                  <h3 className="er-video-title">
                    <Link to={`/editor/en/v/${v.slug}`}>{pick(v.title, 'en')}</Link>
                  </h3>
                  <p className="er-video-desc">{pick(v.description, 'en')}</p>
                  <div className="er-video-meta">
                    <span className="er-video-date">{pick(v.category, 'en')}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </RetroChrome>
  )
}
