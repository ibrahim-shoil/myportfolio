import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { ChallengeGuard } from './challengeGuard.mjs'
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


const ipCache = new Map()
const TTL_MS = 24 * 60 * 60 * 1000

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


setInterval(() => {
  for (const fileName of ipCache.keys()) {
    cleanExpiredIps(fileName)
  }
}, 60 * 60 * 1000)

app.disable('x-powered-by')
app.set('trust proxy', 'loopback')
app.use(express.json({ limit: '32kb', strict: true }))

const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])
const ALLOWED_ORIGINS = new Set([
  'https://ishoil.me',
  'https://www.ishoil.me',
])

app.use('/api', (req, res, next) => {
  if (!WRITE_METHODS.has(req.method)) return next()

  const origin = req.get('origin')
  if (!origin) return next()

  if (!ALLOWED_ORIGINS.has(origin)) {
    return res.status(403).json({ error: 'Origin not allowed' })
  }

  next()
})






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


app.get('/api/downloads', async (req, res) => {
  try {
    const counts = await readCounts()
    res.json(counts)
  } catch (err) {
    console.error('Error reading counts:', err)
    res.status(500).json({ error: 'Failed to read download counts' })
  }
})


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






const inquiryRateMap = new Map()
const INQUIRY_RATE_LIMIT = 3
const INQUIRY_RATE_WINDOW = 3600000
const INQUIRY_RATE_BYPASS_IPS = new Set(
  String(process.env.INQUIRY_RATE_BYPASS_IPS || '')
    .split(',')
    .map(ip => ip.trim().replace(/^::ffff:/, ''))
    .filter(Boolean)
)
const MAX_TEXT_LEN = 2000

const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json')


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
  try {
    await fs.chmod(INQUIRIES_FILE, 0o600)
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }

  return inquiriesCache
}

async function persistInquiry(entry) {
  const data = await loadInquiries()


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

  await fs.writeFile(
    temporaryFile,
    JSON.stringify(data, null, 2),
    { mode: 0o600 }
  )

  await fs.chmod(
    temporaryFile,
    0o600
  )

  await fs.rename(
    temporaryFile,
    INQUIRIES_FILE
  )

  await fs.chmod(
    INQUIRIES_FILE,
    0o600
  )

  return data
}

function saveInquiry(entry) {
  const pendingWrite = inquiryWriteQueue.then(() => persistInquiry(entry))
  inquiryWriteQueue = pendingWrite.catch(() => {})
  return pendingWrite
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function normalizeSourceUrl(value) {
  const raw = String(value || '').trim()
  if (!raw) return ''

  try {
    const url = new URL(
      raw,
      'https://ishoil.me'
    )

    if (
      url.protocol !== 'https:' ||
      !['ishoil.me', 'www.ishoil.me'].includes(url.hostname) ||
      url.username ||
      url.password ||
      url.port
    ) {
      return ''
    }

    url.protocol = 'https:'
    url.hostname = 'ishoil.me'

    return url.href
  } catch {
    return ''
  }
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




const regionDisplayNames = new Intl.DisplayNames(
  ['en'],
  { type: 'region' }
)

function detectLocation(req) {
  const countryCode = String(
    req.get('CF-IPCountry') || ''
  )
    .trim()
    .toUpperCase()

  if (!/^[A-Z]{2}$/.test(countryCode)) {
    return {
      country: 'Unknown',
      countryCode: '',
      callingCode: '',
    }
  }

  const known =
    COUNTRY_BY_CODE.get(
      countryCode
    )

  let country =
    known?.country ||
    countryCode

  try {
    country =
      regionDisplayNames.of(
        countryCode
      ) ||
      country
  } catch {

  }

  return {
    country,
    countryCode,
    callingCode:
      known?.callingCode || '',
  }
}


setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of inquiryRateMap) {
    if (now - entry.windowStart > INQUIRY_RATE_WINDOW) inquiryRateMap.delete(ip)
  }
}, 60 * 60 * 1000)

const challengeGuard = new ChallengeGuard({
  secret: process.env.CHALLENGE_SECRET || undefined,
  ttlMs: 10 * 60 * 1000,
})


app.get('/api/inquiry/challenge', (req, res) => {
  res.json(challengeGuard.issue())
})


app.post('/api/inquiry', async (req, res) => {
  try {
    const ip = req.ip || req.socket.remoteAddress


    if (!checkInquiryRateLimit(ip)) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' })
    }

    const {
      name, contact, callingCode: submittedCallingCode, countryCode: submittedCountryCode, projectType, message,
      deliverableLength, services, assetStatus, timeline, deadlineDate, timelineNote, budget, referenceUrl,
      sourceUrl, sourceTitle,

      website: honeypot,

      challengeQuestion, challengeAnswer, challengeNonce, challengeIssuedAt, challengeSig,
    } = req.body


    if (honeypot) {
      return res.json({ ok: true })
    }

    const normalizedSourceUrl =
      normalizeSourceUrl(sourceUrl)


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
    if (sourceUrl && !normalizedSourceUrl) {
      errors.push({ field: 'sourceUrl', message: 'Invalid source URL.' })
    }
    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', errors })
    }


    if (!challengeGuard.verify({
      question: challengeQuestion,
      answer: challengeAnswer,
      nonce: challengeNonce,
      issuedAt: challengeIssuedAt,
      sig: challengeSig,
    })) {
      return res.status(400).json({
        error: 'Verification failed.',
        errors: [{ field: 'verify', message: 'Wrong or expired verification.' }],
      })
    }


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


    const detectedLocation = detectLocation(req)
    const location = detectedLocation.country === 'Unknown' && selectedCountry
      ? { country: selectedCountry.country, countryCode: String(submittedCountryCode).toUpperCase(), callingCode }
      : detectedLocation


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
      sourceUrl: normalizedSourceUrl,
      sourceTitle: String(sourceTitle || '').trim(),
    }
    await saveInquiry(entry)


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
    if (normalizedSourceUrl) {
      lines.push(
        '',
        `<b>المرجع:</b> <a href="${safe(normalizedSourceUrl)}">${safe(sourceTitle || normalizedSourceUrl)}</a>`
      )
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
          disable_web_page_preview: !normalizedSourceUrl,
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
