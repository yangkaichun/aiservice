/* ============================================================
   pancad.ai v3 — 共用 JS
   導航 / 語言切換（掛接 i18n.js）/ reveal 動效 / 敘事捲動
   CT 互動滑桿 / 捲動進度條 / 數字跑馬燈
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 1. NAV：滾動加陰影 + 漢堡選單 ---------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var mobileMenu = document.getElementById('mobileMenu');
  var body = document.body;

  function onScroll() {
    if (nav && window.scrollY > 40) nav.classList.add('scrolled');
    else if (nav) nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (burger && mobileMenu) {
    burger.addEventListener('click', function () {
      var open = mobileMenu.classList.toggle('open');
      burger.classList.toggle('open', open);
      body.style.overflow = open ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        burger.classList.remove('open');
        body.style.overflow = '';
      });
    });
  }

  /* ---------- 2. 語言切換（與 i18n.js 協作） ---------- */
  function setLangLabel(lang) {
    var names = { zh: '繁體中文', en: 'English', ja: '日本語' };
    var label = document.getElementById('langLabel');
    if (label) label.textContent = names[lang] || names.zh;
    document.querySelectorAll('.lang-btn-opt').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    // i18n.js 已處理 langBtn 開關與 [data-lang] 切換；
    // 此處僅補 mobile menu 的關閉與語言標籤同步。
    var lang = (window.PANCAD_LANG && PANCAD_LANG.current && PANCAD_LANG.current()) || 'zh';
    setLangLabel(lang);

    document.querySelectorAll('.mobile-menu [data-lang]').forEach(function (b) {
      b.addEventListener('click', function () {
        var l = b.getAttribute('data-lang');
        if (window.PANCAD_LANG && PANCAD_LANG.apply) PANCAD_LANG.apply(l);
        var menu = document.getElementById('mobileMenu');
        if (menu) menu.classList.remove('open');
        var burgerEl = document.getElementById('burger');
        if (burgerEl) burgerEl.classList.remove('open');
        body.style.overflow = '';
        setLangLabel(l);
        setTimeout(function () {
          window.dispatchEvent(new CustomEvent('langchange'));
        }, 60);
      });
    });
  });

  /* ---------- 3. Reveal 滾動淡入 ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          ro.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { ro.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- 4. 敘事軌捲動（patient.html 章節切換） ---------- */
  var chapters = document.querySelectorAll('.chapter');
  if (chapters.length) {
    var progress = document.getElementById('storyProgress');
    var chapterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          chapters.forEach(function (c) { c.classList.remove('active'); });
          e.target.classList.add('active');
        }
      });
    }, { threshold: 0.55 });
    chapters.forEach(function (c) { chapterObserver.observe(c); });

    window.addEventListener('scroll', function () {
      if (!progress) return;
      var h = document.documentElement;
      var max = h.scrollHeight - window.innerHeight;
      var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      progress.style.width = pct + '%';
    }, { passive: true });
  }

  /* ---------- 5. CT 互動滑桿（patient.html 幕 4） ---------- */
  var slider = document.querySelector('.ct-slider');
  if (slider) {
    var topLayer = slider.querySelector('.top-layer');
    var handle = slider.querySelector('.handle');
    var dragging = false;

    function setPos(clientX) {
      var r = slider.getBoundingClientRect();
      var pct = ((clientX - r.left) / r.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      topLayer.style.width = pct + '%';
      handle.style.left = pct + '%';
    }

    function onMove(e) {
      if (!dragging) return;
      var x = e.touches ? e.touches[0].clientX : e.clientX;
      setPos(x);
    }
    function onDown(e) {
      dragging = true;
      var x = e.touches ? e.touches[0].clientX : e.clientX;
      setPos(x);
    }
    function onUp() { dragging = false; }

    slider.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    slider.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
  }

  /* ---------- 6. 數字跑馬燈（counter） ---------- */
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-target'));
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var dur = 1600;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('.counter');
  if (counters.length && 'IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          animateCounter(e.target);
          co.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  }

  /* ---------- 7. contact 頁表單分流 tabs ---------- */
  var tabs = document.querySelectorAll('.contact-tabs button');
  if (tabs.length) {
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        tabs.forEach(function (x) { x.classList.remove('active'); });
        t.classList.add('active');
        var target = t.getAttribute('data-tab');
        var form = document.getElementById('contactForm');
        if (form && target) {
          var sel = form.querySelector('#topic');
          if (sel) sel.value = target;
        }
      });
    });
  }

  /* ---------- 8. 表單提交（mailto 備援 / 導向成功訊息） ---------- */
  var forms = document.querySelectorAll('form[data-form]');
  forms.forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = f.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = btn.getAttribute('data-sending') || '送出中…';
      }
      // 靜態站：組 mailto 連結作為可用的最低成本方案
      var name = (f.querySelector('#name') || {}).value || '';
      var topic = (f.querySelector('#topic') || {}).value || '';
      var msg = (f.querySelector('#message') || {}).value || '';
      var mailto = 'mailto:contact@pancad.ai?subject=' +
        encodeURIComponent('[' + topic + '] ' + name) +
        '&body=' + encodeURIComponent(msg);
      window.location.href = mailto;
      setTimeout(function () {
        if (btn) { btn.disabled = false; btn.textContent = btn.getAttribute('data-orig') || '送出'; }
      }, 1500);
    });
  });
})();
