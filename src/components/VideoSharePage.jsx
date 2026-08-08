import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import './VideoSharePage.scss'
import VideoPlayer from './VideoPlayer'
import VideoStats from './VideoStats'
import videosData from '../../data/videos.json'
import collectionsData from '../../data/collections.json'
import { useLang } from '../i18n/LanguageContext'
import { STRINGS, t } from '../i18n/strings'
import { pick } from '../i18n/data'
import { useInquiry } from '../hooks/useInquiry'
import { useQualifiedVideoView, useVideoAnalytics } from '../hooks/useAnalytics'

function IconShare() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
  )
}

function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
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
  const navigate = useNavigate()
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
    const siteName = lang === 'ar' ? 'إبراهيم شُعيل' : 'Ibrahim A. Soliman'
    document.title = video ? `${title} — ${siteName}` : siteName
    return () => { document.title = 'Ibrahim A. Soliman' }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video, lang])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      void e
    }
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
      <div className="vsp">
        <div className="vsp-inner">
          <h1 className="vsp-notfound">{t(STRINGS.share.videoNotFound, lang)}</h1>
          <p className="vsp-notfound-sub">{t(STRINGS.share.videoNotFoundSub, lang)}</p>
          <div className="vsp-ctas">
            <Link to={`/editor/${lang}`} className="vsp-btn vsp-btn-primary">{t(STRINGS.share.backToPortfolio, lang)}</Link>
          </div>
        </div>
      </div>
    )
  }

  const collection = video.collection ? collectionsData.find(c => c.slug === video.collection) : null
  const moreVideos = videosData.filter(v => v.slug !== slug).slice(0, 3)

  return (
    <div className="vsp">
      <div className="vsp-inner">
        <Link to={`/editor/${lang}`} className="vsp-back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="15 18 9 12 15 6"/></svg>
          {t(STRINGS.share.fullPortfolio, lang)}
        </Link>

        <div ref={playerWrapRef} className={`vsp-player-wrap vsp-player-wrap-${getRatio(video)}`}>
          <VideoPlayer src={video.src} poster={video.poster} ratio={getRatio(video)} autoPlay />
        </div>

        <div className="vsp-meta">
          <div className="vsp-meta-head">
            <span className="vsp-category">{pick(video.category, lang)}</span>
            <h1 className="vsp-title">{title}</h1>
          </div>
          <p className="vsp-desc">{description}</p>

          {video.tags && (
            <div className="vsp-tags">
              {pick(video.tags, lang).map((tag, i) => (
                <span key={i} className="vsp-tag">{tag}</span>
              ))}
            </div>
          )}

          {video.formats && (
            <p className="vsp-formats">
              <span className="vsp-formats-label">{t(STRINGS.vsp.formatsLabel, lang)}:</span>{' '}
              {pick(video.formats, lang)}
            </p>
          )}

          <VideoStats stats={stats} onLike={like} busyLike={busyLike} lang={lang} />

          <div className="vsp-ctas">
            <button className="vsp-btn vsp-btn-share" onClick={copyLink}>
              {copied ? <IconCheck /> : <IconShare />}
              {copied ? t(STRINGS.share.linkCopied, lang) : t(STRINGS.share.copyLink, lang)}
            </button>
            <button
              className="vsp-btn vsp-btn-hire"
              onClick={() => openInquiry({ url: window.location.href, title })}
            >
              {t(STRINGS.share.hireMe, lang)}
            </button>
            <a href="https://wa.me/2001123994906" target="_blank" rel="noopener noreferrer" className="vsp-btn vsp-btn-whatsapp">{t(STRINGS.share.whatsapp, lang)}</a>
          </div>

          {collection && (
            <Link to={`/editor/${lang}/c/${collection.slug}`} className="vsp-collection-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              {pick(collection.title, lang)}
            </Link>
          )}
        </div>

        {moreVideos.length > 0 && (
          <div className="vsp-more">
            <h3>{t(STRINGS.vsp.moreWork, lang)}</h3>
            <div className="vsp-more-grid">
              {moreVideos.map(v => (
                <button
                  key={v.slug}
                  className="vsp-more-card"
                  onClick={() => navigate(`/editor/${lang}/v/${v.slug}`)}
                >
                  {v.poster ? (
                    <img src={v.poster} alt={pick(v.title, lang)} loading="lazy" />
                  ) : (
                    <div className="vsp-more-thumb-empty" />
                  )}
                  <div className="vsp-more-info">
                    <span className="vsp-more-cat">{pick(v.category, lang)}</span>
                    <span className="vsp-more-title">{pick(v.title, lang)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
