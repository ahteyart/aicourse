// ── Artwork grid ─────────────────────────────────────────────────────────────
// Reads artwork/manifest.json and populates #artworkGrid.
// To add new images: upload to artwork/ and add the filename to manifest.json.

async function loadArtwork() {
  const grid = document.getElementById('artworkGrid');
  if (!grid) return;

  let manifest;
  try {
    const res = await fetch('artwork/manifest.json');
    if (!res.ok) throw new Error('manifest not found');
    manifest = await res.json();
  } catch {
    return; // leave grid empty if manifest missing
  }

  const images = manifest.images || [];
  if (images.length === 0) return;

  grid.innerHTML = images
    .map(
      ({ file, caption }) => `
    <div class="artwork__item">
      <img
        src="artwork/${file}"
        alt="${caption || '學員作品'}"
        loading="lazy"
        onerror="this.closest('.artwork__item').style.display='none'"
      />
      ${caption ? `<div class="artwork__caption">${caption}</div>` : ''}
    </div>`
    )
    .join('');
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
    .artwork__item {
      position: relative;
      overflow: hidden;
    }
    .artwork__caption {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%);
      color: #fff;
      font-size: 0.8rem;
      font-weight: 600;
      padding: 24px 14px 12px;
      opacity: 0;
      transition: opacity 0.25s ease;
    }
    .artwork__item:hover .artwork__caption { opacity: 1; }
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
  loadArtwork();
  initScrollAnimations();
  initNavHighlight();
});
