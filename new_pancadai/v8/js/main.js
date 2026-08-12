/* PANCREASaver 官網 v8 —「黎明之光」main.js（零套件） */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var netTier = 2;
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

  /* ---------- 1. Nav ---------- */
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
    var page = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '');
    $$('.nav .menu a[data-page]').forEach(function (a) {
      if (a.getAttribute('data-page') === page) a.classList.add('on');
    });
  }

  /* ---------- 2. Reveal ---------- */
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

  /* ---------- 3. 掃描線（黎明光） ---------- */
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
        requestAnimationFrame(function () { line.classList.add('active'); });
        setTimeout(function () { if (line.parentNode) line.parentNode.removeChild(line); }, 1300);
      });
    }, { threshold: 0.25 });
    hosts.forEach(function (h) { io.observe(h); });
  }

  /* ---------- 4. 黎明光暈跟隨捲動（dawn-glow 位移） ---------- */
  function initDawnGlow() {
    var glow = $('.dawn-glow');
    if (!glow || reduceMotion) return;
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        var docH = document.documentElement.scrollHeight - window.innerHeight;
        var p = docH > 0 ? y / docH : 0;
        // 光暈隨捲動：左上 → 中 → 右下（希望之光巡視全站）
        glow.style.left = (12 + p * 76) + '%';
        glow.style.top = (8 + p * 55) + '%';
        glow.style.opacity = 0.55 + p * 0.45;
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 5. 數字希望帶（計數） ---------- */
  function initHopeCounters() {
    var cards = $$('.hope-card[data-count]');
    if (!cards.length) return;
    function fire(card) {
      if (card._fired) return;
      card._fired = true;
      card.classList.add('revealed');
      var target = parseFloat(card.getAttribute('data-count'));
      var decimals = parseInt(card.getAttribute('data-dec') || '0', 10);
      var el = $('.num span:first-child', card);
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
    }
    if (reduceMotion) { cards.forEach(function (c) { fire(c); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { fire(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
    cards.forEach(function (c) { io.observe(c); });
    // fallback：3s 後仍在視口上方未觸發者直接 fire（快速捲動安全網）
    setTimeout(function () {
      cards.forEach(function (c) {
        if (!c._fired) {
          var r = c.getBoundingClientRect();
          if (r.top < window.innerHeight && r.bottom > 0) fire(c);
        }
      });
    }, 2500);
  }

  /* ---------- 6. 個案電影（case-film 逐幕進場 + CT 自動演示） ---------- */
  function initCaseFilm() {
    var scenes = $$('.case-scene');
    if (!scenes.length) return;
    if (reduceMotion) {
      scenes.forEach(function (s) { s.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var scene = en.target;
        if (scene._fired) return;
        scene._fired = true;
        scene.classList.add('in');
        // CT 對比自動演示
        var pair = $('.ct-pair', scene);
        if (pair) {
          pair.style.setProperty('--split', '50%');
          var t = 50;
          var timer = setInterval(function () {
            t += 2.2;
            pair.style.setProperty('--split', t + '%');
            if (t >= 88) clearInterval(timer);
          }, 40);
        }
        io.unobserve(scene);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    scenes.forEach(function (s) { io.observe(s); });
  }

  /* ---------- 7. CT split 互動（拖曳） ---------- */
  function initCT() {
    var box = $('#ctSplit');
    if (!box) return;
    function set(v) {
      box.style.setProperty('--split', Math.max(8, Math.min(92, v)) + '%');
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

  /* ---------- 8. FAQ ---------- */
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

  /* ---------- 9. 動態背景影片（data-bg-video） ---------- */
  function initBgVideos() {
    $$('[data-bg-video]').forEach(function (host) {
      if (reduceMotion || netTier === 0) return;
      var src = host.getAttribute('data-bg-video');
      if (!src) return;
      var poster = host.querySelector('.poster');
      var v = document.createElement('video');
      v.autoplay = true; v.muted = true; v.loop = true; v.playsInline = true;
      v.preload = 'auto';
      var s1 = document.createElement('source');
      s1.src = 'video/' + src + '.mp4'; s1.type = 'video/mp4';
      v.appendChild(s1);
      var s2 = document.createElement('source');
      s2.src = 'video/' + src + '.webm'; s2.type = 'video/webm';
      v.appendChild(s2);
      v.addEventListener('playing', function () { if (poster) poster.classList.add('hidden'); });
      var p = v.play();
      if (p && p.catch) p.catch(function () { v.remove(); if (poster) poster.classList.remove('hidden'); });
      host.appendChild(v);
    });
  }

  /* ---------- 10. Hero 影片 ---------- */
  function initHeroVideo() {
    var video = $('#heroVideo');
    var poster = $('#heroPoster');
    if (!video) return;
    if (reduceMotion || netTier === 0) {
      video.remove();
      if (poster) poster.classList.remove('hidden');
      return;
    }
    video.addEventListener('playing', function () { if (poster) poster.classList.add('hidden'); });
    var p = video.play();
    if (p && p.catch) p.catch(function () { video.remove(); if (poster) poster.classList.remove('hidden'); });
  }

  /* ---------- init ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initReveal();
    initScanlines();
    initDawnGlow();
    initHopeCounters();
    initCaseFilm();
    initCT();
    initFAQ();
    initBgVideos();
    initHeroVideo();
  });
})();
