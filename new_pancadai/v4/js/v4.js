/* ============================================================
   pancad.ai v4 — 互動層（白畫布 × DICOM 視窗）
   閱片視窗：分隔滑桿 / 病灶點擊 / 窗寬窗位 / 自動演示 / 3D 傾斜
   品牌旅程時間軸 reveal
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 1. 互動 CT 閱片視窗 ---------- */
  var vp = document.getElementById('ctViewport');
  if (vp) {
    var imgBase = document.getElementById('vpImgBase');
    var imgAi = document.getElementById('vpImgAi');
    var divider = document.getElementById('vpDivider');
    var demoBtn = document.getElementById('vpDemo');
    var wlRange = document.getElementById('vpWl');
    var wwRange = document.getElementById('vpWw');
    var wlVal = document.getElementById('vpWlVal');
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var dragging = false;
    var animRaf = null;

    function setSplit(pct) {
      pct = Math.max(4, Math.min(96, pct));
      vp.style.setProperty('--split', String(pct));
      if (divider) divider.setAttribute('aria-valuenow', Math.round(pct));
    }

    function splitFromX(clientX) {
      var r = vp.getBoundingClientRect();
      return ((clientX - r.left) / r.width) * 100;
    }

    /* 分隔滑桿拖曳 */
    function onDown(e) {
      dragging = true;
      if (animRaf) { cancelAnimationFrame(animRaf); animRaf = null; }
      if (divider) divider.classList.add('dragging');
      setSplit(splitFromX(e.touches ? e.touches[0].clientX : e.clientX));
    }
    function onMove(e) {
      if (!dragging) return;
      setSplit(splitFromX(e.touches ? e.touches[0].clientX : e.clientX));
    }
    function onUp() {
      dragging = false;
      if (divider) divider.classList.remove('dragging');
    }

    vp.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseup', onUp);
    vp.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);

    /* 鍵盤操作（無障礙） */
    if (divider) {
      divider.addEventListener('keydown', function (e) {
        var cur = parseFloat(vp.style.getPropertyValue('--split') || '50');
        if (e.key === 'ArrowLeft') { e.preventDefault(); setSplit(cur - 4); }
        if (e.key === 'ArrowRight') { e.preventDefault(); setSplit(cur + 4); }
      });
    }

    /* 自動演示：分隔線往返一趟 */
    if (demoBtn) {
      demoBtn.addEventListener('click', function () {
        if (dragging) return;
        if (animRaf) cancelAnimationFrame(animRaf);
        var from = parseFloat(vp.style.getPropertyValue('--split') || '50');
        var start = null;
        var phases = [
          { t0: 0, t1: 0.55, a: from, b: 88 },
          { t0: 0.55, t1: 1, a: 88, b: 12 }
        ];
        function frame(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / 2600, 1);
          var seg = p < 0.55 ? phases[0] : phases[1];
          var lp = seg === phases[0] ? p / 0.55 : (p - 0.55) / 0.45;
          var eased = seg === phases[0] ? 1 - Math.pow(1 - lp, 3) : lp * lp * (3 - 2 * lp);
          setSplit(seg.a + (seg.b - seg.a) * eased);
          if (p < 1) { animRaf = requestAnimationFrame(frame); }
          else { animRaf = null; setTimeout(function () { setSplit(50); }, 900); }
        }
        animRaf = requestAnimationFrame(frame);
      });
    }

    /* 窗寬 / 窗位 → 即時改變影像對比（CSS filter） */
    function applyWl() {
      if (!imgBase || !imgAi) return;
      var wl = wlRange ? parseInt(wlRange.value, 10) : 40;
      var ww = wwRange ? parseInt(wwRange.value, 10) : 400;
      var brightness = 0.7 + (wl / 200) * 1.3;
      var contrast = 0.5 + (ww / 800) * 1.7;
      var f = 'brightness(' + brightness.toFixed(2) + ') contrast(' + contrast.toFixed(2) + ')';
      imgBase.style.filter = f;
      imgAi.style.filter = f;
      if (wlVal) wlVal.textContent = 'WW ' + ww + ' · WL ' + wl;
    }
    if (wlRange) wlRange.addEventListener('input', applyWl);
    if (wwRange) wwRange.addEventListener('input', applyWl);
    applyWl();

    /* 3D 微傾（僅精準滑鼠） */
    if (finePointer && 'ontouchstart' in window === false) {
      var tiltRaf = null;
      vp.addEventListener('mousemove', function (e) {
        if (dragging) return;
        if (tiltRaf) return;
        tiltRaf = requestAnimationFrame(function () {
          var r = vp.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width;
          var py = (e.clientY - r.top) / r.height;
          var rx = (0.5 - py) * 5;
          var ry = (px - 0.5) * 6;
          vp.style.transform = 'perspective(1200px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
          tiltRaf = null;
        });
      });
      vp.addEventListener('mouseleave', function () {
        vp.style.transform = '';
      });
    }
  }

  /* ---------- 2. 品牌旅程時間軸（stagger reveal） ---------- */
  var steps = document.querySelectorAll('.j-step');
  if (steps.length && 'IntersectionObserver' in window) {
    var jo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var el = e.target;
          var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
          el.style.transitionDelay = (delay * 0.14) + 's';
          el.classList.add('in');
          jo.unobserve(el);
        }
      });
    }, { threshold: 0.35 });
    steps.forEach(function (s) { jo.observe(s); });
  } else {
    steps.forEach(function (s) { s.classList.add('in'); });
  }
})();
