import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import './VideoSharePage.scss'
import './UpworkVideoPage.scss'
import VideoPlayer from './VideoPlayer'
import VideoStats from './VideoStats'
import videosData from '../../data/videos.json'
import { useLang } from '../i18n/LanguageContext'
import { pick } from '../i18n/data'
import { useQualifiedVideoView, useVideoAnalytics } from '../hooks/useAnalytics'
import MoreWork from './MoreWork'

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
  const video = videosData.find(item => item.slug === slug)
  const { stats, recordView, like, busyLike } = useVideoAnalytics(slug)
  const playerWrapRef = useRef(null)
  useQualifiedVideoView(playerWrapRef, recordView, 5, slug)

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
  const processSteps = isAr
    ? [
        ['01', 'فهم المحتوى', 'تحديد الفكرة الأساسية والجمهور وإيقاع المشاهدة المناسب.'],
        ['02', 'بناء المشاهد', 'تقسيم المعلومات إلى لقطات مترابطة وتسلسل بصري واضح.'],
        ['03', 'التنفيذ الحركي', 'تطبيق الحركة والكتابة والعناصر الداعمة بما يخدم السرد.'],
        ['04', 'التجهيز للنشر', 'مراجعة الإيقاع والوضوح وتجهيز التكوين للمنصات المطلوبة.'],
      ]
    : [
        ['01', 'Understand', 'Define the core idea, audience, and the right viewing pace.'],
        ['02', 'Structure', 'Break information into connected scenes and a clear visual sequence.'],
        ['03', 'Animate', 'Apply motion, typography, and supporting elements around the narrative.'],
        ['04', 'Deliver', 'Refine pacing and clarity, then prepare the composition for its platforms.'],
      ]
  const orientation = ratio === 'portrait'
    ? (isAr ? 'رأسي' : 'Portrait')
    : ratio === 'square' ? (isAr ? 'مربع' : 'Square') : (isAr ? 'أفقي' : 'Landscape')

  return (
    <div className="vsp upwork-vsp" key={slug}>
      <div className="vsp-inner upwork-vsp-inner">
        <header className="upwork-preview-head motion-surface">
          <div>
            <div className="upwork-preview-label">{isAr ? 'معاينة أعمال عبر Upwork' : 'Upwork Portfolio Preview'}</div>
            <div className="upwork-preview-author">{isAr ? 'إبراهيم شُعيل' : 'Ibrahim A. Soliman'}</div>
          </div>
          <div className="upwork-preview-note">{isAr ? 'للتواصل بخصوص المشروع، استخدم Upwork.' : 'For project inquiries, please use Upwork.'}</div>
        </header>

        <section className={`upwork-project-hero upwork-project-hero-${ratio}`}>
          <div className="upwork-project-copy">
            <span className="vsp-category">{pick(video.category, lang)}</span>
            <h1 className="vsp-title">{title}</h1>
            <p className="vsp-desc">{description}</p>
            {video.tags && (
              <div className="vsp-tags">
                {pick(video.tags, lang).map((tag, index) => <span key={index} className="vsp-tag">{tag}</span>)}
              </div>
            )}
            <VideoStats stats={stats} onLike={like} busyLike={busyLike} lang={lang} />
          </div>

          <div ref={playerWrapRef} className={`vsp-player-wrap vsp-player-wrap-${ratio}`}>
            <VideoPlayer src={video.src} poster={video.poster} ratio={ratio} />
          </div>
        </section>

        <section className="upwork-snapshot" aria-label={isAr ? 'ملخص المشروع' : 'Project snapshot'}>
          <div><small>{isAr ? 'الصيغة' : 'Format'}</small><strong>{orientation}</strong></div>
          <div><small>{isAr ? 'الأبعاد' : 'Dimensions'}</small><strong dir="ltr">{video.width} × {video.height}</strong></div>
          <div><small>{isAr ? 'المهارات' : 'Skills'}</small><strong>{pick(video.tags, lang).length}</strong></div>
          <div><small>{isAr ? 'الهدف' : 'Focus'}</small><strong>{isAr ? 'وضوح السرد' : 'Narrative clarity'}</strong></div>
        </section>

        <section className="upwork-process">
          <div className="upwork-section-heading">
            <span>{isAr ? 'منهجية العمل' : 'Workflow'}</span>
            <h2>{isAr ? 'من الفكرة إلى فيديو واضح' : 'From idea to a clear visual story'}</h2>
          </div>
          <div className="upwork-process-track">
            <span className="upwork-process-line"><i /></span>
            {processSteps.map(([number, heading, copy]) => (
              <article key={number}>
                <span className="upwork-process-number">{number}</span>
                <h3>{heading}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        {video.formats && (
          <section className="upwork-delivery motion-surface">
            <span>{isAr ? 'جاهزية التسليم' : 'Delivery readiness'}</span>
            <h2>{isAr ? 'تكوين قابل للتكييف مع المنصة' : 'A composition designed to adapt'}</h2>
            <p>{pick(video.formats, lang)}</p>
          </section>
        )}

        <MoreWork currentVideo={video} lang={lang} upwork />

        <footer className="upwork-preview-footer">
          {isAr ? 'هذه صفحة معاينة للأعمال فقط. يتم التواصل والتعاقد من خلال Upwork.' : 'This is a portfolio-only preview. Communication and contracting stay on Upwork.'}
        </footer>
      </div>
    </div>
  )
}
