/* ============================================================
   PANCREASaver 助胰見® | pancad.ai 新官網 — 互動腳本
   ============================================================ */
(function () {
  'use strict';

  /* --- Nav：滾動變色 --- */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --- 行動版漢堡選單 --- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  burger.addEventListener('click', function () {
    menu.classList.toggle('open');
    burger.classList.toggle('open');
  });
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { menu.classList.remove('open'); });
  });

  /* --- 滾動漸現（IntersectionObserver） --- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  /* --- 數字跑馬燈（easeOutCubic） --- */
  var counters = document.querySelectorAll('.counter');
  function animateCounter(el) {
    var target = parseFloat(el.dataset.target);
    var decimals = parseInt(el.dataset.decimals || '0', 10);
    var dur = 1800, start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCounter(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* --- 頁尾年份自動更新 --- */
  var yr = document.querySelector('.footer-bottom span:first-child');
  if (yr) yr.textContent = yr.textContent.replace('2026', String(new Date().getFullYear()));

  /* --- INTRO 進入動畫（停留3秒後自動進入首頁；下滑/SKIP 可提早） --- */
  var intro = document.getElementById('intro');
  if (intro) {
    var entered = false;
    function finishIntro() {
      if (entered) return;
      entered = true;
      intro.classList.add('done');
      document.body.classList.remove('no-scroll');
      /* Hero 文字錯落入場 */
      var hc = document.querySelector('.hero-card');
      if (hc) hc.classList.add('hero-enter');
      setTimeout(function () { if (intro.parentNode) intro.parentNode.removeChild(intro); }, 1200);
    }
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finishIntro(); /* 無障礙：減少動態偏好直接進入 */
    } else {
      /* 3 秒後自動進入首頁 */
      setTimeout(finishIntro, 3000);
      /* 滑鼠滾輪向下 / 觸控上滑 → 提早進入 */
      window.addEventListener('wheel', function (e) { if (e.deltaY > 8) finishIntro(); }, { passive: true });
      window.addEventListener('touchstart', function (e) {
        var y = e.touches[0].clientY;
        window.addEventListener('touchmove', function (ev) {
          if (ev.touches[0].clientY < y - 24) finishIntro();
        }, { passive: true, once: true });
      }, { passive: true });
      /* 鍵盤 PageDown / 向下鍵 */
      window.addEventListener('keydown', function (e) {
        if (e.key === 'PageDown' || e.key === 'ArrowDown' || e.key === ' ') finishIntro();
      });
      /* SKIP 直接進入 */
      var skipBtn = document.getElementById('introSkip');
      if (skipBtn) skipBtn.addEventListener('click', finishIntro);
    }
  }

  /* --- Hero 背景漸進載入（v2 使用 CT SVG，不需漸進載入，移除） --- */

  /* --- Hero 金色粒子（活出精彩的活力感） --- */
  var particles = document.getElementById('heroParticles');
  if (particles) {
    var COUNT = window.innerWidth < 768 ? 10 : 18;
    for (var i = 0; i < COUNT; i++) {
      var p = document.createElement('span');
      p.className = 'particle';
      var size = 3 + Math.random() * 7;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.left = (Math.random() * 100) + '%';
      p.style.animationDuration = (9 + Math.random() * 14) + 's';
      p.style.animationDelay = (-Math.random() * 20) + 's';
      particles.appendChild(p);
    }
  }
})();
