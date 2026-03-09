# galla

**Galla** is a minimal, fullscreen photo viewer built with Next.js and TypeScript.

### Photo Detail Sidebar
Click any photo to slide in a sidebar (powered by Motion) from the right. Shows the photo large with metadata below it — date on the left, "Taken with [camera link]" on the right. A close button lives on the left edge of the sidebar and fades out as it closes.

### Mode Switcher
A minimal bottom-center pill with **Canvas** and **Flow** tabs. Currently only Canvas is implemented.

### Adding Photos
Drop images into `public/photos/` and add entries to `public/photos/photos.json`:
```json
{
  "src": "/photos/filename.jpg",
  "date": "MAR 8, 2026",
  "camera": "FUJIFILM X100V",
  "cameraUrl": "https://fujifilm.com"
}
```

### Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Motion (sidebar animations)
- Geist Mono font
