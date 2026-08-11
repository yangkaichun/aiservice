/* ============================================================
   pancad.ai v3 — 共用 JS
   導航 / 語言切換（掛接 i18n.js）/ reveal 動效 / 敘事捲動
   CT 互動滑桿 / 捲動進度條 / 數字跑馬燈
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 0. INTRO 進場特效 ---------- */
  var intro = document.getElementById('intro');
  if (intro) {
    var introEntered = false;
    function finishIntro() {
      if (introEntered) return;
      introEntered = true;
      intro.classList.add('done');
      document.body.classList.remove('no-scroll');
      setTimeout(function () { if (intro.parentNode) intro.parentNode.removeChild(intro); }, 1100);
    }
    // 頁面載入期間鎖滾動（intro 結束才放開）
    document.body.classList.add('no-scroll');
    // 生成 intro 粒子
    var introParticles = document.getElementById('introParticles');
    if (introParticles) {
      for (var ip = 0; ip < 22; ip++) {
        var p2 = document.createElement('span');
        p2.className = 'particle';
        var sz = 3 + Math.random() * 6;
        p2.style.width = sz + 'px';
        p2.style.height = sz + 'px';
        p2.style.left = (Math.random() * 100) + '%';
        p2.style.top = (20 + Math.random() * 80) + '%';
        p2.style.animationDuration = (5 + Math.random() * 9) + 's';
        p2.style.animationDelay = (Math.random() * 4) + 's';
        introParticles.appendChild(p2);
      }
    }
    // 無障礙：減少動態偏好直接進入
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finishIntro();
    } else {
      // 3 秒後自動進入
      setTimeout(finishIntro, 3200);
      // 下滑 / 觸控上滑 / PageDown / 空白 → 提早進入
      window.addEventListener('wheel', function (e) { if (e.deltaY > 8) finishIntro(); }, { passive: true });
      window.addEventListener('touchstart', function (e) {
        var ty = e.touches[0].clientY;
        window.addEventListener('touchmove', function (ev) {
          if (ev.touches[0].clientY < ty - 24) finishIntro();
        }, { passive: true, once: true });
      }, { passive: true });
      window.addEventListener('keydown', function (e) {
        if (e.key === 'PageDown' || e.key === 'ArrowDown' || e.key === ' ') finishIntro();
      });
      var skipBtn = document.getElementById('introSkip');
      if (skipBtn) skipBtn.addEventListener('click', finishIntro);
    }
  }

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
  var revealEls = document.querySelectorAll('.reveal, .reveal-l, .reveal-r');
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
    var divider = slider.querySelector('.divider');
    var dragging = false;

    function setPos(clientX) {
      var r = slider.getBoundingClientRect();
      var pct = ((clientX - r.left) / r.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      // 遮罩方式：圖片不縮放，clip-path 控制顯示範圍
      topLayer.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
      handle.style.left = pct + '%';
      if (divider) divider.style.left = pct + '%';
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

  /* ---------- 9. 動態光影系統 ---------- */
  // 9.1 滑鼠追蹤光暈（更新 CSS 變數，rAF 節流）
  var rootEl = document.documentElement;
  var glow = document.querySelector('.spot-glow');
  var mousemoveRaf = null;
  window.addEventListener('mousemove', function (e) {
    if (mousemoveRaf) return;
    mousemoveRaf = requestAnimationFrame(function () {
      var x = (e.clientX / window.innerWidth) * 100;
      var y = (e.clientY / window.innerHeight) * 100;
      rootEl.style.setProperty('--mx', x + '%');
      rootEl.style.setProperty('--my', y + '%');
      if (glow && !glow.classList.contains('on')) glow.classList.add('on');
      mousemoveRaf = null;
    });
  }, { passive: true });
  // 觸控裝置不顯示追蹤光暈
  if (window.matchMedia('(hover: none)').matches && glow) {
    glow.style.display = 'none';
  }

  // 9.2 Hero 金色粒子生成
  var particlesBox = document.querySelector('.hero-particles');
  if (particlesBox) {
    for (var i = 0; i < 26; i++) {
      var p = document.createElement('span');
      p.className = 'particle';
      var size = 3 + Math.random() * 6;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.left = (Math.random() * 100) + '%';
      p.style.top = (30 + Math.random() * 70) + '%';
      p.style.animationDuration = (5 + Math.random() * 9) + 's';
      p.style.animationDelay = (Math.random() * 7) + 's';
      particlesBox.appendChild(p);
    }
  }

  // 9.3 分流卡 3D 傾斜 + 光暈跟隨（滑鼠）
  var gateCards = document.querySelectorAll('.gate-card');
  if (gateCards.length && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    gateCards.forEach(function (card) {
      // 加入光暈跟隨元素
      var follow = document.createElement('span');
      follow.className = 'glow-follow';
      card.appendChild(follow);

      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        var rx = (0.5 - py) * 8;
        var ry = (px - 0.5) * 10;
        card.style.transform = 'perspective(1000px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-6px)';
        follow.style.setProperty('--gx', (px * 100) + '%');
        follow.style.setProperty('--gy', (py * 100) + '%');
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  // 9.4 視差滾動（chapter / page-hero 背景緩慢位移；hero-bg 已有 kenburns 不動）
  var parallaxEls = document.querySelectorAll('.chapter .chapter-bg, .page-hero .bg');
  if (parallaxEls.length && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    var paf = null;
    window.addEventListener('scroll', function () {
      if (paf) return;
      paf = requestAnimationFrame(function () {
        parallaxEls.forEach(function (el) {
          var r = el.parentElement.getBoundingClientRect();
          if (r.bottom < -100 || r.top > window.innerHeight + 100) return;
          var rel = (r.top + r.height / 2 - window.innerHeight / 2);
          el.style.transform = 'scale(1.12) translateY(' + (rel * -0.07) + 'px)';
        });
        paf = null;
      });
    }, { passive: true });
  }

  // 9.5 Hero 背景：語言池分流（en=多元種族 30 張；zh/ja=台灣 7 張）
  //      ＋依網速漸進解析度（slow-2g/2g=小圖、3g=原圖、4g/wifi=HD 5120）
  //      ＋9 秒停留隨機輪換（預載完成才淡入切換）
  var heroBg = document.querySelector('.hero-bg');
  function heroPool() {
    if (document.documentElement.lang === 'en') {
      var arr = [];
      for (var i = 1; i <= 30; i++) {
        var n = (i < 10 ? '0' : '') + i;
        arr.push({ src: 'assets/hero_intl_' + n + '_safe.jpg', hd: 'assets/hero_intl_' + n + '_safe_hd.webp' });
      }
      return arr;
    }
    return [
      { src: 'assets/hero_sun_bike_safe.jpg', hd: 'assets/hero_sun_bike_safe_hd.webp' },
      { src: 'assets/hero_sun_yoga_safe.jpg', hd: 'assets/hero_sun_yoga_safe_hd.webp' },
      { src: 'assets/hero_sun_picnic_safe.jpg', hd: 'assets/hero_sun_picnic_safe_hd.webp' },
      { src: 'assets/hero_sun_coffee_safe.jpg', hd: 'assets/hero_sun_coffee_safe_hd.webp' },
      { src: 'assets/hero_sun_kayak_safe.jpg', hd: 'assets/hero_sun_kayak_safe_hd.webp' },
      { src: 'assets/hero_sun_bridge_safe.jpg', hd: 'assets/hero_sun_bridge_safe_hd.webp' },
      { src: 'assets/hero_sun_forest_safe.jpg', hd: 'assets/hero_sun_forest_safe_hd.webp' }
    ];
  }
  if (heroBg) {
    var heroPick = heroPool()[Math.floor(Math.random() * heroPool().length)];
    var conn = navigator.connection || {};
    var et = (conn.effectiveType || '4g').toLowerCase();
    var wantMed = et !== 'slow-2g' && et !== '2g';
    var wantHd = et === '4g' || et === 'wifi' || et.indexOf('ethernet') === 0 || !conn.effectiveType;

    function restartKenburns() {
      // 重啟背景縮放動畫（每張新圖都重新 Ken Burns）
      heroBg.style.animation = 'none';
      void heroBg.offsetWidth; /* reflow 強制重啟 */
      heroBg.style.animation = '';
    }

    function showHeroBg(cand) {
      if (!wantMed) {
        // 慢速網路：直接顯示小圖（CSS 首幀已載入）
        heroBg.style.backgroundImage = "url('" + cand.src + "')";
        restartKenburns();
        return;
      }
      var hImg = new Image();
      hImg.onload = function () {
        heroBg.style.transition = 'opacity 1.2s ease';
        heroBg.style.opacity = '0';
        setTimeout(function () {
          heroBg.style.backgroundImage = "url('" + cand.src + "')";
          heroBg.style.opacity = '1';
          restartKenburns();
        }, 180);
        if (wantHd) {
          var hdImg = new Image();
          hdImg.onload = function () {
            heroBg.style.opacity = '0';
            setTimeout(function () {
              heroBg.style.backgroundImage = "url('" + cand.hd + "')";
              heroBg.style.opacity = '1';
              restartKenburns();
            }, 200);
          };
          hdImg.src = cand.hd;
        }
      };
      hImg.src = cand.src;
    }
    showHeroBg(heroPick);

    // 語言切換 → 立即從新語言池重選背景
    window.addEventListener('langchange', function () {
      var pool = heroPool();
      heroPick = pool[Math.floor(Math.random() * pool.length)];
      showHeroBg(heroPick);
    });

    // 停留輪換：每 9s 隨機換一張，預載完成（onload）才淡入淡出切換
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) {
      setInterval(function () {
        var pool = heroPool();
        var next = pool[Math.floor(Math.random() * pool.length)];
        if (next === heroPick) {
          next = pool[(pool.indexOf(heroPick) + 1) % pool.length];
        }
        var pre = new Image();
        pre.onload = function () {
          heroBg.style.transition = 'opacity .9s ease';
          heroBg.style.opacity = '0';
          setTimeout(function () {
            heroBg.style.backgroundImage = "url('" + next.hd + "')";
            heroBg.style.opacity = '1';
            heroPick = next;
            restartKenburns();
          }, 320);
        };
        pre.onerror = function () {
          var fb = new Image();
          fb.onload = function () {
            heroBg.style.opacity = '0';
            setTimeout(function () {
              heroBg.style.backgroundImage = "url('" + next.src + "')";
              heroBg.style.opacity = '1';
              heroPick = next;
              restartKenburns();
            }, 320);
          };
          fb.src = next.src;
        };
        pre.src = next.hd;
      }, 9000);
    }
  }

  /* ---------- 8. 表單提交（GAS 後端；未部署時 mailto 備援） ---------- */
  var forms = document.querySelectorAll('form[data-form]');
  forms.forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = f.querySelector('button[type="submit"]');
      var origLabel = btn ? btn.textContent : '';
      if (btn) {
        btn.disabled = true;
        btn.textContent = btn.getAttribute('data-sending') || '送出中…';
      }
      var name = (f.querySelector('#name') || {}).value || '';
      var email = (f.querySelector('#email') || {}).value || '';
      var topic = (f.querySelector('#topic') || {}).value || '';
      var msg = (f.querySelector('#message') || {}).value || '';
      var payload = {
        name: name, email: email, topic: topic,
        subject: '[' + topic + '] ' + name, message: msg
      };
      var gasUrl = (window.PANCAD_FORM && window.PANCAD_FORM.GAS_API_URL) || '';
      if (gasUrl) {
        // GAS 後端（text/plain 避免 CORS preflight）
        fetch(gasUrl, {
          method: 'POST',
          body: JSON.stringify(payload)
        }).then(function (r) { return r.json(); }).then(function (res) {
          if (res.ok) {
            if (btn) { btn.textContent = btn.getAttribute('data-done') || '✓ 已送出'; btn.disabled = false; }
            f.reset();
            setTimeout(function () { if (btn) btn.textContent = origLabel; }, 3000);
          } else {
            throw new Error(res.error || 'GAS error');
          }
        }).catch(function () {
          if (btn) { btn.textContent = origLabel; btn.disabled = false; }
          alert('送出失敗，請稍後再試或直接 Email contact@pancad.ai');
        });
      } else {
        // mailto 備援（未部署 GAS 時）
        var mailto = 'mailto:contact@pancad.ai?subject=' +
          encodeURIComponent('[' + topic + '] ' + name) +
          '&body=' + encodeURIComponent(msg);
        window.location.href = mailto;
        setTimeout(function () {
          if (btn) { btn.disabled = false; btn.textContent = origLabel; }
        }, 1500);
      }
    });
  });
})();
