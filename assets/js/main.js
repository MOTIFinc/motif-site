// MOTIF 共通の動き:スマホのメニュー/スクロールに合わせた控えめな表示/ヘッダーの線
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- スマホのメニュー ----
  var btn = document.querySelector('.menu-btn');
  var menu = document.getElementById('site-menu');
  function setMenu(open) {
    if (!btn || !menu) return;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    document.documentElement.classList.toggle('menu-open', open);
    if (open) { menu.hidden = false; void menu.offsetWidth; menu.classList.add('is-open'); }
    else { menu.classList.remove('is-open'); setTimeout(function () { if (!menu.classList.contains('is-open')) menu.hidden = true; }, reduce ? 0 : 350); }
  }
  if (btn && menu) {
    btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 760) setMenu(false); });
  }

  // ---- ヘッダー:少しスクロールしたら下に細い線 ----
  var header = document.querySelector('.site-header');
  function onScroll() { if (header) header.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // ---- スクロールで、要素が少しだけ浮かび上がる ----
  var targets = [
    '.hero-text > *', '.label', '.col-left > *', '.block h2', '.block .body', '.block .r-body', '.cities',
    '.item', '.venn-circle', '.diagram-note', '.tl-row', '.logo-ph', '.clients > .r-note',
    '.cases > .wrap > *', '.case-main', '.case-head', '.case-dl', '.case-pair > *', '.full-bleed',
    '.more > .r-note', '.more-item', '.contact > *', '.field', '.form .btn'
  ].join(',');
  var els = Array.prototype.slice.call(document.querySelectorAll(targets));
  if (reduce || !('IntersectionObserver' in window)) return;
  els.forEach(function (el) {
    el.classList.add('rv');
    // 同じ並びの要素は、少しずつ時間をずらす(最大4つ分)
    var sib = Array.prototype.indexOf.call(el.parentNode.children, el);
    el.style.transitionDelay = (Math.min(sib, 4) * 80) + 'ms';
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.01 });
  els.forEach(function (el) { io.observe(el); });
})();
