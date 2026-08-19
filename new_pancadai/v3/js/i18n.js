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
    var saved = null;
    try { saved = localStorage.getItem(LANG_KEY); } catch (e) {}
    if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
    var nav = (navigator.language || navigator.userLanguage || 'zh-TW').toLowerCase();
    if (nav.indexOf('zh') === 0) return 'zh';
    if (nav.indexOf('ja') === 0) return 'ja';
    return 'en';
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
    if (btn) btn.innerHTML = '<i class="bi bi-globe2"></i> ' + NAMES[lang];
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    /* 通知外部（背景池切換等） */
    try { window.dispatchEvent(new CustomEvent('langchange')); } catch (e) {}
  }

  function current() { return document.documentElement.lang || detect(); }

  function init() {
    apply(detect());
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      b.addEventListener('click', function () {
        apply(b.getAttribute('data-lang'));
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
