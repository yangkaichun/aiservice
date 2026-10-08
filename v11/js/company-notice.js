(function () {
  'use strict';
  if (!/^zh(?:-|$)/i.test(document.documentElement.lang)) return;
  var notice = window.PANCAD_COMPANY_NOTICE;
  if (!notice || !window.pancadCompanyNoticeActive) return;
  var root = new URL('../', document.currentScript.src);
  var key = 'pancad-company-notice-' + notice.id + '-v' + notice.version + '-' + (notice.startsAt || 'preview');
  var clockAt = Date.now();
  var monotonicAt = performance.now();
  var acknowledged = false;
  var dialog, launcher, previousFocus, timer, cookieObserver;
  var onStatement = Boolean(document.querySelector('[data-company-statement]'));
  function now() { return clockAt + performance.now() - monotonicAt; }
  function seen() {
    if (acknowledged) return true;
    try { return sessionStorage.getItem(key) === 'seen'; } catch (error) { return false; }
  }
  function remember() {
    acknowledged = true;
    try { sessionStorage.setItem(key, 'seen'); } catch (error) { /* Closing still works if storage is unavailable. */ }
  }
  async function syncClock() {
    var controller = new AbortController();
    var timeout = setTimeout(function () { controller.abort(); }, 1200);
    try {
      var response = await fetch(new URL('js/company-notice-config.js', root), {
        method: 'HEAD', cache: 'no-store', signal: controller.signal
      });
      var date = Date.parse(response.headers.get('Date'));
      var age = Number(response.headers.get('Age') || 0);
      if (response.ok && Number.isFinite(date)) {
        clockAt = date + (Number.isFinite(age) && age > 0 ? age * 1000 : 0);
        monotonicAt = performance.now();
      }
    } catch (error) { /* Static mirrors/offline previews can fall back to the device clock. */ }
    finally { clearTimeout(timeout); }
  }
  function cookiePending() {
    var banner = document.getElementById('pancad-cookie-banner');
    return banner && !banner.hidden;
  }
  function updateLauncher() {
    if (launcher) launcher.hidden = onStatement || !window.pancadCompanyNoticeActive(now()) || Boolean(dialog && dialog.open) || Boolean(cookiePending());
  }
  function close(acknowledged) {
    if (acknowledged) remember();
    if (dialog && dialog.open) dialog.close();
    document.documentElement.removeAttribute('data-company-notice-open');
    updateLauncher();
    if (cookiePending()) {
      document.querySelector('[data-cookie-action="reject"]').focus({preventScroll: true});
    } else if (previousFocus && previousFocus !== document.body && previousFocus.isConnected) {
      previousFocus.focus({preventScroll: true});
    } else if (launcher && !launcher.hidden) launcher.focus({preventScroll: true});
  }
  function open() {
    if (!window.pancadCompanyNoticeActive(now())) return;
    if (typeof dialog.showModal !== 'function') {
      location.href = new URL(notice.statementPath, root).href;
      return;
    }
    previousFocus = document.activeElement;
    dialog.showModal();
    document.documentElement.setAttribute('data-company-notice-open', '');
    dialog.querySelector('#pancad-notice-title').focus({preventScroll: true});
    updateLauncher();
  }
  function build() {
    if (dialog) return;
    dialog = document.createElement('dialog');
    dialog.className = 'pancad-notice-dialog';
    dialog.id = 'pancad-company-notice';
    dialog.setAttribute('aria-labelledby', 'pancad-notice-title');
    dialog.setAttribute('aria-describedby', 'pancad-notice-intro');
    dialog.innerHTML = '<div class="pancad-notice-inner">' +
      '<div class="pancad-notice-top"><img class="pancad-notice-logo" alt="PanCAD.ai" width="156" height="20">' +
      '<button type="button" class="pancad-notice-close" aria-label="關閉資安提醒">×</button></div>' +
      '<p class="pancad-notice-eyebrow">仲智數位健康・公司公告</p>' +
      '<h2 id="pancad-notice-title" tabindex="-1">重要資安提醒</h2>' +
      '<p class="pancad-notice-subtitle">請留意冒用本公司名義的釣魚郵件</p>' +
      '<p class="pancad-notice-intro" id="pancad-notice-intro">近期有不明人士冒用本公司及人員名義寄送釣魚郵件，誘導收件者點擊連結並加入不明 LINE 群組。經初步查核，可疑郵件由外部第三方帳號寄送，並非由本公司電子郵件帳號寄出。</p>' +
      '<ul class="pancad-notice-reminders"><li><strong>勿點擊連結、勿加入不明群組、勿回覆或提供資料。</strong></li>' +
      '<li>以本公司或人員名義寄送，寄件地址卻非正式網域 <strong>@pancad.ai</strong> 的郵件，請提高警覺。</li>' +
      '<li>對訊息有疑慮時，請透過您與本公司的<strong>既有聯絡窗口</strong>確認。</li></ul>' +
      '<p class="pancad-notice-confirm">本公司不會以不明個人電子郵件帳號要求合作夥伴加入「公司內部 LINE 群組」，或提供敏感資訊。</p>' +
      '<div class="pancad-notice-actions"><a class="pancad-notice-button" data-notice-statement>閱讀完整聲明</a>' +
      '<button type="button" class="pancad-notice-button pancad-notice-button-secondary" data-notice-dismiss>知道了，繼續瀏覽</button></div>' +
      '<a class="pancad-notice-pdf" download>下載原始聲明（PDF）</a></div>';
    dialog.querySelector('img').src = new URL('assets/pancad-ai-logo.svg', root).href;
    dialog.querySelector('[data-notice-statement]').href = new URL(notice.statementPath, root).href;
    dialog.querySelector('.pancad-notice-pdf').href = new URL(notice.pdfPath, root).href;
    launcher = document.createElement('button');
    launcher.type = 'button';
    launcher.className = 'pancad-notice-launcher';
    launcher.textContent = '重要資安提醒';
    launcher.setAttribute('aria-haspopup', 'dialog');
    launcher.setAttribute('aria-controls', dialog.id);
    launcher.hidden = true;
    document.body.append(dialog, launcher);
    launcher.addEventListener('click', open);
    dialog.querySelector('.pancad-notice-close').addEventListener('click', function () { close(true); });
    dialog.querySelector('[data-notice-dismiss]').addEventListener('click', function () { close(true); });
    dialog.querySelector('[data-notice-statement]').addEventListener('click', function () { close(true); });
    dialog.addEventListener('keydown', function (event) {
      if (event.key !== 'Tab') return;
      var controls = dialog.querySelectorAll('button:not([disabled]), a[href]');
      var first = controls[0], last = controls[controls.length - 1];
      var focus = document.activeElement;
      if (event.shiftKey && (focus === first || focus.id === 'pancad-notice-title')) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (focus === last || focus.id === 'pancad-notice-title')) {
        event.preventDefault(); first.focus();
      }
    });
    dialog.addEventListener('cancel', function (event) { event.preventDefault(); close(true); });
    dialog.addEventListener('close', function () { document.documentElement.removeAttribute('data-company-notice-open'); updateLauncher(); });
    var banner = document.getElementById('pancad-cookie-banner');
    if (banner) {
      cookieObserver = new MutationObserver(updateLauncher);
      cookieObserver.observe(banner, {attributes: true, attributeFilter: ['hidden']});
    }
  }
  function updatePeriod() {
    var period = document.querySelector('[data-notice-period]');
    if (!period) return;
    if (!notice.enabled) { period.textContent = '公告預覽｜正式發布日起一個曆月'; return; }
    var formatter = new Intl.DateTimeFormat('zh-TW', {timeZone: 'Asia/Taipei', dateStyle: 'medium', timeStyle: 'short', hour12: false});
    var start = Date.parse(notice.startsAt), end = Date.parse(notice.endsAt);
    if (Number.isFinite(start) && Number.isFinite(end)) {
      period.textContent = '公告期間：' + formatter.format(start) + ' 至 ' + formatter.format(end) + '（台北時間）' +
        (now() >= end ? '｜公告期間已結束，聲明留存供查閱。' : '');
    }
  }
  function refresh() {
    clearTimeout(timer);
    updatePeriod();
    var active = window.pancadCompanyNoticeActive(now());
    if (active) {
      build();
      if (!seen() && !onStatement && !dialog.open) open();
      updateLauncher();
    } else if (dialog) {
      if (dialog.open) close(false);
      launcher.hidden = true;
    }
    // Recompute while the page stays open, including an exact end boundary.
    var end = Date.parse(notice.endsAt), start = Date.parse(notice.startsAt);
    var boundary = active ? end : start;
    var delay = Number.isFinite(boundary) && boundary > now() ? Math.min(60000, Math.max(1, boundary - now())) : 60000;
    timer = setTimeout(refresh, delay);
  }
  async function init() {
    if (notice.enabled) await syncClock();
    refresh();
    document.addEventListener('visibilitychange', async function () {
      if (!document.hidden) { if (notice.enabled) await syncClock(); refresh(); }
    });
    window.addEventListener('pageshow', async function (event) {
      if (event.persisted) { if (notice.enabled) await syncClock(); refresh(); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
