/* ============================================================
   PANCREASaver® 助胰見® — v10「希望星圖」全站動態引擎
   星空 canvas / 光斑漂移 / 捲動光柱 / cursor 暖光 / kinetic 字
   互動 CT / 3D tilt / magnetic 按鈕 / 計數器 / FAQ / 影片降級
   ============================================================ */
(function () {
  'use strict';
  var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lowTier = false;

  function netTier() {
    try {
      var c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (c) {
        if (c.effectiveType && (c.effectiveType === 'slow-2g' || c.effectiveType === '2g')) return 0;
        if (c.saveData) return 0;
      }
    } catch (e) {}
    return 2;
  }
  lowTier = netTier() === 0;

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function on(el, ev, fn) { if (el) el.addEventListener(ev, fn); }

  /* ---------- 星空 canvas（fixed 全站） ---------- */
  function initStarField() {
    var cv = $('#starField');
    if (!cv || RM) return;
    var ctx = cv.getContext('2d');
    var W, H, stars = [], meteors = [], raf = null;
    var DPR = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      cv.width = W * DPR; cv.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      var n = Math.round(Math.min(320, W * H / 5200));
      stars = [];
      for (var i = 0; i < n; i++) {
        stars.push({
          x: Math.random() * W, y: Math.random() * H,
          r: Math.random() * 1.4 + 0.3,
          p: Math.random() * Math.PI * 2,
          sp: Math.random() * 1.6 + 0.5,
          depth: Math.random() * 0.5 + 0.5,
          hue: Math.random() < 0.82 ? 48 : (Math.random() < 0.5 ? 210 : 30)
        });
      }
    }

    function spawnMeteor() {
      if (meteors.length > 2) return;
      meteors.push({
        x: Math.random() * W * 0.8, y: Math.random() * H * 0.35,
        vx: 7 + Math.random() * 5, vy: 3 + Math.random() * 2.5,
        life: 1
      });
    }

    var last = 0;
    function frame(t) {
      raf = requestAnimationFrame(frame);
      if (t - last < 1000 / 30) return; // ~30fps 節能
      last = t;
      ctx.clearRect(0, 0, W, H);
      var sy = window.scrollY;
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var tw = 0.45 + 0.55 * Math.sin(t / 1000 * s.sp * 2 + s.p);
        var a = 0.25 + 0.65 * tw * s.depth;
        ctx.beginPath();
        ctx.arc(s.x, (s.y - sy * 0.05 * s.depth + H * 2) % H - 0, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.hue === 210 ? 'rgba(120,180,255,' + a * 0.9 + ')' :
                        s.hue === 30 ? 'rgba(255,190,140,' + a * 0.9 + ')' :
                        'rgba(255,240,215,' + a + ')';
        ctx.fill();
      }
      if (Math.random() < 0.004) spawnMeteor();
      for (i = meteors.length - 1; i >= 0; i--) {
        var m = meteors[i];
        m.x += m.vx; m.y += m.vy; m.life -= 0.02;
        if (m.life <= 0 || m.x > W + 60 || m.y > H + 60) { meteors.splice(i, 1); continue; }
        var tail = 14;
        var grd = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * tail, m.y - m.vy * tail);
        grd.addColorStop(0, 'rgba(255,244,220,' + m.life * 0.9 + ')');
        grd.addColorStop(1, 'rgba(255,244,220,0)');
        ctx.strokeStyle = grd; ctx.lineWidth = 1.6; ctx.beginPath();
        ctx.moveTo(m.x, m.y); ctx.lineTo(m.x - m.vx * tail, m.y - m.vy * tail);
        ctx.stroke();
      }
    }
    resize();
    on(window, 'resize', resize);
    raf = requestAnimationFrame(frame);
    on(document, 'visibilitychange', function () {
      if (document.hidden && raf) { cancelAnimationFrame(raf); raf = null; }
      else if (!raf) raf = requestAnimationFrame(frame);
    });
  }

  /* ---------- 背景光斑捲動漂移 ---------- */
  function initOrbs() {
    var orbs = $$('.orb');
    if (!orbs.length || RM) return;
    var base = [];
    orbs.forEach(function (o, i) {
      base.push({ el: o, x: parseFloat(o.getAttribute('data-x') || (15 + i * 32)), y: parseFloat(o.getAttribute('data-y') || (12 + i * 22)) });
    });
    var ticking = false;
    function move() {
      ticking = false;
      var sy = window.scrollY;
      base.forEach(function (b, i) {
        var dx = Math.sin(sy * 0.00028 + i * 2.1) * 5;
        var dy = Math.cos(sy * 0.00036 + i * 1.7) * 4;
        b.el.style.transform = 'translate(' + dx + 'vw,' + (dy + sy * 0.10 * (i % 2 ? 1 : -1) % 90) + 'px)';
      });
    }
    function req() { if (!ticking) { ticking = true; requestAnimationFrame(move); } }
    on(window, 'scroll', req); on(window, 'resize', req); move();
  }

  /* ---------- 捲動進度光柱 ---------- */
  function initScrollBeam() {
    var beam = $('#scrollBeam');
    if (!beam) return;
    var doc = document.documentElement;
    function upd() {
      var max = doc.scrollHeight - window.innerHeight;
      var p = max > 0 ? window.scrollY / max : 0;
      beam.style.setProperty('--p', p);
      var b = beam.querySelector('.beam-fill');
      if (b) b.style.transform = 'translateY(' + (p * 100 - 100) + 'vh)';
    }
    // 用 CSS ::before 的 translateY 動畫改為 JS 控制高度
    var fill = document.createElement('div');
    fill.className = 'beam-fill';
    fill.style.cssText = 'position:absolute;top:0;left:0;right:0;height:38vh;background:linear-gradient(180deg,var(--dawn-lt),var(--brand-lt),transparent);box-shadow:0 0 22px rgba(255,217,160,.85),0 0 44px rgba(61,127,224,.5);transform:translateY(-100%);transition:transform .1s linear';
    beam.appendChild(fill);
    var ticking = false;
    function req() { if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; upd(); }); } }
    on(window, 'scroll', req); upd();
  }

  /* ---------- cursor 暖光 ---------- */
  function initCursor() {
    var g = $('#cursorGlow');
    if (!g) return;
    var x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y;
    function move(e) { tx = e.clientX; ty = e.clientY; }
    function frame() {
      x += (tx - x) * 0.14; y += (ty - y) * 0.14;
      g.style.left = x + 'px'; g.style.top = y + 'px';
      requestAnimationFrame(frame);
    }
    on(window, 'mousemove', move);
    requestAnimationFrame(frame);
  }

  /* ---------- Nav ---------- */
  function initNav() {
    var hdr = $('header.nav');
    var burger = $('#burger');
    var links = $('.nav-links');
    if (hdr) {
      var onScroll = function () { hdr.classList.toggle('scrolled', window.scrollY > 24); };
      on(window, 'scroll', onScroll); onScroll();
    }
    if (burger && links) {
      on(burger, 'click', function () {
        burger.classList.toggle('open');
        links.classList.toggle('open');
      });
      $$('a', links).forEach(function (a) {
        on(a, 'click', function () {
          burger.classList.remove('open'); links.classList.remove('open');
        });
      });
    }
  }

  /* ---------- Kinetic 標題（逐字彈入，v8 修法：保存原始 HTML） ---------- */
  function splitWords(text) {
    // 中文/日文逐字，英文按單詞，標點附著前字
    var out = [];
    var m = text.match(/([\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]|[A-Za-z0-9]+(?:\.[A-Za-z0-9]+)*|\s+|[^\s\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7afA-Za-z0-9]+)/g);
    if (!m) return [];
    for (var i = 0; i < m.length; i++) {
      var t = m[i];
      if (/^[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/.test(t)) {
        for (var j = 0; j < t.length; j++) out.push(t[j]);
      } else if (/^\s+$/.test(t)) {
        // skip whitespace
      } else {
        out.push(t);
      }
    }
    return out;
  }
  function initKinetic() {
    if (RM) return;
    var hosts = $$('.kinetic');
    hosts.forEach(function (h) {
      if (h.getAttribute('data-kinetic-done')) return;
      var text = h.textContent.trim();
      if (!text) return;
      h.setAttribute('data-kinetic-done', '1');
      h.setAttribute('data-kinetic-html', h.innerHTML); // 還原點（含 data-i18n-html 內容）
      var words = splitWords(text);
      var html = '';
      words.forEach(function (w, i) {
        html += '<span class="w" style="animation-delay:' + (0.25 + i * 0.045) + 's">' + escapeHtml(w) + '</span>';
      });
      h.innerHTML = html;
    });
  }
  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  window.rebuildKinetic = function () {
    if (RM) return;
    var hosts = $$('.kinetic[data-kinetic-done]');
    hosts.forEach(function (h) {
      var raw = h.getAttribute('data-kinetic-html');
      if (raw) h.innerHTML = raw; // 還原（含 data-i18n-html 屬性內容）
      h.removeAttribute('data-kinetic-done');
    });
    // 重新翻譯（kinetic 包裝前的原始 HTML 是舊語言）
    if (window.PANCAD_LANG && window.PANCAD_LANG.applyAll) window.PANCAD_LANG.applyAll();
    initKinetic();
  };

  /* ---------- Reveal ---------- */
  function initReveal() {
    var els = $$('.reveal');
    if (!els.length) return;
    if (RM) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- 計數器 ---------- */
  function initCounters() {
    var els = $$('[data-count]');
    if (!els.length) return;
    function run(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var dec = el.getAttribute('data-dec') ? parseInt(el.getAttribute('data-dec'), 10) : 0;
      var suf = el.getAttribute('data-suf') || '';
      var dur = 1600, t0 = null;
      function step(t) {
        if (!t0) t0 = t;
        var p = Math.min(1, (t - t0) / dur);
        var e = 1 - Math.pow(1 - p, 3);
        var v = target * e;
        el.textContent = (dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US')) + suf;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- 互動 CT 對比拖曳 ---------- */
  function initCTCompare() {
    $$('.ct-compare').forEach(function (box) {
      var top = $('.ct-top', box), div = $('.ct-divider', box), handle = $('.ct-handle', box);
      if (!top || !div) return;
      var dragging = false;
      function setP(p) {
        p = Math.max(2, Math.min(98, p));
        top.style.clipPath = 'inset(0 0 0 ' + p + '%)';
        div.style.left = p + '%';
        if (handle) handle.style.left = p + '%';
      }
      function clientX(e) { return e.touches ? e.touches[0].clientX : e.clientX; }
      function onMove(e) {
        if (!dragging) return;
        var r = box.getBoundingClientRect();
        setP((clientX(e) - r.left) / r.width * 100);
      }
      on(box, 'mousedown', function (e) { dragging = true; onMove(e); });
      on(box, 'touchstart', function (e) { dragging = true; onMove(e); }, { passive: true });
      on(window, 'mousemove', onMove);
      on(window, 'touchmove', onMove, { passive: true });
      on(window, 'mouseup', function () { dragging = false; });
      on(window, 'touchend', function () { dragging = false; });
      // 進入視野自動演示一次
      var played = false;
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting && !played) {
          played = true;
          if (RM) return;
          var p = 12;
          var iv = setInterval(function () {
            p += 4;
            setP(p);
            if (p >= 78) { clearInterval(iv); setP(50); }
          }, 28);
          io.unobserve(box);
        }
      }, { threshold: 0.4 });
      io.observe(box);
      setP(50);
    });
  }

  /* ---------- 3D Tilt ---------- */
  function initTilt() {
    if (RM) return;
    var cards = $$('.tilt');
    if (!cards.length) return;
    if (!window.matchMedia('(hover:hover)').matches) return;
    cards.forEach(function (c) {
      var max = 7;
      on(c, 'mousemove', function (e) {
        var r = c.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        c.style.transform = 'perspective(900px) rotateY(' + (px * max) + 'deg) rotateX(' + (-py * max) + 'deg) translateY(-4px)';
      });
      on(c, 'mouseleave', function () { c.style.transform = ''; });
    });
  }

  /* ---------- Magnetic 按鈕 ---------- */
  function initMagnetic() {
    if (RM) return;
    var btns = $$('.magnetic');
    if (!btns.length || !window.matchMedia('(hover:hover)').matches) return;
    btns.forEach(function (b) {
      on(b, 'mousemove', function (e) {
        var r = b.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width / 2) * 0.22;
        var dy = (e.clientY - r.top - r.height / 2) * 0.3;
        b.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      });
      on(b, 'mouseleave', function () { b.style.transform = ''; });
    });
  }

  /* ---------- FAQ ---------- */
  function initFAQ() {
    $$('.faq-item').forEach(function (item) {
      var q = $('.faq-q', item);
      if (!q) return;
      on(q, 'click', function () {
        var open = item.classList.contains('open');
        $$('.faq-item.open').forEach(function (o) {
          o.classList.remove('open');
          var a = $('.faq-a', o);
          if (a) a.style.maxHeight = '';
        });
        if (!open) {
          item.classList.add('open');
          var a = $('.faq-a', item);
          if (a) a.style.maxHeight = a.scrollHeight + 'px';
        }
      });
    });
  }

  /* ---------- 影片：poster fade + 降級 ---------- */
  function initVideos() {
    $$('video[data-hero]').forEach(function (v) {
      var box = v.closest('.hero-bg, .bg-video, .page-hero, .cta-band, .aurora-band');
      var poster = box ? $('.poster', box) : null;
      if (RM || lowTier) {
        v.remove();
        return;
      }
      var started = false;
      on(v, 'playing', function () {
        if (!started && poster) { started = true; poster.classList.add('hidden'); }
      });
      var pr = v.play();
      if (pr && pr.catch) pr.catch(function () {
        v.remove();
        if (poster) poster.classList.remove('hidden');
      });
      // 3 秒內沒播起來就移除
      setTimeout(function () {
        if (!started && !v.ended) {
          var ready = v.readyState >= 2;
          if (!ready) { v.remove(); if (poster) poster.classList.remove('hidden'); }
        }
      }, 3000);
    });
  }

  /* ---------- 個案星圖：進場時大星點亮 ---------- */
  function initCaseStars() {
    $$('.case-section').forEach(function (sec) {
      var star = $('.big-star', sec);
      if (!star) return;
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          star.classList.add('lit');
          io.unobserve(star);
        }
      }, { threshold: 0.3 });
      io.observe(star);
    });
  }

  /* ---------- 語言切換掛鉤（kinetic 重建） ---------- */
  window.onLangChange = function (lang) {
    setTimeout(function () {
      if (window.rebuildKinetic) window.rebuildKinetic();
    }, 330);
  };

  /* ---------- Boot ---------- */
  function boot() {
    initStarField();
    initOrbs();
    initScrollBeam();
    initCursor();
    initNav();
    initKinetic();
    initReveal();
    initCounters();
    initCTCompare();
    initTilt();
    initMagnetic();
    initFAQ();
    initVideos();
    initCaseStars();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
