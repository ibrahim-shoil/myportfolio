# Videos

Drop your `.mp4` files in this folder, then add an entry to `data/videos.json`.

## Workflow to add a new video

1. Drop `myvideo.mp4` here (e.g. `public/videos/showreel-2026.mp4`)
2. (Optional) Add a poster image to `public/videos/posters/myvideo.jpg`
3. Add one entry to `data/videos.json`:

```json
{
  "slug": "showreel-2026",
  "title": "Showreel 2026",
  "category": "Reel",
  "description": "Short description shown on the card and share page.",
  "src": "/videos/showreel-2026.mp4",
  "poster": "/videos/posters/showreel-2026.jpg",
  "featured": true
}
```

4. Run `npm run build` and redeploy.

## Share link

Every video gets a shareable URL automatically:

```
ishoil.me/editor/v/<slug>
```

For example: `ishoil.me/editor/v/showreel-2026`

On the Videos section, each card has a "Share" button that copies this link to your clipboard.

## Tips

- Keep videos under ~100MB for reasonable load times.
- Use H.264 MP4 with AAC audio for maximum browser compatibility.
- Recommended resolution: 1080p (1920×1080). 720p is fine for short clips.
- Poster images should be 16:9 JPGs, ideally the same resolution as the video.
