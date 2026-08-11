/* ============================================================
   PANCREASaver 助胰見® — pancad.ai v5 動畫核心
   A×B×C：3D 全息（A）× 劇場式捲動（B）× 手機 App 化（C）
   零套件：自製平滑捲動 + 捲動時間軸 + 粒子 + 互動 CT
   版本：?v=1
   ============================================================ */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var isMobile = window.matchMedia('(max-width: 767px)').matches;

  /* ==========================================================
     0. 導覽：scrolled 狀態 + 漢堡選單 + 語言選單
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
     1. 平滑捲動（自製 Lenis：桌面 + 非 reduced-motion）
     ========================================================== */
  function initSmoothScroll() {
    if (prefersReduced || !isFine) return;
    var current = window.scrollY;
    var target = current;
    var running = false;

    window.addEventListener('scroll', function () {
      target = window.scrollY;
      if (!running) {
        running = true;
        requestAnimationFrame(step);
      }
    }, { passive: true });

    function step() {
      var diff = target - current;
      if (Math.abs(diff) < 0.5) {
        current = target;
        running = false;
        return;
      }
      current += diff * 0.09;
      window.scrollTo(0, current);
      requestAnimationFrame(step);
    }
  }

  /* ==========================================================
     2. 捲動時間軸：--sp 全域進度 + 視差
     ========================================================== */
  function initScrollTimeline() {
    var root = document.documentElement;
    var parEls = document.querySelectorAll('.chapter-bg, .page-hero .bg');

    function update() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      root.style.setProperty('--sp', max > 0 ? (window.scrollY / max).toFixed(4) : '0');
      parEls.forEach(function (el) {
        var r = el.parentElement.getBoundingClientRect();
        var mid = r.top + r.height / 2 - window.innerHeight / 2;
        el.style.setProperty('--par', (mid * -0.07).toFixed(1) + 'px');
      });
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ==========================================================
     3. Kinetic 標題：逐詞包裝 + 錯落入場
     ========================================================== */
  function initKinetic() {
    if (prefersReduced) return;
    document.querySelectorAll('.kinetic').forEach(function (el) {
      if (el.getAttribute('data-kinetic-done')) return;
      var text = el.textContent;
      var words = text.split(/(\s+)/);
      el.innerHTML = words.map(function (w) {
        if (w.trim() === '') return w;
        return '<span class="w"><span style="animation-delay:' +
          (Math.random() * 0.6).toFixed(2) + 's">' + w + '</span></span>';
      }).join('');
      el.setAttribute('data-kinetic-done', '1');
    });
  }

  /* ==========================================================
     4. 3D 全息互動（A 提案核心）
     ========================================================== */
  function initHolo() {
    var stage = document.querySelector('.holo-stage');
    if (!stage) return;
    var holo = stage.querySelector('.holo');
    var rotY = 0, rotX = 0, targetY = 0, targetX = 0;

    if (isFine && !prefersReduced) {
      stage.addEventListener('mousemove', function (e) {
        var r = stage.getBoundingClientRect();
        targetY = ((e.clientX - r.left) / r.width - 0.5) * 30;
        targetX = ((e.clientY - r.top) / r.height - 0.5) * -20;
      });
      stage.addEventListener('mouseleave', function () { targetY = 0; targetX = 0; });
    }

    /* 捲動時模型收縮進場（首屏捲離時） */
    var hero = document.querySelector('.hero');
    function holoRaf() {
      rotY += (targetY - rotY) * 0.06;
      rotX += (targetX - rotX) * 0.06;
      var scale = 1;
      if (hero) {
        var h = hero.getBoundingClientRect();
        var progress = Math.min(Math.max(-h.top / window.innerHeight, 0), 1);
        scale = 1 - progress * 0.25;
      }
      holo.style.setProperty('--holo-rot-y', rotY.toFixed(2) + 'deg');
      holo.style.setProperty('--holo-rot-x', rotX.toFixed(2) + 'deg');
      holo.style.setProperty('--holo-scale', scale.toFixed(3));
      requestAnimationFrame(holoRaf);
    }
    requestAnimationFrame(holoRaf);

    /* 觸控：拖動旋轉 */
    var dragging = false, lastX = 0;
    stage.addEventListener('touchstart', function (e) {
      dragging = true;
      lastX = e.touches[0].clientX;
    }, { passive: true });
    stage.addEventListener('touchmove', function (e) {
      if (!dragging) return;
      var dx = e.touches[0].clientX - lastX;
      lastX = e.touches[0].clientX;
      targetY += dx * 0.5;
    }, { passive: true });
    stage.addEventListener('touchend', function () { dragging = false; }, { passive: true });
  }

  /* ==========================================================
     5. 星空粒子 canvas（首屏）
     ========================================================== */
  function initParticles() {
    var canvas = document.querySelector('canvas.particles');
    if (!canvas || prefersReduced) return;
    var ctx = canvas.getContext('2d');
    var W, H, pts = [];

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      var n = Math.min(Math.floor(W * H / 14000), 90);
      pts = [];
      for (var i = 0; i < n; i++) {
        pts.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.6 + 0.4,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          a: Math.random() * 0.5 + 0.15
        });
      }
    }
    resize();
    window.addEventListener('resize', resize);

    function draw() {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(function (p) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, 'rgba(126,231,255,' + p.a + ')');
        g.addColorStop(1, 'rgba(126,231,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  /* ==========================================================
     6. Reveal 系統（ScrollTrigger 式進場）
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

  /* 場景過場：進入視野時亮頂線 */
  function initSceneEnter() {
    var scenes = document.querySelectorAll('.scene');
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) en.target.classList.add('enter');
      });
    }, { threshold: 0.05 });
    scenes.forEach(function (s) { io.observe(s); });
  }

  /* ==========================================================
     7. 計數器（捲動觸發）
     ========================================================== */
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    function animate(c) {
      var target = parseFloat(c.getAttribute('data-count'));
      var decimals = parseInt(c.getAttribute('data-decimals') || '0', 10);
      var dur = 1600;
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
        if (en.isIntersecting) {
          animate(en.target);
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { io.observe(c); });
  }

  /* ==========================================================
     8. 互動 CT 閱片視窗（v4 繼承：split 拖曳 + WL/WW + 自動演示）
     ========================================================== */
  function initCT() {
    var vp = document.querySelector('.ct-frame');
    if (!vp) return;

    var divider = vp.querySelector('.ct-divider');
    var readout = vp.querySelector('.ct-readout');
    var wlInput = document.getElementById('ctWl');
    var wwInput = document.getElementById('ctWw');
    var baseImg = vp.querySelector('.ct-base');
    var aiImg = vp.querySelector('.ct-ai');

    function setSplit(pct) {
      vp.style.setProperty('--split', String(pct));
      if (divider) divider.style.left = 'calc(' + pct + ' * 1%)';
      if (readout) readout.textContent = 'SPLIT ' + Math.round(pct) + '%';
    }
    function setWL(v) {
      vp.style.setProperty('--wl', String(v));
      if (readout) readout.textContent = 'WW ' + ww + ' · WL ' + v;
    }
    function setWW(v) {
      vp.style.setProperty('--ww', String(v));
      if (readout) readout.textContent = 'WW ' + v + ' · WL ' + wl;
    }
    var wl = 100, ww = 400;
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

    if (wlInput) {
      wlInput.addEventListener('input', function () { wl = parseInt(this.value, 10); setWL(wl); });
    }
    if (wwInput) {
      wwInput.addEventListener('input', function () { ww = parseInt(this.value, 10); setWW(ww); });
    }

    /* 自動演示（進入視野一次，之後使用者接管） */
    var demoDone = false;
    var demo = document.querySelector('.ct-demo');
    if (demo && !prefersReduced) {
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
     9. 手機 App 化：底部 tab 高亮 + 進場
     ========================================================== */
  function initAppTabbar() {
    var bar = document.querySelector('.app-tabbar');
    if (!bar) return;
    var path = window.location.pathname.split('/').pop() || 'index.html';
    bar.querySelectorAll('a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (path === href || (path === 'index.html' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  }

  /* ==========================================================
     10. 病患軌敘事：章節進場 + 進度條
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
            var revealEls = en.target.querySelectorAll('.chapter-body .reveal, .chapter-body .reveal-l, .chapter-body .reveal-r');
            revealEls.forEach(function (el) { el.classList.add('in'); });
          }
        });
      }, { threshold: 0.5 });
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
     11. 表單：GAS 後端（沿用家族）
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

  /* ==========================================================
     Boot
     ========================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initSmoothScroll();
    initScrollTimeline();
    initKinetic();
    initHolo();
    initParticles();
    initReveal();
    initSceneEnter();
    initCounters();
    initCT();
    initAppTabbar();
    initStory();
    initForm();
  });

  /* 語言切換後重跑 kinetic（字典換文字 → 重新包裝 .w span） */
  window.addEventListener('langchange', function () {
    setTimeout(function () {
      document.querySelectorAll('.kinetic').forEach(function (el) {
        el.removeAttribute('data-kinetic-done');
      });
      initKinetic();
    }, 60);
  });
})();
