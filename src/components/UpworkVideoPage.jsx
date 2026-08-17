import { useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import './VideoSharePage.scss'
import './RetroShare.scss'
import VideoPlayer from './VideoPlayer'
import VideoStats from './VideoStats'
import RetroChrome from './RetroChrome'
import { getRelatedVideos } from './MoreWork'
import videosData from '../../data/videos.json'
import { pick } from '../i18n/data'
import { useQualifiedVideoView, useVideoAnalytics } from '../hooks/useAnalytics'

function getRatio(video) {
  if (!video?.width || !video?.height) return 'landscape'
  const ratio = video.width / video.height
  if (ratio < 0.8) return 'portrait'
  if (ratio > 1.3) return 'landscape'
  return 'square'
}

/**
 * Upwork preview pages: the 2010 card system, but contact-free —
 * no hire buttons, no links back to the main site (communication stays
 * on Upwork). Chrome is used in `bare` mode.
 */
export default function UpworkVideoPage() {
  const { slug } = useParams()
  const video = videosData.find(item => item.slug === slug)
  const { stats, recordView, like, busyLike } = useVideoAnalytics(slug)
  const playerWrapRef = useRef(null)
  useQualifiedVideoView(playerWrapRef, recordView, 5, slug)

  const title = video ? pick(video.title, 'en') : ''
  const description = video ? pick(video.description, 'en') : ''

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = video ? `${title} — Upwork Portfolio Preview` : 'Project not found'
    return () => { document.title = 'Ibrahim A. Soliman' }
  }, [video, title])

  if (!video) {
    return (
      <RetroChrome bare>
        <section className="rc-card rsp-404">
          <h2 className="rc-h2"><span className="rc-h2-gloss">Not found</span></h2>
          <p className="rsp-404-text">This project does not exist. Please check the link in Upwork.</p>
        </section>
      </RetroChrome>
    )
  }

  const ratio = getRatio(video)
  const orientation = ratio === 'portrait' ? 'Portrait' : ratio === 'square' ? 'Square' : 'Landscape'
  const related = getRelatedVideos(video, 'en', 3).filter(v => v.slug !== video.slug)

  return (
    <RetroChrome bare>
      {/* Preview banner — no contact surfaces, per Upwork rules */}
      <section className="rc-card">
        <h2 className="rc-h2"><span className="rc-h2-gloss">Upwork Portfolio Preview</span></h2>
        <p className="rsp-desc">
          Work by <strong>Ibrahim A. Soliman</strong>. This is a portfolio-only
          preview — for project inquiries, please use Upwork.
        </p>
      </section>

      {/* Player */}
      <section className="rc-card rsp-player-card">
        <h2 className="rc-h2"><span className="rc-h2-gloss">Now playing</span></h2>
        <div ref={playerWrapRef} className={`vsp-player-wrap vsp-player-wrap-${ratio}`}>
          <VideoPlayer src={video.src} poster={video.poster} ratio={ratio} />
        </div>
      </section>

      {/* About */}
      <section className="rc-card">
        <h2 className="rc-h2"><span className="rc-h2-gloss">{title}</span></h2>
        <span className="rsp-cat">{pick(video.category, 'en')}</span>
        <p className="rsp-desc">{description}</p>

        {video.tags && (
          <p className="rsp-tagsline">{pick(video.tags, 'en').join(' · ')}</p>
        )}

        <VideoStats stats={stats} onLike={like} busyLike={busyLike} lang="en" />
      </section>

      {/* Snapshot — 2010 spec table */}
      <section className="rc-card">
        <h2 className="rc-h2"><span className="rc-h2-gloss">Project snapshot</span></h2>
        <table className="rsp-snapshot" cellSpacing={0}>
          <tbody>
            <tr><td className="rsp-snap-k">Format</td><td>{orientation}</td></tr>
            <tr><td className="rsp-snap-k">Dimensions</td><td dir="ltr">{video.width} × {video.height}</td></tr>
            <tr><td className="rsp-snap-k">Skills</td><td>{pick(video.tags, 'en').map(t => <span key={t} className="rsp-skill">{t}</span>)}</td></tr>
            <tr><td className="rsp-snap-k">Focus</td><td>Narrative clarity</td></tr>
            {video.formats && (
              <tr><td className="rsp-snap-k">Delivery</td><td>{pick(video.formats, 'en')}</td></tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Workflow — ordered notes instead of the old animated track */}
      <section className="rc-card">
        <h2 className="rc-h2"><span className="rc-h2-gloss">Workflow</span></h2>
        <ol className="rsp-case-steps rsp-workflow">
          <li><strong>Understand.</strong> Define the core idea, audience, and the right viewing pace.</li>
          <li><strong>Structure.</strong> Break information into connected scenes and a clear visual sequence.</li>
          <li><strong>Animate.</strong> Apply motion, typography, and supporting elements around the narrative.</li>
          <li><strong>Deliver.</strong> Refine pacing and clarity, then prepare the composition for its platforms.</li>
        </ol>
      </section>

      {/* Related work — stays inside the Upwork previews */}
      {related.length > 0 && (
        <section className="rc-card">
          <h2 className="rc-h2"><span className="rc-h2-gloss">More work</span></h2>
          <ul className="er-videos rsp-related">
            {related.map(v => (
              <li key={v.slug} className="er-video">
                <Link to={`/editor/en/upwork/${v.slug}`} className="er-video-thumb">
                  {v.poster
                    ? <img src={v.poster} alt={pick(v.title, 'en')} width={v.width} height={v.height} loading="lazy" />
                    : <span className="er-video-empty" aria-hidden="true" />}
                </Link>
                <div className="er-video-body">
                  <h3 className="er-video-title">
                    <Link to={`/editor/en/upwork/${v.slug}`}>{pick(v.title, 'en')}</Link>
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

      <p className="rsp-upwork-note">
        Portfolio-only preview. Communication and contracting stay on Upwork.
      </p>
    </RetroChrome>
  )
}
