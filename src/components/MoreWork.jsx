import { useNavigate } from 'react-router-dom'
import videosData from '../../data/videos.json'
import { STRINGS, t } from '../i18n/strings'
import { pick } from '../i18n/data'
import './MoreWork.scss'

function getRatio(video) {
  if (!video?.width || !video?.height) return 'landscape'
  const ratio = video.width / video.height
  if (ratio < 0.8) return 'portrait'
  if (ratio > 1.3) return 'landscape'
  return 'square'
}

function getRelatedVideos(currentVideo, lang, limit = 3) {
  const currentCategory = pick(currentVideo.category, 'en')
  const currentRatio = getRatio(currentVideo)

  return videosData
    .map((video, index) => {
      let score = 0
      if (video.contentLanguage === lang) score += 100
      if (pick(video.category, 'en') === currentCategory) score += 35
      if (video.collection && video.collection === currentVideo.collection) score += 24
      if (getRatio(video) === currentRatio) score += 8
      if (video.featured) score += 3
      return { video, index, score }
    })
    .filter(item => item.video.slug !== currentVideo.slug)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map(item => item.video)
}

export default function MoreWork({ currentVideo, lang, upwork = false }) {
  const navigate = useNavigate()
  const videos = getRelatedVideos(currentVideo, lang)
  const strings = STRINGS.vsp

  if (videos.length === 0) return null

  const openVideo = (slug) => {
    const prefix = upwork ? `/editor/${lang}/upwork` : `/editor/${lang}/v`
    navigate(`${prefix}/${slug}`)
  }

  return (
    <section className={`vsp-more${upwork ? ' upwork-more' : ''}`} aria-labelledby={`more-work-${upwork ? 'upwork' : 'portfolio'}`}>
      <div className="vsp-more-head">
        <div>
          <span className="vsp-more-eyebrow">{t(strings.moreWorkEyebrow, lang)}</span>
          <h3 id={`more-work-${upwork ? 'upwork' : 'portfolio'}`}>{t(strings.moreWork, lang)}</h3>
        </div>
        <p>{t(strings.moreWorkIntro, lang)}</p>
      </div>

      <div className="vsp-more-grid">
        {videos.map((video, index) => {
          const ratio = getRatio(video)
          const title = pick(video.title, lang)

          return (
            <button
              key={video.slug}
              type="button"
              className={`vsp-more-card vsp-more-card-${ratio} motion-surface`}
              onClick={() => openVideo(video.slug)}
              aria-label={`${t(strings.openProject, lang)}: ${title}`}
            >
              <span className="vsp-more-media">
                {video.poster ? (
                  <>
                    <img className="vsp-more-backdrop" src={video.poster} alt="" aria-hidden="true" loading="lazy" />
                    <img className="vsp-more-poster" src={video.poster} alt={title} loading="lazy" />
                  </>
                ) : (
                  <span className="vsp-more-thumb-empty" />
                )}
                <span className="vsp-more-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <span className="vsp-more-format">{t(strings[ratio], lang)}</span>
              </span>

              <span className="vsp-more-info">
                <span className="vsp-more-cat">{pick(video.category, lang)}</span>
                <span className="vsp-more-title">{title}</span>
                <span className="vsp-more-open">
                  {t(strings.openProject, lang)}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
