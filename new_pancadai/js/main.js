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

  /* --- 數字跑馬燈 --- */
  var counters = document.querySelectorAll('.counter');
  function animateCounter(el) {
    var target = parseFloat(el.dataset.target);
    var decimals = parseInt(el.dataset.decimals || '0', 10);
    var dur = 1600, start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3); /* easeOutCubic */
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target.toFixed(decimals);
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

  /* --- INTRO 進入動畫（停留等待，使用者下滑才進入） --- */
  var intro = document.getElementById('intro');
  if (intro) {
    function finishIntro() {
      intro.classList.add('done');
      document.body.classList.remove('no-scroll');
      setTimeout(function () { if (intro.parentNode) intro.parentNode.removeChild(intro); }, 1200);
    }
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finishIntro(); /* 無障礙：減少動態偏好直接進入 */
    } else {
      var entered = false;
      function enterByScroll() {
        if (entered) return;
        entered = true;
        finishIntro();
      }
      /* 滑鼠滾輪向下 / 觸控上滑 → 進入 */
      window.addEventListener('wheel', function (e) { if (e.deltaY > 8) enterByScroll(); }, { passive: true });
      window.addEventListener('touchstart', function (e) {
        var y = e.touches[0].clientY;
        var h = window.innerHeight;
        window.addEventListener('touchmove', function (ev) {
          if (!entered && ev.touches[0].clientY < y - 24) enterByScroll();
        }, { passive: true, once: true });
      }, { passive: true });
      /* 鍵盤 PageDown / 向下鍵 */
      window.addEventListener('keydown', function (e) {
        if (e.key === 'PageDown' || e.key === 'ArrowDown' || e.key === ' ') enterByScroll();
      });
      /* SKIP 直接進入 */
      var skipBtn = document.getElementById('introSkip');
      if (skipBtn) skipBtn.addEventListener('click', enterByScroll);
    }
  }

  /* --- Hero 背景漸進載入：低解析先顯示 → 高解析載入後淡入 --- */
  var heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    var hi = new Image();
    hi.onload = function () {
      heroBg.classList.add('swap-hd');
      setTimeout(function () {
        heroBg.style.backgroundImage = "url('assets/hero_sunrise.jpg')";
        heroBg.classList.remove('swap-hd');
      }, 120);
    };
    hi.src = 'assets/hero_sunrise.jpg';
  }

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
