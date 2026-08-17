import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import './VideoSharePage.scss'
import './RetroShare.scss'
import VideoPlayer from './VideoPlayer'
import VideoStats from './VideoStats'
import RetroChrome from './RetroChrome'
import { getRelatedVideos } from './MoreWork'
import videosData from '../../data/videos.json'
import collectionsData from '../../data/collections.json'
import { useLang } from '../i18n/LanguageContext'
import { STRINGS, t } from '../i18n/strings'
import { pick } from '../i18n/data'
import { useInquiry } from '../hooks/useInquiry'
import { useQualifiedVideoView, useVideoAnalytics } from '../hooks/useAnalytics'

function IconShare() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
  )
}

// Build a lookup: video slug → collection it belongs to (if any)
const videoCollection = {}
collectionsData.forEach(c => {
  c.videos.forEach(slug => { videoCollection[slug] = c })
})

export default function VideoSharePage() {
  const { slug } = useParams()
  const { lang } = useLang()
  const { openInquiry } = useInquiry()
  const video = videosData.find(v => v.slug === slug)
  const [copied, setCopied] = useState(false)
  const playerWrapRef = useRef(null)
  const { stats, recordView, like, busyLike } = useVideoAnalytics(slug)
  useQualifiedVideoView(playerWrapRef, recordView, 5, slug)

  const title = video ? pick(video.title, lang) : ''
  const description = video ? pick(video.description, lang) : ''

  useEffect(() => {
    window.scrollTo(0, 0)
    const siteName = 'Ibrahim A. Soliman'
    document.title = video ? `${title} — ${siteName}` : siteName
    return () => { document.title = 'Ibrahim A. Soliman' }
  }, [video, lang, title])

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

  // 404 for unknown slug
  if (!video) {
    return (
      <RetroChrome active="videos">
        <section className="rc-card rsp-404">
          <h2 className="rc-h2"><span className="rc-h2-gloss">Not found</span></h2>
          <p className="rsp-404-text">This video does not exist. The link may be old.</p>
          <Link className="rc-btn rc-btn-green" to="/editor/en">Back to the videos</Link>
        </section>
      </RetroChrome>
    )
  }

  const collection = video.collection ? collectionsData.find(c => c.slug === video.collection) : null
  const related = getRelatedVideos(video, lang, 3)

  return (
    <RetroChrome active="videos">
      {/* Hidden Arabic for Arabic search (UI stays English) */}
      {video.title?.ar && (
        <div className="sr-ar" lang="ar" dir="rtl" aria-hidden="true">
          <h2>{video.title.ar}</h2>
          <p>{video.description?.ar}</p>
        </div>
      )}

      {/* Player */}
      <section className="rc-card rsp-player-card">
        <h2 className="rc-h2"><span className="rc-h2-gloss">Now playing</span></h2>
        <div ref={playerWrapRef} className={`vsp-player-wrap vsp-player-wrap-${getRatio(video)}`}>
          <VideoPlayer src={video.src} poster={video.poster} ratio={getRatio(video)} autoPlay />
        </div>
      </section>

      {/* About this cut */}
      <section className="rc-card">
        <h2 className="rc-h2"><span className="rc-h2-gloss">{title}</span></h2>
        <span className="rsp-cat">{pick(video.category, lang)}</span>
        <p className="rsp-desc">{description}</p>

        {video.tags && (
          <p className="rsp-tagsline">{pick(video.tags, lang).join(' · ')}</p>
        )}

        {video.formats && (
          <p className="rsp-tagsline rsp-formats-line">
            <span className="rsp-fmt-label">Formats:</span> {pick(video.formats, lang)}
          </p>
        )}

        <VideoStats stats={stats} onLike={like} busyLike={busyLike} lang={lang} />

        <div className="rsp-actions">
          <button type="button" className="rc-btn rc-btn-green" onClick={copyLink}>
            <IconShare /> {copied ? 'Link copied' : 'Share video'}
          </button>
          <button
            type="button"
            className="rc-btn"
            onClick={() => openInquiry({ url: window.location.href, title })}
          >
            Request a service
          </button>
          <a href="https://wa.me/2001123994906" target="_blank" rel="noopener noreferrer" className="rc-btn">WhatsApp</a>
        </div>

        {collection && (
          <Link to={`/editor/en/c/${collection.slug}`} className="rsp-series-link">
            Part of the series: {pick(collection.title, lang)}
          </Link>
        )}
      </section>

      {/* Case study */}
      {video.caseStudy && (
        <section className="rc-card">
          <h2 className="rc-h2"><span className="rc-h2-gloss">Case study</span></h2>
          <dl className="rsp-case">
            <dt>The goal</dt>
            <dd>{pick(video.caseStudy.goal, lang)}</dd>
            <dt>The approach</dt>
            <dd>
              <ol className="rsp-case-steps">
                {video.caseStudy.approach.map((step, i) => <li key={i}>{pick(step, lang)}</li>)}
              </ol>
            </dd>
            <dt>Tools</dt>
            <dd className="rsp-case-tools">{video.caseStudy.tools.join(' · ')}</dd>
            <dt>The outcome</dt>
            <dd>{pick(video.caseStudy.outcome, lang)}</dd>
          </dl>
        </section>
      )}

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
