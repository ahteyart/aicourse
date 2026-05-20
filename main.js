// ── Artwork grid ─────────────────────────────────────────────────────────────
// Reads artwork/manifest.json and populates #artworkGrid.
// To add new images: upload to artwork/ — the build script regenerates manifest.json.

let artworkImages = []; // { src, caption } — populated by loadArtwork()

async function loadArtwork() {
  const grid = document.getElementById('artworkGrid');
  if (!grid) return;

  let manifest;
  try {
    const res = await fetch('artwork/manifest.json');
    if (!res.ok) throw new Error('manifest not found');
    manifest = await res.json();
  } catch {
    return;
  }

  const images = manifest.images || [];
  if (images.length === 0) return;

  artworkImages = images.map(({ file, caption }) => ({
    src: `artwork/${file}`,
    caption: caption || '學員作品',
  }));

  grid.innerHTML = artworkImages
    .map(({ src, caption }, index) => `
    <div class="artwork__item" data-index="${index}" role="button" tabindex="0" aria-label="放大查看：${caption}">
      <img
        src="${src}"
        alt="${caption}"
        loading="lazy"
        onerror="this.closest('.artwork__item').style.display='none'"
        draggable="false"
      />
      <div class="artwork__caption">${caption}</div>
    </div>`)
    .join('');

  // attach click/keyboard handlers after DOM is built
  grid.querySelectorAll('.artwork__item').forEach((item) => {
    item.addEventListener('click', () => openLightbox(Number(item.dataset.index)));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') openLightbox(Number(item.dataset.index));
    });
  });
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
let currentIndex = 0;

const lb = {
  el:       () => document.getElementById('lightbox'),
  img:      () => document.getElementById('lightboxImg'),
  caption:  () => document.getElementById('lightboxCaption'),
  counter:  () => document.getElementById('lightboxCounter'),
  prev:     () => document.getElementById('lightboxPrev'),
  next:     () => document.getElementById('lightboxNext'),
};

function openLightbox(index) {
  currentIndex = index;
  renderLightbox();
  lb.el().classList.add('is-open');
  document.body.style.overflow = 'hidden';
  lb.img().focus();
}

function closeLightbox() {
  lb.el().classList.remove('is-open');
  document.body.style.overflow = '';
}

function renderLightbox() {
  const { src, caption } = artworkImages[currentIndex];
  const img = lb.img();
  img.src = src;
  img.alt = caption;
  lb.caption().textContent = caption;
  lb.counter().textContent = `${currentIndex + 1} / ${artworkImages.length}`;
  lb.prev().disabled = currentIndex === 0;
  lb.next().disabled = currentIndex === artworkImages.length - 1;
}

function showPrev() {
  if (currentIndex > 0) { currentIndex--; renderLightbox(); }
}

function showNext() {
  if (currentIndex < artworkImages.length - 1) { currentIndex++; renderLightbox(); }
}

function initLightbox() {
  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  document.getElementById('lightboxBackdrop').addEventListener('click', closeLightbox);
  document.getElementById('lightboxPrev').addEventListener('click', showPrev);
  document.getElementById('lightboxNext').addEventListener('click', showNext);

  document.addEventListener('keydown', (e) => {
    if (!lb.el().classList.contains('is-open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   showPrev();
    if (e.key === 'ArrowRight')  showNext();
  });

  // swipe support for mobile
  let touchStartX = 0;
  lb.el().addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lb.el().addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) dx < 0 ? showNext() : showPrev();
  });
}

// ── Scroll fade-in ────────────────────────────────────────────────────────────
function injectFadeInStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .fade-in {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.55s ease, transform 0.55s ease;
    }
    .fade-in.is-visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);
}

function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(
    '.module-card, .pain__card, .testimonial-card, .tutor__card'
  ).forEach((el) => {
    el.classList.add('fade-in');
    observer.observe(el);
  });
}

// ── Nav scroll highlight ──────────────────────────────────────────────────────
function initNavHighlight() {
  const nav = document.querySelector('.nav');
  const style = document.createElement('style');
  style.textContent = `.nav--scrolled { background: rgba(10,10,15,0.97) !important; }`;
  document.head.appendChild(style);
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 50);
  }, { passive: true });
}

// ── Boot ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  injectFadeInStyles();
  initLightbox();
  loadArtwork();
  initScrollAnimations();
  initNavHighlight();
});
