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
     1. 捲動時間軸：--sp 全域進度 + 視差（原生捲動，最順手感）
     ========================================================== */
  function initScrollTimeline() {
    var root = document.documentElement;
    var parEls = document.querySelectorAll('.chapter-bg, .page-hero .bg, .hero-inner');
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
        el.style.setProperty('--par', (mid * -0.07).toFixed(1) + 'px');
      });
      ticking = false;
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
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
     4. 3D 全息互動（A 提案核心）— 自動旋轉 + 拖曳 + 懸停
     ========================================================== */
  function initHolo() {
    var stage = document.querySelector('.holo-stage');
    if (!stage) return;
    var holo = stage.querySelector('.holo');
    var rotY = 0, rotX = 0, targetY = 0, targetX = 0;
    var idleSpin = 0.35;          /* 每秒自動旋轉度數 */
    var dragging = false, lastX = 0, lastY = 0;
    var hoverStrength = 0;

    /* 拖曳旋轉（滑鼠 + 觸控）— 直覺、靈敏 */
    stage.addEventListener('mousedown', function (e) {
      dragging = true;
      lastX = e.clientX; lastY = e.clientY;
      e.preventDefault();
    });
    window.addEventListener('mousemove', function (e) {
      if (dragging) {
        var dx = e.clientX - lastX;
        var dy = e.clientY - lastY;
        lastX = e.clientX; lastY = e.clientY;
        targetY += dx * 0.45;   /* 高靈敏度 */
        targetX += dy * 0.35;
      } else if (isFine && !prefersReduced) {
        /* 懸停微傾（靠近中心加乘） */
        var r = stage.getBoundingClientRect();
        var nx = (e.clientX - r.left) / r.width - 0.5;
        var ny = (e.clientY - r.top) / r.height - 0.5;
        targetY = nx * 40;
        targetX = ny * -28;
      }
    });
    window.addEventListener('mouseup', function () { dragging = false; });
    stage.addEventListener('mouseenter', function () {
      if (!dragging) hoverStrength = 1;
    });
    stage.addEventListener('mouseleave', function () {
      if (!dragging) { targetY = 0; targetX = 0; hoverStrength = 0; }
    });

    /* 觸控拖曳 */
    stage.addEventListener('touchstart', function (e) {
      dragging = true;
      lastX = e.touches[0].clientX; lastY = e.touches[0].clientY;
    }, { passive: true });
    stage.addEventListener('touchmove', function (e) {
      if (!dragging) return;
      var dx = e.touches[0].clientX - lastX;
      var dy = e.touches[0].clientY - lastY;
      lastX = e.touches[0].clientX; lastY = e.touches[0].clientY;
      targetY += dx * 0.5;
      targetX += dy * 0.4;
    }, { passive: true });
    stage.addEventListener('touchend', function () { dragging = false; }, { passive: true });

    /* 捲動時模型收縮進場（首屏捲離時） */
    var hero = document.querySelector('.hero');
    var lastT = 0;
    function holoRaf(t) {
      var dt = lastT ? (t - lastT) / 1000 : 0;
      lastT = t;
      /* idle 自動旋轉（不拖曳、不懸停時） */
      if (!dragging && hoverStrength === 0 && !prefersReduced) {
        targetY += idleSpin * dt * 60 / 60;
      }
      rotY += (targetY - rotY) * 0.08;
      rotX += (targetX - rotX) * 0.08;
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
  }

  /* 滑鼠光暈追蹤（桌面，全站） */
  function initSpotGlow() {
    if (!isFine || prefersReduced) return;
    var glow = document.createElement('div');
    glow.className = 'spot-glow';
    document.body.appendChild(glow);
    var x = 0, y = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', function (e) {
      x = e.clientX; y = e.clientY;
    }, { passive: true });
    (function raf() {
      cx += (x - cx) * 0.12;
      cy += (y - cy) * 0.12;
      glow.style.setProperty('--gx', cx + 'px');
      glow.style.setProperty('--gy', cy + 'px');
      requestAnimationFrame(raf);
    })();
  }

  /* ==========================================================
     5. 星空粒子 canvas（首屏）— 星座連線版
     ========================================================== */
  function initParticles() {
    var canvas = document.querySelector('canvas.particles');
    if (!canvas || prefersReduced) return;
    var ctx = canvas.getContext('2d');
    var W, H, pts = [];
    var mouseX = -9999, mouseY = -9999;

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      var n = Math.min(Math.floor(W * H / 9000), 140);
      pts = [];
      for (var i = 0; i < n; i++) {
        pts.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.8 + 0.5,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          a: Math.random() * 0.55 + 0.15
        });
      }
    }
    resize();
    window.addEventListener('resize', resize);

    if (isFine) {
      window.addEventListener('mousemove', function (e) {
        mouseX = e.clientX; mouseY = e.clientY;
      }, { passive: true });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      var i, j, p, q;
      /* 星座連線：近點互連 */
      ctx.lineWidth = 0.6;
      for (i = 0; i < pts.length; i++) {
        p = pts[i];
        for (j = i + 1; j < pts.length; j++) {
          q = pts[j];
          var dx = p.x - q.x, dy = p.y - q.y;
          var d2 = dx * dx + dy * dy;
          if (d2 < 130 * 130) {
            var alpha = (1 - Math.sqrt(d2) / 130) * 0.22;
            ctx.strokeStyle = 'rgba(126,231,255,' + alpha + ')';
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      /* 粒子 + 滑鼠排斥 */
      pts.forEach(function (pt) {
        var mdx = pt.x - mouseX, mdy = pt.y - mouseY;
        var md2 = mdx * mdx + mdy * mdy;
        if (md2 < 120 * 120 && md2 > 0.01) {
          var mdist = Math.sqrt(md2);
          var force = (120 - mdist) / 120 * 1.6;
          pt.x += mdx / mdist * force;
          pt.y += mdy / mdist * force;
        }
        pt.x += pt.vx; pt.y += pt.vy;
        if (pt.x < 0) pt.x = W; if (pt.x > W) pt.x = 0;
        if (pt.y < 0) pt.y = H; if (pt.y > H) pt.y = 0;
        var g = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, pt.r * 4);
        g.addColorStop(0, 'rgba(126,231,255,' + pt.a + ')');
        g.addColorStop(1, 'rgba(126,231,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r * 4, 0, Math.PI * 2);
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

  /* 全域光影：為所有深色場景自動注入光斑（orb）— 保證每頁都有光影動畫 */
  function initGlobalOrbs() {
    var targets = document.querySelectorAll('.scene.dark, .scene.darker, .page-hero');
    if (!targets.length) return;
    var variants = ['orb-a', 'orb-b', 'orb-c'];
    var counter = 0;
    targets.forEach(function (t) {
      if (t.querySelector('.orb')) return; /* 已有手動光斑就跳過 */
      var n = t.classList.contains('page-hero') ? 2 : 1;
      for (var i = 0; i < n; i++) {
        var orb = document.createElement('div');
        orb.className = 'orb ' + variants[(counter++) % 3];
        t.appendChild(orb);
      }
    });
  }

  /* 卡片 3D 傾斜（gate / stat / cert，桌面 hover） */
  function initTilt() {
    if (!isFine || prefersReduced) return;
    document.querySelectorAll('.gate, .stat, .cert-card, .flow-step, .pub-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var nx = (e.clientX - r.left) / r.width - 0.5;
        var ny = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          'perspective(900px) translateY(-8px) rotateX(' + (ny * -6).toFixed(2) + 'deg) rotateY(' + (nx * 8).toFixed(2) + 'deg)';
        card.style.setProperty('--gx', (nx * 100 + 50) + '%');
        card.style.setProperty('--gy', (ny * 100 + 50) + '%');
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
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
    initScrollTimeline();
    initKinetic();
    initHolo();
    initSpotGlow();
    initGlobalOrbs();
    initParticles();
    initReveal();
    initSceneEnter();
    initTilt();
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
