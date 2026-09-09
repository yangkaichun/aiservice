/* Homepage entry: use the browser's current primary language on every visit. */
(function () {
  'use strict';
  var current = new URL(window.location.href);
  var explicit = current.searchParams.get('lang');
  function supported(value) { return value === 'zh' || value === 'en' || value === 'ja'; }

  /* A deliberate ?lang=zh is the only opt-out from automatic detection. */
  if (explicit === 'zh') return;

  var preferred = (navigator.languages && navigator.languages[0]) || navigator.language || '';
  var language = /^ja(?:[-_]|$)/i.test(preferred) ? 'ja' : 'en';
  var destination = new URL(language === 'ja' ? 'jp/' : 'en/', current);
  if (supported(explicit)) current.searchParams.delete('lang');
  destination.search = current.search;
  destination.hash = current.hash;
  window.location.replace(destination.href);
})();
