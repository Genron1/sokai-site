document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const animatedItems = Array.from(document.querySelectorAll("[data-animate]"));

  if (animatedItems.length > 0) {
    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      animatedItems.forEach((el) => el.classList.add("is-visible"));
    } else {
      document.body.classList.add("has-animations");
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.35,
          rootMargin: "0px 0px -10%",
        }
      );

      animatedItems.forEach((el) => {
        const delay = Number(el.dataset.delay || 0);
        if (delay) {
          el.style.transitionDelay = `${delay}ms`;
        }
        observer.observe(el);
      });
    }
  }

  const shareBtn = document.querySelector(".share-btn");
  if (shareBtn) {
    shareBtn.addEventListener("click", (event) => {
      event.preventDefault();
      const text = shareBtn.dataset.shareText || "";
      const url = shareBtn.dataset.shareUrl || "";
      const intentUrl = `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      const deepLink = `twitter://post?message=${encodeURIComponent(`${text} ${url}`)}`;
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

      if (isMobile) {
        // Try to open Xアプリ（同一タブ遷移）。未インストール時のみ intent にフォールバック。
        const fallback = setTimeout(() => {
          window.location.href = intentUrl;
        }, 900);
        window.location.href = deepLink;
        setTimeout(() => clearTimeout(fallback), 1600);
      } else {
        window.open(intentUrl, "_blank", "noopener,noreferrer");
      }
    });
  }
});
