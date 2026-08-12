/* PANCREASaver 官網 v8 — main.js 動態系統（零套件） */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var netTier = 2; // 0=2g 1=3g 2=4g+
  try {
    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn) {
      if (!conn.effectiveType) netTier = 2;
      else if (conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g') netTier = 0;
      else if (conn.effectiveType === '3g') netTier = 1;
      else netTier = 2;
    }
  } catch (e) {}

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  /* ---------- 1. Nav（sticky + 漢堡） ---------- */
  function initNav() {
    var burger = $('#burger');
    var menu = $('#menu');
    if (burger && menu) {
      burger.addEventListener('click', function () {
        burger.classList.toggle('open');
        menu.classList.toggle('open');
      });
      $$('#menu a').forEach(function (a) {
        a.addEventListener('click', function () {
          burger.classList.remove('open');
          menu.classList.remove('open');
        });
      });
    }
    // 當前頁高亮
    var page = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '');
    $$('.nav .menu a[data-page]').forEach(function (a) {
      if (a.getAttribute('data-page') === page) a.classList.add('on');
    });
  }

  /* ---------- 2. Reveal（捲動漸顯） ---------- */
  function initReveal() {
    var els = $$('.reveal');
    if (!els.length) return;
    if (reduceMotion) { els.forEach(function (el) { el.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 3. 掃描線（章節進入掃過） ---------- */
  function initScanlines() {
    var hosts = $$('[data-scanline]');
    if (!hosts.length || reduceMotion) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var host = en.target;
        var line = document.createElement('div');
        line.className = 'scanline';
        host.appendChild(line);
        // 觸發 animation
        requestAnimationFrame(function () { line.classList.add('active'); });
        setTimeout(function () { if (line.parentNode) line.parentNode.removeChild(line); }, 1300);
      });
    }, { threshold: 0.25 });
    hosts.forEach(function (h) { io.observe(h); });
  }

  /* ---------- 4. 數字雷達（進入視野計數） ---------- */
  function initRadar() {
    var cards = $$('.radar .card[data-count]');
    if (!cards.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var card = en.target;
        card.classList.add('revealed');
        var target = parseFloat(card.getAttribute('data-count'));
        var decimals = parseInt(card.getAttribute('data-dec') || '0', 10);
        var el = $('.num', card);
        if (el && !reduceMotion) {
          var t0 = null;
          var dur = 1600;
          function step(ts) {
            if (!t0) t0 = ts;
            var p = Math.min((ts - t0) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = (target * eased).toFixed(decimals);
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = target.toFixed(decimals);
          }
          requestAnimationFrame(step);
        } else if (el) {
          el.textContent = target.toFixed(decimals);
        }
        io.unobserve(card);
      });
    }, { threshold: 0.4 });
    cards.forEach(function (c) { io.observe(c); });
  }

  /* ---------- 5. CT split 互動（拖曳） ---------- */
  function initCT() {
    var box = $('#ctSplit');
    if (!box) return;
    var split = 50;
    function set(v) {
      split = Math.max(8, Math.min(92, v));
      box.style.setProperty('--split', split + '%');
    }
    function startDrag(e) {
      e.preventDefault();
      var move = function (ev) {
        var r = box.getBoundingClientRect();
        set(((ev.clientX || (ev.touches && ev.touches[0].clientX)) - r.left) / r.width * 100);
      };
      var up = function () {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
        document.removeEventListener('touchmove', move);
        document.removeEventListener('touchend', up);
      };
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
      document.addEventListener('touchmove', move, { passive: false });
      document.addEventListener('touchend', up);
    }
    var div = $('.divider', box);
    if (div) {
      div.addEventListener('mousedown', startDrag);
      div.addEventListener('touchstart', startDrag, { passive: false });
    }
    // 進入視野自動演示一次
    if (!reduceMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          io.unobserve(box);
          set(12);
          var t = 0;
          var timer = setInterval(function () {
            t += 2.4;
            set(t);
            if (t >= 88) clearInterval(timer);
          }, 40);
        });
      }, { threshold: 0.5 });
      io.observe(box);
    }
  }

  /* ---------- 6. FAQ 手風琴 ---------- */
  function initFAQ() {
    $$('.faq .item').forEach(function (item) {
      var q = $('.q', item);
      if (!q) return;
      q.addEventListener('click', function () {
        var open = item.classList.contains('open');
        $$('.faq .item.open').forEach(function (o) { o.classList.remove('open'); $('.a', o).style.maxHeight = '0px'; });
        if (!open) {
          item.classList.add('open');
          var a = $('.a', item);
          if (a) a.style.maxHeight = a.scrollHeight + 'px';
        }
      });
    });
  }

  /* ---------- 7. Hero 影片（漸進 + reduced-motion） ---------- */
  function initHeroVideo() {
    var video = $('#heroVideo');
    var poster = $('#heroPoster');
    if (!video) return;
    if (reduceMotion || netTier === 0) {
      video.remove();
      if (poster) poster.classList.remove('hidden');
      return;
    }
    video.addEventListener('playing', function () {
      if (poster) poster.classList.add('hidden');
    });
    var p = video.play();
    if (p && p.catch) p.catch(function () { video.remove(); if (poster) poster.classList.remove('hidden'); });
  }

  /* ---------- 8. Kinetic 標題（逐字包裝，i18n 安全） ---------- */
  function initKinetic() {
    var hosts = $$('[data-kinetic]');
    if (!hosts.length || reduceMotion) return;
    hosts.forEach(function (host) {
      if (host.getAttribute('data-kinetic-done')) return;
      var text = host.textContent.trim();
      host.innerHTML = '';
      var parts = text.split(/(<[^>]+>)/g).filter(Boolean);
      parts.forEach(function (part) {
        if (part.charAt(0) === '<') { host.insertAdjacentHTML('beforeend', part); return; }
        var words = part.split(/(\s+)/);
        words.forEach(function (w) {
          if (!w) return;
          var span = document.createElement('span');
          span.className = 'w';
          span.style.display = 'inline-block';
          span.style.opacity = '0';
          span.style.transform = 'translateY(14px)';
          span.textContent = w;
          host.appendChild(span);
        });
      });
      host.setAttribute('data-kinetic-done', '1');
      // 進入視野觸發
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          io.unobserve(host);
          $$('.w', host).forEach(function (w, i) {
            setTimeout(function () {
              w.style.transition = 'opacity .5s ease, transform .5s ease';
              w.style.opacity = '1';
              w.style.transform = 'none';
            }, i * 45);
          });
        });
      }, { threshold: 0.4 });
      io.observe(host);
    });
  }

  /* ---------- 9. 背景圖池（多圖輪換） ---------- */
  function initBgPool() {
    var pools = $$('[data-bg-pool]');
    if (!pools.length) return;
    var shown = {};
    pools.forEach(function (el) {
      var list = (el.getAttribute('data-bg-pool') || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
      if (!list.length) return;
      var idx = 0;
      function apply() {
        var key = list[idx % list.length];
        el.style.backgroundImage = 'url(assets/' + key + ')';
        idx++;
      }
      apply();
      el._poolTimer = setInterval(function () { apply(); }, 9000);
    });
    // 語言切換時若 intl 池不同，交由 onLangChange 處理
  }

  /* ---------- 10. onLangChange（頁面語言掛勾） ---------- */
  window.onLangChange = function (lang) {
    // 背景池語言切換：en → intl 圖
    var langPools = {
      zh: 'bg_ct_room.jpg,bg_reading.jpg,bg_hospital.jpg,bg_data.jpg,bg_patient.jpg,bg_doctor.jpg',
      ja: 'bg_ct_room.jpg,bg_reading.jpg,bg_hospital.jpg,bg_data.jpg,bg_patient.jpg,bg_doctor.jpg',
      en: 'bg_intl_ct.jpg,bg_intl_reading.jpg,bg_intl_hospital.jpg,bg_intl_data.jpg,bg_intl_patient.jpg'
    };
    var pools = $$('[data-bg-pool-lang]');
    pools.forEach(function (el) {
      if (el._poolTimer) clearInterval(el._poolTimer);
      var list = (langPools[lang] || langPools.zh).split(',');
      var idx = 0;
      function apply() {
        el.style.backgroundImage = 'url(assets/' + (list[idx % list.length]) + ')';
        idx++;
      }
      apply();
      el._poolTimer = setInterval(apply, 9000);
    });
    // kinetic 重建（等 i18n apply 完成後）
    setTimeout(function () {
      $$('[data-kinetic]').forEach(function (h) {
        h.removeAttribute('data-kinetic-done');
        h.innerHTML = '';
      });
      initKinetic();
    }, 320);
  };

  /* ---------- init ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initReveal();
    initScanlines();
    initRadar();
    initCT();
    initFAQ();
    initHeroVideo();
    initKinetic();
    initBgPool();
  });
})();
