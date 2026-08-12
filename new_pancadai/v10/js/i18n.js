/* PANCREASaver 官網 v10 — i18n 框架（navigator 偵測 + localStorage + 即時切換） */
(function () {
  'use strict';
  var LS_KEY = 'pancad-lang-v10';
  var SUPPORTED = ['zh', 'en', 'ja'];
  var current = 'zh';

  function detect() {
    var saved = null;
    try { saved = localStorage.getItem(LS_KEY); } catch (e) {}
    if (saved && SUPPORTED.indexOf(saved) > -1) return saved;
    var nav = (navigator.language || 'zh-TW').toLowerCase();
    if (nav.indexOf('zh') > -1) return 'zh';
    if (nav.indexOf('ja') > -1) return 'ja';
    return 'en';
  }

  function apply() {
    var dict = window.PANCAD_I18N || {};
    var d = dict[current] || dict.zh || {};
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i], k = el.getAttribute('data-i18n');
      if (d[k] !== undefined) el.textContent = d[k];
    }
    els = document.querySelectorAll('[data-i18n-html]');
    for (i = 0; i < els.length; i++) {
      var el2 = els[i], k2 = el2.getAttribute('data-i18n-html');
      if (d[k2] !== undefined) el2.innerHTML = d[k2];
    }
    els = document.querySelectorAll('[data-i18n-ph]');
    for (i = 0; i < els.length; i++) {
      var el3 = els[i], k3 = el3.getAttribute('data-i18n-ph');
      if (d[k3] !== undefined) el3.setAttribute('placeholder', d[k3]);
    }
    document.documentElement.lang = current === 'zh' ? 'zh-TW' : (current === 'ja' ? 'ja' : 'en');
    var btns = document.querySelectorAll('.lang-switch button[data-lang]');
    for (i = 0; i < btns.length; i++) {
      btns[i].classList.toggle('on', btns[i].getAttribute('data-lang') === current);
    }
    els = document.querySelectorAll('[data-zh-only]');
    for (i = 0; i < els.length; i++) els[i].style.display = current === 'zh' ? '' : 'none';
    if (typeof window.onLangChange === 'function') window.onLangChange(current);
    document.dispatchEvent(new CustomEvent('pancad:lang', { detail: current }));
  }

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) return;
    current = lang;
    try { localStorage.setItem(LS_KEY, lang); } catch (e) {}
    apply();
  }

  window.PANCAD_LANG = {
    get: function () { return current; },
    set: setLang,
    applyAll: apply
  };
  current = detect();
  document.addEventListener('DOMContentLoaded', apply);
  window.addEventListener('load', function () { if (typeof window.onLangChange === 'function') window.onLangChange(current); });
})();
