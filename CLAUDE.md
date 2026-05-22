# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build

```bash
npm run build        # generates artwork/manifest.json from artwork/ folder contents
```

This is the only build step. Vercel runs it automatically on deploy (`vercel.json` sets `buildCommand: "npm run build"`).

## Architecture

This is a **pure static site** — no framework, no bundler, no dependencies. Three files form the entire frontend:

- `index.html` — all page sections in order: nav, hero, pain points, curriculum, tutor, artwork, testimonials, enroll CTA, footer, lightbox modal
- `styles.css` — all styles in one file, organised by section with `/* === SECTION === */` banners
- `main.js` — four concerns wired together in the `DOMContentLoaded` boot: artwork loading, lightbox, scroll animations, nav highlight

### Artwork pipeline

1. Images live in `artwork/` (jpg, jpeg, png, webp, gif, avif)
2. `scripts/generate-manifest.js` scans `artwork/`, derives captions from filenames, and writes `artwork/manifest.json`
3. `main.js` → `loadArtwork()` fetches `manifest.json` at runtime and injects `<div class="artwork__item" data-index="N">` elements into `#artworkGrid`
4. Click handlers are attached after injection; they call `openLightbox(index)` which reads from the module-level `artworkImages[]` array

Caption auto-detection in `generate-manifest.js` matches lowercase filename against keywords: `branding`/`logo`, `product_ad`, `product`, `ecommerce`/`ecom`, `prompt`, `edit`/`retouch`.

### Lightbox

State is two module-level variables in `main.js`: `artworkImages[]` (populated by `loadArtwork`) and `currentIndex`. The lightbox DOM (`#lightbox`) is static in HTML; JS toggles `.is-open` on it and updates `#lightboxImg`, `#lightboxCaption`, `#lightboxCounter`. Supports keyboard (ESC, ←/→), touch swipe (threshold 50px), and backdrop click.

### Adding new artwork

1. Upload image to `artwork/`
2. Push — Vercel rebuild auto-regenerates `manifest.json`

### Tutor photo

Place at `assets/tutor-photo.jpg`. The `<img>` in the tutor section has an `onerror` that hides the img and adds `.tutor__avatar--placeholder` to its parent, which shows a fallback emoji via `::after`.
