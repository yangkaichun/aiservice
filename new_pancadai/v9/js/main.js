/* ============================================================
   PANCREASaver 官網 v9 — 動效核心 v2
   （修正：kinetic 用 DOM 遞迴、i18n 掛勾防護、順序修正）
   ============================================================ */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Kinetic 標題（DOM 遞迴逐字湧現，保留 span class） ---------- */
  function kineticizeText(node, wrap, state) {
    var text = node.nodeValue;
    if (!text) return;
    var tokens = text.split(/(\s+)/);
    tokens.forEach(function (tk) {
      if (!tk) return;
      if (/^\s+$/.test(tk)) { wrap.appendChild(document.createTextNode(tk)); return; }
      Array.prototype.forEach.call(tk, function (ch) {
        var w = document.createElement('span');
        w.className = 'kinetic-w';
        w.style.setProperty('--kd', (state.delay * 0.05) + 's');
        var inner = document.createElement('span');
        inner.textContent = ch;
        w.appendChild(inner);
        wrap.appendChild(w);
        state.delay++;
      });
    });
  }

  function initKinetic(host) {
    if (!host || host.dataset.kineticDone === '1') return;
    host.dataset.kineticHtml = host.innerHTML;
    var state = { delay: 0 };
    var frag = document.createDocumentFragment();
    function walk(el, parent) {
      Array.prototype.forEach.call(el.childNodes, function (child) {
        if (child.nodeType === 3) { // text
          kineticizeText(child, parent, state);
        } else if (child.nodeType === 1) { // element
          if (child.tagName === 'BR') { parent.appendChild(document.createElement('br')); return; }
          var clone = document.createElement(child.tagName);
          Array.prototype.forEach.call(child.attributes, function (a) {
            if (a.name === 'data-i18n-html' || a.name === 'data-i18n') return; // i18n 由重建流程管理
            try { clone.setAttribute(a.name, a.value); } catch (e) {}
          });
          walk(child, clone);
          parent.appendChild(clone);
        }
      });
    }
    walk(host, frag);
    host.textContent = '';
    host.appendChild(frag);
    host.dataset.kineticDone = '1';
  }

  /* 子樹翻譯（kinetic host 內部的 data-i18n 元素，用全域字典） */
  function translateSubtree(root) {
    if (!window.PANCAD_I18N || !window.PANCAD_LANG) return;
    var lang = PANCAD_LANG.get();
    var d = (window.PANCAD_I18N[lang] || window.PANCAD_I18N.zh || {});
    var els = root.querySelectorAll('[data-i18n-html],[data-i18n],[data-i18n-ph]');
    Array.prototype.forEach.call(els, function (el) {
      var k = el.getAttribute('data-i18n-html') || el.getAttribute('data-i18n');
      if (k && d[k] !== undefined) {
        if (el.hasAttribute('data-i18n-html')) el.innerHTML = d[k];
        else el.textContent = d[k];
      }
      var ph = el.getAttribute('data-i18n-ph');
      if (ph && d[ph] !== undefined) el.setAttribute('placeholder', d[ph]);
    });
  }

  /* 重建 kinetic：還原原始 HTML → 重新翻譯 → 逐字化 */
  function rebuildKinetic() {
    document.querySelectorAll('[data-kinetic]').forEach(function (host) {
      if (!host.dataset.kineticHtml) return; // 尚未初始化
      host.dataset.kineticDone = '0';
      host.innerHTML = host.dataset.kineticHtml;
      translateSubtree(host);
      initKinetic(host);
    });
  }

  /* ---------- 2. Reveal on scroll ---------- */
  function initReveal() {
    var els = document.querySelectorAll('[data-reveal]');
    if (reduced) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- 3. 計數器 ---------- */
  function initCounters() {
    var els = document.querySelectorAll('[data-count]');
    if (!els.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        io.unobserve(el);
        var target = parseFloat(el.getAttribute('data-count'));
        var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
        var suffix = el.getAttribute('data-suffix') || '';
        function fmt(v) { return (dec ? v.toFixed(dec) : Math.round(v)) + suffix; }
        if (reduced) { el.textContent = fmt(target); return; }
        var t0 = null, dur = 1900;
        function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = fmt(target * eased);
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = fmt(target);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- 4. 生存條 ---------- */
  function initBars() {
    var bars = document.querySelectorAll('[data-bar]');
    if (!bars.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var bar = en.target;
        io.unobserve(bar);
        bar.style.width = bar.getAttribute('data-bar') + '%';
      });
    }, { threshold: 0.5 });
    bars.forEach(function (b) { io.observe(b); });
  }

  /* ---------- 5. CT 拖曳比較 ---------- */
  function initCompare() {
    document.querySelectorAll('.ct-compare').forEach(function (box) {
      var divider = box.querySelector('.divider');
      var seg = box.querySelector('.seg-layer');
      if (!divider || !seg) return;
      function setPosFromPct(pct) {
        pct = Math.max(2, Math.min(98, pct));
        divider.style.left = pct + '%';
        seg.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
      }
      function setPos(clientX) {
        var rect = box.getBoundingClientRect();
        setPosFromPct(((clientX - rect.left) / rect.width) * 100);
      }
      var dragging = false;
      box.addEventListener('pointerdown', function (e) { dragging = true; setPos(e.clientX); if (box.setPointerCapture) box.setPointerCapture(e.pointerId); });
      box.addEventListener('pointermove', function (e) { if (dragging) setPos(e.clientX); });
      box.addEventListener('pointerup', function () { dragging = false; });
      box.addEventListener('pointercancel', function () { dragging = false; });
      box.setAttribute('tabindex', '0');
      box.addEventListener('keydown', function (e) {
        var pct = parseFloat(divider.style.left) || 50;
        if (e.key === 'ArrowLeft') { setPosFromPct(pct - 4); e.preventDefault(); }
        if (e.key === 'ArrowRight') { setPosFromPct(pct + 4); e.preventDefault(); }
      });
    });
  }

  /* ---------- 6. 旅程步驟活化 ---------- */
  function initJourney() {
    var steps = document.querySelectorAll('[data-jstep]');
    if (!steps.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        en.target.classList.toggle('in', en.isIntersecting);
      });
    }, { threshold: 0.35 });
    steps.forEach(function (s) { io.observe(s); });
  }

  /* ---------- 7. 背景光斑視差 ---------- */
  function initOrbs() {
    var orbs = document.querySelectorAll('#bgOrbs .orb');
    if (!orbs.length || reduced) return;
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        orbs.forEach(function (o, i) {
          o.style.transform = 'translate3d(0,' + (y * (0.06 + i * 0.035)) + 'px,0)';
        });
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- 8. 捲動進度光柱 ---------- */
  function initScrollBeam() {
    var beam = document.getElementById('scrollBeam');
    if (!beam) return;
    var inner = document.createElement('div');
    inner.style.cssText = 'position:absolute;left:0;right:0;top:0;height:38vh;background:linear-gradient(180deg,#ffd9a0,#3d7fe0,transparent);box-shadow:0 0 22px rgba(255,217,160,.85),0 0 44px rgba(61,127,224,.5);transform:translateY(-100%);transition:transform .12s linear';
    beam.appendChild(inner);
    var ticking = false;
    function update() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var p = max > 0 ? (window.scrollY / max) : 0;
      inner.style.transform = 'translateY(' + (-38 + p * 138) + 'vh)';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---------- 9. Nav ---------- */
  function initNav() {
    var nav = document.getElementById('nav');
    var burger = document.getElementById('burger');
    var links = document.getElementById('navLinks');
    if (!nav) return;
    function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 40); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    if (burger && links) {
      burger.addEventListener('click', function () {
        burger.classList.toggle('open');
        links.classList.toggle('open');
      });
      links.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') {
          burger.classList.remove('open');
          links.classList.remove('open');
        }
      });
    }
    document.querySelectorAll('.lang-switch button[data-lang]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        window.PANCAD_LANG && PANCAD_LANG.set(btn.getAttribute('data-lang'));
      });
    });
  }

  /* ---------- 10. Marquee 克隆（無縫） ---------- */
  function initMarquee() {
    var mq = document.getElementById('marquee');
    if (!mq) return;
    mq.innerHTML = mq.innerHTML + mq.innerHTML;
  }

  /* ---------- 10b. FAQ 展開 ---------- */
  function initFaq() {
    document.querySelectorAll('.faq-item').forEach(function (item) {
      var q = item.querySelector('.faq-q');
      if (!q) return;
      q.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(function (o) {
          if (o !== item) { o.classList.remove('open'); o.querySelector('.faq-a').style.maxHeight = '0px'; }
        });
        item.classList.toggle('open', !isOpen);
        var a = item.querySelector('.faq-a');
        a.style.maxHeight = !isOpen ? a.scrollHeight + 'px' : '0px';
      });
    });
  }

  /* ---------- 10c. 聯絡表單（mailto 備援） ---------- */
  function initForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name ? form.name.value : '';
      var email = form.email ? form.email.value : '';
      var type = form.type ? form.type.value : '';
      var msg = form.message ? form.message.value : '';
      var body = encodeURIComponent('姓名: ' + name + '\nEmail: ' + email + '\n類型: ' + type + '\n\n' + msg);
      window.location.href = 'mailto:contact@pancad.ai?subject=' + encodeURIComponent('[網站諮詢] ' + name) + '&body=' + body;
      var ok = document.getElementById('formOk');
      if (ok) ok.style.display = 'block';
    });
  }

  /* ---------- 11. i18n 掛勾：切語言時重建 kinetic ---------- */
  document.addEventListener('pancad:lang', rebuildKinetic);

  /* ---------- 12. 影片 poster fallback ---------- */
  function initVideoFallback() {
    document.querySelectorAll('video').forEach(function (v) {
      var poster = v.parentElement ? v.parentElement.querySelector('.poster') : null;
      v.addEventListener('error', function () { if (poster) poster.style.display = 'block'; });
      v.addEventListener('canplay', function () { if (poster) poster.style.display = 'none'; });
    });
  }

  /* ---------- 啟動 ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initReveal();
    initCounters();
    initBars();
    initCompare();
    initJourney();
    initOrbs();
    initScrollBeam();
    initMarquee();
    initFaq();
    initForm();
    initVideoFallback();
    // 先套用已存語言（非 kinetic 元素），kinetic host 則翻譯後再逐字化
    if (window.PANCAD_LANG) PANCAD_LANG.applyAll();
    document.querySelectorAll('[data-kinetic]').forEach(function (host) {
      translateSubtree(host);
      initKinetic(host);
    });
  });
})();
