const fs = require('fs');
const path = require('path');

const ARTWORK_DIR = path.join(__dirname, '..', 'artwork');
const MANIFEST_PATH = path.join(ARTWORK_DIR, 'manifest.json');
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

// Auto-derive a display caption from the filename
function captionFromFilename(filename) {
  const base = path.basename(filename, path.extname(filename)).toLowerCase();
  if (base.includes('branding') || base.includes('logo')) return '品牌 Logo 設計';
  if (base.includes('product_ad') || base.includes('productad')) return '產品電商廣告圖';
  if (base.includes('product')) return '產品攝影圖';
  if (base.includes('ecommerce') || base.includes('ecom')) return '電商視覺設計';
  if (base.includes('prompt')) return 'AI Prompt 作品';
  if (base.includes('edit') || base.includes('retouch')) return '修圖作品';
  return '學員作品';
}

const files = fs.readdirSync(ARTWORK_DIR)
  .filter(f => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()))
  .sort()
  .map(file => ({
    file,
    caption: captionFromFilename(file),
  }));

const manifest = { images: files };
fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');

console.log(`Generated manifest with ${files.length} image(s):`);
files.forEach(({ file, caption }) => console.log(`  ${file} → ${caption}`));
