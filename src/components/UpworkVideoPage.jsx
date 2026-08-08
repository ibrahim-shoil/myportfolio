import { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './VideoSharePage.scss'
import './UpworkVideoPage.scss'
import VideoPlayer from './VideoPlayer'
import VideoStats from './VideoStats'
import videosData from '../../data/videos.json'
import { useLang } from '../i18n/LanguageContext'
import { pick } from '../i18n/data'
import { useQualifiedVideoView, useVideoAnalytics } from '../hooks/useAnalytics'

function getRatio(video) {
  if (!video?.width || !video?.height) return 'landscape'
  const ratio = video.width / video.height
  if (ratio < 0.8) return 'portrait'
  if (ratio > 1.3) return 'landscape'
  return 'square'
}

export default function UpworkVideoPage() {
  const { slug } = useParams()
  const { lang } = useLang()
  const navigate = useNavigate()
  const video = videosData.find(item => item.slug === slug)
  const { stats, recordView, like, busyLike } = useVideoAnalytics(slug)
  const playerWrapRef = useRef(null)
  useQualifiedVideoView(playerWrapRef, recordView)

  const title = video ? pick(video.title, lang) : ''
  const description = video ? pick(video.description, lang) : ''
  const isAr = lang === 'ar'

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = video
      ? `${title} — ${isAr ? 'معاينة أعمال عبر Upwork' : 'Upwork Portfolio Preview'}`
      : (isAr ? 'المشروع غير موجود' : 'Project not found')
    return () => { document.title = 'Ibrahim A. Soliman' }
  }, [video, title, isAr])

  if (!video) {
    return (
      <div className="vsp upwork-vsp">
        <div className="vsp-inner upwork-vsp-inner">
          <div className="upwork-preview-label">{isAr ? 'معاينة أعمال عبر Upwork' : 'Upwork Portfolio Preview'}</div>
          <h1 className="vsp-notfound">{isAr ? 'المشروع غير موجود' : 'Project not found'}</h1>
          <p className="vsp-notfound-sub">{isAr ? 'تحقق من رابط المشروع داخل Upwork.' : 'Please check the project link in Upwork.'}</p>
        </div>
      </div>
    )
  }

  const ratio = getRatio(video)
  const moreVideos = videosData.filter(item => item.slug !== slug).slice(0, 3)

  return (
    <div className="vsp upwork-vsp">
      <div className="vsp-inner upwork-vsp-inner">
        <header className="upwork-preview-head">
          <div>
            <div className="upwork-preview-label">{isAr ? 'معاينة أعمال عبر Upwork' : 'Upwork Portfolio Preview'}</div>
            <div className="upwork-preview-author">Ibrahim A. Soliman</div>
          </div>
          <div className="upwork-preview-note">{isAr ? 'للتواصل بخصوص المشروع، استخدم Upwork.' : 'For project inquiries, please use Upwork.'}</div>
        </header>

        <div ref={playerWrapRef} className={`vsp-player-wrap vsp-player-wrap-${ratio}`}>
          <VideoPlayer src={video.src} poster={video.poster} ratio={ratio} autoPlay />
        </div>

        <div className="vsp-meta">
          <div className="vsp-meta-head">
            <span className="vsp-category">{pick(video.category, lang)}</span>
            <h1 className="vsp-title">{title}</h1>
          </div>

          <p className="vsp-desc">{description}</p>

          {video.tags && (
            <div className="vsp-tags">
              {pick(video.tags, lang).map((tag, index) => (
                <span key={index} className="vsp-tag">{tag}</span>
              ))}
            </div>
          )}

          {video.formats && (
            <p className="vsp-formats">
              <span className="vsp-formats-label">{isAr ? 'الصيغ' : 'Formats'}:</span>{' '}
              {pick(video.formats, lang)}
            </p>
          )}

          <VideoStats stats={stats} onLike={like} busyLike={busyLike} lang={lang} />
        </div>

        {moreVideos.length > 0 && (
          <section className="vsp-more upwork-more" aria-label={isAr ? 'أعمال إضافية' : 'More work'}>
            <h3>{isAr ? 'أعمال إضافية' : 'More work'}</h3>
            <div className="vsp-more-grid">
              {moreVideos.map(item => (
                <button
                  key={item.slug}
                  className="vsp-more-card"
                  onClick={() => navigate(`/editor/${lang}/upwork/${item.slug}`)}
                >
                  {item.poster ? (
                    <img src={item.poster} alt={pick(item.title, lang)} loading="lazy" />
                  ) : (
                    <div className="vsp-more-thumb-empty" />
                  )}
                  <div className="vsp-more-info">
                    <span className="vsp-more-cat">{pick(item.category, lang)}</span>
                    <span className="vsp-more-title">{pick(item.title, lang)}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        <footer className="upwork-preview-footer">
          {isAr ? 'هذه صفحة معاينة للأعمال فقط. يتم التواصل والتعاقد من خلال Upwork.' : 'This is a portfolio-only preview. Communication and contracting stay on Upwork.'}
        </footer>
      </div>
    </div>
  )
}
