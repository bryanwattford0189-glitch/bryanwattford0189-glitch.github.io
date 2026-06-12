/* =========================================
   SAM BY GLAM — JAVASCRIPT
   ========================================= */

/* ---- Block scroll during load ---- */
document.body.style.overflow = 'hidden';

/* ---- Page Loader ---- */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.classList.add('hidden');
    document.body.style.overflow = '';
  }, 2300);
});

/* ---- Custom Cursor ---- */
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let mouseX = 0, mouseY = 0;
let fx = 0, fy = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

(function animateFollower() {
  fx += (mouseX - fx) * 0.11;
  fy += (mouseY - fy) * 0.11;
  follower.style.left = fx + 'px';
  follower.style.top = fy + 'px';
  requestAnimationFrame(animateFollower);
})();

document.querySelectorAll('a, button, .gallery-scroll-item, .service-card, .t-dot, .strip-item').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('hovering'); follower.classList.add('hovering'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('hovering'); follower.classList.remove('hovering'); });
});

/* ---- Navbar Scroll ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ---- Mobile Menu ---- */
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

menuBtn.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  const [s1, s2] = menuBtn.querySelectorAll('span');
  s1.style.transform = menuOpen ? 'rotate(45deg) translate(4px, 4px)' : '';
  s2.style.transform = menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : '';
});

mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    const [s1, s2] = menuBtn.querySelectorAll('span');
    s1.style.transform = '';
    s2.style.transform = '';
  });
});

/* ---- Smooth Scroll ---- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ---- Intersection Observer: Scroll Animations ---- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

/* ---- Stats Counter ---- */
function countUp(el, target, duration = 1800) {
  let start = null;
  const step = (ts) => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(eased * target);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      const numEl = entry.target.querySelector('.stat-number');
      countUp(numEl, parseInt(numEl.dataset.count));
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(el => statObserver.observe(el));

/* ---- Marquee: clone enough copies to fill screen, animate by one copy width ---- */
document.querySelectorAll('.marquee-track').forEach(track => {
  const inner = track.querySelector('.marquee-inner');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const copyWidth = inner.getBoundingClientRect().width;
      const needed = Math.ceil((window.innerWidth * 3) / copyWidth);
      for (let i = 1; i < needed; i++) {
        const clone = inner.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      }
      track.style.setProperty('--marquee-offset', `-${copyWidth}px`);
      track.style.animationPlayState = 'running';
    });
  });
});

/* ---- Gallery Infinite Scroll: duplicate + measure exact offset ---- */
const track = document.getElementById('scrollTrack1');
if (track) {
  const originals = Array.from(track.children);
  originals.forEach(item => {
    const clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.dataset.clone = 'true';
    track.appendChild(clone);
  });
  // After layout, measure the exact pixel width of the originals
  // so the loop snaps back to pixel-perfect with zero visible jump
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const offset = track.scrollWidth / 2;
      track.style.setProperty('--track-offset', `-${offset}px`);
    });
  });
}

/* ---- Lightbox ---- */
const lightbox = document.getElementById('lightbox');
const lightboxBackdrop = document.getElementById('lightboxBackdrop');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTag = document.getElementById('lightboxTag');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxDesc = document.getElementById('lightboxDesc');
let currentItems = [];
let currentIdx = 0;

function openLightbox(item, items) {
  currentItems = items;
  currentIdx = items.indexOf(item);
  populateLightbox(item);
  lightbox.classList.add('open');
  lightboxBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function populateLightbox(item) {
  const img = item.querySelector('.gallery-img');
  lightboxImg.style.backgroundImage = img.style.backgroundImage;
  lightboxImg.style.backgroundSize = 'cover';
  lightboxImg.style.backgroundPosition = 'center';
  lightboxTag.textContent = item.querySelector('.gallery-tag').textContent;
  lightboxTitle.textContent = item.querySelector('h3').textContent;
  lightboxDesc.textContent = item.querySelector('p').textContent;
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightboxBackdrop.classList.remove('open');
  document.body.style.overflow = '';
}

function navigate(dir) {
  currentIdx = (currentIdx + dir + currentItems.length) % currentItems.length;
  populateLightbox(currentItems[currentIdx]);
}

// All original (non-clone) scroll items are lightbox-eligible
const scrollItems = () => Array.from(document.querySelectorAll('.gallery-scroll-item:not([data-clone])'));

document.querySelectorAll('.gallery-scroll-item').forEach(item => {
  if (item.dataset.clone) return;
  item.addEventListener('click', () => openLightbox(item, scrollItems()));
});

document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
lightboxBackdrop.addEventListener('click', closeLightbox);
document.getElementById('lightboxPrev').addEventListener('click', () => navigate(-1));
document.getElementById('lightboxNext').addEventListener('click', () => navigate(1));

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') navigate(1);
  if (e.key === 'ArrowLeft') navigate(-1);
});

/* ---- Testimonial Slider ---- */
const testimonials = Array.from(document.querySelectorAll('.testimonial-card'));
const tDots = document.getElementById('tDots');
let current = 0;
let autoTimer;

testimonials.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.className = 't-dot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => goTo(i));
  tDots.appendChild(dot);
});

function goTo(idx) {
  testimonials[current].classList.remove('active');
  current = (idx + testimonials.length) % testimonials.length;
  testimonials[current].classList.add('active');
  document.querySelectorAll('.t-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  clearTimeout(autoTimer);
  autoTimer = setTimeout(() => goTo(current + 1), 5500);
}

document.getElementById('tPrev').addEventListener('click', () => goTo(current - 1));
document.getElementById('tNext').addEventListener('click', () => goTo(current + 1));
autoTimer = setTimeout(() => goTo(1), 5500);

/* ---- Service Cards: staggered entrance via data-animate ---- */
document.querySelectorAll('.service-card').forEach(card => {
  card.setAttribute('data-animate', '');
  observer.observe(card);
});

/* ---- Magnetic Buttons ---- */
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.28;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.28;
    btn.style.transform = `translate(${x}px, ${y}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ---- Hero Mouse Parallax (orbs drift subtly with cursor) ---- */
const heroSection = document.getElementById('hero');
const orbs = document.querySelectorAll('.hero-orb');
document.addEventListener('mousemove', (e) => {
  if (!heroSection) return;
  const rect = heroSection.getBoundingClientRect();
  if (e.clientY > rect.bottom) return;
  const x = (e.clientX / window.innerWidth - 0.5) * 2;
  const y = (e.clientY / window.innerHeight - 0.5) * 2;
  orbs.forEach((orb, i) => {
    const d = (i + 1) * 6;
    orb.style.transform = `translate(${x * d}px, ${y * d}px)`;
  });
}, { passive: true });

/* ---- Gallery Scroll Items: subtle 3D tilt on hover ---- */
document.querySelectorAll('.gallery-scroll-item').forEach(item => {
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    item.style.transform = `perspective(700px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.03) translateY(-6px)`;
  });
  item.addEventListener('mouseleave', () => {
    item.style.transform = '';
  });
});
