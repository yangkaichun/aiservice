/* Chinese-page metadata only; not loaded by the EN/JP pages. */
(function () {
  'use strict';
  var node = document.getElementById('zh-page-data');
  if (!node || !/^zh/i.test(document.documentElement.lang)) return;
  var data;
  try { data = JSON.parse(node.textContent); } catch (e) { return; }
  window.PANCAD_I18N = window.PANCAD_I18N || {};
  var dict = window.PANCAD_I18N.zh = window.PANCAD_I18N.zh || {};
  dict.meta_title = data.title;
  dict.meta_desc = data.description;
  /* Mobile already uses the poster in CSS: do not download a hidden video. */
  var video = document.getElementById('heroVideo');
  if (video) {
    if (window.matchMedia('(max-width:768px), (prefers-reduced-motion:reduce)').matches) {
      video.remove();
    } else {
      video.muted = true;
      video.autoplay = true;
      video.querySelectorAll('source[data-src]').forEach(function (source) {
        source.src = source.getAttribute('data-src');
      });
      video.load();
    }
  }
})();
