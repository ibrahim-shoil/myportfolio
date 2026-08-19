/**
 * Link the GTA6 downloads media into dist/ after a build.
 *
 * `vite build` wipes dist/, so the 4 GB of video files live outside it in
 * /var/www/gta6-media and are re-linked here on every build. If the media
 * directory is missing (fresh server), the link is skipped and the downloads
 * page simply 404s until run_gta6_download.sh is executed once:
 *   WEB_ROOT=/var/www/gta6-media bash run_gta6_download.sh
 */
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
