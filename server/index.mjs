import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = 3002

const DATA_DIR = path.join(__dirname, '..', 'data')
const DOWNLOADS_FILE = path.join(DATA_DIR, 'downloads.json')
const DOWNLOADS_DIR = path.join(__dirname, '..', 'public', 'downloads')

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

ensureDataFile().then(() => {
  app.listen(PORT, '127.0.0.1', () => {
    console.log(`Download tracker listening on 127.0.0.1:${PORT}`)
  })
})
