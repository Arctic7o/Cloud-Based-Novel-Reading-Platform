/* ============================================================
   CLOUDNOVEL — main.js
   Vanilla JavaScript — no dependencies
   ============================================================ */

'use strict';

/* ── 1. SMOOTH SCROLL NAVIGATION ──────────────────────────── */

/**
 * Intercept all anchor clicks that point to an on-page hash
 * and scroll smoothly instead of jumping.
 */
function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const navbarHeight = document.querySelector('.navbar')?.offsetHeight ?? 68;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 12;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });

    // Update active link state
    document.querySelectorAll('.navbar__links a').forEach((a) => a.classList.remove('active'));
    link.classList.add('active');

    // Close mobile nav if open
    closeMobileNav();
  });
}

/* ── 2. NAVBAR — SCROLL SHADOW + ACTIVE HIGHLIGHT ─────────── */

/**
 * Add `.scrolled` class to navbar once the user scrolls past 10px.
 * Highlight the nav link whose section is currently in view.
 */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const navLinks = document.querySelectorAll('.navbar__links a[href^="#"]');
  const sections = [...navLinks]
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  function onScroll() {
    // Scrolled shadow
    navbar.classList.toggle('scrolled', window.scrollY > 10);

    // Active section highlight
    const scrollMid = window.scrollY + window.innerHeight / 2;
    let current = sections[0];

    sections.forEach((section) => {
      if (section.offsetTop <= scrollMid) current = section;
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${current?.id}`;
      link.classList.toggle('active', isActive);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run once on load
}

/* ── 3. MOBILE NAVIGATION TOGGLE ──────────────────────────── */

let mobileNavOpen = false;

function openMobileNav() {
  const links = document.querySelector('.navbar__links');
  const btn   = document.querySelector('.navbar__hamburger');
  if (!links || !btn) return;

  mobileNavOpen = true;
  links.classList.add('open');
  btn.setAttribute('aria-expanded', 'true');
  btn.setAttribute('aria-label', 'Close navigation');
  document.body.style.overflow = 'hidden';

  // Animate hamburger → X
  const spans = btn.querySelectorAll('span');
  if (spans.length === 3) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  }
}

function closeMobileNav() {
  const links = document.querySelector('.navbar__links');
  const btn   = document.querySelector('.navbar__hamburger');
  if (!links || !btn) return;

  mobileNavOpen = false;
  links.classList.remove('open');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-label', 'Open navigation');
  document.body.style.overflow = '';

  // Restore hamburger lines
  const spans = btn.querySelectorAll('span');
  if (spans.length === 3) {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }
}

function initMobileNav() {
  const btn = document.querySelector('.navbar__hamburger');
  if (!btn) return;

  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-label', 'Open navigation');
  btn.setAttribute('aria-controls', 'navbar-links');

  btn.addEventListener('click', () => {
    mobileNavOpen ? closeMobileNav() : openMobileNav();
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!mobileNavOpen) return;
    const navbar = document.querySelector('.navbar');
    if (navbar && !navbar.contains(e.target)) closeMobileNav();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNavOpen) closeMobileNav();
  });

  // Restore on desktop resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 640 && mobileNavOpen) closeMobileNav();
  });
}

/* ── 4. SCROLL FADE-IN ANIMATIONS ─────────────────────────── */

/**
 * Elements with [data-fade] slide up and fade in as they enter
 * the viewport. Stagger children inside [data-fade="children"].
 *
 * Usage in HTML:
 *   <section data-fade>...</section>
 *   <ul data-fade="children">
 *     <li>...</li>  ← each child animates in sequence
 *   </ul>
 */
function initFadeIn() {
  // Inject base keyframe styles once
  if (!document.getElementById('cn-fade-styles')) {
    const style = document.createElement('style');
    style.id = 'cn-fade-styles';
    style.textContent = `
      [data-fade], [data-fade="children"] > * {
        opacity: 0;
        transform: translateY(28px);
        transition: opacity 0.55s cubic-bezier(0.4, 0, 0.2, 1),
                    transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
      }
      [data-fade].is-visible,
      [data-fade="children"] > *.is-visible {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);
  }

  // Collect all observable targets
  function getTargets() {
    const direct   = [...document.querySelectorAll('[data-fade]:not([data-fade="children"])')];
    const children = [...document.querySelectorAll('[data-fade="children"] > *')];
    return [...direct, ...children];
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el     = entry.target;
        const parent = el.parentElement;

        // Calculate stagger delay for sibling children
        if (parent?.dataset.fade === 'children') {
          const siblings = [...parent.children];
          const index    = siblings.indexOf(el);
          el.style.transitionDelay = `${index * 80}ms`;
        }

        el.classList.add('is-visible');
        observer.unobserve(el); // Animate once
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  getTargets().forEach((el) => observer.observe(el));
}

/* ── 5. BUTTON RIPPLE EFFECT ───────────────────────────────── */

/**
 * Adds a Material-style ripple on every `.btn` click.
 */
function initButtonRipple() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;

    // Remove any leftover ripple
    btn.querySelectorAll('.btn-ripple').forEach((r) => r.remove());

    const rect   = btn.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height) * 1.8;
    const x      = e.clientX - rect.left - size / 2;
    const y      = e.clientY - rect.top  - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'btn-ripple';
    Object.assign(ripple.style, {
      position:      'absolute',
      width:         `${size}px`,
      height:        `${size}px`,
      left:          `${x}px`,
      top:           `${y}px`,
      borderRadius:  '50%',
      background:    'rgba(255, 255, 255, 0.18)',
      transform:     'scale(0)',
      animation:     'ripple-expand 0.55s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      pointerEvents: 'none',
    });

    // Ensure btn is positioned for ripple containment
    if (getComputedStyle(btn).position === 'static') {
      btn.style.position = 'relative';
    }
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);

    ripple.addEventListener('animationend', () => ripple.remove());
  });

  // Inject ripple keyframe once
  if (!document.getElementById('cn-ripple-styles')) {
    const style = document.createElement('style');
    style.id = 'cn-ripple-styles';
    style.textContent = `
      @keyframes ripple-expand {
        to { transform: scale(1); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

/* ── 6. BOOK CARD TILT ON HOVER ────────────────────────────── */

/**
 * Subtle 3-D tilt on book covers as the cursor moves over them.
 * Respects prefers-reduced-motion.
 */
function initBookTilt() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const MAX_TILT = 10; // degrees

  document.addEventListener('mousemove', (e) => {
    const cover = e.target.closest('.book-item__cover');
    if (!cover) return;

    const rect   = cover.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2);
    const dy     = (e.clientY - cy) / (rect.height / 2);
    const tiltX  = -dy * MAX_TILT;
    const tiltY  =  dx * MAX_TILT;

    cover.style.transform = `scale(1.045) translateY(-6px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    cover.style.transition = 'transform 0.08s linear';
  });

  document.addEventListener('mouseleave', (e) => {
    const cover = e.target.closest('.book-item__cover');
    if (!cover) return;
    cover.style.transform  = '';
    cover.style.transition = 'transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)';
  }, true);
}

/* ── 7. GENRE TAG FILTER ───────────────────────────────────── */

/**
 * Toggles `.active` on genre tags and (optionally) filters
 * book items whose [data-genre] attribute matches.
 */
function initGenreFilter() {
  const tagContainer = document.querySelector('.genre-tags');
  if (!tagContainer) return;

  tagContainer.addEventListener('click', (e) => {
    const tag = e.target.closest('.genre-tag');
    if (!tag) return;

    const wasActive = tag.classList.contains('active');

    // Deactivate all
    tagContainer.querySelectorAll('.genre-tag').forEach((t) => t.classList.remove('active'));

    if (!wasActive) {
      tag.classList.add('active');
      filterBooks(tag.dataset.genre);
    } else {
      filterBooks(null); // Show all
    }
  });
}

function filterBooks(genre) {
  const books = document.querySelectorAll('.book-item[data-genre]');
  if (!books.length) return;

  books.forEach((book) => {
    const match = !genre || book.dataset.genre === genre;
    book.style.opacity   = match ? '1' : '0.3';
    book.style.transform = match ? '' : 'scale(0.95)';
    book.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  });
}

/* ── 8. READING PROGRESS BAR ───────────────────────────────── */

/**
 * Thin accent-colored bar at the very top of the page that
 * fills as the user scrolls down.
 */
function initReadingProgress() {
  const bar = document.createElement('div');
  bar.id = 'reading-progress';
  Object.assign(bar.style, {
    position:   'fixed',
    top:        '0',
    left:       '0',
    height:     '3px',
    width:      '0%',
    background: 'linear-gradient(90deg, #6366f1, #818cf8)',
    zIndex:     '9999',
    transition: 'width 0.1s linear',
    pointerEvents: 'none',
  });
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    const pct      = total > 0 ? (scrolled / total) * 100 : 0;
    bar.style.width = `${Math.min(pct, 100)}%`;
  }, { passive: true });
}

/* ── 9. SEARCH BAR FOCUS EFFECTS ───────────────────────────── */

function initSearchBar() {
  const form = document.querySelector('.search-bar');
  const input = form?.querySelector('input');
  if (!form || !input) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;
    console.info(`[CloudNovel] Search: "${query}"`);
    // Plug in your real search handler here
  });

  // Keyboard shortcut: '/' focuses the search bar
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
      e.preventDefault();
      input.focus();
    }
  });
}

/* ── 10. LAZY IMAGE LOADING ────────────────────────────────── */

/**
 * Swap [data-src] into [src] only when the image enters the
 * viewport, keeping initial load fast.
 */
function initLazyImages() {
  const images = document.querySelectorAll('img[data-src]');
  if (!images.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      });
    },
    { rootMargin: '200px' }
  );

  images.forEach((img) => observer.observe(img));
}

/* ── 11. BACK-TO-TOP BUTTON ────────────────────────────────── */

function initBackToTop() {
  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '↑';
  Object.assign(btn.style, {
    position:     'fixed',
    bottom:       '1.75rem',
    right:        '1.75rem',
    width:        '42px',
    height:       '42px',
    borderRadius: '50%',
    background:   '#6366f1',
    color:        '#fff',
    border:       'none',
    fontSize:     '1.1rem',
    fontWeight:   '700',
    cursor:       'pointer',
    opacity:      '0',
    transform:    'translateY(12px)',
    transition:   'opacity 0.3s ease, transform 0.3s ease, box-shadow 0.2s ease',
    zIndex:       '200',
    lineHeight:   '1',
  });

  document.body.appendChild(btn);

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  btn.addEventListener('mouseenter', () => {
    btn.style.boxShadow = '0 0 20px rgba(99,102,241,0.5)';
    btn.style.transform = 'translateY(-2px)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.boxShadow = '';
    btn.style.transform = 'translateY(0)';
  });

  window.addEventListener('scroll', () => {
    const show = window.scrollY > 400;
    btn.style.opacity   = show ? '1' : '0';
    btn.style.transform = show ? 'translateY(0)' : 'translateY(12px)';
    btn.style.pointerEvents = show ? 'auto' : 'none';
  }, { passive: true });
}

/* ── INIT ──────────────────────────────────────────────────── */

function init() {
  initSmoothScroll();
  initNavbarScroll();
  initMobileNav();
  initFadeIn();
  initButtonRipple();
  initBookTilt();
  initGenreFilter();
  initReadingProgress();
  initSearchBar();
  initLazyImages();
  initBackToTop();
}

// Run after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}