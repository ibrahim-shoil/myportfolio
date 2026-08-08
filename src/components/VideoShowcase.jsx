import { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './VideoShowcase.scss'
import useScrollReveal from '../hooks/useScrollReveal'
import VideoPlayer from './VideoPlayer'
import videosData from '../../data/videos.json'
import collectionsData from '../../data/collections.json'
import { useLang } from '../i18n/LanguageContext'
import { STRINGS, t } from '../i18n/strings'
import { pick } from '../i18n/data'

// Build a lookup: video slug → collection it belongs to (if any)
const videoCollection = {}
collectionsData.forEach(c => {
  c.videos.forEach(slug => { videoCollection[slug] = c })
})

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

export default function VideoShowcase() {
  const { lang } = useLang()
  const ref = useScrollReveal()
  const navigate = useNavigate()
  const [featuredSlug, setFeaturedSlug] = useState(
    videosData.find(v => v.featured)?.slug || videosData[0]?.slug
  )
  const [copiedSlug, setCopiedSlug] = useState(null)

  const featured = useMemo(
    () => videosData.find(v => v.slug === featuredSlug) || videosData[0],
    [featuredSlug]
  )

  const getRatio = (v) => {
    if (!v || !v.width || !v.height) return 'landscape'
    const r = v.width / v.height
    if (r < 0.8) return 'portrait'
    if (r > 1.3) return 'landscape'
    return 'square'
  }

  // If every video is portrait/square, render as a vertical reels grid
  const allPortrait = videosData.length > 0 && videosData.every(v => getRatio(v) !== 'landscape')

  const shareUrl = (video) => `${window.location.origin}/editor/${lang}/v/${video.slug}`
  const collectionUrl = (slug) => `/editor/${lang}/c/${slug}`

  const handleShare = async (video) => {
    const url = shareUrl(video)
    const title = pick(video.title, lang)
    try {
      if (navigator.share) {
        await navigator.share({ title, url })
        return
      }
    } catch (e) {
      void e // fall through to clipboard
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopiedSlug(video.slug)
      setTimeout(() => setCopiedSlug(c => (c === video.slug ? null : c)), 2000)
    } catch (e) {
      void e // clipboard blocked
    }
  }

  return (
    <section id="videos" className="videos">
      <div className="videos-container" ref={ref}>
        <span className="section-eyebrow reveal-on-scroll">{t(STRINGS.videos.eyebrow, lang)}</span>
        <h2 className="section-title reveal-on-scroll">{t(STRINGS.videos.title, lang)}</h2>
        <p className="videos-intro reveal-on-scroll">
          {t(STRINGS.videos.intro, lang)}
        </p>

        {featured && (
          <div className={`videos-featured reveal-on-scroll ${allPortrait ? 'videos-featured-reels' : ''}`}>
            <div className="videos-featured-player">
              <VideoPlayer
                key={featured.slug}
                src={featured.src}
                poster={featured.poster}
                ratio={getRatio(featured)}
              />
            </div>
            <div className="videos-featured-meta">
              <div className="videos-featured-head">
                <span className="videos-category">{pick(featured.category, lang)}</span>
                <h3>{pick(featured.title, lang)}</h3>
              </div>
              <p>{pick(featured.description, lang)}</p>
              <button
                className="videos-share-btn"
                onClick={() => handleShare(featured)}
              >
                {copiedSlug === featured.slug ? <IconCheck /> : <IconShare />}
                {copiedSlug === featured.slug ? t(STRINGS.videos.linkCopied, lang) : t(STRINGS.videos.shareVideo, lang)}
              </button>
            </div>
          </div>
        )}

        <div className={allPortrait ? 'videos-grid videos-grid-reels' : 'videos-grid'}>
          {videosData.map((video, i) => (
            <div
              key={video.slug}
              className={`video-card reveal-on-scroll ${video.slug === featuredSlug ? 'active' : ''} ${getRatio(video) === 'portrait' ? 'video-card-portrait' : ''}`}
              style={{ '--reveal-delay': `${i * 80}ms` }}
            >
              <button
                className={`video-card-thumb ${getRatio(video) === 'portrait' ? 'video-card-thumb-portrait' : ''}`}
                onClick={() => navigate(`/editor/${lang}/v/${video.slug}`)}
                aria-label={`Play ${pick(video.title, lang)}`}
              >
                {video.poster ? (
                  <img src={video.poster} alt={pick(video.title, lang)} loading="lazy" />
                ) : (
                  <div className="video-card-thumb-empty">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                )}
                <span className="video-card-play" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M8 5v14l11-7z"/></svg>
                </span>
                {video.featured && <span className="video-card-badge">{t(STRINGS.videos.featured, lang)}</span>}
              </button>

              <div className="video-card-body">
                <span className="videos-category videos-category-sm">{pick(video.category, lang)}</span>
                <h4>{pick(video.title, lang)}</h4>
                <p>{pick(video.description, lang)}</p>
                {videoCollection[video.slug] && (
                  <Link
                    to={collectionUrl(videoCollection[video.slug].slug)}
                    className="video-card-series"
                    onClick={e => e.stopPropagation()}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                    {t(STRINGS.videos.partOfSeries, lang)}
                  </Link>
                )}
                <div className="video-card-actions">
                  <button
                    className="video-card-share"
                    onClick={() => handleShare(video)}
                  >
                    {copiedSlug === video.slug ? <IconCheck /> : <IconShare />}
                    {copiedSlug === video.slug ? t(STRINGS.videos.linkCopied, lang) : t(STRINGS.videos.shareVideo, lang)}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
