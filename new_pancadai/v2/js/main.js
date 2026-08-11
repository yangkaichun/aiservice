/* ============================================================
   PANCREASaver 助胰見® | pancad.ai 新官網 — 互動腳本
   ============================================================ */
(function () {
  'use strict';

  /* --- Nav：滾動變色（缺元素時跳過） --- */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (nav) {
      if (window.scrollY > 40) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --- 行動版漢堡選單（缺元素時跳過，避免崩潰） --- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      menu.classList.toggle('open');
      burger.classList.toggle('open');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { menu.classList.remove('open'); });
    });
  }

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

  /* --- Hero 背景：依語言選池（en=多元種族 30 張；zh/ja=台灣 7 張）＋HD 升級＋9s 輪換 --- */
  var heroBg = document.querySelector('.hero-bg');
  function heroPool() {
    if (document.documentElement.lang === 'en') {
      var arr = [];
      for (var i = 1; i <= 30; i++) {
        var n = (i < 10 ? '0' : '') + i;
        arr.push({ src: 'assets/hero_intl_' + n + '_safe.jpg', hd: 'assets/hero_intl_' + n + '_safe_hd.jpg' });
      }
      return arr;
    }
    return [
      { src: 'assets/hero_sun_bike_safe.jpg', hd: 'assets/hero_sun_bike_safe_hd.jpg' },
      { src: 'assets/hero_sun_yoga_safe.jpg', hd: 'assets/hero_sun_yoga_safe_hd.jpg' },
      { src: 'assets/hero_sun_picnic_safe.jpg', hd: 'assets/hero_sun_picnic_safe_hd.jpg' },
      { src: 'assets/hero_sun_coffee_safe.jpg', hd: 'assets/hero_sun_coffee_safe_hd.jpg' },
      { src: 'assets/hero_sun_kayak_safe.jpg', hd: 'assets/hero_sun_kayak_safe_hd.jpg' },
      { src: 'assets/hero_sun_bridge_safe.jpg', hd: 'assets/hero_sun_bridge_safe_hd.jpg' },
      { src: 'assets/hero_sun_forest_safe.jpg', hd: 'assets/hero_sun_forest_safe_hd.jpg' }
    ];
  }
  if (heroBg) {
    var heroPick = heroPool()[Math.floor(Math.random() * heroPool().length)];
    var conn = navigator.connection || {};
    var et = (conn.effectiveType || '4g').toLowerCase();
    var wantMed = et !== 'slow-2g' && et !== '2g';
    var wantHd = et === '4g' || et === 'wifi' || et.indexOf('ethernet') === 0 || !conn.effectiveType;
    function showHeroBg(cand) {
      if (wantMed) {
        var hImg = new Image();
        hImg.onload = function () {
          heroBg.style.transition = 'opacity 1.2s ease';
          heroBg.style.opacity = '0';
          setTimeout(function () {
            heroBg.style.backgroundImage = "url('" + cand.src + "')";
            heroBg.style.opacity = '1';
          }, 180);
          if (wantHd) {
            var hdImg = new Image();
            hdImg.onload = function () {
              heroBg.style.opacity = '0';
              setTimeout(function () {
                heroBg.style.backgroundImage = "url('" + cand.hd + "')";
                heroBg.style.opacity = '1';
              }, 200);
            };
            hdImg.src = cand.hd;
          }
        };
        hImg.src = cand.src;
      }
    }
    showHeroBg(heroPick);
    /* --- 語言切換 → 立即從新語言池重選背景 --- */
    window.addEventListener('langchange', function () {
      var pool = heroPool();
      heroPick = pool[Math.floor(Math.random() * pool.length)];
      showHeroBg(heroPick);
    });
    /* --- 停留輪換：每 9s 隨機換一張，預載完成（onload）才淡入淡出切換 --- */
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) {
      setInterval(function () {
        var pool = heroPool();
        var next = pool[Math.floor(Math.random() * pool.length)];
        if (next === heroPick) {
          next = pool[(pool.indexOf(heroPick) + 1) % pool.length];
        }
        var pre = new Image();
        pre.onload = function () {
          heroBg.style.transition = 'opacity .9s ease';
          heroBg.style.opacity = '0';
          setTimeout(function () {
            heroBg.style.backgroundImage = "url('" + next.hd + "')";
            heroBg.style.opacity = '1';
            heroPick = next;
          }, 320);
        };
        pre.onerror = function () {
          var fb = new Image();
          fb.onload = function () {
            heroBg.style.opacity = '0';
            setTimeout(function () {
              heroBg.style.backgroundImage = "url('" + next.src + "')";
              heroBg.style.opacity = '1';
              heroPick = next;
            }, 320);
          };
          fb.src = next.src;
        };
        pre.src = next.hd;
      }, 9000);
    }
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
