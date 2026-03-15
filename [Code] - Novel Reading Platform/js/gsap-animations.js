/* ============================================================
   CLOUDNOVEL — gsap-animations.js
   GSAP-powered animations: hero, books, scroll, transitions
   Requires GSAP + ScrollTrigger loaded via CDN before this file
   ============================================================ */

'use strict';

/* ── Guard: wait for GSAP to be ready ─────────────────────── */
function waitForGSAP(cb) {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    cb();
  } else {
    setTimeout(() => waitForGSAP(cb), 50);
  }
}

waitForGSAP(initAll);

function initAll() {
  /* Register ScrollTrigger plugin */
  gsap.registerPlugin(ScrollTrigger);

  /* Respect reduced-motion preference */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.globalTimeline.timeScale(20); // fast-forward all — skip, not disable
    return;
  }

  initHeroAnimation();
  initScrollReveal();
  initBookHover();
  initNavAnimation();
  initPageTransition();
  initFeatureCards();
  initCounterNumbers();
  initCursorGlow();
}

/* ══════════════════════════════════════════════════════════════
   1. HERO SECTION FADE-IN
   Orchestrated staggered entrance for all hero elements
══════════════════════════════════════════════════════════════ */
function initHeroAnimation() {
  const hero = document.querySelector('.hero, [data-hero], #hero');
  if (!hero) return;

  /* Set initial invisible states */
  gsap.set('.hero__eyebrow, [data-hero-eyebrow]', { autoAlpha: 0, y: 20 });
  gsap.set('.hero__title, [data-hero-title]',     { autoAlpha: 0, y: 36 });
  gsap.set('.hero__desc, [data-hero-desc]',       { autoAlpha: 0, y: 24 });
  gsap.set('.hero__actions, [data-hero-actions]', { autoAlpha: 0, y: 20 });
  gsap.set('.hero__stats .hero__stat, .hero__stats > *, [data-hero-stat]', { autoAlpha: 0, y: 16 });
  gsap.set('.hero__visual, [data-hero-visual]',   { autoAlpha: 0, x: 40, scale: 0.95 });

  /* Master timeline */
  const tl = gsap.timeline({ delay: 0.1 });

  tl.to('.hero__eyebrow, [data-hero-eyebrow]', {
      autoAlpha: 1, y: 0,
      duration: 0.65,
      ease: 'power3.out'
    })
    .to('.hero__title, [data-hero-title]', {
      autoAlpha: 1, y: 0,
      duration: 0.8,
      ease: 'power4.out'
    }, '-=0.4')
    .to('.hero__desc, [data-hero-desc]', {
      autoAlpha: 1, y: 0,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.5')
    .to('.hero__actions, [data-hero-actions]', {
      autoAlpha: 1, y: 0,
      duration: 0.55,
      ease: 'power3.out'
    }, '-=0.4')
    .to('.hero__stats .hero__stat, .hero__stats > *, [data-hero-stat]', {
      autoAlpha: 1, y: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out'
    }, '-=0.3')
    .to('.hero__visual, [data-hero-visual]', {
      autoAlpha: 1, x: 0, scale: 1,
      duration: 0.9,
      ease: 'power3.out'
    }, '-=0.7');

  /* Floating animation on hero visual after entrance */
  tl.to('.hero__visual, [data-hero-visual]', {
    y: -14,
    duration: 3.2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  }, '+=0.2');

  /* Orb parallax on mouse move */
  document.addEventListener('mousemove', (e) => {
    const { clientX: x, clientY: y } = e;
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (x - cx) / cx;
    const dy = (y - cy) / cy;

    gsap.to('.hero::before, .bg-orb--1', {
      x: dx * 22, y: dy * 12,
      duration: 1.8, ease: 'power1.out', overwrite: 'auto'
    });
    gsap.to('.hero::after, .bg-orb--2', {
      x: -dx * 16, y: -dy * 10,
      duration: 2.2, ease: 'power1.out', overwrite: 'auto'
    });
  }, { passive: true });
}

/* ══════════════════════════════════════════════════════════════
   2. SCROLL-TRIGGERED REVEAL ANIMATIONS
   Works on any element with [data-reveal] or common selectors
══════════════════════════════════════════════════════════════ */
function initScrollReveal() {

  /* ── Fade up (default) ─────────────────────────────────── */
  const fadeTargets = gsap.utils.toArray(
    '[data-reveal], .section__header, .section__title, .section__desc, ' +
    '.section__label, .cta-banner__title, .cta-banner__desc'
  );

  fadeTargets.forEach(el => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none'
      },
      autoAlpha: 0,
      y: 30,
      duration: 0.75,
      ease: 'power3.out'
    });
  });

  /* ── Staggered grid items ──────────────────────────────── */
  const grids = gsap.utils.toArray(
    '.book-grid, .features-grid, [data-stagger-grid]'
  );

  grids.forEach(grid => {
    const children = gsap.utils.toArray(grid.children);
    gsap.from(children, {
      scrollTrigger: {
        trigger: grid,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      autoAlpha: 0,
      y: 40,
      scale: 0.96,
      duration: 0.6,
      stagger: { each: 0.08, from: 'start' },
      ease: 'power3.out',
      clearProps: 'scale'
    });
  });

  /* ── Feature cards slide-in from sides ─────────────────── */
  const featureCards = gsap.utils.toArray('.feature-card, [data-reveal-card]');
  featureCards.forEach((card, i) => {
    const fromLeft = i % 2 === 0;
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        toggleActions: 'play none none none'
      },
      autoAlpha: 0,
      x: fromLeft ? -30 : 30,
      y: 20,
      duration: 0.7,
      ease: 'power3.out'
    });
  });

  /* ── Progress cards reveal ─────────────────────────────── */
  const progressCards = gsap.utils.toArray('.progress-card, [data-reveal-progress]');
  progressCards.forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 90%',
        toggleActions: 'play none none none'
      },
      autoAlpha: 0,
      x: -20,
      duration: 0.55,
      delay: i * 0.07,
      ease: 'power2.out'
    });

    /* Animate progress bar fill on scroll */
    const fill = card.querySelector('.progress-bar__fill');
    if (fill) {
      const targetWidth = fill.style.width || '50%';
      gsap.fromTo(fill,
        { width: '0%' },
        {
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none none'
          },
          width: targetWidth,
          duration: 1.1,
          ease: 'power2.inOut'
        }
      );
    }
  });

  /* ── Horizontal scroll pin section (if present) ───────── */
  const hScroll = document.querySelector('[data-hscroll]');
  if (hScroll) {
    const items = gsap.utils.toArray('[data-hscroll] > *');
    const totalWidth = items.reduce((sum, el) => sum + el.offsetWidth + 24, 0);

    gsap.to(hScroll, {
      x: () => -(totalWidth - window.innerWidth + 48),
      ease: 'none',
      scrollTrigger: {
        trigger: hScroll.parentElement,
        pin: true,
        scrub: 1,
        end: () => `+=${totalWidth}`,
        invalidateOnRefresh: true
      }
    });
  }

  /* ── Section divider line draw ─────────────────────────── */
  const dividers = gsap.utils.toArray('.divider, hr');
  dividers.forEach(hr => {
    gsap.from(hr, {
      scrollTrigger: {
        trigger: hr,
        start: 'top 92%',
        toggleActions: 'play none none none'
      },
      scaleX: 0,
      transformOrigin: 'left center',
      duration: 0.8,
      ease: 'power2.inOut'
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   3. BOOK CARD HOVER ANIMATIONS
   GSAP handles spring physics & 3-D tilt — smoother than CSS
══════════════════════════════════════════════════════════════ */
function initBookHover() {
  const cards = gsap.utils.toArray(
    '.book-item, .book-card, [data-book-card]'
  );

  cards.forEach(card => {
    const cover   = card.querySelector('.book-item__cover, .book-card__cover') || card;
    const overlay = card.querySelector('.book-item__overlay, .book-card__overlay');
    const title   = card.querySelector('.book-item__title, .book-card__title');
    const badge   = card.querySelector('.book-item__badge, .book-card__badge');

    /* Hover enter */
    card.addEventListener('mouseenter', () => {
      gsap.to(cover, {
        y: -10, scale: 1.05, rotationX: 4,
        duration: 0.45,
        ease: 'back.out(1.6)',
        overwrite: 'auto'
      });
      gsap.to(cover, {
        boxShadow: '0 28px 60px rgba(0,0,0,0.55), 0 0 30px rgba(99,102,241,0.2)',
        duration: 0.3,
        overwrite: 'auto'
      });
      if (overlay) gsap.to(overlay, { autoAlpha: 1, duration: 0.28 });
      if (title)   gsap.to(title,   { color: '#818cf8', duration: 0.25 });
      if (badge)   gsap.to(badge,   { scale: 1.06, duration: 0.3, ease: 'back.out(2)' });
    });

    /* Hover leave */
    card.addEventListener('mouseleave', () => {
      gsap.to(cover, {
        y: 0, scale: 1, rotationX: 0,
        duration: 0.5,
        ease: 'power3.out',
        overwrite: 'auto'
      });
      gsap.to(cover, {
        boxShadow: 'none',
        duration: 0.4,
        overwrite: 'auto'
      });
      if (overlay) gsap.to(overlay, { autoAlpha: 0, duration: 0.25 });
      if (title)   gsap.to(title,   { color: '', duration: 0.25 });
      if (badge)   gsap.to(badge,   { scale: 1, duration: 0.3 });
    });

    /* Mouse-tracking 3-D tilt */
    card.addEventListener('mousemove', (e) => {
      const rect  = cover.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const rotY  = ((e.clientX - cx) / (rect.width  / 2)) * 8;
      const rotX  = -((e.clientY - cy) / (rect.height / 2)) * 5;

      gsap.to(cover, {
        rotationY: rotY, rotationX: rotX,
        duration: 0.3,
        ease: 'power1.out',
        overwrite: 'auto',
        transformPerspective: 800
      });
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      gsap.to(cover, {
        rotationX: 0, rotationY: 0,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });

    /* Click press effect */
    card.addEventListener('mousedown', () => {
      gsap.to(cover, { scale: 0.98, duration: 0.12, ease: 'power2.in', overwrite: 'auto' });
    });
    card.addEventListener('mouseup', () => {
      gsap.to(cover, { scale: 1.05, duration: 0.3, ease: 'back.out(2)', overwrite: 'auto' });
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   4. NAVBAR ENTRANCE ANIMATION
══════════════════════════════════════════════════════════════ */
function initNavAnimation() {
  const navbar = document.querySelector('.navbar, nav, #navbar');
  if (!navbar) return;

  gsap.from(navbar, {
    y: -80,
    autoAlpha: 0,
    duration: 0.7,
    ease: 'power3.out',
    delay: 0.05
  });

  /* Nav links stagger in */
  const links = gsap.utils.toArray('.navbar__links a, .nav-links a, .nav-links li');
  if (links.length) {
    gsap.from(links, {
      autoAlpha: 0,
      y: -12,
      duration: 0.45,
      stagger: 0.07,
      ease: 'power2.out',
      delay: 0.4
    });
  }

  /* Nav actions (buttons) */
  const actions = gsap.utils.toArray('.navbar__actions > *, .nav-actions > *');
  if (actions.length) {
    gsap.from(actions, {
      autoAlpha: 0,
      x: 14,
      duration: 0.45,
      stagger: 0.08,
      ease: 'power2.out',
      delay: 0.5
    });
  }
}

/* ══════════════════════════════════════════════════════════════
   5. PAGE TRANSITION (between pages in the site)
   Wrap all <a> clicks with a fade-out before navigation
══════════════════════════════════════════════════════════════ */
function initPageTransition() {
  /* Create overlay element */
  const overlay = document.createElement('div');
  overlay.id = 'gsap-page-overlay';
  Object.assign(overlay.style, {
    position:   'fixed',
    inset:      '0',
    background: '#0f172a',
    zIndex:     '9999',
    pointerEvents: 'none'
  });
  document.body.appendChild(overlay);

  /* Fade IN (page arriving) */
  gsap.to(overlay, {
    autoAlpha: 0,
    duration: 0.55,
    ease: 'power2.out',
    delay: 0.05
  });

  /* Intercept link clicks → fade out → navigate */
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    /* Skip anchors, external links, javascript:, mailto: */
    if (
      !href ||
      href.startsWith('#') ||
      href.startsWith('http') ||
      href.startsWith('mailto') ||
      href.startsWith('javascript') ||
      link.target === '_blank'
    ) return;

    e.preventDefault();

    gsap.to(overlay, {
      autoAlpha: 1,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => { window.location.href = href; }
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   6. FEATURE CARDS — scroll-triggered with glow pulse
══════════════════════════════════════════════════════════════ */
function initFeatureCards() {
  const cards = gsap.utils.toArray('.feature-card, [data-feature-card]');

  cards.forEach((card, i) => {
    const icon = card.querySelector('.feature-card__icon');

    /* Pulse glow on icon when card enters viewport */
    if (icon) {
      ScrollTrigger.create({
        trigger: card,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.fromTo(icon,
            { boxShadow: '0 0 0px rgba(99,102,241,0)' },
            {
              boxShadow: '0 0 22px rgba(99,102,241,0.5)',
              duration: 0.6,
              delay: i * 0.1,
              ease: 'power2.out',
              yoyo: true,
              repeat: 1
            }
          );
        }
      });
    }

    /* Button micro-interactions */
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        y: -8,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        y: 0,
        duration: 0.45,
        ease: 'power3.out',
        overwrite: 'auto'
      });
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   7. COUNTER / STAT NUMBER ANIMATION
   Animates numeric values inside [data-counter] or .hero__stat-value
══════════════════════════════════════════════════════════════ */
function initCounterNumbers() {
  const counters = gsap.utils.toArray(
    '[data-counter], .hero__stat-value, [data-hero-stat] .hero__stat-value'
  );

  counters.forEach(el => {
    const raw    = el.textContent.trim();
    const suffix = raw.replace(/[\d.]/g, '');   // e.g. 'k+', 'M', '%'
    const num    = parseFloat(raw.replace(/[^\d.]/g, '')) || 0;
    const decimals = (raw.includes('.')) ? (raw.split('.')[1]?.replace(/[^\d]/g,'').length ?? 0) : 0;

    const obj = { val: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: num,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = obj.val.toFixed(decimals) + suffix;
          }
        });
      }
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   8. MAGNETIC CURSOR GLOW (desktop only)
   A subtle accent-colored glow that follows the cursor
══════════════════════════════════════════════════════════════ */
function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip on touch

  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  Object.assign(glow.style, {
    position:      'fixed',
    width:         '320px',
    height:        '320px',
    borderRadius:  '50%',
    background:    'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex:        '0',
    transform:     'translate(-50%, -50%)',
    top:           '-999px',
    left:          '-999px',
    willChange:    'transform, top, left'
  });
  document.body.appendChild(glow);

  let mouseX = -999, mouseY = -999;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.to(glow, {
      top: mouseY, left: mouseX,
      duration: 0.7,
      ease: 'power1.out',
      overwrite: 'auto'
    });
  }, { passive: true });

  /* Grow glow over interactive elements */
  const interactives = 'a, button, .book-item, .book-card, .feature-card, .filter-btn, .genre-tag';
  document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(glow, {
        width: 420, height: 420,
        background: 'radial-gradient(circle, rgba(99,102,241,0.13) 0%, transparent 70%)',
        duration: 0.4, ease: 'power2.out'
      });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(glow, {
        width: 320, height: 320,
        background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)',
        duration: 0.4, ease: 'power2.out'
      });
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   9. BUTTON MAGNETIC ATTRACTION
   Buttons slightly attract toward cursor on hover
══════════════════════════════════════════════════════════════ */
(function initMagneticButtons() {
  const STRENGTH = 0.28;

  const btns = gsap.utils.toArray('.btn--primary, .btn-login, [data-magnetic]');
  btns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) * STRENGTH;
      const dy   = (e.clientY - cy) * STRENGTH;
      gsap.to(btn, { x: dx, y: dy, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
    }, { passive: true });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' });
    });
  });
})();