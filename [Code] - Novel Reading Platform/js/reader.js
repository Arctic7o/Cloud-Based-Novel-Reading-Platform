/* ============================================================
   CLOUDNOVEL — reader.js
   Distraction-free novel reader controller
   Vanilla JavaScript — no dependencies
   ============================================================ */

'use strict';

/* ── 1. NOVEL DATA ─────────────────────────────────────────── */

const NOVELS = {
  1: {
    title:   'The Starless Crown',
    author:  'James Rollins',
    chapter: 'Chapter 1',
    chapterTitle: 'The Edge of the World',
    pages: [
      `<p>The wind came off the Shattered Sea like a blade, cutting through wool and flesh alike. Nyx stood at the crumbling parapet of Chalk Keep and watched the horizon bleed from violet into black, the last fingers of sunlight losing their grip on the world.</p>
      <p>She had stood here every evening since childhood, long before the prophecy had found her — or rather, long before she had found it, pressed between the leaves of her mother's herbiary like a dried flower, fragile and full of impossible color.</p>
      <p>Three hundred steps below, the village of Brayk went about its dimming: shutters drawn against the dark, cook-fires kindled, children called home by names that drifted up to her like smoke. Ordinary life. She had wanted nothing more, once.</p>
      <p><em>"You cannot stand on the edge of the world forever,"</em> said a voice behind her. Low. Patient. Carrying the faint rasp of old lungs that had breathed in too much knowledge.</p>
      <p>She did not turn. "Watch me, Archon."</p>`,

      `<p>Archon Rothis moved to stand beside her, his grey robes catching the wind and snapping like a flag in surrender. His hands, knuckled and ink-stained, folded across the top of his walking staff. He smelled of parchment and star-anise, the scent of the Academy, of somewhere she had never been.</p>
      <p>"The council met again this morning," he said, as though remarking on the weather.</p>
      <p>"And?" She kept her gaze on the sea.</p>
      <p>"And they voted three to two to send a delegation to the Thornwood." A pause long enough to feel intentional. "You will lead it."</p>
      <p>Nyx felt the word land in her chest like a stone dropped in still water. Ripples spread outward, cold and inevitable. She had known this was coming — the prophecy had always been moving toward her, patient as tide — yet knowing had not prepared her for the specific weight of hearing it spoken aloud in the fading light of an ordinary evening.</p>
      <p>"Three to two," she said at last. "Someone voted for me."</p>
      <p>"I always vote for you," Rothis said simply. "Even when you are wrong."</p>`,

      `<p>The descent from the parapet took her past the old sundial, whose shadow now pointed at nothing, and through the inner courtyard where the well stood frozen at its center like a held breath. She pulled her cloak tighter and tried to arrange her thoughts into something useful.</p>
      <p>The Thornwood was three weeks' ride, assuming the passes stayed open. They would not stay open. The season was turning and every shepherd in the lowlands had already driven their flocks south; she had watched the last of them go two mornings past, a long woolen river flowing along the King's Road until distance swallowed it.</p>
      <p>Rothis followed at his unhurried pace, the tap of his staff marking time on the cobblestones.</p>
      <p>"Who else?" Nyx asked without stopping.</p>
      <p>"Ser Aldric has volunteered. The twins from the border garrison. One healer — the young one, Brynn, who you will not remember because you have never been ill."</p>
      <p><em>Brynn.</em> She filed the name. A healer was sensible; the Thornwood was not a place that was gentle to bodies.</p>
      <p>"And a scholar," Rothis added. "Of sorts."</p>
      <p>She stopped walking. "What kind of scholar?"</p>
      <p>The old man's expression moved through something that was not quite a smile. "The kind that knows things," he said, "that I do not. Which, at this point in history, is precisely what we require."</p>`,

      `<p>She found the scholar in the lower library at an hour when sensible people were at supper. He was young — or at least he carried youth about him loosely, like an ill-fitting coat — and he was doing three things at once: reading, making notes, and eating a heel of bread directly over the open manuscript, scattering crumbs with cheerful inattention.</p>
      <p>Nyx stood in the doorway and watched this for a moment. The library was warm, banked with the heat of a generous fireplace and the particular close warmth of old books pressed together on too many shelves. The scholar had pushed every lamp on his table to the far edge to capture more reading light, creating a small illuminated pool around himself and leaving the rest of the room in amber shadow.</p>
      <p>"You are going to destroy that manuscript," she said.</p>
      <p>He looked up without startling, which told her something. People who did not startle either had clean consciences or very bad ones; she had not yet determined which category applied here.</p>
      <p>"Unlikely," he said. "It has survived four hundred years of worse. I checked the margins: one previous owner used it as a cutting board." He held it up briefly, indicating a faint groove near the left edge, then set it back down and brushed at the crumbs with his sleeve, achieving nothing. "You are Nyx. The prophecy girl."</p>
      <p>She pulled up the nearest chair and sat. "I am Nyx. What are you?"</p>
      <p>"Calder," he said. "The scholar of sorts." He said it without irony, which meant he had already spoken to Rothis. "Are we leaving tomorrow?"</p>
      <p>"Day after. Can you ride?"</p>
      <p>"Badly. But with conviction."</p>
      <p>She almost smiled. She did not let it finish. "Then we'll manage," she said, and rose, and left him to his crumbs and his four-hundred-year-old book and his pool of light in the dark library.</p>`,

      `<p>That night she did not sleep. Instead she lay on her back in the narrow bed of her childhood room and stared at the ceiling and let the prophecy run through her head as it always did when she gave it space, steady and terrible as a liturgy:</p>
      <p><em>She who bears the crown no star can light shall walk the thornwood's keeping. The ancient dark awaits its heir. The empire breathes. The sleeper stirs. What wakes in winter will not wait for spring.</em></p>
      <p>Twenty-three words that had been waiting for her, apparently, since before she was born. She found this presumptuous. Prophecies, she had decided, were the universe's way of telling you it had already made up its mind, and would you please stop arguing and get on with things.</p>
      <p>She was not, as it happened, good at getting on with things. She was good at standing on parapets in the wind and thinking very precisely about all the ways a thing might go wrong. This was perhaps not the temperament suited to a prophesied hero. It was, she suspected, exactly the temperament required for the actual work of surviving one.</p>
      <p>Outside, the Shattered Sea moved in its ancient, indifferent pattern. The village below had gone quiet. Somewhere in the lower library, a scholar of sorts was almost certainly still reading, oblivious to the hour, crumbing the centuries.</p>
      <p>Nyx closed her eyes. In two days they would leave. In two days, ordinary life would be finished with her, and something else would begin. She let this fact settle over her, heavy and real as a cloak put on in cold weather.</p>
      <p>Then she got up, dressed in the dark, and went back to the parapet to watch the sea until morning.</p>`,

      `<p>The morning of departure arrived in the manner of all mornings that matter: indistinguishable from any other until the light hit and everything became suddenly, irreversibly different.</p>
      <p>Six horses waited in the outer yard. Ser Aldric was already mounted, armored in the practical style of the border garrison — nothing decorative, everything functional, the metal worn at the joints from actual use. He was a large man with a face that had arrived at stillness through long practice and probably some suffering. He nodded once at Nyx and asked nothing.</p>
      <p>The twins — Essa and Maren, who were identical in person and opposite in temperament — were arguing in low voices about the distribution of the supply packs. Brynn the healer stood a little apart, checking and rechecking a leather satchel with the focused attention of someone who knew exactly what was in it and was checking because checking was how worry expressed itself productively.</p>
      <p>Calder arrived last, walking briskly and looking as though he had slept three hours and found them sufficient. He carried a single pack, a rolled map case, and an expression of alert curiosity that Nyx was already learning to read as his default state.</p>
      <p>"You did not sleep," he said, falling into step beside her.</p>
      <p>"Neither did you."</p>
      <p>"I was reading. That's different." He swung up onto his horse with the promised lack of grace but the promised conviction, and gathered the reins with the air of someone engaged in a negotiation he expected to lose. "Ready when you are."</p>`,

      `<p>Rothis saw them off at the gate. He embraced Nyx with the careful strength of old arms that knew they were old and did not want to waste the gesture.</p>
      <p>"You know what to find," he said quietly, into the wool of her shoulder.</p>
      <p>"I know what we're looking for. Whether we find it is another matter."</p>
      <p>"Yes." He stepped back and held her at arm's length for a moment, examining her with the particular attention of someone making a memory. "Come back," he said. Simply, without embellishment. Come back.</p>
      <p>She mounted and turned her horse's head toward the King's Road and did not look behind her, because she was already certain that if she looked at the old man standing in the gate arch with his staff and his ink-stained hands and his unwavering faith in her, she would find it much harder to go.</p>
      <p>The road unrolled ahead of them, pale with frost, leading north toward the passes and then east, always east, toward the dark tree-line of the Thornwood and whatever waited inside it. The wind was behind them for once. The horses moved well.</p>
      <p><em>The sleeper stirs,</em> said the prophecy in the back of her skull, quiet and constant as a heartbeat.</p>
      <p>Nyx rode on into the lightening morning and did not look back, and six riders followed her into whatever came next.</p>`,

      `<p>Three days out from Chalk Keep, they found the body.</p>
      <p>It lay at the roadside a quarter-mile past the Cresting Bridge, half-covered by leaves that had blown over it in a way that suggested it had been there long enough for weather to take notice. Ser Aldric saw it first and held up a fist without speaking; they halted in the instinctive quiet of people who have spent time in places where things go wrong.</p>
      <p>The man had been a messenger — the livery was still legible, royal blue beneath the frost. The satchel at his side had been cut open and emptied with the efficient interest of someone who had known exactly what they were looking for.</p>
      <p>"Council courier," Aldric said, crouching beside the body. He touched nothing. He simply read, with the attention of someone who had learned long ago that a scene could only tell you its story once, undisturbed.</p>
      <p>"Which council?" Essa asked.</p>
      <p>"The king's."</p>
      <p>The word fell into the group and rearranged everything inside it. Nyx looked at Calder. He was already looking at her, the alert curiosity on his face sharpened into something more specific and more careful.</p>
      <p>"The message he was carrying," Calder said quietly. "Do we think it was traveling toward the Thornwood?"</p>
      <p>"Or from it," Nyx said.</p>
      <p>The wind moved through the stripped branches overhead. Somewhere to the east, not very far now, the Thornwood waited with its secrets and its ancient dark and whatever had been sleeping in it long enough that a prophecy had thought it worth mentioning.</p>
      <p>They buried the courier by the roadside, with the respect owed to someone who had died carrying news they had not been allowed to deliver. Then they rode on, a little faster than before, into the narrowing light of the afternoon.</p>`
    ]
  }
};

/* ── Default fallback novel ────────────────────────────────── */
const DEFAULT_NOVEL = {
  title: 'Untitled Novel',
  author: 'Unknown Author',
  chapter: 'Chapter 1',
  chapterTitle: 'The Beginning',
  pages: [
    `<p>The page you requested could not be found. This is a placeholder chapter to ensure the reader experience remains intact. Start exploring the library to find novels available for reading.</p>
    <p>Return to the library and select a novel to begin your reading journey. Each novel is crafted with care to provide an immersive experience within the CloudNovel platform.</p>`
  ]
};

/* ── 2. STATE ──────────────────────────────────────────────── */

const state = {
  novelId:      null,
  novel:        null,
  currentPage:  0,        // 0-indexed
  totalPages:   0,
  fontSize:     18,       // px
  fontMin:      13,
  fontMax:      28,
  theme:        'dark',
  bookmarked:   false,
  focusMode:    false,
  focusTimer:   null,
  bookmarks:    {}        // { novelId: [pageIndex, ...] }
};

/* ── 3. DOM REFS ───────────────────────────────────────────── */

const dom = {
  layout:          document.getElementById('reader-layout'),
  toolbarTitle:    document.getElementById('toolbar-title'),
  toolbarChapter:  document.getElementById('toolbar-chapter'),
  chLabel:         document.getElementById('ch-label'),
  chTitle:         document.getElementById('ch-title'),
  readerText:      document.getElementById('reader-text'),
  readerBody:      document.getElementById('reader-body'),
  progressFill:    document.getElementById('progress-fill'),
  btnPrev:         document.getElementById('btn-prev'),
  btnNext:         document.getElementById('btn-next'),
  pageNum:         document.getElementById('page-num'),
  pageTotal:       document.getElementById('page-total'),
  btnFontUp:       document.getElementById('btn-font-up'),
  btnFontDown:     document.getElementById('btn-font-down'),
  fontSizeDisplay: document.getElementById('font-size-display'),
  btnBookmark:     document.getElementById('btn-bookmark'),
  btnFocus:        document.getElementById('btn-focus'),
  themePills:      document.querySelectorAll('.theme-pill'),
  toast:           document.getElementById('reader-toast'),
};

/* ── 4. TOAST ──────────────────────────────────────────────── */

let toastTimer;
function showToast(msg, duration = 2400) {
  dom.toast.textContent = msg;
  dom.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => dom.toast.classList.remove('show'), duration);
}

/* ── 5. LOAD NOVEL ─────────────────────────────────────────── */

function loadNovel() {
  const params = new URLSearchParams(window.location.search);
  state.novelId = params.get('id') ? parseInt(params.get('id'), 10) : null;
  state.novel   = (state.novelId && NOVELS[state.novelId]) ? NOVELS[state.novelId] : DEFAULT_NOVEL;

  state.totalPages  = state.novel.pages.length;
  state.currentPage = 0;

  // Restore saved page position from sessionStorage
  const savedPage = sessionStorage.getItem(`cn_page_${state.novelId}`);
  if (savedPage !== null) {
    const p = parseInt(savedPage, 10);
    if (!isNaN(p) && p >= 0 && p < state.totalPages) {
      state.currentPage = p;
    }
  }

  // Restore bookmarks from localStorage
  try {
    const saved = localStorage.getItem('cn_bookmarks');
    if (saved) state.bookmarks = JSON.parse(saved);
  } catch { state.bookmarks = {}; }

  // Apply saved font size
  const savedFont = localStorage.getItem('cn_font_size');
  if (savedFont) {
    const f = parseInt(savedFont, 10);
    if (f >= state.fontMin && f <= state.fontMax) state.fontSize = f;
  }

  // Apply saved theme
  const savedTheme = localStorage.getItem('cn_theme');
  if (savedTheme) applyTheme(savedTheme, false);

  // Populate UI
  dom.toolbarTitle.textContent  = state.novel.title;
  dom.toolbarChapter.textContent = state.novel.chapter;
  dom.chLabel.textContent        = state.novel.chapter;
  dom.chTitle.textContent        = state.novel.chapterTitle;
  document.title = `${state.novel.title} — CloudNovel`;

  applyFontSize(false);
  renderPage(false);
}

/* ── 6. RENDER PAGE ────────────────────────────────────────── */

function renderPage(animate = true) {
  const { novel, currentPage, totalPages } = state;

  // Animate content transition
  if (animate) {
    dom.readerText.style.opacity   = '0';
    dom.readerText.style.transform = 'translateY(8px)';
  }

  setTimeout(() => {
    dom.readerText.innerHTML = novel.pages[currentPage];

    // Re-apply drop-cap class on first page
    const firstP = dom.readerText.querySelector('p:first-child');
    if (currentPage === 0 && firstP) firstP.classList.add('drop-cap');

    // Scroll to top of reading area
    dom.readerBody.scrollTo({ top: 0, behavior: 'smooth' });

    if (animate) {
      dom.readerText.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      requestAnimationFrame(() => {
        dom.readerText.style.opacity   = '1';
        dom.readerText.style.transform = 'translateY(0)';
      });
    }
  }, animate ? 160 : 0);

  // Page controls
  dom.pageNum.textContent   = currentPage + 1;
  dom.pageTotal.textContent = `of ${totalPages} page${totalPages !== 1 ? 's' : ''}`;
  dom.btnPrev.disabled      = currentPage === 0;
  dom.btnNext.disabled      = currentPage === totalPages - 1;

  // Progress bar
  const pct = totalPages > 1 ? (currentPage / (totalPages - 1)) * 100 : 100;
  dom.progressFill.style.width = `${pct.toFixed(1)}%`;

  // Bookmark state
  updateBookmarkButton();

  // Persist page position
  sessionStorage.setItem(`cn_page_${state.novelId}`, currentPage);
}

/* ── 7. PAGINATION ─────────────────────────────────────────── */

function prevPage() {
  if (state.currentPage <= 0) return;
  state.currentPage--;
  renderPage(true);
}

function nextPage() {
  if (state.currentPage >= state.totalPages - 1) return;
  state.currentPage++;
  renderPage(true);
}

function initPagination() {
  dom.btnPrev.addEventListener('click', prevPage);
  dom.btnNext.addEventListener('click', nextPage);
}

/* ── 8. FONT SIZE ──────────────────────────────────────────── */

function applyFontSize(save = true) {
  document.documentElement.style.setProperty('--font-size', `${state.fontSize}px`);
  dom.fontSizeDisplay.textContent = state.fontSize;
  dom.btnFontUp.disabled   = state.fontSize >= state.fontMax;
  dom.btnFontDown.disabled = state.fontSize <= state.fontMin;
  if (save) localStorage.setItem('cn_font_size', state.fontSize);
}

function initFontControls() {
  dom.btnFontUp.addEventListener('click', () => {
    if (state.fontSize >= state.fontMax) return;
    state.fontSize += 1;
    applyFontSize();
    showToast(`Font size: ${state.fontSize}px`);
  });

  dom.btnFontDown.addEventListener('click', () => {
    if (state.fontSize <= state.fontMin) return;
    state.fontSize -= 1;
    applyFontSize();
    showToast(`Font size: ${state.fontSize}px`);
  });
}

/* ── 9. THEME ──────────────────────────────────────────────── */

function applyTheme(theme, save = true) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  dom.themePills.forEach(pill => {
    const isActive = pill.dataset.theme === theme;
    pill.classList.toggle('active', isActive);
    pill.setAttribute('aria-pressed', isActive);
  });
  if (save) localStorage.setItem('cn_theme', theme);
}

function initTheme() {
  dom.themePills.forEach(pill => {
    pill.addEventListener('click', () => {
      applyTheme(pill.dataset.theme);
      showToast(`${pill.dataset.theme.charAt(0).toUpperCase() + pill.dataset.theme.slice(1)} theme applied`);
    });
  });
}

/* ── 10. BOOKMARKS ─────────────────────────────────────────── */

function toggleBookmark() {
  const id   = String(state.novelId ?? 'default');
  const page = state.currentPage;

  if (!state.bookmarks[id]) state.bookmarks[id] = [];

  const idx = state.bookmarks[id].indexOf(page);
  if (idx === -1) {
    state.bookmarks[id].push(page);
    showToast(`🔖 Page ${page + 1} bookmarked`);
  } else {
    state.bookmarks[id].splice(idx, 1);
    showToast(`Bookmark removed from page ${page + 1}`);
  }

  try {
    localStorage.setItem('cn_bookmarks', JSON.stringify(state.bookmarks));
  } catch { /* storage unavailable */ }

  updateBookmarkButton();
}

function updateBookmarkButton() {
  const id   = String(state.novelId ?? 'default');
  const page = state.currentPage;
  const isMarked = state.bookmarks[id]?.includes(page) ?? false;
  dom.btnBookmark.classList.toggle('active', isMarked);
  dom.btnBookmark.setAttribute('aria-pressed', isMarked);
}

function initBookmarks() {
  dom.btnBookmark.addEventListener('click', toggleBookmark);
}

/* ── 11. FOCUS MODE ────────────────────────────────────────── */

function setFocusMode(on) {
  state.focusMode = on;
  dom.layout.classList.toggle('focus-mode', on);
  dom.btnFocus.classList.toggle('active', on);
  dom.btnFocus.setAttribute('aria-pressed', on);
}

function resetFocusTimer() {
  if (!state.focusMode) return;
  setFocusMode(false);
  clearTimeout(state.focusTimer);
}

function initFocusMode() {
  dom.btnFocus.addEventListener('click', () => {
    const entering = !state.focusMode;
    setFocusMode(entering);
    if (entering) showToast('Focus mode on — move mouse or press F to exit');
  });

  // Exit focus mode on any interaction
  ['mousemove', 'touchstart', 'click'].forEach(evt => {
    document.addEventListener(evt, () => {
      if (state.focusMode) setFocusMode(false);
    }, { passive: true });
  });
}

/* ── 12. KEYBOARD SHORTCUTS ────────────────────────────────── */

function initKeyboard() {
  document.addEventListener('keydown', (e) => {
    // Ignore when typing in inputs
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        prevPage();
        break;
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
        e.preventDefault();
        nextPage();
        break;
      case 'b':
      case 'B':
        toggleBookmark();
        break;
      case 'f':
      case 'F':
        setFocusMode(!state.focusMode);
        if (state.focusMode) showToast('Focus mode on — press F to exit');
        break;
      case '+':
      case '=':
        if (state.fontSize < state.fontMax) {
          state.fontSize++;
          applyFontSize();
        }
        break;
      case '-':
        if (state.fontSize > state.fontMin) {
          state.fontSize--;
          applyFontSize();
        }
        break;
      case 'Home':
        e.preventDefault();
        state.currentPage = 0;
        renderPage(true);
        break;
      case 'End':
        e.preventDefault();
        state.currentPage = state.totalPages - 1;
        renderPage(true);
        break;
    }
  });
}

/* ── 13. SCROLL PROGRESS ───────────────────────────────────── */

function initScrollProgress() {
  // The progress bar tracks chapter pages, not scroll position.
  // However we also track scroll to show reading body is active.
  dom.readerBody.addEventListener('scroll', () => {
    // If on the same page, reflect scroll position as additional sub-progress
    const el = dom.readerBody;
    const max = el.scrollHeight - el.clientHeight;
    if (max <= 0) return;
    const scrollPct = el.scrollTop / max;
    const pagePct   = state.totalPages > 1
      ? (state.currentPage / (state.totalPages - 1)) * 100
      : 100;
    const sub = state.totalPages > 1 ? (1 / (state.totalPages - 1)) * 100 : 100;
    const total = pagePct + scrollPct * sub * 0.9;
    dom.progressFill.style.width = `${Math.min(total, 100).toFixed(2)}%`;
  }, { passive: true });
}

/* ── 14. SWIPE (MOBILE) ────────────────────────────────────── */

function initSwipe() {
  let startX = null;
  const THRESHOLD = 60;

  dom.readerBody.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  dom.readerBody.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    startX = null;
    if (Math.abs(dx) < THRESHOLD) return;
    dx < 0 ? nextPage() : prevPage();
  }, { passive: true });
}

/* ── INIT ──────────────────────────────────────────────────── */

function init() {
  loadNovel();
  initPagination();
  initFontControls();
  initTheme();
  initBookmarks();
  initFocusMode();
  initKeyboard();
  initScrollProgress();
  initSwipe();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}