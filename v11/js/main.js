/* ============================================================
   pancad.ai v7 — main.js（零套件）
   日光系統 / 導覽 / 旅程軌 / 背景池 / 影片 / CT / AUC / What-if / Quiz / FAQ
   ============================================================ */
(function () {
  'use strict';

  function $(s, c) { return (c || document).querySelector(s); }
  function $all(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  /* ---------- 1. 日光系統（捲動驅動：晨→午→昏→星空） ---------- */
  var PHASES = [
    { at: 0,    sky1: [255, 232, 194], sky2: [255, 217, 168], alt: 82, x: 32, ang: -24 },
    { at: 0.28, sky1: [255, 246, 232], sky2: [255, 233, 207], alt: 46, x: 44, ang: 8 },
    { at: 0.52, sky1: [255, 255, 255], sky2: [238, 246, 255], alt: 14, x: 52, ang: 58 },
    { at: 0.72, sky1: [255, 243, 222], sky2: [255, 223, 192], alt: 34, x: 62, ang: 30 },
    { at: 0.88, sky1: [255, 224, 192], sky2: [255, 192, 143], alt: 66, x: 72, ang: -8 },
    { at: 1,    sky1: [32, 48, 79],    sky2: [14, 34, 68],    alt: 78, x: 80, ang: -30 }
  ];
  function lerp(a, b, t) { return a + (b - a) * t; }
  function rgbStr(c) { return 'rgb(' + Math.round(c[0]) + ',' + Math.round(c[1]) + ',' + Math.round(c[2]) + ')'; }
  function initSunlight() {
    var root = document.documentElement;
    var nightAt = 0.92;
    function update() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
      var i = 0;
      while (i < PHASES.length - 1 && p > PHASES[i + 1].at) i++;
      var a = PHASES[i], b = PHASES[Math.min(i + 1, PHASES.length - 1)];
      var seg = b.at - a.at;
      var t = seg > 0 ? Math.min(1, Math.max(0, (p - a.at) / seg)) : 0;
      var sky1 = [lerp(a.sky1[0], b.sky1[0], t), lerp(a.sky1[1], b.sky1[1], t), lerp(a.sky1[2], b.sky1[2], t)];
      var sky2 = [lerp(a.sky2[0], b.sky2[0], t), lerp(a.sky2[1], b.sky2[1], t), lerp(a.sky2[2], b.sky2[2], t)];
      root.style.setProperty('--sky1', rgbStr(sky1));
      root.style.setProperty('--sky2', rgbStr(sky2));
      root.style.setProperty('--sun-alt', Math.round(lerp(a.alt, b.alt, t)) + '%');
      root.style.setProperty('--sun-x', Math.round(lerp(a.x, b.x, t)) + '%');
      root.style.setProperty('--light-angle', Math.round(lerp(a.ang, b.ang, t)) + 'deg');
      root.classList.toggle('is-night', p > nightAt);
      var sp = $('.scroll-progress');
      if (sp) sp.style.width = (p * 100).toFixed(2) + '%';
    }
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { update(); ticking = false; });
    }, { passive: true });
    update();
  }

  /* ---------- 2. 導覽 ---------- */
  function initNav() {
    var nav = $('#nav'), burger = $('#burger'), menu = $('#menu');
    if (nav) {
      var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 24); };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
    if (burger && menu) {
      burger.addEventListener('click', function () { menu.classList.toggle('open'); });
      $all('.mobile-menu a', menu).forEach(function (a) {
        a.addEventListener('click', function () { menu.classList.remove('open'); });
      });
    }
  }

  /* ---------- 3. Reveal ---------- */
  function initReveal() {
    var els = $all('.reveal, .reveal-l, .reveal-r, .stagger');
    if (!els.length || !('IntersectionObserver' in window)) {
      $all('.reveal, .reveal-l, .reveal-r').forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 4. Kinetic（中文逐字 / 英文逐詞） ---------- */
  function isCjk(text) { return /[\u4e00-\u9fff\u3040-\u30ff]/.test(text) && !/\s/.test(text); }
  function initKinetic() {
    $all('.kinetic').forEach(function (el) {
      if (el.getAttribute('data-kinetic-done')) return;
      var text = el.textContent.trim();
      if (!text) return;
      var units = isCjk(text) ? text.split('') : text.split(/\s+/);
      var html = units.map(function (u) {
        return '<span class="w"><span>' + u + '</span></span>';
      }).join(' ');
      el.setAttribute('aria-label', text);
      el.innerHTML = html;
      el.setAttribute('data-kinetic-done', '1');
    });
  }
  function rebuildKinetic() {
    $all('.kinetic').forEach(function (el) {
      el.removeAttribute('data-kinetic-done');
      var t = el.textContent; /* i18n apply() 已更新為新語言文字 */
      el.removeAttribute('aria-label');
      el.innerHTML = t; /* 還原純文字，等待 initKinetic 重新包裝 */
    });
    setTimeout(initKinetic, 320);
  }

  /* ---------- 5. 旅程軌（v6 家族） ---------- */
  function initJourney() {
    var stations = $all('[data-station]');
    var nodes = $all('.jr-node');
    var lines = $all('.jr-line');
    if (!stations.length) return;
    function update() {
      var vh = window.innerHeight, total = 0;
      var cur = -1, within = 0;
      stations.forEach(function (s, idx) {
        var r = s.getBoundingClientRect();
        if (r.top <= vh * 0.55) { cur = idx; within = Math.min(1, (vh * 0.55 - r.top) / Math.max(1, r.height)); }
      });
      if (cur === -1) cur = 0;
      total = ((cur + within * 0.999) / stations.length) * 100;
      total = Math.min(100, total);
      stations.forEach(function (s, idx) {
        s.classList.toggle('done', idx < cur);
        s.classList.toggle('active', idx === cur);
      });
      nodes.forEach(function (n, idx) {
        n.classList.toggle('done', idx < cur);
        n.classList.toggle('active', idx === cur);
      });
      lines.forEach(function (l, idx) {
        var pct = (idx + 1) <= cur ? 100 : (idx === cur ? within * 100 : 0);
        l.style.setProperty('--jr-fill', Math.max(0, Math.min(100, pct)) / 100);
      });
    }
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { update(); ticking = false; });
    }, { passive: true });
    nodes.forEach(function (n, idx) {
      n.addEventListener('click', function () {
        var s = stations[idx];
        if (s) s.scrollIntoView({ block: 'start' });
      });
    });
    update();
  }

  /* ---------- 6. 背景語言圖池（zh/ja→sun、en→intl，9 秒輪換＋漸進） ---------- */
  function netTier() {
    var c = navigator.connection;
    if (!c) return 2;
    var et = c.effectiveType || '';
    if (et.indexOf('2g') !== -1) return 0;
    if (et === '3g') return 1;
    return 2;
  }
  function initBgPool() {
    var els = $all('[data-bg-pool]');
    if (!els.length) return;
    var lang = (document.documentElement.lang || 'zh').toLowerCase().replace('-', '');
    var poolName = (lang === 'en') ? 'intl' : 'sun';
    var isMobile = window.matchMedia && window.matchMedia('(max-width:768px)').matches;
    var pool;
    if (poolName === 'sun') {
      pool = ['bike', 'bridge', 'coffee', 'forest', 'kayak', 'picnic', 'yoga', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map(function (k) {
        return { key: k, src: 'assets/hero_sun_' + k + '_safe.jpg', src640: 'assets/hero_sun_' + k + '_safe_640.webp', hd: 'assets/hero_sun_' + k + '_safe_hd.webp' };
      });
    } else {
      pool = [];
      for (var i = 1; i <= 30; i++) {
        var n = (i < 10 ? '0' : '') + i;
        pool.push({ key: 'i' + i, src: 'assets/hero_intl_' + n + '_safe.jpg', src640: 'assets/hero_intl_' + n + '_safe_640.webp', hd: 'assets/hero_intl_' + n + '_safe_hd.webp' });
      }
    }
    var tier = netTier();
    var useHd = tier >= 1; /* v11.2：3g 以上也漸進載入 HD（小圖先顯示、HD 背景預載後替換） */
    /* v11.2.22：全部背景圖皆無 pad 滿版（cover，不放大 113%） */
    var FULL = {};
    ['1','2','3','4','5','6','7','8','9','10','bike','bridge','coffee','forest','kayak','picnic','yoga'].forEach(function (k) { FULL[k] = 1; });
    for (var ii = 1; ii <= 30; ii++) FULL['i' + ii] = 1;
    /* 池洗牌（每次進站隨機順序，背景隨機產生） */
    shuffle(pool);
    /* 同頁不重複：目前正被顯示的圖 key → 計數 */
    var shown = {};
    function pickFree() {
      var free = pool.filter(function (it) { return !shown[it.key]; });
      if (!free.length) free = pool;
      return free[Math.floor(Math.random() * free.length)];
    }
    function display(el, item, useHd) {
      var src = isMobile && item.src640 ? item.src640 : item.src;
      var img = new Image();
      img.onload = function () {
        el.style.backgroundImage = 'url(' + src + ')';
        if (FULL[item.key]) el.style.backgroundSize = 'cover';
        if (useHd && !isMobile) {
          var hd = new Image();
          hd.onload = function () {
            el.style.backgroundImage = 'url(' + item.hd + ')';
            if (FULL[item.key]) el.style.backgroundSize = 'cover';
          };
          hd.onerror = function () {};
          hd.src = item.hd;
        }
      };
      img.src = item.src;
    }
    els.forEach(function (el) {
      if (el._bgTimer) { clearInterval(el._bgTimer); el._bgTimer = null; }
      var cur = null;
      function apply(item) {
        if (cur) shown[cur.key] = (shown[cur.key] || 1) - 1;
        cur = item;
        shown[cur.key] = (shown[cur.key] || 0) + 1;
        display(el, cur, useHd);
      }
      apply(pickFree());
      /* v11.2：固定 10 秒輪換（使用者指定），背景隨機不重複 */
      function schedule() {
        el._bgTimer = setTimeout(function () {
          apply(pickFree());
          schedule();
        }, 10000);
      }
      schedule();
    });
  }

  /* ---------- 7. Hero 晨光影片 ---------- */
  function initHeroVideo() {
    var video = $('#heroVideo');
    var poster = $('.hero-bg-video .poster');
    if (!video) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || netTier() === 0) {
      video.remove();
      return;
    }
    video.addEventListener('playing', function () {
      if (poster) poster.classList.add('hidden');
    });
    video.addEventListener('error', function () {
      video.remove();
      if (poster) poster.classList.remove('hidden');
    });
    var p = video.play();
    if (p && p.catch) p.catch(function () { video.remove(); });
  }

  /* ---------- 8. 星星（夜空） ---------- */
  function initStars() {
    var field = $('.star-field');
    if (!field) return;
    for (var i = 0; i < 42; i++) {
      var s = document.createElement('i');
      s.style.left = (Math.random() * 100).toFixed(2) + '%';
      s.style.top = (Math.random() * 70).toFixed(2) + '%';
      s.style.animationDelay = (Math.random() * 4).toFixed(2) + 's';
      s.style.animationDuration = (2.6 + Math.random() * 3).toFixed(2) + 's';
      s.style.width = s.style.height = (1.5 + Math.random() * 2).toFixed(1) + 'px';
      field.appendChild(s);
    }
  }

  /* ---------- 9. 塵光粒子（hero + patient 各幕 dust-layer） ---------- */
  function spawnDust(host, count, spreadTop) {
    for (var i = 0; i < count; i++) {
      var d = document.createElement('span');
      d.className = 'dust';
      var size = 3 + Math.random() * 7;
      d.style.width = d.style.height = size.toFixed(1) + 'px';
      d.style.left = (Math.random() * 100).toFixed(1) + '%';
      d.style.top = (spreadTop + Math.random() * (98 - spreadTop)).toFixed(1) + '%';
      d.style.animationDuration = (18 + Math.random() * 28).toFixed(1) + 's'; /* v11.2.28 慢速 */
      d.style.animationDelay = (Math.random() * 9).toFixed(1) + 's';
      host.appendChild(d);
    }
  }
  function initDust() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var hero = $('.hero');
    if (hero) spawnDust(hero, 18, 60);
    /* 自動為所有背景圖容器加粒子層（不重複加） */
    function addDustTo(el, count, top) {
      if (el.querySelector('.dust-layer')) return;
      var layer = document.createElement('div');
      layer.className = 'dust-layer';
      layer.setAttribute('aria-hidden', 'true');
      el.appendChild(layer);
      spawnDust(layer, count, top);
    }
    $all('.page-hero').forEach(function (h) { addDustTo(h, 18, 30); });
    $all('.journey-station').forEach(function (s) { addDustTo(s, 16, 40); });
    $all('.day-card').forEach(function (c) { addDustTo(c, 12, 50); });
    /* 既有手寫 .dust-layer（patient 各幕） */
    $all('.dust-layer').forEach(function (layer) {
      if (!layer.children.length) spawnDust(layer, 16, 40);
    });
  }

  /* ---------- 9.5 光子粒子（v11.2.4：金黃圓點、快速上升、動態重生不間斷） ---------- */
  function spawnPhotons(host, count) {
    var h = host.clientHeight || 700;
    for (var i = 0; i < count; i++) {
      var p = document.createElement('span');
      p.className = 'photon';
      var sz = 3 + Math.random() * 6;
      p.style.width = p.style.height = sz.toFixed(1) + 'px';
      p.style.left = (Math.random() * 100).toFixed(1) + '%';
      p.style.top = (45 + Math.random() * 53).toFixed(1) + '%'; /* 下半部出發向上飄 */
      p.style.setProperty('--ph-rise', (-(h * 0.9 + Math.random() * h * 0.6)).toFixed(0) + 'px');
      p.style.setProperty('--ph-sw', ((Math.random() * 2 - 1) * 40).toFixed(0) + 'px');
      p.style.setProperty('--ph-op', (0.5 + Math.random() * 0.5).toFixed(2));
      p.style.animationDuration = (6 + Math.random() * 7).toFixed(2) + 's'; /* v11.2.28 慢速上升 */
      p.style.animationDelay = (Math.random() * 4).toFixed(2) + 's';
      host.appendChild(p);
    }
  }
  function respawnPhoton(p, h) {
    /* 不間斷隨機出現：隨機重生單顆粒子（新位置/速度/延遲） */
    var sz = 3 + Math.random() * 6;
    p.style.width = p.style.height = sz.toFixed(1) + 'px';
    p.style.left = (Math.random() * 100).toFixed(1) + '%';
    p.style.top = (45 + Math.random() * 53).toFixed(1) + '%';
    p.style.setProperty('--ph-rise', (-(h * 0.9 + Math.random() * h * 0.6)).toFixed(0) + 'px');
    p.style.setProperty('--ph-sw', ((Math.random() * 2 - 1) * 40).toFixed(0) + 'px');
    p.style.setProperty('--ph-op', (0.5 + Math.random() * 0.5).toFixed(2));
    p.style.animationDuration = (3 + Math.random() * 3.5).toFixed(2) + 's';
    p.style.animationDelay = (Math.random() * 4).toFixed(2) + 's';
    /* 強制重啟動畫 */
    p.style.animationName = 'none';
    void p.offsetWidth;
    p.style.animationName = '';
  }
  function initPhotons() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    /* v11.2.26 手機效能：粒子減量 70% */
    var mobile = window.matchMedia && window.matchMedia('(max-width:768px)').matches;
    var scale = mobile ? 0.3 : 1;
    var hosts = [
      ['.hero', Math.round(48 * scale)], ['.page-hero', Math.round(34 * scale)], ['.journey-station', Math.round(30 * scale)], ['.day-card', Math.round(20 * scale)],
      ['.quote-section', Math.round(16 * scale)], ['.cta-band', Math.round(20 * scale)], ['.line-band', Math.round(30 * scale)], ['.stats-band', Math.round(16 * scale)]
    ];
    hosts.forEach(function (h) {
      $all(h[0]).forEach(function (el) {
        if (el.querySelector('.photon-layer')) return;
        var layer = document.createElement('div');
        layer.className = 'photon-layer';
        layer.setAttribute('aria-hidden', 'true');
        el.appendChild(layer);
        spawnPhotons(layer, h[1]);
        /* 動態重生：每 3 秒隨機重生 1 顆（v11.2.28 慢速） */
        (function (lay, cnt) {
          setInterval(function () {
            var dots = lay.querySelectorAll('.photon');
            if (!dots.length) return;
            for (var k = 0; k < 1; k++) {
              var p = dots[Math.floor(Math.random() * dots.length)];
              respawnPhoton(p, lay.clientHeight || 700);
            }
          }, 3000);
        })(layer, h[1]);
      });
    });
  }
  function initLightFX() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    $all('.hero, .page-hero, .journey-station, .line-band, .day-card, .stats-band').forEach(function (el) {
      if (el.querySelector('.light-orb')) return;
      var n = 2 + Math.floor(Math.random() * 2);
      for (var i = 0; i < n; i++) {
        var o = document.createElement('div');
        var r = Math.random();
        o.className = 'light-orb' + (r < 0.28 ? ' blue' : (r < 0.45 ? ' green' : ''));
        var sz = 300 + Math.random() * 340;
        o.style.width = o.style.height = sz.toFixed(0) + 'px';
        o.style.left = (Math.random() * 85).toFixed(1) + '%';
        o.style.top = (Math.random() * 75).toFixed(1) + '%';
        o.style.setProperty('--orb-dx', ((Math.random() * 2 - 1) * 70).toFixed(0) + 'px');
        o.style.setProperty('--orb-dy', ((Math.random() * 2 - 1) * 55).toFixed(0) + 'px');
        o.style.setProperty('--orb-dur', (10 + Math.random() * 10).toFixed(1) + 's');
        el.appendChild(o);
      }
      var sw = document.createElement('div');
      sw.className = 'light-sweep';
      sw.setAttribute('aria-hidden', 'true');
      el.appendChild(sw);
    });
  }

  /* ---------- 9.7 幕7 晚餐語言專屬池（v11.2：zh/ja 亞裔、en 西歐，每 10 秒交替） ---------- */
  function initDinnerPool() {
    var el = $('[data-dinner-pool]');
    if (!el) return;
    if (el._dinnerTimer) { clearInterval(el._dinnerTimer); el._dinnerTimer = null; }
    var lang = (document.documentElement.lang || 'zh').toLowerCase().replace('-', '');
    var pool;
    /* v11.2.22：E1/E2（dinner_zh_1/2）停用存檔備用——zh 晚餐池改用亞裔 dinner_ja */
    if (lang === 'en') pool = ['dinner_en_1', 'dinner_en_2'];
    else pool = ['dinner_ja_1', 'dinner_ja_2'];
    /* v11.2.20：晚餐池全部無 pad 滿版（cover） */
    var DINNER_FULL = { 'dinner_zh_1': 1, 'dinner_zh_2': 1, 'dinner_ja_1': 1, 'dinner_ja_2': 1, 'dinner_en_1': 1, 'dinner_en_2': 1 };
    var dMobile = window.matchMedia && window.matchMedia('(max-width:768px)').matches;
    var idx = 0;
    function show() {
      var base = pool[idx];
      var src = dMobile ? 'assets/' + base + '_safe_640.webp' : 'assets/' + base + '_safe.jpg';
      var img = new Image();
      img.onload = function () {
        el.style.backgroundImage = 'url(' + src + ')';
        if (DINNER_FULL[base]) el.style.backgroundSize = 'cover';
        /* 漸進：HD 預載後替換（手機不載 HD） */
        if (!dMobile) {
          var hd = new Image();
          hd.onload = function () {
            el.style.backgroundImage = 'url(assets/' + base + '_safe_hd.webp)';
            if (DINNER_FULL[base]) el.style.backgroundSize = 'cover';
          };
          hd.onerror = function () {};
          hd.src = 'assets/' + base + '_safe_hd.webp';
        }
      };
      img.onerror = function () {};
      img.src = src;
    }
    show();
    el._dinnerTimer = setInterval(function () { idx = (idx + 1) % pool.length; show(); }, 10000);
    /* 幕3 CT 固定圖 HD 漸進（data-ct-hd；手機不載 HD 用 640 小圖） */
    var ct = $('[data-ct-hd]');
    if (ct) {
      if (dMobile) {
        ct.style.backgroundImage = "url('assets/ct_scan_bed_safe_640.webp')";
      } else {
        var hdSrc = ct.getAttribute('data-ct-hd');
        if (hdSrc) {
          var hdImg = new Image();
          hdImg.onload = function () { ct.style.backgroundImage = 'url(' + hdSrc + ')'; };
          hdImg.onerror = function () {};
          hdImg.src = hdSrc;
        }
      }
    }
  }

  /* ---------- 9.6 背景隨機強化（v11.1）：池洗牌＋隨機輪換間隔 ---------- */
  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  /* ---------- 10. 互動 CT ---------- */
  function initCT() {
    var frame = $('.ct-frame');
    if (!frame) return;
    var split = parseFloat(frame.style.getPropertyValue('--split')) || 50;
    function setSplit(v) {
      split = Math.max(4, Math.min(96, v));
      frame.style.setProperty('--split', split);
    }
    function posToSplit(clientX) {
      var r = frame.getBoundingClientRect();
      return ((clientX - r.left) / r.width) * 100;
    }
    var dragging = false;
    var divider = $('.ct-divider', frame);
    function down(e) { dragging = true; setSplit(posToSplit(e.clientX || (e.touches && e.touches[0].clientX))); e.preventDefault(); }
    function move(e) {
      if (!dragging) return;
      setSplit(posToSplit(e.clientX || (e.touches && e.touches[0].clientX)));
    }
    function up() { dragging = false; }
    if (divider) {
      divider.addEventListener('mousedown', down);
      window.addEventListener('mousemove', move);
      window.addEventListener('mouseup', up);
      divider.addEventListener('touchstart', down, { passive: false });
      window.addEventListener('touchmove', move, { passive: true });
      window.addEventListener('touchend', up);
    }
    var btn = $all('.ct-btn', frame.parentElement);
    btn.forEach(function (b) {
      b.addEventListener('click', function () {
        btn.forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        var k = b.getAttribute('data-mode');
        var imgs = $all('.ct-frame img', frame);
        if (k === 'normal') imgs.forEach(function (im) { im.style.filter = 'none'; });
        if (k === 'wl') imgs.forEach(function (im) { im.style.filter = 'brightness(1.675) contrast(1.35)'; });
        if (k === 'ww') imgs.forEach(function (im) { im.style.filter = 'brightness(1.05) contrast(1.9)'; });
      });
    });
    /* 自動演示（進入視野一次） */
    if ('IntersectionObserver' in window) {
      var done = false;
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting && !done) {
          done = true;
          var t0 = null, startV = split;
          function step(ts) {
            if (!t0) t0 = ts;
            var p = Math.min(1, (ts - t0) / 3400);
            setSplit(startV + (88 - startV) * Math.min(1, p * 1.4));
            if (p < 1) requestAnimationFrame(step);
            else { t0 = ts; (function back(ts2) { if (!t0) t0 = ts2; var p2 = Math.min(1, (ts2 - t0) / 2600); setSplit(88 - 76 * Math.min(1, p2 * 1.6)); if (p2 < 1) requestAnimationFrame(back); })(ts); }
          }
          requestAnimationFrame(step);
        }
      }, { threshold: 0.4 });
      io.observe(frame);
    }
  }

  /* ---------- 11. What-if 滑桿 ---------- */
  function initWhatIf() {
    var track = $('.wi-track');
    if (!track) return;
    var wi = parseFloat(track.style.getPropertyValue('--wi')) || 70;
    function setWi(v) { wi = Math.max(12, Math.min(88, v)); track.style.setProperty('--wi', wi); }
    function pos(e) {
      var r = track.getBoundingClientRect();
      var x = e.clientX || (e.touches && e.touches[0].clientX);
      return ((x - r.left) / r.width) * 100;
    }
    var dragging = false, div = $('.wi-divider', track);
    function down(e) { dragging = true; setWi(pos(e)); e.preventDefault(); }
    function move(e) { if (dragging) setWi(pos(e)); }
    function up() { dragging = false; }
    if (div) {
      div.addEventListener('mousedown', down);
      window.addEventListener('mousemove', move);
      window.addEventListener('mouseup', up);
      div.addEventListener('touchstart', down, { passive: false });
      window.addEventListener('touchmove', move, { passive: true });
      window.addEventListener('touchend', up);
    }
    var range = $('input[type=range]', track.parentElement);
    if (range) {
      range.addEventListener('input', function () { setWi(parseFloat(range.value)); });
    }
  }

  /* ---------- 12. AUC 捲動繪製 ---------- */
  function initAUC() {
    var curve = $('.auc-curve');
    if (!curve || !('IntersectionObserver' in window)) return;
    var card = curve.closest('.auc-card') || curve.parentElement;
    function update() {
      var r = card.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.7)));
      curve.style.setProperty('--auc-p', Math.round(p * 100));
      var marker = $('.auc-marker');
      if (marker) marker.style.opacity = p > 0.8 ? 1 : 0;
    }
    window.addEventListener('scroll', function () { requestAnimationFrame(update); }, { passive: true });
    update();
  }

  /* ---------- 13. 風險自測 ---------- */
  function initQuiz() {
    var box = $('.quiz-box');
    if (!box) return;
    var steps = $all('.quiz-step', box);
    var result = $('.quiz-result', box);
    if (!steps.length) return;
    var cur = 0, score = 0;
    function showStep(i) {
      steps.forEach(function (s, idx) { s.classList.toggle('active', idx === i); });
      var next = $('.quiz-next', box);
      if (next) next.classList.remove('on');
      if (i === steps.length) showResult();
    }
    function showResult() {
      var lvl = score >= 4 ? 'high' : score >= 2 ? 'mid' : 'low';
      result.classList.add('active');
      result.classList.add(lvl);
      steps.forEach(function (s) { s.classList.remove('active'); });
    }
    steps.forEach(function (step, idx) {
      var opts = $all('.quiz-opt', step);
      var next = $('.quiz-next', step);
      opts.forEach(function (o) {
        o.addEventListener('click', function () {
          opts.forEach(function (x) { x.classList.remove('sel'); });
          o.classList.add('sel');
          if (o.getAttribute('data-val') === '1') score++;
          if (next) next.classList.add('on');
        });
      });
      if (next) {
        next.addEventListener('click', function () { if (next.classList.contains('on')) showStep(idx + 1); });
      }
    });
    var restart = $('.quiz-restart', box);
    if (restart) {
      restart.addEventListener('click', function () {
        score = 0; cur = 0;
        result.classList.remove('active', 'low', 'mid', 'high');
        showStep(0);
      });
    }
    showStep(0);
  }

  /* ---------- 14. FAQ ---------- */
  function initFAQ() {
    $all('.faq-item').forEach(function (item) {
      var q = $('.faq-q', item);
      if (!q) return;
      q.addEventListener('click', function () {
        var open = item.classList.contains('open');
        $all('.faq-item.open').forEach(function (o) { o.classList.remove('open'); $('.faq-a', o).style.maxHeight = null; });
        if (!open) {
          item.classList.add('open');
          var a = $('.faq-a', item);
          if (a) a.style.maxHeight = a.scrollHeight + 'px';
        }
      });
    });
  }

  /* ---------- 14.5 產品證據輪播（v11，Siemens 式） ---------- */
  function initCarousel() {
    var root = document.getElementById('carousel');
    if (!root) return;
    var track = document.getElementById('carTrack');
    var dotsBox = document.getElementById('carDots');
    var prev = document.getElementById('carPrev');
    var next = document.getElementById('carNext');
    if (!track || !track.children.length || !dotsBox) return;
    var n = track.children.length, idx = 0, timer = null;
    for (var i = 0; i < n; i++) {
      (function (k) {
        var d = document.createElement('button');
        d.className = 'car-dot' + (k === 0 ? ' active' : '');
        d.setAttribute('aria-label', 'Slide ' + (k + 1));
        d.addEventListener('click', function () { go(k); restart(); });
        dotsBox.appendChild(d);
      })(i);
    }
    function go(i) {
      idx = (i + n) % n;
      track.style.transform = 'translateX(-' + (idx * 100) + '%)';
      for (var j = 0; j < dotsBox.children.length; j++) {
        dotsBox.children[j].classList.toggle('active', j === idx);
      }
    }
    function restart() {
      if (timer) clearInterval(timer);
      timer = setInterval(function () { go(idx + 1); }, 6000);
    }
    if (prev) prev.addEventListener('click', function () { go(idx - 1); restart(); });
    if (next) next.addEventListener('click', function () { go(idx + 1); restart(); });
    root.addEventListener('mouseenter', function () { if (timer) clearInterval(timer); });
    root.addEventListener('mouseleave', restart);
    restart();
  }

  /* ---------- 14.6 動態計數器（v11.2.8：彩色滑動上升累加） ---------- */
  function initLiveCounter() {
    return; /* v11.2.27 靜態 2000+（不再每秒 +1） */
    var els = $all('[data-live-count]');
    if (!els.length) return;
    els.forEach(function (el) {
      var n = parseInt(el.getAttribute('data-start') || '2000', 10);
      el.textContent = n;
      el._lcTimer = setInterval(function () {
        n++;
        el.setAttribute('data-prev', el.textContent); /* 舊值：往上滑出 */
        el.textContent = n;                            /* 新值：從下方滑入 */
        el.classList.remove('count-slide');
        void el.offsetWidth;
        el.classList.add('count-slide');
      }, 10000);
    });
  }

  /* ---------- 14.7c 雙圖交替背景（v11.2.28：data-bg-pair="a.jpg|b.jpg" 10 秒輪換；en 分流） ---------- */
  var pageLang = (document.documentElement.lang || 'zh').toLowerCase().replace('-', '');
  var isEn = pageLang === 'en';
  var isJa = pageLang === 'ja';
  document.querySelectorAll('[data-bg-pair]').forEach(function (el) {
    var pairAttr = (isEn && el.getAttribute('data-bg-pair-en')) ? 'data-bg-pair-en' : 'data-bg-pair';
    var srcs = (el.getAttribute(pairAttr) || '').split('|').filter(Boolean);
    if (srcs.length < 1) return;
    var pi = 0;
    function showPair() {
      var src = srcs[pi % srcs.length];
      pi++;
      var img = new Image();
      img.onload = function () { el.style.backgroundImage = 'url(' + src + ')'; el.style.backgroundSize = 'cover'; };
      img.onerror = function () {};
      img.src = src;
    }
    showPair();
    if (srcs.length > 1) {
      var speed = parseInt(el.getAttribute('data-pair-ms') || '10000', 10);
      el._pairTimer = setInterval(showPair, speed);
    }
  });

  /* ---------- 14.7d 固定背景語言分流（v11.2.29：en 版用 data-bg-fixed-en 西歐圖） ---------- */
  document.querySelectorAll('[data-bg-fixed]').forEach(function (el) {
    var langSrc = isEn ? el.getAttribute('data-bg-fixed-en') : (isJa ? el.getAttribute('data-bg-fixed-ja') : null);
    if (langSrc) el.style.backgroundImage = 'url(' + langSrc + ')';
  });

  /* ---------- 14.7b 通用背景 HD 漸進（v11.2.26：data-bg-hd；手機跳過） ---------- */
  var bgHdMobile = window.matchMedia && window.matchMedia('(max-width:768px)').matches;
  document.querySelectorAll('[data-bg-hd]').forEach(function (el) {
    if (bgHdMobile) return;
    var hd = (isEn && el.getAttribute('data-bg-hd-en')) ? el.getAttribute('data-bg-hd-en') : (isJa && el.getAttribute('data-bg-hd-ja')) ? el.getAttribute('data-bg-hd-ja') : el.getAttribute('data-bg-hd');
    if (!hd) return;
    var img = new Image();
    img.onload = function () {
      el.style.backgroundImage = 'url(' + hd + ')';
      el.style.backgroundSize = 'cover';
    };
    img.onerror = function () {};
    img.src = hd;
  });

  /* ---------- 14.7 hero 海報 HD 漸進（v11.2.22：intl 無 pad 用 cover；couple pad 維持 113%） ---------- */
  function initPosterHD() {
    /* v11.2.26：手機用 CSS 480 小圖（不載 HD） */
    if (window.matchMedia && window.matchMedia('(max-width:768px)').matches) return;
    var lang = (document.documentElement.lang || 'zh').toLowerCase().replace('-', '');
    var isEn = lang === 'en';
    var posters = document.querySelectorAll('.hero-bg-video .poster, #patientHero .bg');
    if (!posters.length) return;
    var hdSrc = 'assets/' + (isEn ? 'hero_v7_morning_intl' : 'hero_v7_morning_couple') + '_safe_hd.webp';
    posters.forEach(function (el) {
      var img = new Image();
      img.onload = function () {
        el.style.backgroundImage = 'url(' + hdSrc + ')';
        if (isEn) el.style.backgroundSize = 'cover';
      };
      img.onerror = function () {};
      img.src = hdSrc;
    });
  }

  /* ---------- 14.8 輪播大圖 HD 漸進（v11.2.16：1280/1600 → 5120） ---------- */
  function initCarouselHD() {
    document.querySelectorAll('.car-media img').forEach(function (img) {
      var src = img.getAttribute('src') || '';
      var base = src.replace(/^assets\//, '').replace(/\.(jpg|png|webp)$/, '');
      if (!base) return;
      var hd = 'assets/' + base + '_hd.webp';
      var t = new Image();
      t.onload = function () { img.src = hd; };
      t.onerror = function () {};
      t.src = hd;
    });
  }

  /* ---------- 15. 啟動 ---------- */
  function boot() {
    initSunlight();
    initNav();
    initReveal();
    initKinetic();
    initJourney();
    initBgPool();
    initHeroVideo();
    initStars();
    initDust();
    initPhotons();
    initLightFX();
    initDinnerPool();
    initCT();
    initWhatIf();
    initAUC();
    initQuiz();
    initFAQ();
    initCarousel();
    initLiveCounter();
    initPosterHD();
    initCarouselHD();
    window.addEventListener('langchange', function () {
      initBgPool();
      initDinnerPool();
      initPosterHD();
      rebuildKinetic();
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();
