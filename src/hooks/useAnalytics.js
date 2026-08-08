import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

async function readJson(res) {
  if (!res.ok) throw new Error(`Analytics request failed: ${res.status}`)
  return res.json()
}

function makeEventId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID().replace(/-/g, '_')
  return `view_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`
}

export function usePageVisitTracking() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (!pathname) return
    fetch('/api/analytics/page-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname }),
      keepalive: true,
    }).catch(() => {})
  }, [pathname])
}

export function useVideoAnalytics(slug) {
  const [stats, setStats] = useState(null)
  const [busyLike, setBusyLike] = useState(false)

  const refresh = useCallback(async () => {
    if (!slug) return
    try {
      const data = await fetch(`/api/analytics/video/${encodeURIComponent(slug)}`).then(readJson)
      setStats(data)
    } catch {
      // Analytics must never break video playback or the portfolio page.
    }
  }, [slug])

  useEffect(() => {
    setStats(null)
    refresh()
  }, [refresh])

  const recordView = useCallback(async () => {
    if (!slug) return
    try {
      const data = await fetch(`/api/analytics/video/${encodeURIComponent(slug)}/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: makeEventId() }),
      }).then(readJson)
      setStats(current => ({
        views: data.views,
        likes: data.likes,
        liked: current?.liked ?? false,
      }))
    } catch {
      // Keep the player independent from analytics failures.
    }
  }, [slug])

  const like = useCallback(async () => {
    if (!slug || stats?.liked || busyLike) return
    setBusyLike(true)
    try {
      const data = await fetch(`/api/analytics/video/${encodeURIComponent(slug)}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }).then(readJson)
      setStats({ views: data.views, likes: data.likes, liked: data.liked })
    } catch {
      // Keep the UI usable if the API is temporarily unavailable.
    } finally {
      setBusyLike(false)
    }
  }, [slug, stats?.liked, busyLike])

  return {
    stats,
    recordView,
    like,
    busyLike,
  }
}

/**
 * Counts a video view only after real foreground playback time is accumulated.
 * Seeking forward does not satisfy the threshold because this uses wall-clock
 * playback time, not currentTime. A completed video can earn another view on a
 * later replay in the same mounted player after another qualified watch.
 */
export function useQualifiedVideoView(containerRef, onQualifiedView, thresholdSeconds = 5) {
  const callbackRef = useRef(onQualifiedView)

  useEffect(() => { callbackRef.current = onQualifiedView }, [onQualifiedView])

  useEffect(() => {
    const root = containerRef?.current
    const video = root?.querySelector?.('.vp-main-video')
    if (!video) return undefined

    let watchedMs = 0
    let reported = false
    let lastTick = null

    const tick = () => {
      const now = performance.now()
      if (lastTick === null) lastTick = now
      const delta = Math.max(0, Math.min(now - lastTick, 1000))
      lastTick = now

      const activelyWatching = !video.paused && !video.ended && !video.seeking && document.visibilityState === 'visible'
      if (!activelyWatching || reported) return

      watchedMs += delta
      if (watchedMs >= thresholdSeconds * 1000) {
        reported = true
        Promise.resolve(callbackRef.current?.()).catch(() => {})
      }
    }

    const timer = window.setInterval(tick, 250)
    const resetClock = () => { lastTick = performance.now() }
    const resetReplay = () => {
      watchedMs = 0
      reported = false
      lastTick = performance.now()
    }

    video.addEventListener('play', resetClock)
    video.addEventListener('playing', resetClock)
    video.addEventListener('pause', resetClock)
    video.addEventListener('waiting', resetClock)
    video.addEventListener('seeking', resetClock)
    video.addEventListener('ended', resetReplay)
    document.addEventListener('visibilitychange', resetClock)

    return () => {
      window.clearInterval(timer)
      video.removeEventListener('play', resetClock)
      video.removeEventListener('playing', resetClock)
      video.removeEventListener('pause', resetClock)
      video.removeEventListener('waiting', resetClock)
      video.removeEventListener('seeking', resetClock)
      video.removeEventListener('ended', resetReplay)
      document.removeEventListener('visibilitychange', resetClock)
    }
  }, [containerRef, thresholdSeconds])
}
