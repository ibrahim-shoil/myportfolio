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
const PORT = Number(process.env.PORT || 3002)

const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(__dirname, '..', 'data')
const DOWNLOADS_FILE = path.join(DATA_DIR, 'downloads.json')
const DOWNLOADS_DIR = path.join(__dirname, '..', 'public', 'downloads')
const VIDEOS_FILE = path.join(DATA_DIR, 'videos.json')

// --- Telegram bot config (delivers hire inquiries to Ibrahim) ---
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '6229915378'

const COUNTRY_BY_CODE = new Map([
  ['EG', { country: 'Egypt', callingCode: '+20', lengths: [10] }], ['SA', { country: 'Saudi Arabia', callingCode: '+966', lengths: [9] }],
  ['AE', { country: 'United Arab Emirates', callingCode: '+971', lengths: [9] }], ['KW', { country: 'Kuwait', callingCode: '+965', lengths: [8] }],
  ['QA', { country: 'Qatar', callingCode: '+974', lengths: [8] }], ['BH', { country: 'Bahrain', callingCode: '+973', lengths: [8] }],
  ['OM', { country: 'Oman', callingCode: '+968', lengths: [8] }], ['JO', { country: 'Jordan', callingCode: '+962', lengths: [9] }],
  ['IQ', { country: 'Iraq', callingCode: '+964', lengths: [10] }], ['PS', { country: 'Palestine', callingCode: '+970', lengths: [9] }],
  ['LB', { country: 'Lebanon', callingCode: '+961', lengths: [7, 8] }], ['SY', { country: 'Syria', callingCode: '+963', lengths: [9] }],
  ['YE', { country: 'Yemen', callingCode: '+967', lengths: [9] }], ['SD', { country: 'Sudan', callingCode: '+249', lengths: [9] }],
  ['LY', { country: 'Libya', callingCode: '+218', lengths: [9] }], ['TN', { country: 'Tunisia', callingCode: '+216', lengths: [8] }],
  ['DZ', { country: 'Algeria', callingCode: '+213', lengths: [9] }], ['MA', { country: 'Morocco', callingCode: '+212', lengths: [9] }],
  ['US', { country: 'United States / Canada', callingCode: '+1', lengths: [10] }], ['GB', { country: 'United Kingdom', callingCode: '+44', lengths: [10] }],
  ['FR', { country: 'France', callingCode: '+33', lengths: [9] }], ['DE', { country: 'Germany', callingCode: '+49', lengths: [10, 11] }],
  ['TR', { country: 'Turkey', callingCode: '+90', lengths: [10] }],
])

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
const INQUIRY_RATE_BYPASS_IPS = new Set(
  String(process.env.INQUIRY_RATE_BYPASS_IPS || '')
    .split(',')
    .map(ip => ip.trim().replace(/^::ffff:/, ''))
    .filter(Boolean)
)
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
  const normalizedIp = String(ip || '').replace(/^::ffff:/, '')
  if (INQUIRY_RATE_BYPASS_IPS.has(normalizedIp)) return true

  const now = Date.now()
  let entry = inquiryRateMap.get(normalizedIp)
  if (!entry || now - entry.windowStart > INQUIRY_RATE_WINDOW) {
    entry = { count: 0, windowStart: now }
    inquiryRateMap.set(normalizedIp, entry)
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
    // ipwho.is is the primary source because ipapi.co frequently rate-limits
    // shared production servers.
    const res = await fetch(`https://ipwho.is/${ip}/`, { signal: AbortSignal.timeout(3500) })
    const data = await res.json()
    if (!res.ok || data.success === false || !data.country) throw new Error('Primary geolocation failed')
    const location = {
      country: data.country,
      countryCode: data.country_code || '',
      callingCode: normalizeCallingCode(data.calling_code),
    }
    countryCache.set(ip, { location, ts: Date.now() })
    return location
  } catch {
    // Fallback to another independent provider.
    try {
      const res2 = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode`, { signal: AbortSignal.timeout(3000) })
      const data2 = await res2.json()
      if (!res2.ok || data2.status !== 'success' || !data2.country) throw new Error('Fallback geolocation failed')
      const location = {
        country: data2.country || 'Unknown',
        countryCode: data2.countryCode || '',
        callingCode: COUNTRY_BY_CODE.get(data2.countryCode)?.callingCode || '',
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
      name, contact, callingCode: submittedCallingCode, countryCode: submittedCountryCode, projectType, message,
      deliverableLength, services, assetStatus, timeline, deadlineDate, timelineNote, budget, referenceUrl,
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
    const selectedCountry = contactIsEmail ? null : COUNTRY_BY_CODE.get(String(submittedCountryCode || '').toUpperCase())
    if (!contactIsEmail && (!callingCode || !normalizeContact(contact).startsWith(callingCode))) {
      errors.push({ field: 'contact', message: 'Select a valid country calling code.' })
    }
    if (!contactIsEmail && (!selectedCountry || selectedCountry.callingCode !== callingCode)) {
      errors.push({ field: 'contact', message: 'Select a valid country.' })
    }
    if (!contactIsEmail && selectedCountry) {
      const localNumber = normalizeContact(contact).slice(callingCode.length).replace(/\D/g, '')
      if (localNumber.startsWith('0') || !selectedCountry.lengths.includes(localNumber.length)) {
        errors.push({ field: 'contact', message: 'Enter a valid phone number for the selected country without the leading zero.' })
      }
    }
    if (!deliverableLength || !assetStatus || !timeline || !budget) {
      errors.push({ field: 'deliverableLength', message: 'Please complete the project brief.' })
    }
    if (!Array.isArray(services) || services.length < 1 || services.length > 12) {
      errors.push({ field: 'services', message: 'Select at least one required service.' })
    }
    if (referenceUrl && !/^https?:\/\/[^\s]+$/i.test(String(referenceUrl).trim())) {
      errors.push({ field: 'referenceUrl', message: 'Enter a valid reference URL.' })
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
      String(deliverableLength || '').length > 100 ||
      String(assetStatus || '').length > 100 ||
      String(timeline || '').length > 100 ||
      String(deadlineDate || '').length > 20 ||
      String(timelineNote || '').length > 200 ||
      String(budget || '').length > 100 ||
      String(referenceUrl || '').length > 500 ||
      (Array.isArray(services) && services.some(service => String(service).length > 100)) ||
      String(message || '').length > MAX_TEXT_LEN ||
      String(sourceUrl || '').length > 500 ||
      String(sourceTitle || '').length > 300
    ) {
      return res.status(400).json({ error: 'Field too long.' })
    }

    // --- Detect country from IP ---
    const detectedLocation = await detectLocation(ip)
    const location = detectedLocation.country === 'Unknown' && selectedCountry
      ? { country: selectedCountry.country, countryCode: String(submittedCountryCode).toUpperCase(), callingCode }
      : detectedLocation

    // --- Persist to inquiries.json ---
    const now = new Date().toISOString()
    const entry = {
      date: now,
      name: normalizeName(name),
      contact: normalizeContact(contact),
      projectType: String(projectType || services?.[0] || '').trim(),
      deliverableLength: String(deliverableLength || '').trim(),
      services: Array.isArray(services) ? services.map(service => String(service).trim()) : [],
      assetStatus: String(assetStatus || '').trim(),
      timeline: String(timeline || '').trim(),
      deadlineDate: String(deadlineDate || '').trim(),
      timelineNote: String(timelineNote || '').trim(),
      budget: String(budget || '').trim(),
      referenceUrl: String(referenceUrl || '').trim(),
      message: String(message || '').trim(),
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
    const normalizedSubmittedContact = normalizeContact(contact)
    const contactLabel = contactIsEmail ? 'البريد' : 'الهاتف/واتساب'
    const whatsappDigits = contactIsEmail ? '' : normalizedSubmittedContact.replace(/\D/g, '')
    const contactLine = contactIsEmail
      ? `<b>${contactLabel}:</b> ${safe(normalizedSubmittedContact)}`
      : `<b>${contactLabel}:</b> <a href="https://wa.me/${whatsappDigits}">&#8206;${safe(normalizedSubmittedContact)}</a>`

    const lines = [
      '<b>طلب خدمة جديد</b>',
      '',
      `<b>الاسم:</b> ${safe(name)}`,
      contactLine,
      `<b>الدولة:</b> ${safe(location.country)}${location.countryCode ? ` (${safe(location.countryCode)})` : ''}`,
    ]
    if (callingCode) lines.push(`<b>مفتاح الاتصال:</b> ${safe(callingCode)}`)
    if (projectType && (!Array.isArray(services) || services.length === 0)) lines.push(`<b>نوع المشروع:</b> ${safe(projectType)}`)
    if (deliverableLength) lines.push(`<b>مدة الفيديو:</b> ${safe(deliverableLength)}`)
    if (Array.isArray(services) && services.length) lines.push(`<b>الخدمات:</b> ${safe(services.join('، '))}`)
    if (assetStatus) lines.push(`<b>حالة المواد:</b> ${safe(assetStatus)}`)
    if (timeline) lines.push(`<b>موعد التسليم:</b> ${safe(timeline)}`)
    if (deadlineDate) lines.push(`<b>التاريخ المستهدف:</b> ${safe(deadlineDate)}`)
    if (timelineNote) lines.push(`<b>تفاصيل الموعد:</b> ${safe(timelineNote)}`)
    if (budget) lines.push(`<b>الميزانية:</b> ${safe(budget)}`)
    if (referenceUrl) lines.push(`<b>مرجع:</b> ${safe(referenceUrl)}`)
    if (message) lines.push('', `<b>التفاصيل:</b>`, safe(message))
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
          ...(whatsappDigits ? {
            reply_markup: {
              inline_keyboard: [[{ text: 'فتح المحادثة على واتساب', url: `https://wa.me/${whatsappDigits}` }]],
            },
          } : {}),
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
