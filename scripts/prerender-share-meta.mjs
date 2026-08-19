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
const PERSON_ID = `${SITE}/#ibrahim`
const WEBSITE_ID = `${SITE}/#website`

const PERSON = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Ibrahim A. Soliman',
  alternateName: ['ishoil', 'Ibrahim Shoil', 'Ibrahim Ahmed Soliman', 'إبراهيم شُعيل', 'إبراهيم شعيل', 'ابراهيم شعيل', 'ابراهيم أحمد شعيل'],
  url: `${SITE}/`,
  image: DEFAULT_OG_IMAGE,
  jobTitle: ['Full-Stack Engineer', 'DevOps Engineer', 'Video Editor', 'Motion Designer'],
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'Al-Azhar University', address: 'Cairo, Egypt' },
  knowsAbout: ['Full-Stack Development', 'DevOps', 'Python', 'Node.js', 'React', 'Docker', 'Nginx', 'Video Editing', 'Motion Graphics'],
  sameAs: ['https://github.com/ibrahim-shoil'],
}

const WEBSITE = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE}/`,
  name: 'Ibrahim A. Soliman',
  alternateName: ['ishoil', 'إبراهيم شعيل', 'ابراهيم شعيل'],
  inLanguage: ['en', 'ar'],
  publisher: { '@id': PERSON_ID },
}

// --- Load the same data the app uses ---
const videos = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/videos.json'), 'utf-8'))
const collections = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/collections.json'), 'utf-8'))

const LANGS = ['en', 'ar']
const LOCALE = { en: 'en_US', ar: 'ar_EG' }

const pick = (obj, lang) => (obj && typeof obj === 'object' ? (obj[lang] || obj.en) : obj)
const publicPath = (url) => url === '/' ? '/' : `${url.replace(/\/+$/, '')}/`
const absoluteUrl = (url) => `${SITE}${publicPath(url)}`

// --- UI titles for the editor landing per language ---
const LANDING_TITLE = {
  en: 'Ibrahim A. Soliman — Video Editor & Motion Designer',
  ar: 'إبراهيم شعيل — مونتير فيديو ومصمم موشن جرافيك',
}
const LANDING_DESC = {
  en: 'Video editing, motion graphics, infographics, and animated maps by Ibrahim A. Soliman.',
  ar: 'أعمال إبراهيم شعيل في مونتاج الفيديو والموشن جرافيك والإنفوجرافيك والخرائط المتحركة.',
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
function buildHtml({ template, lang, url, title, description, image, type = 'website', canonicalUrl, indexable = true, includeAlternates = true, structuredData, videoEmbed = null }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  const htmlLang = lang
  const otherLang = lang === 'en' ? 'ar' : 'en'
  const canonical = canonicalUrl || absoluteUrl(url)
  const alternate = absoluteUrl(url.replace(`/editor/${lang}`, `/editor/${otherLang}`))

  const titleTag = `<title>${escapeHtml(title)}</title>`
  const metaDesc = `<meta name="description" content="${escapeHtml(description)}" />`
  const canonicalTag = `<link rel="canonical" href="${canonical}" />`
  const robotsTag = `<meta name="robots" content="${indexable ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' : 'noindex, follow'}" />`

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

  const hreflangTags = includeAlternates ? [
    `<link rel="alternate" hreflang="${lang}" href="${canonical}" />`,
    `<link rel="alternate" hreflang="${otherLang}" href="${alternate}" />`,
    `<link rel="alternate" hreflang="x-default" href="${SITE}/editor/en/" />`,
  ].join('\n    ') : ''

  const jsonLd = structuredData
    ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', ...structuredData })}</script>`
    : ''

  // Strip any existing title/description/canonical/og/twitter from the template
  // (the base index.html has the developer-profile meta), then inject ours.
  let html = template
    // Remove existing SEO tags we're replacing
    .replace(/<title>[\s\S]*?<\/title>/, titleTag)
    .replace(/<meta\s+name=["']description["'][^>]*>/, metaDesc)
    .replace(/<link\s+rel=["']canonical["'][^>]*>/, canonicalTag)
    .replace(/<meta\s+name=["']robots["'][^>]*>/, robotsTag)
    .removeExistingMeta('property', 'og:')
    .removeExistingMeta('property', 'og:locale')
    .removeExistingMeta('name', 'twitter:')
    .replace(/\s*<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/g, '')

  // Set html lang/dir — strip ALL existing lang/dir attributes to avoid duplicates
  html = html.replace(/<html\b[^>]*>/, (m) => {
    const cleaned = m
      .replace(/\s+lang=["'][^"']*["']/gi, '')
      .replace(/\s+dir=["'][^"']*["']/gi, '')
    return `<html lang="${htmlLang}" dir="${dir}"` + (cleaned.endsWith('/>') ? ' />' : '>')
  })

  // Inject our OG/Twitter/hreflang + the alternate locale just before </head>
  const inject = `    ${ogTags}\n    ${twitterTags}${hreflangTags ? `\n    ${hreflangTags}` : ''}${jsonLd ? `\n    ${jsonLd}` : ''}\n  </head>`
  html = html.replace(/\s*<\/head>/, '\n' + inject)

  // Static <video> inside #root so crawlers see the page's main video content
  // before JavaScript runs (Google requires a playable video for a "watch page").
  // React replaces #root's children on mount, so human visitors are unaffected.
  if (videoEmbed) html = html.replace('<div id="root"></div>', `<div id="root">${videoEmbed}</div>`)

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

function pageGraph({ url, name, description, lang, mainEntity }) {
  return {
    '@graph': [
      WEBSITE,
      PERSON,
      {
        '@type': 'WebPage',
        '@id': `${absoluteUrl(url)}#webpage`,
        url: absoluteUrl(url),
        name,
        description,
        inLanguage: lang,
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': PERSON_ID },
        ...(mainEntity ? { mainEntity } : {}),
      },
    ],
  }
}

function writeSitemap(tools = []) {
  const today = new Date().toISOString().slice(0, 10)
  const entries = [
    { loc: `${SITE}/`, priority: '1.0', changefreq: 'monthly' },
    { loc: `${SITE}/dev/`, priority: '0.9', changefreq: 'monthly' },
  ]

  for (const tool of tools) {
    entries.push({ loc: `${SITE}/dev/tools/${tool.slug}/`, priority: '0.8', changefreq: 'monthly' })
  }

  for (const lang of LANGS) {
    entries.push({ loc: `${SITE}/editor/${lang}/`, priority: '0.9', changefreq: 'weekly' })
    for (const video of videos) entries.push({ loc: `${SITE}/editor/${lang}/v/${video.slug}/`, priority: '0.8', changefreq: 'monthly' })
    for (const collection of collections) entries.push({ loc: `${SITE}/editor/${lang}/c/${collection.slug}/`, priority: '0.7', changefreq: 'monthly' })
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.map(entry => `  <url>\n    <loc>${entry.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>`).join('\n')}\n</urlset>\n`
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), xml)
}

function main() {
  if (!fs.existsSync(path.join(DIST, 'index.html'))) {
    console.error('dist/index.html not found. Run `vite build` first.')
    process.exit(1)
  }

  const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8')
  const written = []

  const SITE_NAME = { en: 'Ibrahim A. Soliman', ar: 'إبراهيم شعيل' }
  const UPWORK_PREVIEW = { en: 'Upwork Portfolio Preview', ar: 'معاينة أعمال عبر Upwork' }

  const rootTitle = 'Ibrahim A. Soliman (ishoil) | إبراهيم شعيل'
  const rootDescription = 'The official portfolio of Ibrahim A. Soliman, also known as ishoil and إبراهيم شعيل — full-stack engineer, DevOps practitioner, video editor, and motion designer.'
  const rootHtml = buildHtml({
    template, lang: 'en', url: '/', title: rootTitle, description: rootDescription,
    image: DEFAULT_OG_IMAGE, includeAlternates: false,
    structuredData: { '@graph': [WEBSITE, PERSON] },
  })
  written.push(writeFile('index.html', rootHtml))

  const devUrl = '/dev'
  const devTitle = 'Ibrahim A. Soliman | Full-Stack & DevOps Engineer'
  const devDescription = 'Developer portfolio of Ibrahim A. Soliman (ishoil): full-stack applications, backend systems, DevOps, deployment, and mobile app publishing.'
  const devHtml = buildHtml({
    template, lang: 'en', url: devUrl, title: devTitle, description: devDescription,
    image: DEFAULT_OG_IMAGE, includeAlternates: false,
    structuredData: {
      '@graph': [WEBSITE, PERSON, {
        '@type': 'ProfilePage', '@id': `${absoluteUrl(devUrl)}#profile`, url: absoluteUrl(devUrl),
        name: devTitle, description: devDescription, mainEntity: { '@id': PERSON_ID },
      }],
    },
  })
  written.push(writeFile('dev/index.html', devHtml))

  // Tool pages — the indexable surface for the free After Effects scripts.
  const tools = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'tools.json'), 'utf-8'))
  for (const tool of tools) {
    const url = `/dev/tools/${tool.slug}`
    const html = buildHtml({
      template, lang: 'en', url,
      title: `${tool.titleSeo} | ishoil`,
      description: tool.descriptionSeo,
      image: DEFAULT_OG_IMAGE,
      includeAlternates: false,
      structuredData: pageGraph({
        url, name: tool.titleSeo, description: tool.descriptionSeo, lang: 'en',
        mainEntity: {
          '@type': 'SoftwareApplication',
          '@id': `${absoluteUrl(url)}#tool`,
          url: absoluteUrl(url),
          name: tool.name,
          softwareVersion: tool.version,
          description: tool.descriptionSeo,
          applicationCategory: 'MultimediaApplication',
          operatingSystem: 'Windows, macOS',
          author: { '@id': PERSON_ID },
          downloadUrl: `${SITE}/downloads/${tool.file}`,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        },
      }),
    })
    written.push(writeFile(`${url}/index.html`, html))
  }

  for (const lang of LANGS) {
    const siteName = SITE_NAME[lang]
    // 1. Editor landing
    const landingPath = `/editor/${lang}`
    const landingHtml = buildHtml({
      template, lang, url: landingPath,
      title: LANDING_TITLE[lang], description: LANDING_DESC[lang], image: DEFAULT_OG_IMAGE,
      structuredData: pageGraph({ url: landingPath, name: LANDING_TITLE[lang], description: LANDING_DESC[lang], lang }),
    })
    written.push(writeFile(`${landingPath}/index.html`, landingHtml))

    // 2. Each video share page
    for (const v of videos) {
      const url = `/editor/${lang}/v/${v.slug}`
      const videoEntity = {
        '@type': 'VideoObject', '@id': `${absoluteUrl(url)}#project`, url: absoluteUrl(url),
        name: pick(v.title, lang), description: pick(v.description, lang),
        thumbnailUrl: v.poster ? [`${SITE}${v.poster}`] : [DEFAULT_OG_IMAGE],
        uploadDate: v.publishedDate || '2026-08-01',
        ...(v.src ? { contentUrl: `${SITE}${v.src}` } : {}),
        inLanguage: v.contentLanguage || lang, creator: { '@id': PERSON_ID },
      }
      const html = buildHtml({
        template, lang, url,
        title: `${pick(v.title, lang)} — ${siteName}`,
        description: pick(v.description, lang),
        image: v.poster ? `${SITE}${v.poster}` : DEFAULT_OG_IMAGE,
        type: 'video.other',
        structuredData: pageGraph({ url, name: `${pick(v.title, lang)} — ${siteName}`, description: pick(v.description, lang), lang, mainEntity: videoEntity }),
        videoEmbed: v.src
          ? `<video controls playsinline preload="metadata" src="${SITE}${v.src}"${v.poster ? ` poster="${SITE}${v.poster}"` : ''}${v.width && v.height ? ` width="${v.width}" height="${v.height}"` : ''} style="width:100%;max-width:1280px;display:block;margin:0 auto;background:#000"></video>`
          : null,
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
        structuredData: pageGraph({
          url, name: `${pick(c.title, lang)} — ${siteName}`, description: pick(c.description, lang), lang,
          mainEntity: {
            '@type': 'CollectionPage', '@id': `${absoluteUrl(url)}#collection`, url: absoluteUrl(url),
            name: pick(c.title, lang), description: pick(c.description, lang), creator: { '@id': PERSON_ID },
          },
        }),
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
        canonicalUrl: `${SITE}/editor/${lang}/v/${v.slug}/`,
        indexable: false,
        includeAlternates: false,
      })
      written.push(writeFile(`${url}/index.html`, html))
    }
  }

  writeSitemap(tools)

  console.log(`Prerendered ${written.length} share/SEO HTML files:`)
  for (const w of written) console.log('  ' + w)
}

main()
