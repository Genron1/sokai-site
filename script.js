// ===== Drawer menu + smooth scroll + speaker auto rules =====

const body = document.body;
const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const drawer = document.getElementById('drawer');
const overlay = document.getElementById('overlay');

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

let lastFocused = null;

function setAria(open){
  menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
  overlay.hidden = !open;
  menuBtn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
}

function openMenu(){
  lastFocused = document.activeElement;
  body.classList.add('is-menu-open');
  setAria(true);
  const first = drawer.querySelector(focusableSelector);
  first && first.focus({ preventScroll: true });
}

function closeMenu(){
  body.classList.remove('is-menu-open');
  setAria(false);
  if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
}

function toggleMenu(){
  if (body.classList.contains('is-menu-open')) closeMenu();
  else openMenu();
}

menuBtn?.addEventListener('click', toggleMenu);
closeBtn?.addEventListener('click', closeMenu);
overlay?.addEventListener('click', closeMenu);

// ESC + focus trap
document.addEventListener('keydown', (e) => {
  if (!body.classList.contains('is-menu-open')) return;

  if (e.key === 'Escape') {
    e.preventDefault();
    closeMenu();
    return;
  }

  if (e.key === 'Tab') {
    const focusables = Array.from(drawer.querySelectorAll(focusableSelector));
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

// Smooth scroll + close drawer on drawer links
drawer?.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  e.preventDefault();
  const id = a.getAttribute('href');
  const el = document.querySelector(id);
  closeMenu();
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Smooth scroll for normal anchors
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    if (drawer && drawer.contains(a)) return;
    const id = a.getAttribute('href');
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ===== Speaker layout helpers =====
// - data-count が未指定なら子要素数で自動設定
// - スマホで奇数人数(>=3)なら最後の1人を中央寄せ（is-odd-last付与）
function setupSpeakers(){
  const blocks = document.querySelectorAll('.speakers');
  blocks.forEach(block => {
    const speakers = Array.from(block.children).filter(el => el.classList.contains('speaker'));
    const count = speakers.length;

    if (!block.dataset.count || block.dataset.count === "0") {
      block.dataset.count = String(count);
    }

    // odd last on mobile: 3,5,7... のとき最後だけ中央
    // 2人は中央化しない
    if (count >= 3 && (count % 2 === 1)) {
      block.classList.add('is-odd-last');
    } else {
      block.classList.remove('is-odd-last');
    }
  });
}

setupSpeakers();
window.addEventListener('resize', () => {
  // data-countは変わらないが、運用でDOM差し替えが起きても反映できるように
  setupSpeakers();
});

// ===== Fixed header offset =====
(() => {
  const header = document.querySelector('.topbar');
  if (!header) return;

  const apply = () => {
    const h = header.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--header-h', `${h}px`);
  };

  apply();
  window.addEventListener('resize', apply);
})();

// ===== X share button =====
(() => {
  const btn = document.getElementById('xShareBtn');
  if (!btn) return;

  const text = 'ゲンロン友の会総会 2026';
  const url = location.href;

  const shareUrl =
    'https://twitter.com/intent/tweet?' +
    new URLSearchParams({
      text,
      url
    }).toString();

  btn.href = shareUrl;
})();

// ===== Sticky ticket bar: show after scroll, hide at top =====
(() => {
  const bar = document.getElementById('ticketBar');
  if (!bar) return;

  const SHOW_AFTER = 10; // px（ここより下にスクロールしたら表示）

  const onScroll = () => {
    if (window.scrollY > SHOW_AFTER) {
      bar.classList.add('is-visible');
    } else {
      bar.classList.remove('is-visible');
    }
  };

  // 初期状態を反映（リロード時対策）
  onScroll();

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ==========ここからnew=============== */
// =========================================================
// Image Modal (index.html)
// - Open on click (#timetable/#map images)
// - Scroll resets to top on open
// - Close by backdrop / close button / Esc
// =========================================================
(() => {
  const modal = document.getElementById('imgModal');
  const modalImg = document.getElementById('imgModalImg');
  const modalCaption = document.getElementById('imgModalCaption');

  if (!modal || !modalImg) return;

  const scroller = modal.querySelector('.imgmodal__figure');

  function resetScrollTop() {
    if (!scroller) return;
    scroller.scrollTop = 0;
    // iOS対策：描画タイミングでもう一回
    requestAnimationFrame(() => (scroller.scrollTop = 0));
  }

  function openModal(src, alt) {
    document.body.classList.add('is-imgmodal-open');
    modal.setAttribute('aria-hidden', 'false');

    resetScrollTop();

    modalImg.src = src;
    modalImg.alt = alt || '';
    if (modalCaption) modalCaption.textContent = alt || '';

    // 画像読み込み後も先頭に戻す（縦長の時に効く）
    modalImg.onload = () => resetScrollTop();
  }

  function closeModal() {
    document.body.classList.remove('is-imgmodal-open');
    modal.setAttribute('aria-hidden', 'true');

    if (scroller) scroller.scrollTop = 0;

    modalImg.src = '';
    modalImg.alt = '';
    if (modalCaption) modalCaption.textContent = '';
  }

  // クリックで閉じる（背景/×）
  modal.addEventListener('click', (e) => {
    if (e.target.closest('[data-imgmodal-close]')) {
      e.preventDefault();
      closeModal();
    }
  });

  // Escで閉じる
  document.addEventListener('keydown', (e) => {
    if (!document.body.classList.contains('is-imgmodal-open')) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
    }
  });

  // 対象画像クリックで開く（必要に応じてセレクタ追加OK）
  document.addEventListener('click', (e) => {
    const img = e.target.closest('img.js-imgmodal');
    if (!img) return;
    e.preventDefault();
    openModal(img.src, img.alt);
  });
})();
// ===== Countdown: days until 3/20 =====
(() => {
  const el = document.getElementById('daysLeft');
  if (!el) return;

  // 対象日（年は必要に応じて調整）
  const TARGET = new Date(2026, 2, 20); // ※ 月は0始まり（3月=2）

  // 今日を「日付のみ」で扱う（時刻ズレ防止）
  const today = new Date();
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const diffMs = TARGET - startOfToday;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  el.textContent = diffDays;
})();