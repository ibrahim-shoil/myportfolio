import crypto from 'crypto'
import fs from 'fs/promises'
import path from 'path'

export const PAGE_VISIT_TTL_MS = 24 * 60 * 60 * 1000
const VIEW_EVENT_TTL_MS = 48 * 60 * 60 * 1000

function emptyData() {
  return { version: 1, pages: {}, videos: {} }
}

export function normalizePagePath(value) {
  if (typeof value !== 'string') return null
  const clean = value.trim().split(/[?#]/, 1)[0]
  if (!clean.startsWith('/') || clean.length > 300) return null
  return clean.replace(/\/{2,}/g, '/') || '/'
}

export function normalizeVideoSlug(value) {
  if (typeof value !== 'string') return null
  const slug = value.trim()
  return /^[a-z0-9][a-z0-9-]{0,99}$/.test(slug) ? slug : null
}

export function normalizeEventId(value) {
  if (typeof value !== 'string') return null
  const id = value.trim()
  return /^[A-Za-z0-9_-]{8,96}$/.test(id) ? id : null
}

function normalizeIp(ip) {
  return String(ip || 'unknown').replace(/^::ffff:/, '').trim() || 'unknown'
}

export class AnalyticsStore {
  constructor({ dataDir, now = () => Date.now() }) {
    this.dataDir = dataDir
    this.analyticsFile = path.join(dataDir, 'analytics.json')
    this.secretFile = path.join(dataDir, '.analytics-secret')
    this.now = now
    this.cache = null
    this.secret = null
    this.writeQueue = Promise.resolve()
  }

  async init() {
    await fs.mkdir(this.dataDir, { recursive: true })
    await this.getSecret()
    await this.load()
  }

  async getSecret() {
    if (this.secret) return this.secret
    try {
      this.secret = (await fs.readFile(this.secretFile, 'utf-8')).trim()
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
      this.secret = crypto.randomBytes(32).toString('hex')
      await fs.writeFile(this.secretFile, `${this.secret}\n`, { mode: 0o600 })
    }
    return this.secret
  }

  async visitorKey(ip) {
    const secret = await this.getSecret()
    return crypto.createHmac('sha256', secret).update(normalizeIp(ip)).digest('hex')
  }

  async load() {
    if (this.cache) return this.cache
    try {
      const raw = await fs.readFile(this.analyticsFile, 'utf-8')
      const parsed = JSON.parse(raw)
      this.cache = {
        version: 1,
        pages: parsed?.pages && typeof parsed.pages === 'object' ? parsed.pages : {},
        videos: parsed?.videos && typeof parsed.videos === 'object' ? parsed.videos : {},
      }
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
      this.cache = emptyData()
    }
    return this.cache
  }

  async persist(data) {
    const temporaryFile = `${this.analyticsFile}.tmp`
    await fs.writeFile(temporaryFile, JSON.stringify(data, null, 2))
    await fs.rename(temporaryFile, this.analyticsFile)
  }

  mutate(work) {
    const pending = this.writeQueue.then(async () => {
      const data = await this.load()
      const result = await work(data)
      await this.persist(data)
      return result
    })
    this.writeQueue = pending.catch(() => {})
    return pending
  }

  cleanPageVisitors(page, now) {
    page.visitors = page.visitors || {}
    for (const [key, timestamp] of Object.entries(page.visitors)) {
      if (!Number.isFinite(timestamp) || now - timestamp >= PAGE_VISIT_TTL_MS) {
        delete page.visitors[key]
      }
    }
  }

  cleanViewEvents(video, now) {
    video.viewEvents = video.viewEvents || {}
    for (const [eventId, timestamp] of Object.entries(video.viewEvents)) {
      if (!Number.isFinite(timestamp) || now - timestamp >= VIEW_EVENT_TTL_MS) {
        delete video.viewEvents[eventId]
      }
    }
  }

  ensureVideo(data, slug) {
    if (!data.videos[slug]) {
      data.videos[slug] = { views: 0, likes: 0, likedBy: {}, viewEvents: {} }
    }
    const video = data.videos[slug]
    video.views = Number.isFinite(video.views) ? video.views : 0
    video.likes = Number.isFinite(video.likes) ? video.likes : 0
    video.likedBy = video.likedBy || {}
    video.viewEvents = video.viewEvents || {}
    return video
  }

  async recordPageVisit(pagePath, ip) {
    const pathKey = normalizePagePath(pagePath)
    if (!pathKey) throw new Error('Invalid page path')
    const visitor = await this.visitorKey(ip)
    const now = this.now()

    return this.mutate((data) => {
      const page = data.pages[pathKey] || { visits: 0, visitors: {} }
      data.pages[pathKey] = page
      this.cleanPageVisitors(page, now)

      const previous = page.visitors[visitor]
      const counted = !Number.isFinite(previous) || now - previous >= PAGE_VISIT_TTL_MS
      if (counted) {
        page.visits = (Number.isFinite(page.visits) ? page.visits : 0) + 1
        page.visitors[visitor] = now
      }

      return { counted, visits: page.visits }
    })
  }

  async getPageStats(pagePath) {
    const pathKey = normalizePagePath(pagePath)
    if (!pathKey) throw new Error('Invalid page path')
    const data = await this.load()
    const page = data.pages[pathKey]
    return { visits: Number.isFinite(page?.visits) ? page.visits : 0 }
  }

  async recordVideoView(slugValue, eventValue) {
    const slug = normalizeVideoSlug(slugValue)
    const eventId = normalizeEventId(eventValue)
    if (!slug || !eventId) throw new Error('Invalid video view event')
    const now = this.now()

    return this.mutate((data) => {
      const video = this.ensureVideo(data, slug)
      this.cleanViewEvents(video, now)
      if (video.viewEvents[eventId]) {
        return { counted: false, views: video.views, likes: video.likes }
      }
      video.viewEvents[eventId] = now
      video.views += 1
      return { counted: true, views: video.views, likes: video.likes }
    })
  }

  async likeVideo(slugValue, ip) {
    const slug = normalizeVideoSlug(slugValue)
    if (!slug) throw new Error('Invalid video slug')
    const visitor = await this.visitorKey(ip)
    const now = this.now()

    return this.mutate((data) => {
      const video = this.ensureVideo(data, slug)
      if (video.likedBy[visitor]) {
        return { counted: false, liked: true, views: video.views, likes: video.likes }
      }
      video.likedBy[visitor] = now
      video.likes += 1
      return { counted: true, liked: true, views: video.views, likes: video.likes }
    })
  }

  async getVideoStats(slugValue, ip) {
    const slug = normalizeVideoSlug(slugValue)
    if (!slug) throw new Error('Invalid video slug')
    const visitor = await this.visitorKey(ip)
    const data = await this.load()
    const video = data.videos[slug]
    return {
      views: Number.isFinite(video?.views) ? video.views : 0,
      likes: Number.isFinite(video?.likes) ? video.likes : 0,
      liked: Boolean(video?.likedBy?.[visitor]),
    }
  }
}
