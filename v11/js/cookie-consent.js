/* PanCAD.ai: optional analytics are loaded only after an affirmative choice. */
(function () {
  'use strict';

  var STORAGE_KEY = 'pancad-cookie-choice-v1';
  var CHOICE_LIFETIME = 180 * 24 * 60 * 60 * 1000;
  var GA_ID = 'G-8DNS20C93N';
  var script = document.currentScript;
  var siteRoot = new URL('../', script.src);
  var parts = location.pathname.split('/');
  var lang = parts.indexOf('jp') !== -1 ? 'ja' : (parts.indexOf('en') !== -1 ? 'en' : 'zh');
  var privacyUrl = new URL(lang === 'zh' ? 'privacy.html' : (lang === 'ja' ? 'jp/privacy.html' : 'en/privacy.html'), siteRoot).href;
  var copy = {
    zh: {
      title: 'Cookie 選擇',
      intro: '必要儲存用於網站安全。經您同意後才啟用 Google Analytics 分析；您可隨時變更選擇。',
      privacy: '隱私權政策', accept: '接受', reject: '拒絕',
      customize: '自訂', save: '儲存選擇', settings: 'Cookie 設定',
      essential: '必要：安全及記住選擇（永遠啟用）',
      analytics: '網站分析：Google Analytics（預設關閉）'
    },
    en: {
      title: 'Your cookie choices',
      intro: 'Essential storage keeps this site secure. With your permission, Google Analytics helps us understand site use. You can change your choice anytime.',
      privacy: 'Privacy Policy', accept: 'Accept', reject: 'Deny',
      customize: 'Customize', save: 'Save choices', settings: 'Cookie settings',
      essential: 'Essential: security and saved choices (always on)',
      analytics: 'Analytics: Google Analytics (off by default)'
    },
    ja: {
      title: 'Cookie の選択',
      intro: '必須の保存機能はサイトの安全性のために使用します。Google Analytics は同意後にのみ有効になり、選択はいつでも変更できます。',
      privacy: 'プライバシーポリシー', accept: '同意', reject: '拒否',
      customize: '詳細', save: '選択を保存', settings: 'Cookie 設定',
      essential: '必須：安全性と選択内容の保存（常に有効）',
      analytics: '分析：Google Analytics（初期設定はオフ）'
    }
  }[lang];
  var analyticsLoaded = false;

  function readChoice() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved && saved.version === 1 && typeof saved.analytics === 'boolean' &&
          Number.isFinite(saved.savedAt) && Date.now() - saved.savedAt < CHOICE_LIFETIME &&
          Date.now() >= saved.savedAt) return saved;
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) { /* Private browsing can disable storage. */ }
    return null;
  }

  function clearAnalyticsCookies() {
    document.cookie.split(';').forEach(function (item) {
      var name = item.trim().split('=')[0];
      if (!/^_ga(?:_|$)/.test(name)) return;
      var domains = [''];
      if (/(^|\.)pancad\.ai$/.test(location.hostname)) domains.push('pancad.ai', '.pancad.ai');
      domains.forEach(function (domain) {
        document.cookie = name + '=; Max-Age=0; Path=/; SameSite=Lax' + (domain ? '; Domain=' + domain : '');
      });
    });
  }

  function loadAnalytics() {
    if (analyticsLoaded) return;
    analyticsLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      ad_storage: 'denied', ad_user_data: 'denied',
      ad_personalization: 'denied', analytics_storage: 'denied'
    });
    window.gtag('consent', 'update', {analytics_storage: 'granted'});
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: CHOICE_LIFETIME / 1000,
      cookie_update: false
    });
    var tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(tag);
  }

  var choice = readChoice();
  if (choice && choice.analytics) loadAnalytics();
  else clearAnalyticsCookies();

  function initBanner() {
    var settings = document.createElement('button');
    settings.type = 'button';
    settings.className = 'pancad-cookie-settings';
    settings.textContent = copy.settings;
    settings.setAttribute('aria-controls', 'pancad-cookie-banner');

    var banner = document.createElement('section');
    banner.id = 'pancad-cookie-banner';
    banner.className = 'pancad-cookie-banner';
    banner.setAttribute('aria-labelledby', 'pancad-cookie-title');
    banner.innerHTML =
      '<div class="pancad-cookie-copy">' +
        '<h2 id="pancad-cookie-title">' + copy.title + '</h2>' +
        '<p>' + copy.intro + ' <a href="' + privacyUrl + '">' + copy.privacy + '</a></p>' +
        '<div class="pancad-cookie-options" hidden>' +
          '<p>' + copy.essential + '</p>' +
          '<label><input type="checkbox" id="pancad-analytics-choice"> ' + copy.analytics + '</label>' +
          '<button type="button" data-cookie-action="save">' + copy.save + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="pancad-cookie-actions">' +
        '<button type="button" data-cookie-action="accept">' + copy.accept + '</button>' +
        '<button type="button" data-cookie-action="reject">' + copy.reject + '</button>' +
        '<button type="button" data-cookie-action="customize">' + copy.customize + '</button>' +
      '</div>';
    document.body.appendChild(settings);
    document.body.appendChild(banner);
    var options = banner.querySelector('.pancad-cookie-options');
    var analyticsBox = banner.querySelector('#pancad-analytics-choice');

    function open() {
      choice = readChoice();
      analyticsBox.checked = Boolean(choice && choice.analytics);
      options.hidden = true;
      banner.hidden = false;
      settings.hidden = true;
      banner.querySelector('[data-cookie-action="reject"]').focus();
    }

    function close() {
      banner.hidden = true;
      settings.hidden = false;
      settings.focus();
    }

    function choose(analytics) {
      var wasLoaded = analyticsLoaded;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({version: 1, analytics: analytics, savedAt: Date.now()}));
      } catch (error) { /* Choice still applies for the current page. */ }
      if (analytics) loadAnalytics();
      else {
        if (window.gtag && wasLoaded) window.gtag('consent', 'update', {analytics_storage: 'denied'});
        clearAnalyticsCookies();
      }
      close();
      if (!analytics && wasLoaded) location.reload(); // Stop the loaded tag after withdrawal.
    }

    settings.addEventListener('click', open);
    banner.addEventListener('click', function (event) {
      var button = event.target.closest('[data-cookie-action]');
      if (!button) return;
      var action = button.getAttribute('data-cookie-action');
      if (action === 'accept') choose(true);
      else if (action === 'reject') choose(false);
      else if (action === 'customize') {
        options.hidden = !options.hidden;
        if (!options.hidden) analyticsBox.focus();
      } else if (action === 'save') choose(analyticsBox.checked);
    });

    if (choice) {
      banner.hidden = true;
      settings.hidden = false;
    } else {
      settings.hidden = true;
      banner.hidden = false;
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initBanner);
  else initBanner();
})();
