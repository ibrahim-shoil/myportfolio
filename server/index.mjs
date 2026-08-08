import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'
import crypto from 'crypto'
import { AnalyticsStore, normalizePagePath } from './analyticsStore.mjs'
import {
  isValidContact,
  isValidEmail,
  isValidName,
  normalizeCallingCode,
  normalizeContact,
  normalizeName,
} from '../src/utils/inquiryValidation.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = 3002

const DATA_DIR = path.join(__dirname, '..', 'data')
const DOWNLOADS_FILE = path.join(DATA_DIR, 'downloads.json')
const DOWNLOADS_DIR = path.join(__dirname, '..', 'public', 'downloads')
const VIDEOS_FILE = path.join(DATA_DIR, 'videos.json')

// --- Telegram bot config (delivers hire inquiries to Ibrahim) ---
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '6229915378'

// In-memory IP tracking: Map<fileName, Map<ip, timestamp>>
const ipCache = new Map()
const TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true })
  try {
    await fs.access(DOWNLOADS_FILE)
  } catch {
    await fs.writeFile(DOWNLOADS_FILE, JSON.stringify({}, null, 2))
  }
}

async function readCounts() {
  const raw = await fs.readFile(DOWNLOADS_FILE, 'utf-8')
  return JSON.parse(raw)
}

async function writeCounts(counts) {
  await fs.writeFile(DOWNLOADS_FILE, JSON.stringify(counts, null, 2))
}

function isExpired(timestamp) {
  return Date.now() - timestamp > TTL_MS
}

function cleanExpiredIps(fileName) {
  const fileIps = ipCache.get(fileName)
  if (!fileIps) return
  for (const [ip, ts] of fileIps) {
    if (isExpired(ts)) fileIps.delete(ip)
  }
  if (fileIps.size === 0) ipCache.delete(fileName)
}

// Periodic cleanup every hour
setInterval(() => {
  for (const fileName of ipCache.keys()) {
    cleanExpiredIps(fileName)
  }
}, 60 * 60 * 1000)

app.use(cors())
app.use(express.json())
app.set('trust proxy', true)

// --- Portfolio analytics ---
// Page visits: one count per IP + pathname every 24h, persisted across restarts.
// Video views: counted after the frontend reports a qualified real watch; not IP-limited.
// Likes: one like per IP per video. Raw IP addresses are never stored in analytics.json;
// they are HMAC-hashed with a server-local secret stored outside Git.
const analytics = new AnalyticsStore({ dataDir: DATA_DIR })
let validVideoSlugs = new Set()

async function loadValidVideoSlugs() {
  const raw = await fs.readFile(VIDEOS_FILE, 'utf-8')
  const videos = JSON.parse(raw)
  validVideoSlugs = new Set(videos.map(video => video.slug).filter(Boolean))
}

function requestIp(req) {
  return req.ip || req.socket.remoteAddress || 'unknown'
}

function requireVideoSlug(req, res) {
  const slug = String(req.params.slug || '')
  if (!validVideoSlugs.has(slug)) {
    res.status(404).json({ error: 'Video not found' })
    return null
  }
  return slug
}

app.get('/api/analytics/page', async (req, res) => {
  try {
    const pagePath = normalizePagePath(req.query.path)
    if (!pagePath) return res.status(400).json({ error: 'Invalid page path' })
    res.json(await analytics.getPageStats(pagePath))
  } catch (err) {
    console.error('Error reading page analytics:', err)
    res.status(500).json({ error: 'Failed to read page analytics' })
  }
})

app.post('/api/analytics/page-view', async (req, res) => {
  try {
    const pagePath = normalizePagePath(req.body?.path)
    if (!pagePath) return res.status(400).json({ error: 'Invalid page path' })
    res.json(await analytics.recordPageVisit(pagePath, requestIp(req)))
  } catch (err) {
    console.error('Error recording page view:', err)
    res.status(500).json({ error: 'Failed to record page view' })
  }
})

app.get('/api/analytics/video/:slug', async (req, res) => {
  try {
    const slug = requireVideoSlug(req, res)
    if (!slug) return
    res.json(await analytics.getVideoStats(slug, requestIp(req)))
  } catch (err) {
    console.error('Error reading video analytics:', err)
    res.status(500).json({ error: 'Failed to read video analytics' })
  }
})

app.post('/api/analytics/video/:slug/view', async (req, res) => {
  try {
    const slug = requireVideoSlug(req, res)
    if (!slug) return
    const eventId = req.body?.eventId
    if (typeof eventId !== 'string' || eventId.length > 96) {
      return res.status(400).json({ error: 'Invalid view event' })
    }
    res.json(await analytics.recordVideoView(slug, eventId))
  } catch (err) {
    if (err?.message === 'Invalid video view event') {
      return res.status(400).json({ error: 'Invalid view event' })
    }
    console.error('Error recording video view:', err)
    res.status(500).json({ error: 'Failed to record video view' })
  }
})

app.post('/api/analytics/video/:slug/like', async (req, res) => {
  try {
    const slug = requireVideoSlug(req, res)
    if (!slug) return
    res.json(await analytics.likeVideo(slug, requestIp(req)))
  } catch (err) {
    console.error('Error recording video like:', err)
    res.status(500).json({ error: 'Failed to record video like' })
  }
})

// GET /api/downloads
app.get('/api/downloads', async (req, res) => {
  try {
    const counts = await readCounts()
    res.json(counts)
  } catch (err) {
    console.error('Error reading counts:', err)
    res.status(500).json({ error: 'Failed to read download counts' })
  }
})

// POST /api/downloads/:file
app.post('/api/downloads/:file', async (req, res) => {
  try {
    const fileName = req.params.file
    const ip = req.ip || req.socket.remoteAddress

    const validFiles = await fs.readdir(DOWNLOADS_DIR)
    if (!validFiles.includes(fileName)) {
      return res.status(404).json({ error: 'File not found' })
    }

    cleanExpiredIps(fileName)
    if (!ipCache.has(fileName)) ipCache.set(fileName, new Map())
    const fileIps = ipCache.get(fileName)

    if (fileIps.has(ip) && !isExpired(fileIps.get(ip))) {
      const counts = await readCounts()
      return res.json({ counted: false, counts })
    }

    fileIps.set(ip, Date.now())

    const counts = await readCounts()
    counts[fileName] = (counts[fileName] || 0) + 1
    await writeCounts(counts)

    res.json({ counted: true, counts })
  } catch (err) {
    console.error('Error recording download:', err)
    res.status(500).json({ error: 'Failed to record download' })
  }
})

// --- Hire / inquiry form → Telegram + persistent storage ---
// Anti-abuse: per-IP rate limit + honeypot field + math challenge validation.
// Validation: strict name/email/phone checks (no gibberish names).
// Storage: inquiries saved to data/inquiries.json with date + country for
// client profiles and analytics.
const inquiryRateMap = new Map() // Map<ip, { count, windowStart }>
const INQUIRY_RATE_LIMIT = 3     // max submissions...
const INQUIRY_RATE_WINDOW = 3600000 // ...per hour
const MAX_TEXT_LEN = 2000

const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json')

// In-memory cache of inquiries (loaded once, flushed on each new entry)
let inquiriesCache = null
let inquiryWriteQueue = Promise.resolve()

async function loadInquiries() {
  if (inquiriesCache) return inquiriesCache
  try {
    const raw = await fs.readFile(INQUIRIES_FILE, 'utf-8')
    inquiriesCache = JSON.parse(raw)
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
    inquiriesCache = { inquiries: [], nextId: 1 }
  }
  return inquiriesCache
}

async function persistInquiry(entry) {
  const data = await loadInquiries()
  // If the same contact (normalized email/phone) already exists, append to
  // their history instead of creating a duplicate client.
  const normalizedContact = normalizeContact(entry.contact)
  const existing = data.inquiries.find(
    c => normalizeContact(c.contact) === normalizedContact
  )
  if (existing) {
    existing.history = existing.history || []
    existing.history.push(entry)
    existing.lastSeen = entry.date
    existing.inquiryCount = (existing.inquiryCount || 1) + 1
    existing.name = entry.name
    existing.contact = entry.contact
    existing.country = entry.country
    existing.countryCode = entry.countryCode
    existing.callingCode = entry.callingCode
  } else {
    data.inquiries.push({
      id: data.nextId++,
      name: entry.name,
      contact: entry.contact,
      country: entry.country,
      countryCode: entry.countryCode,
      callingCode: entry.callingCode,
      firstSeen: entry.date,
      lastSeen: entry.date,
      inquiryCount: 1,
      history: [entry],
    })
  }
  const temporaryFile = `${INQUIRIES_FILE}.tmp`
  await fs.writeFile(temporaryFile, JSON.stringify(data, null, 2))
  await fs.rename(temporaryFile, INQUIRIES_FILE)
  return data
}

function saveInquiry(entry) {
  const pendingWrite = inquiryWriteQueue.then(() => persistInquiry(entry))
  inquiryWriteQueue = pendingWrite.catch(() => {})
  return pendingWrite
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function checkInquiryRateLimit(ip) {
  const now = Date.now()
  let entry = inquiryRateMap.get(ip)
  if (!entry || now - entry.windowStart > INQUIRY_RATE_WINDOW) {
    entry = { count: 0, windowStart: now }
    inquiryRateMap.set(ip, entry)
  }
  entry.count++
  return entry.count <= INQUIRY_RATE_LIMIT
}

function isLikelyEmail(contact) {
  return isValidEmail(contact)
}

// --- Country detection via IP geolocation (free, no key) ---
const countryCache = new Map() // Map<ip, { location, ts }>
const COUNTRY_CACHE_TTL = 86400000 // 24h

async function detectLocation(ip) {
  // Localhost / private IPs → unknown
  if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return { country: 'Unknown', countryCode: '', callingCode: '' }
  }
  const cached = countryCache.get(ip)
  if (cached && Date.now() - cached.ts < COUNTRY_CACHE_TTL) return cached.location

  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`, { signal: AbortSignal.timeout(4000) })
    const data = await res.json()
    if (!res.ok || data.error || !data.country_name) throw new Error('Primary geolocation failed')
    const location = {
      country: data.country_name || 'Unknown',
      countryCode: data.country_code || '',
      callingCode: normalizeCallingCode(data.country_calling_code),
    }
    countryCache.set(ip, { location, ts: Date.now() })
    return location
  } catch {
    // Fallback: try ipwho.is
    try {
      const res2 = await fetch(`https://ipwho.is/${ip}/`, { signal: AbortSignal.timeout(4000) })
      const data2 = await res2.json()
      if (!res2.ok || data2.success === false || !data2.country) throw new Error('Fallback geolocation failed')
      const location = {
        country: data2.country || 'Unknown',
        countryCode: data2.country_code || '',
        callingCode: normalizeCallingCode(data2.calling_code),
      }
      countryCache.set(ip, { location, ts: Date.now() })
      return location
    } catch {
      return { country: 'Unknown', countryCode: '', callingCode: '' }
    }
  }
}

// Periodic cleanup of inquiry rate-limit entries
setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of inquiryRateMap) {
    if (now - entry.windowStart > INQUIRY_RATE_WINDOW) inquiryRateMap.delete(ip)
  }
}, 60 * 60 * 1000)

// Serve a fresh math challenge (the answer is validated server-side via HMAC,
// so the client can't bypass it and the answer isn't exposed).
const CHALLENGE_SECRET = process.env.CHALLENGE_SECRET || crypto.randomBytes(32).toString('hex')

function makeChallenge() {
  const a = Math.floor(Math.random() * 8) + 1   // 1-8
  const b = Math.floor(Math.random() * 8) + 1   // 1-8
  const answer = a + b
  const nonce = crypto.randomBytes(8).toString('hex')
  const sig = crypto.createHmac('sha256', CHALLENGE_SECRET)
    .update(`${answer}:${nonce}`)
    .digest('hex')
  return {
    question: `${a} + ${b}`,
    nonce,
    sig,
  }
}

function verifyChallenge(question, answer, nonce, sig) {
  if (!question || !answer || !nonce || !sig) return false
  // Re-derive expected answer from the question to avoid trusting client math
  const parts = question.match(/^(\d+)\s*\+\s*(\d+)$/)
  if (!parts) return false
  const expected = parseInt(parts[1], 10) + parseInt(parts[2], 10)
  if (parseInt(answer, 10) !== expected) return false
  const expectedSig = crypto.createHmac('sha256', CHALLENGE_SECRET)
    .update(`${expected}:${nonce}`)
    .digest('hex')
  try {
    return crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expectedSig, 'hex'))
  } catch {
    return false // sig not valid hex
  }
}

// GET /api/inquiry/challenge — returns a math challenge
app.get('/api/inquiry/challenge', (req, res) => {
  res.json(makeChallenge())
})

// GET /api/inquiry/stats — returns aggregate counts (no PII) for your dashboard
app.get('/api/inquiry/stats', async (req, res) => {
  try {
    const data = await loadInquiries()
    const total = data.inquiries.reduce((s, c) => s + (c.inquiryCount || 1), 0)
    const clients = data.inquiries.length
    const countries = {}
    data.inquiries.forEach(c => {
      const cc = c.country || 'Unknown'
      countries[cc] = (countries[cc] || 0) + 1
    })
    res.json({ clients, totalInquiries: total, countries })
  } catch (err) {
    res.status(500).json({ error: 'Failed to read stats' })
  }
})

// POST /api/inquiry — validate + save + forward to Telegram
app.post('/api/inquiry', async (req, res) => {
  try {
    const ip = req.ip || req.socket.remoteAddress

    // Rate limit
    if (!checkInquiryRateLimit(ip)) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' })
    }

    const {
      name, contact, callingCode: submittedCallingCode, projectType, message,
      sourceUrl, sourceTitle,
      // honeypot — must be empty; bots fill hidden fields
      website: honeypot,
      // challenge
      challengeQuestion, challengeAnswer, challengeNonce, challengeSig,
    } = req.body

    // Honeypot: if filled, silently accept (pretend success) but do nothing
    if (honeypot) {
      return res.json({ ok: true })
    }

    // --- Strict validation ---
    const errors = []
    if (!isValidName(name)) {
      errors.push({ field: 'name', message: 'Please enter a valid name (2-60 letters).' })
    }
    if (!isValidContact(contact)) {
      errors.push({ field: 'contact', message: 'Enter a valid email or an international phone number with country code.' })
    }
    const contactIsEmail = isLikelyEmail(contact)
    const callingCode = contactIsEmail ? '' : normalizeCallingCode(submittedCallingCode)
    if (!contactIsEmail && (!callingCode || !normalizeContact(contact).startsWith(callingCode))) {
      errors.push({ field: 'contact', message: 'Select a valid country calling code.' })
    }
    if (!message || String(message).trim().length < 10) {
      errors.push({ field: 'message', message: 'Please provide at least a few words about your project.' })
    }
    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', errors })
    }

    // Validate challenge (anti-bot)
    if (!verifyChallenge(challengeQuestion, challengeAnswer, challengeNonce, challengeSig)) {
      return res.status(400).json({ error: 'Verification failed.', errors: [{ field: 'verify', message: 'Wrong answer.' }] })
    }

    // Length limits (anti-abuse)
    if (
      String(name).length > 100 ||
      String(contact).length > 200 ||
      String(projectType || '').length > 100 ||
      String(message).length > MAX_TEXT_LEN ||
      String(sourceUrl || '').length > 500 ||
      String(sourceTitle || '').length > 300
    ) {
      return res.status(400).json({ error: 'Field too long.' })
    }

    // --- Detect country from IP ---
    const location = await detectLocation(ip)

    // --- Persist to inquiries.json ---
    const now = new Date().toISOString()
    const entry = {
      date: now,
      name: normalizeName(name),
      contact: normalizeContact(contact),
      projectType: String(projectType || '').trim(),
      message: String(message).trim(),
      country: location.country,
      countryCode: location.countryCode,
      callingCode: callingCode || location.callingCode,
      sourceUrl: String(sourceUrl || '').trim(),
      sourceTitle: String(sourceTitle || '').trim(),
      ip: ip?.replace(/::ffff:/, ''),
    }
    await saveInquiry(entry)

    // --- Forward to Telegram ---
    const safe = (v) => escapeHtml(String(v || '').trim())
    const contactLabel = isLikelyEmail(contact) ? 'البريد' : 'الهاتف/واتساب'

    const lines = [
      '<b>طلب خدمة جديد</b>',
      '',
      `<b>الاسم:</b> ${safe(name)}`,
      `<b>${contactLabel}:</b> ${safe(contact)}`,
      `<b>الدولة:</b> ${safe(location.country)}${location.countryCode ? ` (${safe(location.countryCode)})` : ''}`,
    ]
    if (callingCode) lines.push(`<b>مفتاح الاتصال:</b> ${safe(callingCode)}`)
    if (projectType) lines.push(`<b>نوع المشروع:</b> ${safe(projectType)}`)
    lines.push('', `<b>التفاصيل:</b>`, safe(message))
    if (sourceUrl) {
      lines.push('', `<b>المرجع:</b> <a href="${safe(sourceUrl)}">${safe(sourceTitle || sourceUrl)}</a>`)
    }
    const text = lines.join('\n')

    if (!TELEGRAM_BOT_TOKEN) {
      console.error('TELEGRAM_BOT_TOKEN not set — inquiry saved but not sent')
      return res.json({ ok: true, saved: true, sent: false })
    }

    const tgRes = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: !sourceUrl,
        }),
      }
    )
    const tgData = await tgRes.json()
    if (!tgData.ok) {
      console.error('Telegram error:', tgData)
      // Still return ok — the inquiry was saved even if Telegram failed
      return res.json({ ok: true, saved: true, sent: false })
    }

    res.json({ ok: true })
  } catch (err) {
    console.error('Error processing inquiry:', err)
    res.status(500).json({ error: 'Something went wrong.' })
  }
})

Promise.all([
  ensureDataFile(),
  analytics.init(),
  loadValidVideoSlugs(),
]).then(() => {
  app.listen(PORT, '127.0.0.1', () => {
    console.log(`Download tracker + inquiry + analytics API listening on 127.0.0.1:${PORT}`)
  })
}).catch((error) => {
  console.error('Failed to initialize API server:', error)
  process.exit(1)
})
