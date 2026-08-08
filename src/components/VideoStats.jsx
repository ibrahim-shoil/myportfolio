import './VideoStats.scss'

function formatCount(value) {
  const count = Number(value || 0)
  if (count < 1000) return String(count)
  if (count < 1_000_000) return `${(count / 1000).toFixed(count >= 10_000 ? 0 : 1)}K`
  return `${(count / 1_000_000).toFixed(count >= 10_000_000 ? 0 : 1)}M`
}

export default function VideoStats({ stats, onLike, busyLike = false, lang = 'en' }) {
  if (!stats) return null

  const isAr = lang === 'ar'
  const liked = Boolean(stats.liked)

  return (
    <div className="video-stats" aria-label={isAr ? 'إحصاءات الفيديو' : 'Video statistics'}>
      <span className="video-stat" title={isAr ? 'المشاهدات' : 'Views'}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.7"/></svg>
        <span>{formatCount(stats.views)}</span>
        <span className="video-stat-label">{isAr ? 'مشاهدة' : 'views'}</span>
      </span>

      <button
        type="button"
        className={`video-stat video-stat-like ${liked ? 'is-liked' : ''}`}
        onClick={onLike}
        disabled={liked || busyLike}
        aria-pressed={liked}
        title={liked ? (isAr ? 'تم تسجيل إعجابك' : 'You already liked this') : (isAr ? 'إعجاب' : 'Like')}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21.3l7.8-7.8 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></svg>
        <span>{formatCount(stats.likes)}</span>
        <span className="video-stat-label">{isAr ? 'إعجاب' : 'likes'}</span>
      </button>
    </div>
  )
}
