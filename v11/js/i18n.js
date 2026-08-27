/* ============================================================
   PANCREASaver 助胰見® — 多語言框架 (i18n)
   偵測：navigator.language（瀏覽器/OS 語言）→ localStorage 記憶
   切換：data-lang 按鈕即時套用，不需重新載入
   字典：window.PANCAD_I18N = { zh: {...}, en: {...}, ja: {...} }
   標記：data-i18n（文字）/ data-i18n-html（含 HTML）/ data-i18n-ph（placeholder）
   ============================================================ */
(function () {
  'use strict';
  var LANG_KEY = 'pancad-lang';
  var SUPPORTED = ['zh', 'en', 'ja'];
  var NAMES = { zh: '繁體中文', en: 'English', ja: '日本語' };

  function detect() {
    /* v11.2.44：主站強制中文——路徑無 en/jp 段即 zh（不受 localStorage/瀏覽器語言影響；
       zh-only 深耕計畫連結依 html[lang=zh-TW] 顯示——避免被舊 localStorage 切成英文而隱藏）
       子目錄語言版優先：掃描路徑任一段為 en/jp（支援 GH Pages 子路徑 /new_pancadai/v11/en/ 與 CF 根域 /en/） */
    var p = (window.location.pathname || '');
    var segs = p.split('/').filter(Boolean);
    var hasLang = false;
    for (var k = 0; k < segs.length; k++) {
      if (segs[k] === 'en') { return 'en'; }
      if (segs[k] === 'jp') { return 'ja'; }
    }
    return 'zh'; // 主站＝中文版（英文/日文使用者請用右上角語言切換）
  }

  /* v11.2.44：語言切換跳轉（v4——一律導引到 pancad.ai 語言首頁絕對 URL，使用者指定） */
  function langRedirect(target) {
    var p = window.location.pathname || '';
    var segs = p.split('/').filter(Boolean);
    var here = '';
    for (var k = 0; k < segs.length; k++) {
      if (segs[k] === 'en' || segs[k] === 'jp') { here = segs[k]; segs.splice(k, 1); break; }
    }
    var hereLang = (here === 'jp') ? 'ja' : here; // 目錄名 jp → 語言碼 ja
    if (hereLang === target) return null; // 已在目標語言版（原地）
    if (here === '' && target === 'zh') return null; // 主站點中文＝原地
    if (target === 'en') return 'https://www.pancad.ai/en/';
    if (target === 'ja') return 'https://www.pancad.ai/jp/';
    return 'https://www.pancad.ai/';
  }

  function apply(lang) {
    var dict = (window.PANCAD_I18N || {})[lang] || {};
    document.documentElement.lang = lang === 'zh' ? 'zh-TW' : lang;
    if (dict.meta_title) document.title = dict.meta_title;
    var md = document.querySelector('meta[name="description"]');
    if (md && dict.meta_desc) md.setAttribute('content', dict.meta_desc);
    var og = document.querySelector('meta[property="og:title"]');
    if (og && dict.meta_title) og.setAttribute('content', dict.meta_title);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (dict[k] !== undefined) el.textContent = dict[k];
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-html');
      if (dict[k] !== undefined) el.innerHTML = dict[k];
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-ph');
      if (dict[k] !== undefined) el.setAttribute('placeholder', dict[k]);
    });
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    });
    var btn = document.getElementById('langBtn');
    if (btn) btn.textContent = NAMES[lang] + ' ▾';
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    /* 通知外部（背景池切換等） */
    try { window.dispatchEvent(new CustomEvent('langchange')); } catch (e) {}
  }

  function current() { return document.documentElement.lang || detect(); }

  function init() {
    apply(detect());
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      b.addEventListener('click', function () {
        var target = b.getAttribute('data-lang');
        var redir = langRedirect(target);
        if (redir) { window.location.href = redir; return; }
        apply(target);
        var menu = document.getElementById('langMenu');
        if (menu) menu.classList.remove('open');
      });
    });
    var btn = document.getElementById('langBtn');
    var menu = document.getElementById('langMenu');
    if (btn && menu) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        menu.classList.toggle('open');
      });
      document.addEventListener('click', function () { menu.classList.remove('open'); });
    }
  }

  window.PANCAD_I18N = window.PANCAD_I18N || {};
  window.PANCAD_LANG = { apply: apply, current: current };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
