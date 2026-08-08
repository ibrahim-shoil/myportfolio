# Gallery

Drop your images in this folder, then add entries to `data/gallery.json`.

## Workflow to add a new image

1. Drop `myimage.jpg` here (e.g. `public/gallery/still-1.jpg`)
2. Add one entry to `data/gallery.json`:

```json
{
  "src": "/gallery/still-1.jpg",
  "title": "Motion graphics still",
  "category": "Motion"
}
```

3. Run `npm run build` and redeploy.

## Tips

- Use JPG for photos/screenshots, PNG for graphics with sharp edges or transparency.
- Recommended max width: 1600px. Compress before uploading (TinyPNG, Squosh, etc).
- Categories appear as filter chips. Suggested: Reel, Motion, Infographic, Thumbnail.
