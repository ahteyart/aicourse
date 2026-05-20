// Dynamically load artwork images from the artwork/ folder
// Since this runs in a browser without a server listing, we attempt
// known image extensions. When you host this on a server, replace
// with a server-side file listing or a JSON manifest.

const ARTWORK_FOLDER = 'artwork/';
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

// Simple intersection-observer for fade-in animations
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

// Add CSS for fade-in via JS so it only activates when JS is available
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

// Smooth active state on nav
function initNavHighlight() {
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 50);
  }, { passive: true });

  const style = document.createElement('style');
  style.textContent = `.nav--scrolled { background: rgba(10,10,15,0.97) !important; }`;
  document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', () => {
  injectFadeInStyles();
  initScrollAnimations();
  initNavHighlight();
});
