# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (default port 3000)
npm run dev -- --port 3001  # Start on alternate port
npm run build        # Production build
npm run lint         # Run ESLint
```

No test suite is set up.

## Architecture

Galla is a fullscreen photo viewer. The main page (`app/page.tsx`) holds all top-level state: loaded photos, selected photo, and current view mode. It renders three components: `InfiniteCanvas`, `PhotoSidebar`, and `BottomNav`.

### InfiniteCanvas (`components/InfiniteCanvas.tsx`)
The most important file. The grid is driven entirely by **imperative DOM manipulation** — React does not manage the cell elements. A `useEffect` creates plain `<div>` + `<img>` DOM nodes for all visible cells and starts a `requestAnimationFrame` loop. The RAF loop updates `left`, `top`, and `transform: scale(...)` on each cell directly every frame without triggering any React re-renders.

- `offsetRef` tracks the current pan offset (never React state)
- Pan input (mouse drag, touch, wheel) mutates `offsetRef.current` directly
- Inertia is a separate RAF loop decaying `velocity`
- Tiling: cells are positioned at `col * TILE_W + (offset % TILE_W)` — wrapping creates infinite repetition
- Scale effect: each cell scales between `MIN_SCALE` (0.45) and 1.0 based on distance from viewport center using a smoothstep curve
- Photo assignment: `worldCol = col - floor(offsetX / TILE_W)` gives a stable world-space index; photos are distributed round-robin across `(worldCol + worldRow) % photos.length`

Cell constants (`CELL_W`, `CELL_H`, `GAP`, `MIN_SCALE`) are at the top of the file.

### PhotoSidebar (`components/PhotoSidebar.tsx`)
Slides in from the right using `motion` (`AnimatePresence` + spring transition). Floats over the canvas as a `fixed` panel — does not affect canvas layout. The close button is part of the sidebar's `motion.div` and fades out on exit.

### Photos data (`public/photos/photos.json`)
Runtime-fetched JSON array of `Photo` objects. The `Photo` type is defined in `lib/photos.ts`. Add images to `public/photos/` and register them in `photos.json`. Fields: `src` (required), `date`, `camera`, `cameraUrl` (all optional).
