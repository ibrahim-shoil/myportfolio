/**
 * Prerender per-language, per-page Open Graph / SEO metadata as static HTML files.
 *
 * Social crawlers (WhatsApp, Facebook, Twitter, Telegram) do not execute
 * JavaScript, so they read the <head> of whatever HTML Nginx serves. To give
 * each share URL its own language-correct title/description/image, we emit one
 * HTML file per (language × page) into dist/editor/... and Nginx's existing
 * `try_files` serves them. Humans still get the full SPA (same JS shell).
 *
 * Run after `vite build`.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const DIST = path.join(ROOT, 'dist')

const SITE = 'https://ishoil.me'
const DEFAULT_OG_IMAGE = `${SITE}/is_logo.png`

// --- Load the same data the app uses ---
const videos = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/videos.json'), 'utf-8'))
const collections = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/collections.json'), 'utf-8'))

const LANGS = ['en', 'ar']
const LOCALE = { en: 'en_US', ar: 'ar_EG' }

const pick = (obj, lang) => (obj && typeof obj === 'object' ? (obj[lang] || obj.en) : obj)

// --- UI titles for the editor landing per language ---
const LANDING_TITLE = {
  en: 'Ibrahim A. Soliman — Video Editor & Motion Designer',
  ar: 'إبراهيم شُعيل — مونتير فيديو ومصمم موشن',
}
const LANDING_DESC = {
  en: 'Video editing, motion graphics, infographics, and animated maps by Ibrahim A. Soliman.',
  ar: 'مونتاج فيديو، موشن جرافيك، إنفوجرافيك وخرائط متحركة — إبراهيم شُعيل.',
}

const escapeHtml = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

/**
 * Build the <head> replacements for a given page.
 * Returns the full HTML string.
 */
function buildHtml({ template, lang, url, title, description, image, type = 'website' }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  const htmlLang = lang
  const otherLang = lang === 'en' ? 'ar' : 'en'
  const canonical = `${SITE}${url}`
  const alternate = `${SITE}${url.replace(`/editor/${lang}`, `/editor/${otherLang}`)}`

  const titleTag = `<title>${escapeHtml(title)}</title>`
  const metaDesc = `<meta name="description" content="${escapeHtml(description)}" />`
  const canonicalTag = `<link rel="canonical" href="${canonical}" />`

  const ogTags = [
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:image" content="${image || DEFAULT_OG_IMAGE}" />`,
    `<meta property="og:site_name" content="Ibrahim A. Soliman" />`,
    `<meta property="og:locale" content="${LOCALE[lang]}" />`,
    `<meta property="og:locale:alternate" content="${LOCALE[otherLang]}" />`,
  ].join('\n    ')

  const twitterTags = [
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:image" content="${image || DEFAULT_OG_IMAGE}" />`,
  ].join('\n    ')

  const hreflangTags = [
    `<link rel="alternate" hreflang="${lang}" href="${canonical}" />`,
    `<link rel="alternate" hreflang="${otherLang}" href="${alternate}" />`,
    `<link rel="alternate" hreflang="x-default" href="${SITE}/editor/en" />`,
  ].join('\n    ')

  // Strip any existing title/description/canonical/og/twitter from the template
  // (the base index.html has the developer-profile meta), then inject ours.
  let html = template
    // Remove existing SEO tags we're replacing
    .replace(/<title>[\s\S]*?<\/title>/, titleTag)
    .replace(/<meta\s+name=["']description["'][^>]*>/, metaDesc)
    .replace(/<link\s+rel=["']canonical["'][^>]*>/, canonicalTag)
    .removeExistingMeta('property', 'og:')
    .removeExistingMeta('property', 'og:locale')
    .removeExistingMeta('name', 'twitter:')

  // Set html lang/dir — strip ALL existing lang/dir attributes to avoid duplicates
  html = html.replace(/<html\b[^>]*>/, (m) => {
    const cleaned = m
      .replace(/\s+lang=["'][^"']*["']/gi, '')
      .replace(/\s+dir=["'][^"']*["']/gi, '')
    return `<html lang="${htmlLang}" dir="${dir}"` + (cleaned.endsWith('/>') ? ' />' : '>')
  })

  // Inject our OG/Twitter/hreflang + the alternate locale just before </head>
  const inject = `    ${ogTags}\n    ${twitterTags}\n    ${hreflangTags}\n  </head>`
  html = html.replace(/\s*<\/head>/, '\n' + inject)

  return html
}

// Helper to strip groups of meta tags by attribute name prefix from a string.
// Attached as a String method for fluent chaining above.
String.prototype.removeExistingMeta = function (attr, prefix) {
  const re = new RegExp(`\\s*<meta\\s+${attr}=["']${prefix}[^"']*["'][^>]*>`, 'g')
  return this.replace(re, '')
}

function writeFile(relPath, content) {
  const full = path.join(DIST, relPath)
  fs.mkdirSync(path.dirname(full), { recursive: true })
  fs.writeFileSync(full, content)
  return relPath
}

function main() {
  if (!fs.existsSync(path.join(DIST, 'index.html'))) {
    console.error('dist/index.html not found. Run `vite build` first.')
    process.exit(1)
  }

  const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8')
  const written = []

  const SITE_NAME = { en: 'Ibrahim A. Soliman', ar: 'إبراهيم شُعيل' }
  const UPWORK_PREVIEW = { en: 'Upwork Portfolio Preview', ar: 'معاينة أعمال عبر Upwork' }

  for (const lang of LANGS) {
    const siteName = SITE_NAME[lang]
    // 1. Editor landing
    const landingPath = `/editor/${lang}`
    const landingHtml = buildHtml({
      template, lang, url: landingPath,
      title: LANDING_TITLE[lang], description: LANDING_DESC[lang], image: DEFAULT_OG_IMAGE,
    })
    written.push(writeFile(`${landingPath}/index.html`, landingHtml))

    // 2. Each video share page
    for (const v of videos) {
      const url = `/editor/${lang}/v/${v.slug}`
      const html = buildHtml({
        template, lang, url,
        title: `${pick(v.title, lang)} — ${siteName}`,
        description: pick(v.description, lang),
        image: v.poster ? `${SITE}${v.poster}` : DEFAULT_OG_IMAGE,
        type: 'video.other',
      })
      written.push(writeFile(`${url}/index.html`, html))
    }

    // 3. Each collection share page
    for (const c of collections) {
      const url = `/editor/${lang}/c/${c.slug}`
      const firstVideo = videos.find(vv => vv.slug === c.videos[0])
      const image = firstVideo?.poster ? `${SITE}${firstVideo.poster}` : DEFAULT_OG_IMAGE
      const html = buildHtml({
        template, lang, url,
        title: `${pick(c.title, lang)} — ${siteName}`,
        description: pick(c.description, lang),
        image,
        type: 'website',
      })
      written.push(writeFile(`${url}/index.html`, html))
    }

    // 4. Contact-free project pages for links placed on Upwork.
    // They reuse the exact same project data/media, but the React route omits
    // every contact, social, hire, and normal-site navigation surface.
    for (const v of videos) {
      const url = `/editor/${lang}/upwork/${v.slug}`
      const html = buildHtml({
        template, lang, url,
        title: `${pick(v.title, lang)} — ${UPWORK_PREVIEW[lang]}`,
        description: pick(v.description, lang),
        image: v.poster ? `${SITE}${v.poster}` : DEFAULT_OG_IMAGE,
        type: 'video.other',
      })
      written.push(writeFile(`${url}/index.html`, html))
    }
  }

  console.log(`Prerendered ${written.length} share/SEO HTML files:`)
  for (const w of written) console.log('  ' + w)
}

main()
