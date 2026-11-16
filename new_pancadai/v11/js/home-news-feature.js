/* Temporary Chinese homepage coverage. The news archive remains permanent. */
(function () {
  'use strict';
  var card = document.getElementById('home-gbi-91427');
  if (!card || !/^zh(?:-|$)/i.test(document.documentElement.lang)) return;
  var start = Date.parse(card.dataset.startsAt);
  var end = Date.parse(card.dataset.endsAt);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return;
  var clockAt = Date.now();
  var monotonicAt = performance.now();
  var clockUrl = document.currentScript.src;
  var timer;
  function now() { return clockAt + performance.now() - monotonicAt; }
  function refresh() {
    clearTimeout(timer);
    var current = now();
    card.hidden = current < start || current >= end;
    if (current >= end) return;
    var boundary = current < start ? start : end;
    timer = setTimeout(refresh, Math.min(60000, Math.max(1, boundary - current)));
  }
  async function syncClock() {
    clockAt = Date.now();
    monotonicAt = performance.now();
    var controller = new AbortController();
    var timeout = setTimeout(function () { controller.abort(); }, 1500);
    try {
      var response = await fetch(clockUrl, {method: 'HEAD', cache: 'no-store', signal: controller.signal});
      var serverDate = Date.parse(response.headers.get('Date'));
      var age = Number(response.headers.get('Age') || 0);
      if (response.ok && Number.isFinite(serverDate)) {
        clockAt = serverDate + (Number.isFinite(age) && age > 0 ? age * 1000 : 0);
        monotonicAt = performance.now();
      }
    } catch (error) { /* Offline previews use the device clock. */ }
    finally { clearTimeout(timeout); }
  }
  async function update() {
    // Keep a restored page hidden until its clock is checked again.
    card.hidden = true;
    clearTimeout(timer);
    await syncClock();
    refresh();
  }
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) update();
  });
  window.addEventListener('pageshow', function (event) {
    if (event.persisted) update();
  });
  // Keep the initial HTML hidden until the first server-clock check finishes.
  syncClock().then(refresh);
})();
