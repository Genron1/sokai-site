// ===== About page gallery: thumbnail -> main image switch =====
(() => {
  const mainImg = document.getElementById('aboutGalleryMain');
  const thumbsWrap = document.querySelector('.sokai-about-gallery__thumbs');
  if (!mainImg || !thumbsWrap) return;

  const thumbs = Array.from(thumbsWrap.querySelectorAll('.sokai-about-thumb'));
  if (thumbs.length === 0) return;

  function setActive(btn) {
    const full = btn.getAttribute('data-full');
    const alt = btn.getAttribute('data-alt') || '';

    if (!full) return;

    // 先にスクロール位置の変化を抑える（画像の高さ変化がある場合）
    const prevHeight = mainImg.getBoundingClientRect().height;

    // 画像差し替え
    mainImg.src = full;
    mainImg.alt = alt;

    // active state
    thumbs.forEach((b) => {
      b.classList.remove('is-active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('is-active');
    btn.setAttribute('aria-pressed', 'true');

    // 高さ変化があるときの体感ズレ軽減（任意）
    requestAnimationFrame(() => {
      const newHeight = mainImg.getBoundingClientRect().height;
      const delta = newHeight - prevHeight;
      if (Math.abs(delta) > 40) {
        window.scrollBy({ top: delta * 0.15, left: 0, behavior: 'instant' });
      }
    });
  }

  // クリックで切り替え（イベント委任）
  thumbsWrap.addEventListener('click', (e) => {
    const btn = e.target.closest('.sokai-about-thumb');
    if (!btn) return;
    setActive(btn);
  });

  // キーボード操作：左右でサムネ移動（任意だけど便利）
  thumbsWrap.addEventListener('keydown', (e) => {
    const current = document.activeElement?.closest?.('.sokai-about-thumb');
    if (!current) return;

    const idx = thumbs.indexOf(current);
    if (idx < 0) return;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = thumbs[(idx + 1) % thumbs.length];
      next.focus();
      setActive(next);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = thumbs[(idx - 1 + thumbs.length) % thumbs.length];
      prev.focus();
      setActive(prev);
    }
  });

  // 初期activeが無い場合の保険
  const initial = thumbsWrap.querySelector('.sokai-about-thumb.is-active') || thumbs[0];
  setActive(initial);
})();