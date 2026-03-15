/* ============================================================
   CLOUDNOVEL — library.js
   Handles: book data, rendering, search, filter, sort, nav
   Vanilla JavaScript — no dependencies
   ============================================================ */

'use strict';

/* ── 1. BOOK DATA ──────────────────────────────────────────── */

const BOOKS = [
  {
    id: 1,
    title: 'The Starless Crown',
    author: 'James Rollins',
    genre: 'fantasy',
    rating: 4.7,
    reads: '124k',
    pages: 512,
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80',
    coverFallback: 'linear-gradient(145deg, #312e81, #4c1d95, #1e1b4b)',
    description: 'A young woman discovers she is heir to a dying empire and must unite the realm against an ancient darkness.'
  },
  {
    id: 2,
    title: 'Midnight in Paris',
    author: 'Isabelle Fontaine',
    genre: 'romance',
    rating: 4.5,
    reads: '89k',
    pages: 348,
    cover: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80',
    coverFallback: 'linear-gradient(145deg, #9d174d, #be185d, #4a0520)',
    description: 'A chance encounter on the banks of the Seine sets two broken hearts on a path toward healing.'
  },
  {
    id: 3,
    title: 'The Obsidian Key',
    author: 'Daria Voss',
    genre: 'mystery',
    rating: 4.8,
    reads: '210k',
    pages: 430,
    cover: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&q=80',
    coverFallback: 'linear-gradient(145deg, #92400e, #b45309, #1c1917)',
    description: 'A cold case detective receives anonymous letters that reopen the most chilling unsolved murder of the decade.'
  },
  {
    id: 4,
    title: 'Neon Horizon',
    author: 'Ethan Cross',
    genre: 'sci-fi',
    rating: 4.6,
    reads: '178k',
    pages: 495,
    cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80',
    coverFallback: 'linear-gradient(145deg, #0e7490, #0891b2, #042f2e)',
    description: 'In a city run by algorithms, one rogue programmer discovers the code that controls all of humanity.'
  },
  {
    id: 5,
    title: 'Ember & Ash',
    author: 'Lyra Winthorpe',
    genre: 'fantasy',
    rating: 4.4,
    reads: '67k',
    pages: 378,
    cover: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&q=80',
    coverFallback: 'linear-gradient(145deg, #7c3aed, #6d28d9, #2e1065)',
    description: 'Two rival mages bound by an ancient curse must cooperate to prevent the collapse of their magical world.'
  },
  {
    id: 6,
    title: 'Letters Never Sent',
    author: 'Celine Morel',
    genre: 'romance',
    rating: 4.9,
    reads: '305k',
    pages: 290,
    cover: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80',
    coverFallback: 'linear-gradient(145deg, #be185d, #db2777, #4a044e)',
    description: `Decades of unsent love letters surface after a grandmother's passing, unraveling a secret romance.`
},
  {
    id: 7,
    title: 'The Glass Room',
    author: 'Marcus Hale',
    genre: 'mystery',
    rating: 4.3,
    reads: '95k',
    pages: 360,
    cover: 'https://images.unsplash.com/photo-1509475826633-fed577a2c71b?w=400&q=80',
    coverFallback: 'linear-gradient(145deg, #78350f, #d97706, #0c0a09)',
    description: 'A locked-room murder in a luxury alpine retreat leaves fourteen suspects and zero witnesses.'
  },
  {
    id: 8,
    title: 'Void Protocol',
    author: 'Nadia Shen',
    genre: 'sci-fi',
    rating: 4.7,
    reads: '143k',
    pages: 528,
    cover: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&q=80',
    coverFallback: 'linear-gradient(145deg, #065f46, #059669, #022c22)',
    description: 'The last human colony ship receives a distress signal from deep space — from a ship that vanished 80 years ago.'
  }
];

/* ── 2. STATE ──────────────────────────────────────────────── */

const state = {
  activeGenre: 'all',
  searchQuery: '',
  sortBy: 'default'
};

/* ── 3. DOM REFS ───────────────────────────────────────────── */

const grid        = document.getElementById('book-grid');
const emptyState  = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');
const sortSelect  = document.getElementById('sort-select');
const resultCount = document.getElementById('result-count');
const filterBtns  = document.querySelectorAll('.filter-btn');

/* ── 4. RENDER ─────────────────────────────────────────────── */

function getFiltered() {
  let books = [...BOOKS];

  // Genre filter
  if (state.activeGenre !== 'all') {
    books = books.filter(b => b.genre === state.activeGenre);
  }

  // Search filter (title or author)
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    books = books.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q)
    );
  }

  // Sort
  switch (state.sortBy) {
    case 'rating':
      books.sort((a, b) => b.rating - a.rating);
      break;
    case 'title':
      books.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'author':
      books.sort((a, b) => a.author.localeCompare(b.author));
      break;
  }

  return books;
}

function badgeClass(genre) {
  const map = {
    fantasy: 'badge--fantasy',
    romance: 'badge--romance',
    mystery: 'badge--mystery',
    'sci-fi': 'badge--sci-fi',
    thriller: 'badge--thriller'
  };
  return map[genre] || 'badge--fantasy';
}

function genreLabel(genre) {
  const map = {
    fantasy: '🔮 Fantasy',
    romance: '🌹 Romance',
    mystery: '🕵️ Mystery',
    'sci-fi': '🚀 Sci-Fi',
    thriller: '⚡ Thriller'
  };
  return map[genre] || genre;
}

function renderBooks() {
  const books = getFiltered();

  // Update result count
  resultCount.innerHTML = `<strong>${books.length}</strong> novel${books.length !== 1 ? 's' : ''}`;

  // Clear grid (keep empty state node)
  Array.from(grid.querySelectorAll('.book-card')).forEach(el => el.remove());

  // Empty state
  if (books.length === 0) {
    emptyState.classList.add('visible');
    grid.appendChild(emptyState);
    return;
  }
  emptyState.classList.remove('visible');

  // Render cards
  books.forEach((book, i) => {
    const card = buildCard(book, i);
    grid.appendChild(card);
  });
}

function buildCard(book, index) {
  const card = document.createElement('a');
  card.className = 'book-card';
  card.href = `reader.html?id=${book.id}`;
  card.setAttribute('aria-label', `${book.title} by ${book.author}`);
  card.style.animationDelay = `${index * 0.055}s`;

  // Stars string
  const stars = '★'.repeat(Math.floor(book.rating)) + (book.rating % 1 >= 0.5 ? '½' : '');

  card.innerHTML = `
    <div class="book-card__cover">
      <img
        class="book-card__img"
        src="${book.cover}"
        alt="Cover of ${book.title}"
        loading="lazy"
        onerror="this.style.display='none'; this.parentElement.style.background='${book.coverFallback}'"
      />
      <span class="book-card__badge ${badgeClass(book.genre)}">${genreLabel(book.genre)}</span>
      <div class="book-card__overlay">
        <button class="overlay-read-btn" tabindex="-1">
          ▶ Read Now
        </button>
        <div class="overlay-meta">
          <span class="overlay-pages">📄 ${book.pages} pages</span>
          <span class="overlay-rating">★ ${book.rating}</span>
        </div>
      </div>
    </div>
    <div class="book-card__info">
      <div class="book-card__title">${book.title}</div>
      <div class="book-card__author">${book.author}</div>
      <div class="book-card__footer">
        <span class="book-card__rating">★ ${book.rating}</span>
        <span class="book-card__reads">${book.reads} reads</span>
      </div>
    </div>
  `;

  // Navigate on click (prevent double-navigation from inner button)
  card.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = `reader.html?id=${book.id}`;
  });

  return card;
}

/* ── 5. FILTER LOGIC ───────────────────────────────────────── */

function initFilters() {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeGenre = btn.dataset.genre;
      renderBooks();
    });
  });
}

/* ── 6. SEARCH ─────────────────────────────────────────────── */

function initSearch() {
  let debounceTimer;

  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      state.searchQuery = searchInput.value.trim();
      renderBooks();
    }, 240);
  });

  // Clear on Escape
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      state.searchQuery = '';
      renderBooks();
      searchInput.blur();
    }
  });

  // Global '/' shortcut
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
      e.preventDefault();
      searchInput.focus();
    }
  });
}

/* ── 7. SORT ───────────────────────────────────────────────── */

function initSort() {
  sortSelect.addEventListener('change', () => {
    state.sortBy = sortSelect.value;
    renderBooks();
  });
}

/* ── 8. NAVBAR SCROLL SHADOW ───────────────────────────────── */

function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });
}

/* ── 9. MOBILE NAV TOGGLE ──────────────────────────────────── */

function initMobileNav() {
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (!hamburger || !navLinks) return;

  let open = false;

  hamburger.addEventListener('click', () => {
    open = !open;
    hamburger.setAttribute('aria-expanded', open);
    navLinks.style.display = open ? 'flex' : '';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'fixed';
    navLinks.style.inset = '68px 0 0';
    navLinks.style.background = 'rgba(15,23,42,0.97)';
    navLinks.style.backdropFilter = 'blur(20px)';
    navLinks.style.padding = '2rem 1.5rem';
    navLinks.style.gap = '0.25rem';
    navLinks.style.zIndex = '99';

    // Animate hamburger → X
    const spans = hamburger.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      navLinks.style.display = '';
    }
  });

  document.addEventListener('click', (e) => {
    if (!open) return;
    const navbar = document.getElementById('navbar');
    if (navbar && !navbar.contains(e.target)) {
      open = false;
      hamburger.setAttribute('aria-expanded', false);
      navLinks.style.display = '';
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && open) {
      open = false;
      navLinks.style.display = '';
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
}

/* ── 10. GENRE COUNTS ──────────────────────────────────────── */

function updateGenreCounts() {
  const genres = ['fantasy', 'romance', 'mystery', 'sci-fi'];
  genres.forEach(g => {
    const el = document.getElementById(`count-${g}`);
    if (el) el.textContent = BOOKS.filter(b => b.genre === g).length;
  });
  const allEl = document.getElementById('count-all');
  if (allEl) allEl.textContent = BOOKS.length;
}

/* ── INIT ──────────────────────────────────────────────────── */

function init() {
  updateGenreCounts();
  initFilters();
  initSearch();
  initSort();
  initNavbarScroll();
  initMobileNav();
  renderBooks();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}