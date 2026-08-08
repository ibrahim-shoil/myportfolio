import { useState, useEffect, useRef, useCallback } from 'react'
import './VideoPlayer.scss'
import { useLang } from '../i18n/LanguageContext'

const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2]

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

/** Does this environment support native iOS video fullscreen (iPhone)? */
function supportsNativeVideoFullscreen(video) {
  return Boolean(video && typeof video.webkitEnterFullscreen === 'function')
}

/** Run a fullscreen action and return whether it succeeded (no thrown errors). */
function safe(fn) {
  try {
    const ret = typeof fn === 'function' ? fn() : fn
    if (ret && typeof ret.then === 'function') ret.catch(() => {})
    return true
  } catch {
    return false
  }
}

/**
 * Custom HTML5 video player.
 * Props:
 *  - src: video URL (required)
 *  - poster: poster image URL
 *  - autoPlay: start playing on load (use on share page)
 *  - ratio: "portrait" | "landscape" | "square" — frames the video correctly
 *  - className: extra class for sizing
 *
 * Touch + fullscreen notes:
 *  - Seek/volume support both mouse and touch dragging.
 *  - On touch devices controls never auto-hide during playback (so fullscreen
 *    is always reachable), and a single tap toggles play while showing controls.
 *  - iPhone uses the native video fullscreen (webkitEnterFullscreen); iOS state
 *    is tracked via webkitbeginfullscreen/webkitendfullscreen so the UI stays
 *    in sync. Standard Fullscreen API is used on desktop/Android.
 */
export default function VideoPlayer({ src, poster, autoPlay = false, ratio = 'landscape', className = '' }) {
  const { isAr } = useLang()
  const videoRef = useRef(null)
  const playerRef = useRef(null)
  const hideTimerRef = useRef(null)
  const lastTapRef = useRef(0)

  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [buffered, setBuffered] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showRateMenu, setShowRateMenu] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [waiting, setWaiting] = useState(false)
  const [started, setStarted] = useState(false)
  const [controlsVisible, setControlsVisible] = useState(true)
  const [seeking, setSeeking] = useState(false)
  const [volumeSeeking, setVolumeSeeking] = useState(false)

  // Sync volume / muted / rate to the element
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.volume = volume
    v.muted = muted
  }, [volume, muted])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.playbackRate = playbackRate
  }, [playbackRate])

  const togglePlay = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    if (v.paused || v.ended) {
      v.play().catch(() => {})
    } else {
      v.pause()
    }
  }, [])

  const skip = useCallback((delta) => {
    const v = videoRef.current
    if (!v) return
    v.currentTime = Math.min(Math.max(v.currentTime + delta, 0), v.duration || 0)
  }, [])

  const toggleMute = useCallback(() => {
    setMuted(m => !m)
  }, [])

  const enterNativeFullscreen = useCallback(() => {
    const video = videoRef.current
    if (video && typeof video.webkitEnterFullscreen === 'function') {
      if (video.webkitDisplayingFullscreen) {
        safe(() => video.webkitExitFullscreen())
      } else {
        safe(() => video.webkitEnterFullscreen())
      }
      return true
    }
    return false
  }, [])

  const toggleFullscreen = useCallback(() => {
    const container = playerRef.current

    // iPhone: only the native video fullscreen works.
    if (supportsNativeVideoFullscreen(videoRef.current)) {
      enterNativeFullscreen()
      return
    }

    // Standard Fullscreen API (desktop, Android Chrome, etc.)
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      safe(() => document.exitFullscreen && document.exitFullscreen())
      safe(() => document.webkitExitFullscreen && document.webkitExitFullscreen())
    } else if (container) {
      const el = container
      // Try standard API first, fall back to webkit-prefixed (older Android).
      const ok = safe(() => el.requestFullscreen && el.requestFullscreen())
      if (!ok) safe(() => el.webkitRequestFullscreen && el.webkitRequestFullscreen())
    }
  }, [enterNativeFullscreen])

  // Keyboard shortcuts (only when player is focus/hover area)
  useEffect(() => {
    const el = playerRef.current
    if (!el) return

    const onKey = (e) => {
      // Don't hijack typing in inputs
      const tag = (e.target.tagName || '').toLowerCase()
      if (tag === 'input' || tag === 'textarea') return

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault()
          togglePlay()
          break
        case 'ArrowLeft':
          e.preventDefault()
          skip(-10)
          break
        case 'ArrowRight':
          e.preventDefault()
          skip(10)
          break
        case 'f':
          toggleFullscreen()
          break
        case 'm':
          toggleMute()
          break
        default:
          break
      }
    }

    el.addEventListener('keydown', onKey)
    return () => el.removeEventListener('keydown', onKey)
  }, [togglePlay, skip, toggleFullscreen, toggleMute])

  // Track fullscreen changes from BOTH the standard API and iOS webkit API.
  useEffect(() => {
    const onFs = () => setFullscreen(Boolean(
      document.fullscreenElement || document.webkitFullscreenElement
    ))
    // Standard + webkit (element) Fullscreen API
    document.addEventListener('fullscreenchange', onFs)
    document.addEventListener('webkitfullscreenchange', onFs)

    // iOS native video fullscreen events (iPhone) — keep state in sync.
    const video = videoRef.current
    const onBegin = () => setFullscreen(true)
    const onEnd = () => setFullscreen(false)
    if (video) {
      video.addEventListener('webkitbeginfullscreen', onBegin)
      video.addEventListener('webkitendfullscreen', onEnd)
    }

    return () => {
      document.removeEventListener('fullscreenchange', onFs)
      document.removeEventListener('webkitfullscreenchange', onFs)
      if (video) {
        video.removeEventListener('webkitbeginfullscreen', onBegin)
        video.removeEventListener('webkitendfullscreen', onEnd)
      }
    }
  }, [])

  // Auto-hide controls only on precise-pointer (mouse) devices.
  // On touch we keep controls reachable during playback.
  const showControlsTemporarily = useCallback(() => {
    setControlsVisible(true)
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    // Skip auto-hide on touch devices
    if (window.matchMedia && window.matchMedia('(hover: none)').matches) return
    hideTimerRef.current = setTimeout(() => {
      if (!videoRef.current?.paused) setControlsVisible(false)
    }, 2600)
  }, [])

  useEffect(() => () => hideTimerRef.current && clearTimeout(hideTimerRef.current), [])

  // Media element event wiring
  const onLoadedMetadata = () => {
    const v = videoRef.current
    if (!v) return
    setDuration(v.duration)
    v.playbackRate = playbackRate
    if (autoPlay) v.play().catch(() => {})
  }

  const onTimeUpdate = () => {
    if (seeking) return
    const v = videoRef.current
    if (!v) return
    setCurrent(v.currentTime)
    if (v.buffered.length > 0) {
      setBuffered(v.buffered.end(v.buffered.length - 1))
    }
  }

  const onPlay = () => {
    setPlaying(true)
    setStarted(true)
    showControlsTemporarily()
  }
  const onPause = () => {
    setPlaying(false)
    setControlsVisible(true)
  }
  const onWaiting = () => setWaiting(true)
  const onPlaying = () => setWaiting(false)
  const onEnded = () => {
    setPlaying(false)
    setControlsVisible(true)
  }
  const onVolumeChange = () => {
    const v = videoRef.current
    if (!v) return
    setVolume(v.volume)
    setMuted(v.muted)
  }

  // --- Seek bar interaction (mouse + touch share a resolver) ---
  const seekToClientX = (clientX) => {
    const v = videoRef.current
    if (!v || !Number.isFinite(v.duration)) return
    const track = playerRef.current?.querySelector('.vp-seek')
    if (!track) return
    const rect = track.getBoundingClientRect()
    const fraction = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1)
    v.currentTime = fraction * v.duration
    setCurrent(v.currentTime)
  }

  const handleSeekDown = (e) => {
    setSeeking(true)
    const x = e.touches ? e.touches[0].clientX : e.clientX
    seekToClientX(x)
  }
  const handleSeekMove = (e) => {
    if (!seeking) return
    const x = e.touches ? e.touches[0].clientX : e.clientX
    seekToClientX(x)
  }
  const handleSeekUp = () => setSeeking(false)

  // --- Volume slider (mouse + touch) ---
  const volumeFromClientX = (clientX) => {
    const track = playerRef.current?.querySelector('.vp-volume-track')
    if (!track) return
    const rect = track.getBoundingClientRect()
    const fraction = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1)
    setVolume(fraction)
    if (fraction > 0 && muted) setMuted(false)
  }

  const handleVolumeDown = (e) => {
    setVolumeSeeking(true)
    const x = e.touches ? e.touches[0].clientX : e.clientX
    volumeFromClientX(x)
  }
  const handleVolumeMove = (e) => {
    if (!volumeSeeking) return
    const x = e.touches ? e.touches[0].clientX : e.clientX
    volumeFromClientX(x)
  }
  const handleVolumeUp = () => setVolumeSeeking(false)

  // --- Touch interaction on the video surface ---
  // Single tap: toggle play + reveal controls. Double tap: toggle fullscreen.
  const handleVideoTouchEnd = () => {
    const now = Date.now()
    if (now - lastTapRef.current < 300) {
      lastTapRef.current = 0
      toggleFullscreen()
    } else {
      lastTapRef.current = now
      setControlsVisible(true)
      setTimeout(() => {
        // If no second tap came, treat as single tap (toggle play).
        if (lastTapRef.current && Date.now() - lastTapRef.current >= 290) {
          lastTapRef.current = 0
          togglePlay()
        }
      }, 300)
    }
  }

  const progress = duration > 0 ? (current / duration) * 100 : 0
  const bufferedPct = duration > 0 ? (buffered / duration) * 100 : 0

  return (
    <div
      ref={playerRef}
      className={`vp vp-${ratio} ${className} ${fullscreen ? 'vp-fullscreen' : ''} ${controlsVisible ? 'controls-visible' : 'controls-hidden'}`}
      tabIndex={0}
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => playing && setControlsVisible(false)}
    >
      {/* Blurred color-fill background (visible only in fullscreen for vertical videos) */}
      {fullscreen && (
        <video
          className="vp-fill-bg"
          src={src}
          poster={poster}
          muted
          playsInline
          ref={el => { if (el && videoRef.current) { el.currentTime = videoRef.current.currentTime; if (videoRef.current.paused) el.pause(); else el.play().catch(() => {}) } }}
          aria-hidden="true"
        />
      )}

      <video
        ref={videoRef}
        className="vp-main-video"
        src={src}
        poster={poster}
        preload="metadata"
        playsInline
        onClick={togglePlay}
        onTouchEnd={handleVideoTouchEnd}
        onDoubleClick={(e) => { e.preventDefault(); toggleFullscreen() }}
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onTimeUpdate}
        onPlay={onPlay}
        onPause={onPause}
        onWaiting={onWaiting}
        onPlaying={onPlaying}
        onEnded={onEnded}
        onVolumeChange={onVolumeChange}
        onProgress={onTimeUpdate}
      />

      {/* Loading spinner */}
      {waiting && (
        <div className="vp-spinner" aria-hidden="true">
          <div className="vp-spinner-ring" />
        </div>
      )}

      {/* Big center play button (before start) */}
      {!started && (
        <button
          className="vp-big-play"
          onClick={togglePlay}
          aria-label={isAr ? 'تشغيل الفيديو' : 'Play video'}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="38" height="38">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      )}

      {/* Controls overlay */}
      <div className={`vp-controls ${started ? '' : 'vp-controls-hidden'}`}>
        {/* Seek bar */}
        <div
          className="vp-seek"
          onMouseDown={handleSeekDown}
          onMouseMove={handleSeekMove}
          onMouseUp={handleSeekUp}
          onMouseLeave={handleSeekUp}
          onTouchStart={handleSeekDown}
          onTouchMove={handleSeekMove}
          onTouchEnd={handleSeekUp}
        >
          <div className="vp-seek-buffer" style={{ width: `${bufferedPct}%` }} />
          <div className="vp-seek-fill" style={{ width: `${progress}%` }} />
          <div className="vp-seek-thumb" style={{ left: `${progress}%` }} />
        </div>

        <div className="vp-buttons">
          <div className="vp-buttons-left">
            <button className="vp-btn vp-btn-main" onClick={togglePlay} aria-label={playing ? (isAr ? 'إيقاف مؤقت' : 'Pause') : (isAr ? 'تشغيل' : 'Play')}>
              {playing ? (
                <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M7 4a1 1 0 0 1 1.514-.857l12 8a1 1 0 0 1 0 1.714l-12 8A1 1 0 0 1 7 20V4z"/></svg>
              )}
            </button>

            <div className="vp-volume">
              <button className="vp-btn" onClick={toggleMute} aria-label={muted ? (isAr ? 'تشغيل الصوت' : 'Unmute') : (isAr ? 'كتم الصوت' : 'Mute')}>
                {muted || volume === 0 ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/></svg>
                ) : volume < 0.5 ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                )}
              </button>
              <div
                className="vp-volume-track"
                onMouseDown={handleVolumeDown}
                onMouseMove={handleVolumeMove}
                onMouseUp={handleVolumeUp}
                onMouseLeave={handleVolumeUp}
                onTouchStart={handleVolumeDown}
                onTouchMove={handleVolumeMove}
                onTouchEnd={handleVolumeUp}
              >
                <div className="vp-volume-fill" style={{ width: `${muted ? 0 : volume * 100}%` }} />
              </div>
            </div>

            <span className="vp-time">
              {formatTime(current)} <span className="vp-time-dim">/ {formatTime(duration)}</span>
            </span>
          </div>

          <div className="vp-buttons-right">
            <button className="vp-btn vp-skip" onClick={() => skip(-10)} aria-label={isAr ? 'الرجوع 10 ثوانٍ' : 'Back 10 seconds'}>
              <span className="vp-skip-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/></svg>
                <span className="vp-skip-num">10</span>
              </span>
            </button>
            <button className="vp-btn vp-skip" onClick={() => skip(10)} aria-label={isAr ? 'التقديم 10 ثوانٍ' : 'Forward 10 seconds'}>
              <span className="vp-skip-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M13 17l5-5-5-5M6 17l5-5-5-5"/></svg>
                <span className="vp-skip-num">10</span>
              </span>
            </button>

            {/* Playback speed */}
            <div className="vp-rate">
              <button
                className="vp-btn vp-rate-btn"
                onClick={() => setShowRateMenu(s => !s)}
                aria-label={isAr ? 'سرعة التشغيل' : 'Playback speed'}
                aria-expanded={showRateMenu}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                <span className="vp-rate-label">{playbackRate}×</span>
              </button>
              {showRateMenu && (
                <>
                  <div className="vp-rate-overlay" onClick={() => setShowRateMenu(false)} />
                  <div className="vp-rate-menu">
                    <div className="vp-rate-menu-title">{isAr ? 'سرعة التشغيل' : 'Playback speed'}</div>
                    {PLAYBACK_RATES.map(rate => (
                      <button
                        key={rate}
                        className={`vp-rate-option ${rate === playbackRate ? 'active' : ''}`}
                        onClick={() => { setPlaybackRate(rate); setShowRateMenu(false) }}
                      >
                        <span>{rate === 1 ? (isAr ? 'عادي' : 'Normal') : `${rate}×`}</span>
                        {rate === playbackRate && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button className="vp-btn" onClick={toggleFullscreen} aria-label={fullscreen ? (isAr ? 'الخروج من ملء الشاشة' : 'Exit fullscreen') : (isAr ? 'ملء الشاشة' : 'Fullscreen')}>
              {fullscreen ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M8 3v4a1 1 0 0 1-1 1H3M21 8h-4a1 1 0 0 1-1-1V3M3 16h4a1 1 0 0 1 1 1v4M16 21v-4a1 1 0 0 1 1-1h4"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3"/></svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
