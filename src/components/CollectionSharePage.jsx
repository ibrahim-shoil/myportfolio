import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import './CollectionSharePage.scss'
import VideoPlayer from './VideoPlayer'
import videosData from '../../data/videos.json'
import collectionsData from '../../data/collections.json'
import { useLang } from '../i18n/LanguageContext'
import { STRINGS, t } from '../i18n/strings'
import { pick } from '../i18n/data'
import { useInquiry } from '../hooks/useInquiry'
import MoreWork from './MoreWork'

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
function IconList() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
  )
}

function setPageTitle(title) {
  document.title = title
}

export default function CollectionSharePage() {
  const { slug } = useParams()
  const { lang } = useLang()
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
    const siteName = lang === 'ar' ? 'إبراهيم شعيل' : 'Ibrahim A. Soliman'
    setPageTitle(collection ? `${pick(collection.title, lang)} — ${siteName}` : siteName)
    return () => setPageTitle('Ibrahim A. Soliman')
  }, [collection, lang])

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

  // 404
  if (!collection || videos.length === 0) {
    return (
      <div className="csp">
        <div className="csp-inner">
          <h1 className="csp-notfound">{t(STRINGS.share.collectionNotFound, lang)}</h1>
          <p className="csp-notfound-sub">{t(STRINGS.share.collectionNotFoundSub, lang)}</p>
          <div className="csp-ctas">
            <Link to={`/editor/${lang}`} className="csp-btn csp-btn-primary">{t(STRINGS.share.backToPortfolio, lang)}</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="csp">
      <div className="csp-inner">
        <Link to={`/editor/${lang}`} className="csp-back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="15 18 9 12 15 6"/></svg>
          {t(STRINGS.share.fullPortfolio, lang)}
        </Link>

        {/* Collection header */}
        <div className="csp-header motion-surface">
          <span className="csp-series-badge">
            <IconList />
            {t(STRINGS.csp.seriesBadge, lang)} · {videos.length} {t(STRINGS.series.videosCount, lang)}
          </span>
          <h1 className="csp-title">{pick(collection.title, lang)}</h1>
          <p className="csp-desc">{pick(collection.description, lang)}</p>
        </div>

        {/* Player + playlist sidebar */}
        <div className={`csp-layout ${getRatio(activeVideo) === 'portrait' ? 'csp-layout-portrait' : ''}`}>
          <div className="csp-player-side">
            <div className={`csp-player-wrap csp-player-wrap-${getRatio(activeVideo)}`}>
              <VideoPlayer
                key={activeVideo.slug}
                src={activeVideo.src}
                poster={activeVideo.poster}
                ratio={getRatio(activeVideo)}
                autoPlay
              />
            </div>
            <div className="csp-active-meta">
              <span className="csp-part-label">{t(STRINGS.csp.partOf, lang)} {activeIndex + 1} {t(STRINGS.csp.of, lang)} {videos.length}</span>
              <h2>{pick(activeVideo.title, lang)}</h2>
              {pick(activeVideo.description, lang) && <p>{pick(activeVideo.description, lang)}</p>}
            </div>
          </div>

          {/* Playlist */}
          <aside className="csp-playlist">
            <div className="csp-playlist-head">
              <span className="csp-playlist-title">
                <IconList />
                {t(STRINGS.csp.inThisSeries, lang)}
              </span>
            </div>
            <ol className="csp-playlist-list">
              {videos.map((v, i) => (
                <li key={v.slug}>
                  <button
                    className={`csp-playlist-item motion-surface ${i === activeIndex ? 'active' : ''}`}
                    onClick={() => setSelection({ slug, index: i })}
                  >
                    <span className="csp-playlist-index">{i + 1}</span>
                    <div className="csp-playlist-thumb">
                      {v.poster ? (
                        <img src={v.poster} alt={pick(v.title, lang)} loading="lazy" />
                      ) : (
                        <div className="csp-playlist-thumb-empty" />
                      )}
                      {i === activeIndex && (
                        <span className="csp-playlist-playing">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                        </span>
                      )}
                    </div>
                    <div className="csp-playlist-info">
                      <span className="csp-playlist-name">{pick(v.title, lang)}</span>
                      {pick(v.category, lang) && <span className="csp-playlist-cat">{pick(v.category, lang)}</span>}
                    </div>
                  </button>
                </li>
              ))}
            </ol>
          </aside>
        </div>

        {/* CTAs */}
        <div className="csp-actions">
          <button className="csp-btn csp-btn-share" onClick={copyLink}>
            {copied ? <IconCheck /> : <IconShare />}
            {copied ? t(STRINGS.share.linkCopied, lang) : t(STRINGS.share.copySeriesLink, lang)}
          </button>
          <button
            className="csp-btn csp-btn-hire"
            onClick={() => openInquiry({ url: window.location.href, title: pick(collection.title, lang) })}
          >
            {t(STRINGS.share.hireMe, lang)}
          </button>
          <a href="https://wa.me/2001123994906" target="_blank" rel="noopener noreferrer" className="csp-btn csp-btn-whatsapp">{t(STRINGS.share.whatsapp, lang)}</a>
        </div>

        <MoreWork currentVideo={activeVideo} lang={lang} />
      </div>
    </div>
  )
}
