/* PANCREASaver® — privacy-friendly YouTube facade
   The thumbnail is rendered first; the YouTube iframe is created only after
   an explicit keyboard or pointer activation. */
(function () {
  'use strict';

  function loadVideo(host) {
    if (!host || host.classList.contains('is-loaded')) return;
    var id = host.getAttribute('data-youtube-id') || '';
    if (!/^[A-Za-z0-9_-]{6,}$/.test(id)) return;

    var iframe = document.createElement('iframe');
    iframe.className = 'youtube-iframe';
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?rel=0&modestbranding=1&playsinline=1';
    iframe.title = host.getAttribute('data-iframe-title') || 'PANCREASaver introduction video';
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.tabIndex = 0;

    host.innerHTML = '';
    host.appendChild(iframe);
    host.classList.add('is-loaded');
    window.setTimeout(function () { iframe.focus(); }, 0);
  }

  function init() {
    document.querySelectorAll('[data-youtube-id]').forEach(function (host) {
      var button = host.querySelector('.youtube-play');
      if (!button) return;
      button.addEventListener('click', function () { loadVideo(host); });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
