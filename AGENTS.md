# AGENTS.md

Guidance for AI agents (Claude, GPT, Copilot, etc.) working on this portfolio.

## What this project is

A personal portfolio for **Ibrahim A. Soliman** with **two profiles** behind a landing picker:

- **Developer profile** → `/dev` — full-stack engineering, DevOps, apps, AE scripts
- **Video Editor profile** → `/editor` — video editing, motion graphics, content creation (the freelancing site)

Built with **React 19 + Vite 7 + SCSS**. Backend is a tiny Express sidecar (`server/index.mjs`) for download counting on port 3002. Deployed via Nginx + PM2.

## Design standards (follow these on every UI change)

Two guideline docs live in `docs/design/`:

- `frontend-design.md` (Anthropic) — how to avoid templated "AI-generated" looks: no default gradient-text hero numbers, no eyebrow+pill-badge card patterns, ground the design in the subject (video editing), spend boldness in one place.
- `web-interface-guidelines.md` (Vercel) — mechanical quality floor: focus-visible on all interactive elements, `prefers-reduced-motion` respected, no `transition: all`, explicit transition properties, images with width/height, `text-wrap: balance` on headings, `touch-action: manipulation`, aria-labels on icon buttons.

Run new UI through both before shipping.

## Key conventions

- **No emojis or arrow characters** (`→`, `←`, `⭐`, etc.) anywhere in UI text. Use real inline SVG icons. This is a hard rule.
- **Font**: Cairo (self-hosted in `public/fonts/`) is the primary font via `$font-sans`. Don't switch to Inter/other fonts.
- **Theming**: dark/light via `body.dark` / `body.light` classes. SCSS uses `.light &` nested selectors and `@use '../styles/variables' as *` in every component stylesheet.
- **Design tokens**: all colors, shadows, transitions live in `src/styles/_variables.scss`. Reuse them — don't hardcode hex values.
- **Scroll reveal**: components use `useScrollReveal` hook + `.reveal-on-scroll` class + `--reveal-delay` CSS var for staggered entrance.
- **Data-driven**: content lives in JSON files under `data/`, not hardcoded in components.

## Where content lives

| Content | File | Notes |
|---|---|---|
| Videos (editor profile) | `data/videos.json` | Each entry: slug, title, category, description, src, poster, width, height, featured |
| Photo gallery | `data/gallery.json` | src, title, category |
| Video collections (series) | `data/collections.json` | See "Series/collections" below |
| Dev projects | inline in `src/components/Projects.jsx` | The dev profile's project list |
| Download counts | `data/downloads.json` | Written by the Express server, don't edit by hand |

## Adding a video

1. Encode it for web (critical for instant playback):
   ```bash
   ffmpeg -y -i input.mp4 \
     -c:v libx264 -profile:v high -level 4.0 -preset medium \
     -b:v 4M -maxrate 5M -bufsize 8M \
     -vf "scale=1080:1920:flags=lanczos" \
     -x264-params "keyint=60:min-keyint=60:scenecut=40" \
     -c:a aac -b:a 128k -ac 2 \
     -movflags +faststart \
     public/videos/slug-name.mp4
   ```
   **`-movflags +faststart` is mandatory** — without it the moov atom sits at the end and the browser buffers the whole file before playing. Target **3-5 Mbps** for 1080p (NOT the 30-40Mbps that editing software exports).
2. Generate a poster (grab a frame a few seconds in, skip intro fades):
   ```bash
   ffmpeg -y -ss 4 -i public/videos/slug-name.mp4 -frames:v 1 -q:v 3 public/videos/posters/slug-name.jpg
   ```
3. Add an entry to `data/videos.json`. Include `width`/`height` so the player picks the correct orientation (`portrait` for 9:16 reels).
4. `npm run build` + redeploy.

## Series / collections (multi-video share links)

A collection lets multiple related videos share **one link**: `ishoil.me/editor/c/<slug>`.

**To create one**, add an entry to `data/collections.json`:
```json
{
  "slug": "my-series-slug",
  "title": "Series Title (shown on the page)",
  "description": "What connects these videos.",
  "videos": ["video-slug-1", "video-slug-2"]
}
```
- The `videos` array references slugs that already exist in `data/videos.json`.
- The collection page (`CollectionSharePage`) renders a playlist: player + sidebar list to switch between videos.
- Video cards on `/editor` automatically show a "Part of series" link if the video belongs to a collection.
- Don't leak internal/client project names into `title`/`description` — keep them generic and professional.

## Routing

- `/` → Landing (pick Developer / Video Editor)
- `/dev` → Developer profile
- `/editor` → Video Editor profile
- `/editor/v/:slug` → Single video share page (`VideoSharePage`)
- `/editor/c/:slug` → Collection share page (`CollectionSharePage`)
- `/rtl-toggle-privacy` → Privacy policy (standalone)

Routing is in `src/App.jsx`. The Navbar is config-driven via `NAV_PROFILES` in `src/components/Navbar.jsx` — each profile declares its own links + a switch toggle.

## Player notes

The custom `VideoPlayer` (`src/components/VideoPlayer.jsx`):
- Supports `ratio` prop: `"portrait"` | `"landscape"` | `"square"` — portrait videos get height-capped framing.
- In fullscreen, a **blurred copy of the video** (`.vp-fill-bg`, `position: fixed`) fills the black bars behind a centered vertical video.
- Compact controls on narrow/portrait players (`.vp-portrait` hides skip buttons + volume slider).
- Keyboard shortcuts: Space/k (play), ←/→ (±10s), f (fullscreen), m (mute).

## Build & deploy

```bash
npm run build          # outputs to dist/
systemctl reload nginx # serves dist/ (config: /etc/nginx/sites-available/ishoil.me)
```

Nginx config includes video range-request support (HTTP 206) and font caching. The download-counter API is proxied from `/api/` to `127.0.0.1:3002` (PM2 app `ishoil-downloads`).

## Don't

- Don't hardcode project/client names (e.g. "KAYN") into visible text or data unless explicitly requested.
- Don't add dependencies without strong reason — the project is intentionally lean (React + Vite + sass only).
- Don't remove the `faststart`/range-request setup — that's what makes videos play instantly.
