# Student Artwork Folder

Upload student artwork images to this folder. Supported formats:

- `.jpg` / `.jpeg`
- `.png`
- `.webp`
- `.gif`

## How to display artwork on the page

Add your images here and update `index.html` — find the `artworkGrid` section and replace the placeholder `<div>` blocks with:

```html
<div class="artwork__item">
  <img src="artwork/your-image-name.jpg" alt="學員作品" loading="lazy" />
</div>
```

Repeat for each image you add.

## Recommended image size

- **Aspect ratio**: 4:3 (e.g. 800×600 px)
- **Max file size**: 500 KB per image for fast loading
