/* ==========================================================================
   Sasha — Portfolio · behaviour
   Plain vanilla JS, no framework. Ported from the original design's logic
   class. Organised top-to-bottom as: config → helpers → i18n → toggles →
   scroll animations → cursor trail → hover/focus → contact form → boot.
   ========================================================================== */

/* ----------------------------- Config ----------------------------------- */

// Web3Forms access key. Generate a free one (no account) at https://web3forms.com
// by entering the destination email; the key is emailed to you. Paste it below.
// The key is safe to expose in client-side code.
const WEB3FORMS_ACCESS_KEY = 'REPLACE_WITH_YOUR_WEB3FORMS_ACCESS_KEY';

const DEFAULT_LOCALE = 'pt';        // 'pt' | 'en' — which language loads first
const ENABLE_CURSOR_TRAIL = true;   // subtle colored dots trailing the cursor (desktop only)

// Environment flags (read once).
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

/* ----------------------------- Helpers ---------------------------------- */

const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// Resolve a dot-path like "rest.story.0.t" against a nested object.
function getPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

// Show/hide via the `hidden` content attribute. We use the attribute (not the
// `.hidden` IDL property) because that property doesn't work on SVG elements —
// and some things we toggle (the language circles) are SVG.
function setHidden(el, hidden) {
  if (hidden) el.setAttribute('hidden', '');
  else el.removeAttribute('hidden');
}

/* ------------------------------- i18n ----------------------------------- */

const locales = {};          // { en: {...}, pt: {...} } — filled by loadLocales()
let currentLocale = DEFAULT_LOCALE;

async function loadLocales() {
  try {
    const [en, pt] = await Promise.all([
      fetch('assets/i18n/en.json').then(r => r.json()),
      fetch('assets/i18n/pt.json').then(r => r.json()),
    ]);
    locales.en = en;
    locales.pt = pt;
  } catch (err) {
    // If the JSON can't load (e.g. opened via file://), the PT text baked into
    // the HTML stays in place. The language toggle just won't switch.
    console.warn('Could not load locale files:', err);
  }
}

function applyLocale(loc) {
  const strings = locales[loc];
  currentLocale = loc;
  document.documentElement.lang = loc;

  if (strings) {
    $$('[data-i18n]').forEach(el => {
      const value = getPath(strings, el.dataset.i18n);
      if (value != null) el.textContent = value;
    });
    $$('[data-i18n-ph]').forEach(el => {
      const value = getPath(strings, el.dataset.i18nPh);
      if (value != null) el.placeholder = value;
    });
  }

  // Active-language state: highlight the current language and show its
  // hand-drawn circle (only the nav buttons have one).
  $$('[data-lang]').forEach(btn => {
    const active = btn.dataset.lang === loc;
    btn.setAttribute('aria-pressed', String(active));
    const circle = $('[data-langcircle]', btn);
    if (circle) setHidden(circle, !active);
  });
}

function initLanguageToggle() {
  $$('[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => applyLocale(btn.dataset.lang));
  });
}

/* --------------------- Case-study view toggles -------------------------- */
/* Each toggle group (Maresia "site/sketch", hotel "before/after") keeps both
   states in the DOM; we show one and hide the rest, and slide the pill under
   the active segmented button. */

function setView(group, value) {
  $$(`[data-view-panel="${group}"]`).forEach(panel => {
    setHidden(panel, panel.dataset.viewValue !== value);
  });
  $$(`[data-view-btn="${group}"]`).forEach(btn => {
    const active = btn.dataset.viewValue === value;
    btn.setAttribute('aria-pressed', String(active));
    const pill = $('[data-pill]', btn);
    if (pill) setHidden(pill, !active);
  });
  // New content just became visible — re-evaluate scroll animations for it.
  onScroll();
  setupFrameReveals();
}

function initViewToggles() {
  $$('[data-view-btn]').forEach(btn => {
    btn.addEventListener('click', () => setView(btn.dataset.viewBtn, btn.dataset.viewValue));
  });
}

// One-time "peek": auto-flip a toggle to its second state and back, so the
// user sees that the content changes. Buttons are re-queried before each click
// because setView may re-render pill/aria state.
function peek(group) {
  const buttons = $$('button', group);
  if (buttons.length < 2) return;
  setTimeout(() => { const b = $$('button', group)[1]; if (b) b.click(); }, 500);
  setTimeout(() => { const b = $$('button', group)[0]; if (b) b.click(); }, 1650);
}

/* --------------- Scroll-frame nudge (gentle "there's more") ------------- */

function nudge(frame) {
  const max = frame.scrollHeight - frame.clientHeight;
  if (max < 20 || frame.scrollTop > 4) return;
  const peak = Math.min(74, max);
  const start = performance.now();
  const duration = 1150;
  const step = (now) => {
    const p = Math.min(1, (now - start) / duration);
    if (frame._userScrolled) return;
    frame.scrollTop = peak * Math.sin(p * Math.PI);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// Fire the one-time nudge / peek cues as their elements scroll into view.
let cueEls = null;
function checkCues(viewportH) {
  if (prefersReducedMotion) return;
  if (!cueEls) cueEls = $$('[data-nudge],[data-peek]');
  cueEls.forEach(el => {
    const r = el.getBoundingClientRect();
    const inView = r.top < viewportH * 0.72 && r.bottom > viewportH * 0.3;
    if (!inView) return;
    if (el.hasAttribute('data-nudge') && !el._nudged) { el._nudged = true; nudge(el); }
    if (el.hasAttribute('data-peek') && !el._peeked) { el._peeked = true; peek(el); }
  });
}

/* --------------- Reveals + hand-drawn ink (window scroll) --------------- */

let revealEls = null;
let inkSvgs = null;

function initInk() {
  inkSvgs = $$('svg[data-ink]');
  inkSvgs.forEach(svg => svg.querySelectorAll('path').forEach(p => {
    let len = 300;
    try { len = p.getTotalLength() || 300; } catch (e) {}
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = prefersReducedMotion ? 0 : len;
  }));
}

function initReveal() {
  revealEls = $$('[data-reveal]');
  if (prefersReducedMotion) {
    revealEls.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
  }
}

function onScroll() {
  const vh = window.innerHeight;
  checkCues(vh);
  if (prefersReducedMotion) return;

  // Reveals: fade + rise in when entering view, reset when leaving (so they
  // replay on scroll up too). Optional per-element stagger via data-idx.
  if (revealEls) revealEls.forEach(el => {
    const r = el.getBoundingClientRect();
    const inView = r.top < vh * 0.86 && r.bottom > vh * 0.10;
    if (inView && el.dataset.shown !== '1') {
      el.dataset.shown = '1';
      const delay = el.dataset.idx ? (parseInt(el.dataset.idx, 10) || 0) * 160 : 0;
      el.style.transition = `opacity .6s ease ${delay}ms, transform .7s cubic-bezier(.22,.61,.36,1) ${delay}ms`;
      el.style.opacity = '1';
      el.style.transform = 'none';
    } else if (!inView && el.dataset.shown === '1') {
      el.dataset.shown = '';
      el.style.transition = 'opacity .35s ease, transform .35s ease';
      el.style.opacity = '0';
      el.style.transform = 'translateY(26px)';
    }
  });

  // Ink strokes: draw in when entering view, retract when leaving.
  if (inkSvgs) inkSvgs.forEach(svg => {
    const r = svg.getBoundingClientRect();
    const inView = r.top < vh * 0.85 && r.bottom > vh * 0.06;
    const drawn = svg.dataset.drawn === '1';
    if (inView && !drawn) {
      svg.dataset.drawn = '1';
      svg.querySelectorAll('path').forEach((p, i) => {
        p.style.transition = `stroke-dashoffset .9s cubic-bezier(.22,.61,.36,1) ${i * 0.1}s`;
        p.style.strokeDashoffset = '0';
      });
    } else if (!inView && drawn) {
      svg.dataset.drawn = '';
      svg.querySelectorAll('path').forEach(p => {
        p.style.transition = 'stroke-dashoffset .4s ease';
        p.style.strokeDashoffset = p.style.strokeDasharray;
      });
    }
  });
}

/* ------ Reveals inside the scrollable mockups (their own scrollbar) ----- */

let frameCleanup = [];
function setupFrameReveals() {
  frameCleanup.forEach(fn => fn());
  frameCleanup = [];

  $$('[data-scrollframe]').forEach(frame => {
    const run = () => {
      const fr = frame.getBoundingClientRect();
      frame.querySelectorAll('[data-areveal]').forEach(el => {
        if (prefersReducedMotion) { el.style.opacity = '1'; el.style.transform = 'none'; return; }
        const r = el.getBoundingClientRect();
        const inView = r.top < fr.bottom - fr.height * 0.08 && r.bottom > fr.top + fr.height * 0.03;
        if (inView && el.dataset.ashown !== '1') {
          el.dataset.ashown = '1';
          el.style.transition = 'opacity .6s ease, transform .7s cubic-bezier(.22,.61,.36,1)';
          el.style.opacity = '1';
          el.style.transform = 'none';
        } else if (!inView && el.dataset.ashown === '1') {
          el.dataset.ashown = '';
          el.style.transition = 'opacity .3s ease, transform .3s ease';
          el.style.opacity = '0';
          el.style.transform = 'translateY(24px)';
        }
      });
    };
    frame.addEventListener('scroll', run, { passive: true });
    frameCleanup.push(() => frame.removeEventListener('scroll', run));

    // Hide the "scroll to explore" cue once the user actually scrolls a frame.
    if (!frame._cueWired) {
      frame._cueWired = true;
      const cue = frame.parentElement ? frame.parentElement.querySelector('[data-scrollcue]') : null;
      frame.addEventListener('scroll', () => {
        frame._userScrolled = true;
        if (cue && frame.scrollTop > 6) { cue.style.transition = 'opacity .4s ease'; cue.style.opacity = '0'; }
      }, { passive: true });
    }

    run();
    setTimeout(run, 160);
    setTimeout(run, 520);
  });
}

/* --------------------------- Cursor ink-trail --------------------------- */

function makeTrail() {
  const colors = ['#1A1815', '#FF4A26', '#1D4ED8'];
  const layer = $('#trail');
  let i = 0, last = 0;
  return (e) => {
    const now = performance.now();
    if (now - last < 38) return;
    last = now;
    if (!layer) return;
    const dot = document.createElement('div');
    const color = colors[(i++) % 3];
    dot.style.cssText = `position:absolute;left:${e.clientX}px;top:${e.clientY}px;width:8px;height:8px;border-radius:50%;background:${color};opacity:.5;transform:translate(-50%,-50%);transition:opacity .55s ease, transform .55s ease`;
    layer.appendChild(dot);
    requestAnimationFrame(() => { dot.style.opacity = '0'; dot.style.transform = 'translate(-50%,-50%) scale(.2)'; });
    setTimeout(() => dot.remove(), 600);
  };
}

/* ------------------- Hover / focus accent styles ------------------------ */
/* The design attaches extra inline styles on hover (cards lifting) and focus
   (form field underline). We apply them by appending to the element's own
   inline style and restoring the original on exit. */

function initInteractiveStyles(attr, enterEvent, leaveEvent) {
  $$(`[data-${attr}]`).forEach(el => {
    const base = el.getAttribute('style') || '';
    const extra = el.dataset[attr];
    el.addEventListener(enterEvent, () => { el.setAttribute('style', base + ';' + extra); });
    el.addEventListener(leaveEvent, () => { el.setAttribute('style', base); });
  });
}

/* ----------------------------- Contact form ----------------------------- */

function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;
  const thanks = $('[data-thanks]', form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    data.append('access_key', WEB3FORMS_ACCESS_KEY);
    data.append('subject', 'New enquiry from your website');
    data.append('from_name', 'Sasha portfolio');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });
      const json = await res.json();
      if (json.success) {
        if (thanks) { thanks.style.color = '#1D4ED8'; thanks.style.display = 'block'; }
        form.reset();
      } else {
        showFormError(thanks);
      }
    } catch (err) {
      showFormError(thanks);
    }
  });
}

function showFormError(thanks) {
  if (!thanks) return;
  thanks.textContent = "Couldn't send just now — please email mmroczkowski628@gmail.com or use WhatsApp.";
  thanks.style.color = '#E8321E';
  thanks.style.display = 'block';
}

/* -------------------------------- Boot ---------------------------------- */

async function boot() {
  $('#year').textContent = String(new Date().getFullYear());

  await loadLocales();
  applyLocale(DEFAULT_LOCALE);

  initLanguageToggle();
  initViewToggles();
  initContactForm();
  initInteractiveStyles('hover', 'mouseenter', 'mouseleave');
  initInteractiveStyles('focus', 'focusin', 'focusout');

  initInk();
  initReveal();
  onScroll();
  setupFrameReveals();

  // Throttle scroll work to one pass per animation frame.
  let scrolling = false;
  const onScrollThrottled = () => {
    if (scrolling) return;
    scrolling = true;
    requestAnimationFrame(() => { onScroll(); scrolling = false; });
  };
  window.addEventListener('scroll', onScrollThrottled, { passive: true });
  window.addEventListener('resize', onScroll);

  // Re-measure once web fonts have loaded (text sizes shift ink/reveal geometry).
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(onScroll);

  // Cursor trail: desktop, fine pointer, motion allowed, and enabled in config.
  if (hasFinePointer && !prefersReducedMotion && ENABLE_CURSOR_TRAIL) {
    window.addEventListener('mousemove', makeTrail(), { passive: true });
  }
}

boot();
