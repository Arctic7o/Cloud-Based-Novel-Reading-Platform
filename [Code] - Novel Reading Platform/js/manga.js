/* ============================================================
   CLOUDNOVEL MANGA READER — manga.js
   Firebase Firestore + Storage integration
   Full reader controller: chapters, pages, slider, dark mode
   ============================================================ */

'use strict';

/* ════════════════════════════════════════════════════════════
   SECTION 1: FIREBASE CONFIGURATION
   ─────────────────────────────────────────────────────────
   Replace the values below with your own Firebase project
   config from: Firebase Console → Project Settings → SDK setup
════════════════════════════════════════════════════════════ */
// Remove import statements and ensure you load Firebase scripts via <script type="module"> in your HTML file.
// If you want to keep using imports, change your HTML script tag to:
// <script type="module" src="js/manga.js"></script>

const FIREBASE_CONFIG = {
  apiKey: "your-real-api-key",
  projectId: "your-real-project-id",
  // ...etc
};
```

// Step 3 — Open reader with the manga ID in the URL:
// Example: manga.html?id=solo-leveling

/* Initialize Firebase */
const firebaseApp = initializeApp(FIREBASE_CONFIG);
const db          = getFirestore(firebaseApp);

/* Initialize Firebase */
```
manga.html?id=solo-leveling

/* Initialize Firebase */

/* ════════════════════════════════════════════════════════════
   SECTION 2: APP STATE
   Central state object — single source of truth
════════════════════════════════════════════════════════════ */
const state = {
  manga:          null,   // { id, title, cover, genre, description }
  chapters:       [],     // [{ id, title, number, pages: [url,...] }]
  currentChIdx:   0,      // index into state.chapters
  currentPages:   [],     // array of image URLs for current chapter
  currentPage:    1,      // 1-based visible page number
  totalPages:     0,
  theme:          localStorage.getItem('manga_theme') || 'dark',
  zoomed:         null,   // currently zoomed img element
};

/* ════════════════════════════════════════════════════════════
   SECTION 3: DOM REFERENCES
════════════════════════════════════════════════════════════ */
const $ = id => document.getElementById(id);

const DOM = {
  app:              $('app'),
  hamburger:        $('hamburger'),
  chapterPanel:     $('chapter-panel'),
  panelOverlay:     $('panel-overlay'),
  themeToggle:      $('theme-toggle'),
  themeIcon:        $('theme-icon'),
  themeLabel:       $('theme-label'),
  breadcrumbManga:  $('breadcrumb-manga'),
  breadcrumbChapter:$('breadcrumb-chapter'),
  panelTitle:       $('panel-title'),
  panelCoverImg:    $('panel-cover-img'),
  chapterList:      $('chapter-list'),
  chapterSearch:    $('chapter-search'),
  readerScroll:     $('reader-scroll'),
  chapterBannerLbl: $('chapter-banner-label'),
  chapterBannerTitle:$('chapter-banner-title'),
  chapterBannerSub: $('chapter-banner-sub'),
  pagesContainer:   $('pages-container'),
  chapterEndCard:   $('chapter-end-card'),
  endTitle:         $('end-title'),
  endSub:           $('end-sub'),
  btnEndPrev:       $('btn-end-prev'),
  btnEndNext:       $('btn-end-next'),
  btnPrevCh:        $('btn-prev-ch'),
  btnNextCh:        $('btn-next-ch'),
  pageSlider:       $('page-slider'),
  sliderPageNum:    $('slider-page-num'),
  sliderPageTotal:  $('slider-page-total'),
  toast:            $('toast'),
};

/* ════════════════════════════════════════════════════════════
   SECTION 4: FIREBASE — DATA FETCHING
   Firestore structure expected:
     Collection: "manga"
       Document: { title, cover, genre, description, ... }
       Sub-collection: "chapters"
         Document: { number, title, pages: [imageURL, ...] }
════════════════════════════════════════════════════════════ */

/**
 * Fetches a manga document and all its chapters from Firestore.
 * @param {string} mangaId — Firestore document ID in "manga" collection
 */
async function fetchMangaData(mangaId) {
  try {
    /* 1. Fetch manga metadata */
    const mangaRef  = doc(db, 'manga', mangaId);
    const mangaSnap = await getDoc(mangaRef);

    if (!mangaSnap.exists()) throw new Error(`Manga "${mangaId}" not found.`);

    state.manga = { id: mangaSnap.id, ...mangaSnap.data() };

    /* 2. Fetch chapters sub-collection, ordered by chapter number */
    const chaptersRef  = collection(db, 'manga', mangaId, 'chapters');
    const chaptersQ    = query(chaptersRef, orderBy('number', 'asc'));
    const chaptersSnap = await getDocs(chaptersQ);

    state.chapters = chaptersSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    if (state.chapters.length === 0) throw new Error('No chapters found for this manga.');

    return true;
  } catch (err) {
    console.error('[manga.js] fetchMangaData:', err);
    throw err;
  }
}

/* ════════════════════════════════════════════════════════════
   SECTION 5: RENDER — CHAPTER PANEL
════════════════════════════════════════════════════════════ */

/** Populate the left panel with manga info and chapter list */
function renderPanel() {
  const manga = state.manga;

  /* Cover & title */
  if (manga.cover) {
    DOM.panelCoverImg.src = manga.cover;
    DOM.panelCoverImg.alt = manga.title;
  }

  DOM.panelTitle.textContent       = manga.title;
  DOM.breadcrumbManga.textContent  = manga.title;

  /* Chapter list */
  renderChapterList(state.chapters);

  /* Footer */
  const footerEl = document.querySelector('.panel-footer');
  if (footerEl) footerEl.textContent = `${state.chapters.length} chapters · CloudNovel`;
}

/** Build chapter list items */
function renderChapterList(chapters) {
  DOM.chapterList.innerHTML = '';

  if (chapters.length === 0) {
    DOM.chapterList.innerHTML = `
      <div class="state-container" style="min-height:120px;padding:2rem">
        <div class="state-icon">📭</div>
        <p class="state-sub">No chapters match your search.</p>
      </div>`;
    return;
  }

  chapters.forEach((ch, i) => {
    const li = document.createElement('div');
    li.className   = 'chapter-item' + (i === state.currentChIdx ? ' active' : '');
    li.dataset.idx = i;

    li.innerHTML = `
      <div class="chapter-item__num">${ch.number}</div>
      <div class="chapter-item__info">
        <div class="chapter-item__title">${escHtml(ch.title || `Chapter ${ch.number}`)}</div>
        <div class="chapter-item__meta">${ch.pages ? ch.pages.length + ' pages' : '—'}</div>
      </div>
      <div class="chapter-item__arrow">›</div>
    `;

    li.addEventListener('click', () => {
      loadChapter(i);
      closeMobilePanel();
    });

    DOM.chapterList.appendChild(li);
  });
}

/** Update active state on chapter list items */
function updateActiveChapter() {
  document.querySelectorAll('.chapter-item').forEach(el => {
    el.classList.toggle('active', parseInt(el.dataset.idx, 10) === state.currentChIdx);
  });
}

/* ════════════════════════════════════════════════════════════
   SECTION 6: LOAD & RENDER — CHAPTER PAGES
════════════════════════════════════════════════════════════ */

/**
 * Load a chapter by index, render its pages in the reader.
 * Pages come from Firestore: chapter.pages = [imageURL, ...]
 */
function loadChapter(idx) {
  if (idx < 0 || idx >= state.chapters.length) return;

  state.currentChIdx  = idx;
  state.currentPage   = 1;
  const chapter       = state.chapters[idx];
  state.currentPages  = chapter.pages || [];
  state.totalPages    = state.currentPages.length;
  state.zoomed        = null;

  /* Update breadcrumb */
  DOM.breadcrumbChapter.textContent = `Ch. ${chapter.number}`;

  /* Update banner */
  DOM.chapterBannerLbl.textContent   = state.manga.title;
  DOM.chapterBannerTitle.textContent = chapter.title || `Chapter ${chapter.number}`;
  DOM.chapterBannerSub.textContent   = `${state.totalPages} pages`;

  /* Nav buttons */
  DOM.btnPrevCh.disabled = idx === 0;
  DOM.btnNextCh.disabled = idx === state.chapters.length - 1;

  /* Active chapter in panel */
  updateActiveChapter();

  /* Render pages */
  renderPages();

  /* Reset slider */
  resetSlider();

  /* Scroll reader to top */
  DOM.readerScroll.scrollTo({ top: 0, behavior: 'smooth' });

  /* Persist session */
  try { sessionStorage.setItem('manga_chapter', idx); } catch (_) {}

  /* Chapter end card */
  updateEndCard();
}

/** Build page image elements with skeleton + fade-in */
function renderPages() {
  DOM.pagesContainer.innerHTML = '';
  DOM.chapterEndCard.style.display = 'none';

  if (state.totalPages === 0) {
    DOM.pagesContainer.innerHTML = `
      <div class="state-container">
        <div class="state-icon">🖼️</div>
        <p class="state-title">No pages found</p>
        <p class="state-sub">This chapter may still be uploading.</p>
      </div>`;
    return;
  }

  state.currentPages.forEach((src, i) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'manga-page-wrapper';

    /* Skeleton */
    const skel = document.createElement('div');
    skel.className = 'manga-page-skeleton';

    /* Image */
    const img = document.createElement('img');
    img.className = 'manga-page-img';
    img.alt       = `Page ${i + 1}`;
    img.loading   = i < 3 ? 'eager' : 'lazy';
    img.dataset.page = i + 1;

    img.onload = () => {
      img.classList.add('loaded');
      skel.remove();
    };

    img.onerror = () => {
      /* Replace broken images with a styled placeholder */
      img.classList.add('loaded');
      skel.remove();
      img.style.cssText = `
        aspect-ratio:3/4; background:var(--bg-surface-2);
        display:flex; align-items:center; justify-content:center;
        opacity:1;
      `;
      img.alt = `Page ${i + 1} — failed to load`;
    };

    img.src = src;

    /* Click to zoom */
    img.addEventListener('click', () => {
      if (state.zoomed && state.zoomed !== img) {
        state.zoomed.classList.remove('zoomed');
      }
      img.classList.toggle('zoomed');
      state.zoomed = img.classList.contains('zoomed') ? img : null;
    });

    /* Page number badge */
    const badge = document.createElement('div');
    badge.className   = 'manga-page-badge';
    badge.textContent = `${i + 1} / ${state.totalPages}`;

    wrapper.appendChild(skel);
    wrapper.appendChild(img);
    wrapper.appendChild(badge);
    DOM.pagesContainer.appendChild(wrapper);
  });

  /* Show chapter-end card after last page */
  DOM.chapterEndCard.style.display = 'block';
}

/* ════════════════════════════════════════════════════════════
   SECTION 7: PAGE SLIDER
════════════════════════════════════════════════════════════ */

function resetSlider() {
  DOM.pageSlider.min   = 1;
  DOM.pageSlider.max   = Math.max(state.totalPages, 1);
  DOM.pageSlider.value = 1;
  DOM.sliderPageNum.textContent   = '1';
  DOM.sliderPageTotal.textContent = `/ ${state.totalPages}`;
  updateSliderTrack(1);
}

function updateSliderTrack(value) {
  const min  = parseInt(DOM.pageSlider.min, 10)  || 1;
  const max  = parseInt(DOM.pageSlider.max, 10)  || 1;
  const pct  = ((value - min) / (max - min)) * 100;
  DOM.pageSlider.style.setProperty('--slider-progress', `${pct.toFixed(1)}%`);
}

/** Scroll the reader to the page at the given 1-based index */
function scrollToPage(pageNum) {
  const pages = DOM.pagesContainer.querySelectorAll('.manga-page-wrapper');
  const target = pages[pageNum - 1];
  if (!target) return;

  /* Offset for topbar */
  const topbarH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--topbar-h'), 10) || 60;
  const top     = target.getBoundingClientRect().top + DOM.readerScroll.scrollTop - topbarH - 8;

  DOM.readerScroll.scrollTo({ top, behavior: 'smooth' });
}

/* Slider input: user dragging */
DOM.pageSlider.addEventListener('input', () => {
  const val = parseInt(DOM.pageSlider.value, 10);
  state.currentPage = val;
  DOM.sliderPageNum.textContent = val;
  updateSliderTrack(val);
  scrollToPage(val);
});

/* Track current page on scroll using IntersectionObserver */
function initPageObserver() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img  = entry.target.querySelector('.manga-page-img');
        const page = img ? parseInt(img.dataset.page, 10) : 0;
        if (page && page !== state.currentPage) {
          state.currentPage = page;
          DOM.pageSlider.value = page;
          DOM.sliderPageNum.textContent = page;
          updateSliderTrack(page);
        }
      }
    });
  }, { root: DOM.readerScroll, threshold: 0.5 });

  /* Observe after pages render */
  const observe = () => {
    DOM.pagesContainer.querySelectorAll('.manga-page-wrapper').forEach(el => io.observe(el));
  };

  /* Re-observe whenever chapter changes */
  const mutObs = new MutationObserver(observe);
  mutObs.observe(DOM.pagesContainer, { childList: true });
  observe();
}

/* ════════════════════════════════════════════════════════════
   SECTION 8: CHAPTER NAVIGATION
════════════════════════════════════════════════════════════ */

function prevChapter() { if (state.currentChIdx > 0) loadChapter(state.currentChIdx - 1); }
function nextChapter() { if (state.currentChIdx < state.chapters.length - 1) loadChapter(state.currentChIdx + 1); }

DOM.btnPrevCh.addEventListener('click', prevChapter);
DOM.btnNextCh.addEventListener('click', nextChapter);
DOM.btnEndPrev.addEventListener('click', prevChapter);
DOM.btnEndNext.addEventListener('click', nextChapter);

/** Update the chapter-end card content */
function updateEndCard() {
  const isLast = state.currentChIdx === state.chapters.length - 1;
  const ch     = state.chapters[state.currentChIdx];

  DOM.endTitle.textContent = isLast ? '🎉 You\'re All Caught Up!' : '📖 End of Chapter';
  DOM.endSub.textContent   = isLast
    ? 'Check back for new chapters.'
    : (() => {
        const next = state.chapters[state.currentChIdx + 1];
        return next ? `Next: Ch.${next.number} — ${next.title || ''}` : '';
      })();

  DOM.btnEndPrev.disabled = state.currentChIdx === 0;
  DOM.btnEndNext.disabled = isLast;
}

/* Keyboard navigation */
document.addEventListener('keydown', e => {
  if (['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) return;
  switch (e.key) {
    case 'ArrowRight': case ']': nextChapter(); break;
    case 'ArrowLeft':  case '[': prevChapter(); break;
    case 'Escape': if (state.zoomed) { state.zoomed.classList.remove('zoomed'); state.zoomed = null; } break;
  }
});

/* ════════════════════════════════════════════════════════════
   SECTION 9: DARK / LIGHT MODE TOGGLE
════════════════════════════════════════════════════════════ */

function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  DOM.themeIcon.textContent  = theme === 'dark' ? '🌙' : '☀️';
  DOM.themeLabel.textContent = theme === 'dark' ? 'Dark Mode' : 'Light Mode';
  try { localStorage.setItem('manga_theme', theme); } catch (_) {}
}

DOM.themeToggle.addEventListener('click', () => {
  applyTheme(state.theme === 'dark' ? 'light' : 'dark');
  showToast(state.theme === 'light' ? '☀️ Light mode enabled' : '🌙 Dark mode enabled');
});

/* ════════════════════════════════════════════════════════════
   SECTION 10: MOBILE PANEL (Hamburger)
════════════════════════════════════════════════════════════ */

function openMobilePanel() {
  DOM.chapterPanel.classList.add('open');
  DOM.hamburger.classList.add('open');
  DOM.panelOverlay.classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function closeMobilePanel() {
  DOM.chapterPanel.classList.remove('open');
  DOM.hamburger.classList.remove('open');
  DOM.panelOverlay.classList.remove('visible');
  document.body.style.overflow = '';
}

DOM.hamburger.addEventListener('click', () => {
  DOM.chapterPanel.classList.contains('open') ? closeMobilePanel() : openMobilePanel();
});

DOM.panelOverlay.addEventListener('click', closeMobilePanel);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMobilePanel();
});

/* ════════════════════════════════════════════════════════════
   SECTION 11: CHAPTER SEARCH FILTER
════════════════════════════════════════════════════════════ */

DOM.chapterSearch.addEventListener('input', debounce(() => {
  const q = DOM.chapterSearch.value.trim().toLowerCase();
  const filtered = state.chapters.filter(ch =>
    String(ch.number).includes(q) ||
    (ch.title || '').toLowerCase().includes(q)
  );
  renderChapterList(filtered);
}, 200));

/* ════════════════════════════════════════════════════════════
   SECTION 12: TOAST
════════════════════════════════════════════════════════════ */
let _toastTimer;
function showToast(msg, type = '', duration = 2800) {
  DOM.toast.textContent = msg;
  DOM.toast.className   = `toast ${type} show`;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => DOM.toast.classList.remove('show'), duration);
}

/* ════════════════════════════════════════════════════════════
   SECTION 13: LOADING / ERROR STATE RENDERERS
════════════════════════════════════════════════════════════ */

function showReaderLoading() {
  DOM.pagesContainer.innerHTML = `
    <div class="state-container">
      <div class="spinner-ring"></div>
      <p class="state-title">Loading chapter…</p>
      <p class="state-sub">Fetching pages from Firebase Storage</p>
    </div>`;
}

function showReaderError(msg) {
  DOM.pagesContainer.innerHTML = `
    <div class="state-container">
      <div class="state-icon">⚠️</div>
      <p class="state-title">Something went wrong</p>
      <p class="state-sub">${escHtml(msg)}</p>
      <button class="btn btn--ghost" onclick="window.location.reload()">Retry</button>
    </div>`;
}

function showPanelLoading() {
  DOM.chapterList.innerHTML = `
    <div class="state-container" style="min-height:200px">
      <div class="spinner-ring"></div>
      <p class="state-sub">Loading chapters…</p>
    </div>`;
}

/* ════════════════════════════════════════════════════════════
   SECTION 14: UTILITY HELPERS
════════════════════════════════════════════════════════════ */

function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

/** Read manga ID from URL: manga.html?id=solo-leveling */
function getMangaIdFromURL() {
  return new URLSearchParams(window.location.search).get('id') || null;
}

/* ════════════════════════════════════════════════════════════
   SECTION 15: BOOT / INIT
   Called on DOMContentLoaded
════════════════════════════════════════════════════════════ */
async function init() {
  /* 1. Apply saved theme */
  applyTheme(state.theme);

  /* 2. Get manga ID from URL query string */
  const mangaId = getMangaIdFromURL();

  if (!mangaId) {
    showReaderError('No manga ID provided. Add ?id=YOUR_MANGA_ID to the URL.');
    showPanelLoading();
    return;
  }

  /* 3. Show loading states */
  showPanelLoading();
  showReaderLoading();

  try {
    /* 4. Fetch data from Firestore */
    await fetchMangaData(mangaId);

    /* 5. Render panel */
    renderPanel();

    /* 6. Restore last-read chapter */
    const savedChIdx = parseInt(sessionStorage.getItem('manga_chapter') || '0', 10);
    const startIdx   = (savedChIdx >= 0 && savedChIdx < state.chapters.length) ? savedChIdx : 0;

    /* 7. Load first/last chapter */
    loadChapter(startIdx);

    /* 8. Init scroll-based page tracker */
    initPageObserver();

    showToast(`✦ ${state.manga.title} loaded`, '', 2000);

  } catch (err) {
    showReaderError(err.message || 'Failed to load manga data from Firebase.');
    DOM.chapterList.innerHTML = `
      <div class="state-container" style="min-height:120px;padding:2rem">
        <div class="state-icon">⚠️</div>
        <p class="state-sub">${escHtml(err.message)}</p>
      </div>`;
  }
}

/* ════════════════════════════════════════════════════════════
   START
════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', init);