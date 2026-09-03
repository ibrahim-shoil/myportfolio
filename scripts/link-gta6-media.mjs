








import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const MEDIA_SOURCE = '/var/www/gta6-media/downloads/gta6'
const LINK_PATH = path.join(__dirname, '..', 'dist', 'downloads', 'gta6')

if (!fs.existsSync(MEDIA_SOURCE)) {
  console.log(`gta6 media not found at ${MEDIA_SOURCE} — skipping link (run run_gta6_download.sh once)`)
  process.exit(0)
}

fs.mkdirSync(path.dirname(LINK_PATH), { recursive: true })
fs.rmSync(LINK_PATH, { force: true, recursive: true })
fs.symlinkSync(MEDIA_SOURCE, LINK_PATH, 'dir')
console.log(`linked ${LINK_PATH} -> ${MEDIA_SOURCE}`)
