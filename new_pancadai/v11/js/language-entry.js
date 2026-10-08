/* Homepage entry: use the browser's current primary language on every visit. */
(function () {
  'use strict';
  var current = new URL(window.location.href);
  var explicit = current.searchParams.get('lang');
  function supported(value) { return value === 'zh' || value === 'en' || value === 'ja'; }

  /* A deliberate Chinese selection always takes precedence. */
  if (explicit === 'zh') return;

  var preferred = (navigator.languages && navigator.languages[0]) || navigator.language || '';
  var notice = window.PANCAD_COMPANY_NOTICE;
  var chinese = /^zh(?:[-_]|$)/i.test(preferred);
  function route(now) {
    if (chinese && notice && notice.chineseEntryDuringNotice && window.pancadCompanyNoticeActive(now)) return;
    var language = /^ja(?:[-_]|$)/i.test(preferred) ? 'ja' : 'en';
    var destination = new URL(language === 'ja' ? 'jp/' : 'en/', current);
    if (supported(explicit)) current.searchParams.delete('lang');
    destination.search = current.search;
    destination.hash = current.hash;
    window.location.replace(destination.href);
  }
  if (chinese && notice && notice.enabled && notice.chineseEntryDuringNotice) {
    var controller = new AbortController();
    var timeout = setTimeout(function () { controller.abort(); }, 1200);
    fetch(new URL('js/company-notice-config.js', current), {method: 'HEAD', cache: 'no-store', signal: controller.signal})
      .then(function (response) {
        var serverDate = Date.parse(response.headers.get('Date'));
        var age = Number(response.headers.get('Age') || 0);
        route(response.ok && Number.isFinite(serverDate) ? serverDate + (Number.isFinite(age) && age > 0 ? age * 1000 : 0) : Date.now());
      })
      .catch(function () { route(Date.now()); })
      .finally(function () { clearTimeout(timeout); });
  } else route(Date.now());
})();
