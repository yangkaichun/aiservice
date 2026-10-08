/* Publication settings: enable and set both ISO timestamps when this notice is deployed. */
(function () {
  'use strict';
  window.PANCAD_COMPANY_NOTICE = Object.freeze({
    id: 'security-20261008',
    version: 1,
    enabled: true,
    startsAt: '2026-10-08T14:44:00+08:00',
    endsAt: '2026-11-08T14:44:00+08:00',
    previewOnLocalhost: false,
    chineseEntryDuringNotice: true,
    statementPath: 'company-notice-20261008.html',
    pdfPath: 'notices/company-security-notice-20261008.pdf'
  });
  window.pancadCompanyNoticeActive = function (now) {
    var notice = window.PANCAD_COMPANY_NOTICE;
    if (!notice.enabled) {
      return notice.previewOnLocalhost && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
    }
    var start = Date.parse(notice.startsAt);
    var end = Date.parse(notice.endsAt);
    return Number.isFinite(start) && Number.isFinite(end) && end > start && now >= start && now < end;
  };
})();
