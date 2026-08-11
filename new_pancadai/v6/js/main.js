/* ============================================================
   PANCREASaver 助胰見® — pancad.ai v6 動畫核心
   A×B×C：旅程 360°（A）× 證據即體驗（B）× 暖光編輯敘事（C）
   零套件：原生捲動 + 旅程軌 + 互動 CT + AUC 繪製 + What-if + 風險自測
   版本：?v=1
   ============================================================ */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ==========================================================
     0. 導覽：scrolled + 漢堡選單
     ========================================================== */
  function initNav() {
    var nav = document.getElementById('nav');
    var burger = document.getElementById('burger');
    var menu = document.getElementById('menu');

    function onScroll() {
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (burger && menu) {
      burger.addEventListener('click', function () {
        var open = menu.classList.toggle('open');
        burger.classList.toggle('open', open);
        document.body.style.overflow = open ? 'hidden' : '';
      });
      menu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          menu.classList.remove('open');
          burger.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }
  }

  /* ==========================================================
     1. 捲動時間軸：--sp + 進度條 + 視差（原生捲動）
     ========================================================== */
  function initScrollTimeline() {
    var root = document.documentElement;
    var parEls = document.querySelectorAll('.parallax');
    var bar = document.getElementById('scrollProgress');
    var ticking = false;

    function update() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? (window.scrollY / max) : 0;
      root.style.setProperty('--sp', p.toFixed(4));
      if (bar) bar.style.width = (p * 100).toFixed(2) + '%';
      parEls.forEach(function (el) {
        var r = el.parentElement ? el.parentElement.getBoundingClientRect() : null;
        if (!r) return;
        var mid = r.top + r.height / 2 - window.innerHeight / 2;
        el.style.setProperty('--par', (mid * -0.06).toFixed(1) + 'px');
      });
      ticking = false;
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  /* ==========================================================
     2. Kinetic 標題：逐詞包裝 + 錯落入場
     ========================================================== */
  function initKinetic() {
    if (prefersReduced) return;
    document.querySelectorAll('.kinetic').forEach(function (el) {
      if (el.getAttribute('data-kinetic-done')) return;
      var text = el.textContent;
      var isCJK = /[\u4e00-\u9fff\u3040-\u30ff]/.test(text) && !/\s/.test(text);
      var words = isCJK ? text.split('') : text.split(/(\s+)/);
      el.innerHTML = words.map(function (w) {
        if (w.trim() === '') return w;
        return '<span class="w"><span style="animation-delay:' +
          (Math.random() * 0.5).toFixed(2) + 's">' + w + '</span></span>';
      }).join('');
      el.setAttribute('data-kinetic-done', '1');
    });
  }

  /* ==========================================================
     3. 旅程軌（A 核心）— sticky rail 進度 + 節點亮燈 + 點擊跳轉
     ========================================================== */
  function initJourney() {
    var stations = document.querySelectorAll('[data-station]');
    var nodes = document.querySelectorAll('.jr-node');
    var lineEls = document.querySelectorAll('.jr-line');
    if (!stations.length || !nodes.length) return;
    var ticking = false;

    function update() {
      var vh = window.innerHeight;
      var current = 0;
      stations.forEach(function (s, i) {
        if (s.getBoundingClientRect().top <= vh * 0.45) current = i;
      });
      nodes.forEach(function (n, i) {
        n.classList.toggle('done', i < current);
        n.classList.toggle('active', i === current);
      });
      var total = stations.length - 1;
      var cur = stations[current].getBoundingClientRect();
      var within = Math.min(Math.max(-cur.top / (cur.height + vh * 0.45), 0), 1);
      var p = Math.min((current + within * 0.999) / total, 1);
      document.documentElement.style.setProperty('--journey-p', (p * 100).toFixed(1));
      lineEls.forEach(function (ln, i) {
        var f = i < current ? 1 : (i === current ? within : 0);
        ln.style.setProperty('--jr-fill', f.toFixed(3));
      });
      ticking = false;
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

    nodes.forEach(function (n, i) {
      n.addEventListener('click', function () {
        stations[i].scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
      });
    });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  /* ==========================================================
     4. Reveal 系統（滾動進場）
     ========================================================== */
  function initReveal() {
    var els = document.querySelectorAll('.reveal, .reveal-l, .reveal-r, .reveal-scale');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ==========================================================
     5. 計數器（捲動觸發）
     ========================================================== */
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    function animate(c) {
      var target = parseFloat(c.getAttribute('data-count'));
      var decimals = parseInt(c.getAttribute('data-decimals') || '0', 10);
      var dur = 1500;
      var t0 = null;
      function frame(t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = target * eased;
        c.textContent = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toString();
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animate(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { io.observe(c); });
  }

  /* ==========================================================
     6. 互動 CT（B 核心）— split 拖曳 + WL/WW + 自動演示
     ========================================================== */
  function initCT() {
    var vp = document.querySelector('.ct-frame');
    if (!vp) return;
    var divider = vp.querySelector('.ct-divider');
    var readout = vp.querySelector('.ct-readout');
    var wlInput = document.getElementById('ctWl');
    var wwInput = document.getElementById('ctWw');
    var wl = 100, ww = 400;

    function setSplit(pct) {
      vp.style.setProperty('--split', String(pct));
      if (divider) divider.style.left = 'calc(' + pct + ' * 1%)';
      if (readout) readout.textContent = 'SPLIT ' + Math.round(pct) + '% · WW ' + ww + ' · WL ' + wl;
    }
    function setWL(v) { wl = v; vp.style.setProperty('--wl', String(v)); if (readout) readout.textContent = 'SPLIT ' + Math.round(vp.style.getPropertyValue('--split') || 50) + '% · WW ' + ww + ' · WL ' + v; }
    function setWW(v) { ww = v; vp.style.setProperty('--ww', String(v)); if (readout) readout.textContent = 'SPLIT ' + Math.round(vp.style.getPropertyValue('--split') || 50) + '% · WW ' + v + ' · WL ' + wl; }
    setSplit(50);

    function posFromEvent(e) {
      var r = vp.getBoundingClientRect();
      var x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
      return Math.min(Math.max(x / r.width * 100, 4), 96);
    }
    var dragging = false;
    function down(e) { dragging = true; setSplit(posFromEvent(e)); e.preventDefault(); }
    function move(e) { if (dragging) setSplit(posFromEvent(e)); }
    function up() { dragging = false; }

    if (divider) {
      divider.addEventListener('mousedown', down);
      divider.addEventListener('touchstart', down, { passive: false });
    }
    if (isFine) {
      vp.addEventListener('mousemove', move);
      vp.addEventListener('mouseup', up);
      vp.addEventListener('mouseleave', up);
    }
    vp.addEventListener('touchmove', move, { passive: true });
    vp.addEventListener('touchend', up, { passive: true });

    if (wlInput) wlInput.addEventListener('input', function () { setWL(parseInt(this.value, 10)); });
    if (wwInput) wwInput.addEventListener('input', function () { setWW(parseInt(this.value, 10)); });

    /* 自動演示（進入視野一次） */
    var demoDone = false;
    if (!prefersReduced) {
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting && !demoDone) {
          demoDone = true;
          var t = 0;
          function demoStep() {
            t += 0.025;
            var pct = t < 0.55
              ? 88 - (88 - 12) * (t / 0.55)
              : 12 + (50 - 12) * ((t - 0.55) / 0.45);
            setSplit(Math.min(Math.max(pct, 4), 96));
            if (t < 1) requestAnimationFrame(demoStep);
            else setSplit(50);
          }
          setTimeout(demoStep, 400);
        }
      }, { threshold: 0.4 });
      io.observe(vp);
    }
  }

  /* ==========================================================
     7. AUC 曲線繪製（B 核心）— 捲動驅動 --auc-p
     ========================================================== */
  function initAUC() {
    var card = document.querySelector('.auc-card');
    if (!card) return;
    var ticking = false;
    function update() {
      var r = card.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = 1 - (r.top + r.height / 2) / vh;
      p = Math.min(Math.max(p, 0), 1);
      card.style.setProperty('--auc-p', (p * 100).toFixed(1));
      var marker = card.querySelector('.auc-marker');
      if (marker) marker.classList.toggle('on', p > 0.8);
      ticking = false;
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  /* ==========================================================
     8. What-if 滑桿（治療站）— 拖曳 --wi
     ========================================================== */
  function initWhatIf() {
    var box = document.querySelector('.whatif');
    if (!box) return;
    var bar = box.querySelector('.wi-bar');
    var divider = box.querySelector('.wi-divider');
    if (!bar || !divider) return;
    function set(v) {
      var wi = Math.min(Math.max(v, 12), 88);
      box.style.setProperty('--wi', String(wi));
    }
    set(70);
    var dragging = false;
    function pos(e) {
      var r = bar.getBoundingClientRect();
      var x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
      return x / r.width * 100;
    }
    divider.addEventListener('mousedown', function (e) { dragging = true; set(pos(e)); e.preventDefault(); });
    divider.addEventListener('touchstart', function (e) { dragging = true; set(pos(e)); }, { passive: true });
    window.addEventListener('mousemove', function (e) { if (dragging) set(pos(e)); });
    window.addEventListener('touchmove', function (e) { if (dragging) set(pos(e)); }, { passive: true });
    window.addEventListener('mouseup', function () { dragging = false; });
    window.addEventListener('touchend', function () { dragging = false; });
  }

  /* ==========================================================
     9. 風險自測（Quiz）— 30 秒問答 → 結果分級
     ========================================================== */
  function initQuiz() {
    var card = document.querySelector('.quiz-card');
    if (!card) return;
    var steps = card.querySelectorAll('.quiz-step');
    var bar = card.querySelector('.quiz-progress i');
    var backBtn = card.querySelector('.quiz-back');
    var nextBtn = card.querySelector('.quiz-next');
    var restartBtn = card.querySelector('.quiz-restart');
    var cur = 0;
    var answers = {};

    function updateNext() {
      if (!nextBtn) return;
      var step = steps[cur];
      var sel = step ? step.querySelector('.quiz-opt.selected') : null;
      nextBtn.disabled = !sel;
    }
    function show(i) {
      steps.forEach(function (s, k) { s.classList.toggle('active', k === i); });
      cur = i;
      if (bar) bar.style.width = ((i + 1) / steps.length * 100) + '%';
      if (backBtn) backBtn.style.visibility = i === 0 ? 'hidden' : 'visible';
      if (nextBtn) {
        nextBtn.textContent = i === steps.length - 1
          ? (card.getAttribute('data-finish-text') || '看結果')
          : (card.getAttribute('data-next-text') || '下一題');
      }
      updateNext();
    }
    steps.forEach(function (step, i) {
      step.querySelectorAll('.quiz-opt').forEach(function (opt) {
        opt.addEventListener('click', function () {
          step.querySelectorAll('.quiz-opt').forEach(function (o) { o.classList.remove('selected'); });
          opt.classList.add('selected');
          answers[i] = opt.getAttribute('data-val');
          updateNext();
        });
      });
    });
    if (nextBtn) nextBtn.addEventListener('click', function () {
      if (nextBtn.disabled) return;
      if (cur < steps.length - 1) show(cur + 1); else finish();
    });
    if (backBtn) backBtn.addEventListener('click', function () { if (cur > 0) show(cur - 1); });
    if (restartBtn) restartBtn.addEventListener('click', function () {
      answers = {};
      steps.forEach(function (s) { s.querySelectorAll('.quiz-opt').forEach(function (o) { o.classList.remove('selected'); }); });
      card.querySelectorAll('[data-result]').forEach(function (el) { el.classList.remove('active'); });
      if (bar) bar.style.width = '0%';
      show(0);
    });

    function finish() {
      var score = 0;
      for (var k in answers) if (answers[k] === '1') score++;
      var tier = score >= 4 ? 'high' : (score >= 2 ? 'mid' : 'low');
      steps.forEach(function (s) { s.classList.remove('active'); });
      if (bar) bar.style.width = '100%';
      card.querySelectorAll('[data-result]').forEach(function (el) {
        el.classList.toggle('active', el.getAttribute('data-result') === tier);
      });
    }
    show(0);
  }

  /* ==========================================================
     10. 卡片 3D 傾斜（cert / stat / news，桌面）
     ========================================================== */
  function initTilt() {
    if (!isFine || prefersReduced) return;
    document.querySelectorAll('.cert-card, .stat, .news-card, .edu-card, .gate').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var nx = (e.clientX - r.left) / r.width - 0.5;
        var ny = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(900px) translateY(-5px) rotateX(' + (ny * -4).toFixed(2) + 'deg) rotateY(' + (nx * 6).toFixed(2) + 'deg)';
        card.style.setProperty('--gx', (nx * 100 + 50) + '%');
        card.style.setProperty('--gy', (ny * 100 + 50) + '%');
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });
  }

  /* ==========================================================
     11. FAQ 手風琴
     ========================================================== */
  function initFAQ() {
    document.querySelectorAll('.faq-item').forEach(function (item) {
      var q = item.querySelector('.faq-q');
      var a = item.querySelector('.faq-a');
      if (!q || !a) return;
      q.addEventListener('click', function () {
        var open = item.classList.toggle('open');
        a.style.maxHeight = open ? a.scrollHeight + 'px' : '0px';
        item.parentElement.querySelectorAll('.faq-item.open').forEach(function (o) {
          if (o !== item) {
            o.classList.remove('open');
            var oa = o.querySelector('.faq-a');
            if (oa) oa.style.maxHeight = '0px';
          }
        });
      });
    });
  }

  /* ==========================================================
     12. 手機 App tabbar 高亮
     ========================================================== */
  function initAppTabbar() {
    var bar = document.querySelector('.app-tabbar');
    if (!bar) return;
    var path = window.location.pathname.split('/').pop() || 'index.html';
    bar.querySelectorAll('a').forEach(function (a) {
      if (path === a.getAttribute('href')) a.classList.add('active');
    });
  }

  /* ==========================================================
     13. 敘事章節（patient 頁）
     ========================================================== */
  function initStory() {
    var chapters = document.querySelectorAll('.story-scene');
    var bar = document.getElementById('storyProgress');
    if (!chapters.length) return;
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('active');
            en.target.querySelectorAll('.reveal, .reveal-l, .reveal-r').forEach(function (el) { el.classList.add('in'); });
          }
        });
      }, { threshold: 0.4 });
      chapters.forEach(function (c) { io.observe(c); });
    }
    function prog() {
      if (!bar) return;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    }
    window.addEventListener('scroll', prog, { passive: true });
    prog();
  }

  /* ==========================================================
     14. 表單（GAS 後端 / mailto 備援）
     ========================================================== */
  function initForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var GAS = window.PANCAD_FORM && window.PANCAD_FORM.GAS_API_URL;
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      if (!GAS) {
        var q = Object.keys(data).map(function (k) {
          return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
        }).join('&');
        window.location.href = 'mailto:service@pancad.ai?subject=' +
          encodeURIComponent(data.subject || 'PANCREASaver 洽詢') + '&body=' + encodeURIComponent(q);
        return;
      }
      btn.setAttribute('data-sending', '1');
      btn.textContent = btn.getAttribute('data-sending-text') || '送出中…';
      fetch(GAS, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(data)
      }).then(function () {
        btn.textContent = btn.getAttribute('data-done-text') || '✓ 已送出';
        btn.setAttribute('data-done', '1');
      }).catch(function () {
        btn.textContent = '請再試一次';
        btn.removeAttribute('data-sending');
      });
    });
  }

  /* 滑鼠光暈（桌面，克制） */
  function initSpotGlow() {
    if (!isFine || prefersReduced) return;
    var glow = document.createElement('div');
    glow.className = 'spot-glow';
    document.body.appendChild(glow);
    var x = 0, y = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', function (e) { x = e.clientX; y = e.clientY; }, { passive: true });
    (function raf() {
      cx += (x - cx) * 0.12;
      cy += (y - cy) * 0.12;
      glow.style.setProperty('--gx', cx + 'px');
      glow.style.setProperty('--gy', cy + 'px');
      requestAnimationFrame(raf);
    })();
  }

  /* ==========================================================
     15. 動態光影（v2 級）：全域 orb 注入 + hero 金色粒子 + 場景過場
     ========================================================== */
  function initGlobalOrbs() {
    var targets = document.querySelectorAll('.scene.dark, .scene.darker, .scene.sun, .page-hero');
    if (!targets.length) return;
    var variants = ['orb-a', 'orb-b', 'orb-c', 'orb-d'];
    var counter = 0;
    targets.forEach(function (t) {
      if (t.querySelector('.orb')) return; /* 已有手動光斑就跳過 */
      var n = t.classList.contains('page-hero') ? 2 : 2;
      for (var i = 0; i < n; i++) {
        var orb = document.createElement('div');
        orb.className = 'orb ' + variants[(counter++) % variants.length];
        t.appendChild(orb);
      }
    });
  }

  function initHeroParticles() {
    if (prefersReduced) return;
    var heroes = document.querySelectorAll('.hero, .ph-sun');
    if (!heroes.length) return;
    heroes.forEach(function (hero) {
      var n = isFine ? 22 : 14;
      for (var i = 0; i < n; i++) {
        var p = document.createElement('div');
        p.className = 'particle';
        var size = (Math.random() * 5 + 3).toFixed(1);
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = (Math.random() * 100) + '%';
        p.style.animationDuration = (Math.random() * 9 + 8).toFixed(1) + 's';
        p.style.animationDelay = (-Math.random() * 16).toFixed(1) + 's';
        hero.appendChild(p);
      }
    });
  }

  /* 敘事章節金色塵光（每幕 10 顆上飄） */
  function initSceneParticles() {
    if (prefersReduced) return;
    document.querySelectorAll('.story-scene').forEach(function (scene) {
      for (var i = 0; i < 10; i++) {
        var d = document.createElement('div');
        d.className = 'dust';
        var size = (Math.random() * 4 + 2).toFixed(1);
        d.style.width = size + 'px';
        d.style.height = size + 'px';
        d.style.left = (Math.random() * 100) + '%';
        d.style.bottom = (Math.random() * 20) + '%';
        d.style.animationDuration = (Math.random() * 8 + 9).toFixed(1) + 's';
        d.style.animationDelay = (-Math.random() * 17).toFixed(1) + 's';
        scene.appendChild(d);
      }
    });
  }

  function initSceneEnter() {
    var scenes = document.querySelectorAll('.scene');
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) en.target.classList.add('enter');
      });
    }, { threshold: 0.06 });
    scenes.forEach(function (s) { io.observe(s); });
  }

  /* ==========================================================
     15.5 背景語言池 + 隨機輪換 + 漸進解析度（v3 機制移植）
     中文/日文 → 台灣 sun 池；英文 → 西歐人種 intl 池
     每 9 秒隨機換圖；effectiveType 決定 med(1280 jpg) → hd(5120 webp)
     ========================================================== */
  var BG_POOLS = null;
  function buildPools() {
    if (BG_POOLS) return BG_POOLS;
    var sun = ['bike', 'bridge', 'coffee', 'forest', 'kayak', 'picnic', 'yoga'];
    var intl = [];
    for (var i = 1; i <= 30; i++) intl.push(('0' + i).slice(-2));
    function items(names, prefix) {
      return names.map(function (n) {
        return {
          name: prefix + n,
          med: 'assets/hero_' + prefix + n + '_safe.jpg',
          hd: 'assets/hero_' + prefix + n + '_safe_hd.webp'
        };
      });
    }
    BG_POOLS = {
      sun: items(sun, 'sun_'),
      intl: items(intl, 'intl_')
    };
    return BG_POOLS;
  }
  function poolForLang() {
    var lang = (window.PANCAD_LANG && PANCAD_LANG.current()) || 'zh-TW';
    return (String(lang).toLowerCase().indexOf('en') === 0) ? buildPools().intl : buildPools().sun;
  }
  function netTier() {
    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!conn || !conn.effectiveType) return 'hd';
    var et = conn.effectiveType;
    if (et === 'slow-2g' || et === '2g') return 'med';
    if (et === '3g') return 'med';
    return 'hd';
  }
  function restartBgAnim(el) {
    var anim = getComputedStyle(el).animationName;
    if (anim && anim !== 'none') {
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = '';
    }
  }
  function applyBg(el, item, tier) {
    if (tier === 'hd') {
      /* 先 med（立即顯示）→ HD 載好再升級（漸進） */
      el.style.backgroundImage = "url('" + item.med + "')";
      restartBgAnim(el);
      var img = new Image();
      img.onload = function () {
        if (el.getAttribute('data-bg-name') === item.name) {
          el.style.backgroundImage = "url('" + item.hd + "')";
          restartBgAnim(el);
        }
      };
      img.src = item.hd;
    } else {
      el.style.backgroundImage = "url('" + item.med + "')";
      restartBgAnim(el);
    }
  }
  function initBgPool() {
    var targets = document.querySelectorAll('[data-bg-pool]');
    if (!targets.length) return;
    var pool = poolForLang();
    var tier = netTier();
    targets.forEach(function (el) {
      var cur = pool[Math.floor(Math.random() * pool.length)];
      el.setAttribute('data-bg-name', cur.name);
      el.style.opacity = 0;
      applyBg(el, cur, tier);
      el.style.opacity = 1;
      if (prefersReduced) return;
      setInterval(function () {
        var next;
        do { next = pool[Math.floor(Math.random() * pool.length)]; } while (next.name === cur.name);
        cur = next;
        el.setAttribute('data-bg-name', next.name);
        el.style.opacity = 0;
        setTimeout(function () {
          applyBg(el, next, tier);
          el.style.opacity = 1;
        }, 450);
      }, 9000);
    });
  }
  function reinitBgPool() {
    document.querySelectorAll('[data-bg-pool]').forEach(function (el) {
      el.setAttribute('data-bg-name', '');
    });
    initBgPool();
  }

  /* ==========================================================
     Boot
     ========================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initScrollTimeline();
    initKinetic();
    initJourney();
    initGlobalOrbs();
    initHeroParticles();
    initSceneParticles();
    initSceneEnter();
    initBgPool();
    initReveal();
    initCounters();
    initCT();
    initAUC();
    initWhatIf();
    initQuiz();
    initTilt();
    initFAQ();
    initAppTabbar();
    initStory();
    initForm();
    initSpotGlow();
  });

  /* 語言切換後重跑 kinetic + 背景換池 */
  window.addEventListener('langchange', function () {
    setTimeout(function () {
      document.querySelectorAll('.kinetic').forEach(function (el) {
        el.removeAttribute('data-kinetic-done');
      });
      initKinetic();
    }, 60);
    setTimeout(reinitBgPool, 120);
  });
})();
