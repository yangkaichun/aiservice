/* Homepage entry: explicit choice first, then the browser's primary language. */
(function () {
  'use strict';
  var choiceKey = 'pancad-manual-lang';
  var current = new URL(window.location.href);
  var explicit = current.searchParams.get('lang');
  var choice = null;
  function supported(value) { return value === 'zh' || value === 'en' || value === 'ja'; }

  if (supported(explicit)) {
    choice = explicit;
    try { window.localStorage.setItem(choiceKey, choice); } catch (e) {}
  } else {
    try { choice = window.localStorage.getItem(choiceKey); } catch (e) {}
  }
  if (choice === 'zh') return;

  var preferred = (navigator.languages && navigator.languages[0]) || navigator.language || '';
  var language = supported(choice) ? choice : (/^ja(?:[-_]|$)/i.test(preferred) ? 'ja' : 'en');
  var destination = new URL(language === 'ja' ? 'jp/' : 'en/', current);
  if (supported(explicit)) current.searchParams.delete('lang');
  destination.search = current.search;
  destination.hash = current.hash;
  window.location.replace(destination.href);
})();
