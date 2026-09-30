(function () {
  'use strict';
  var form = document.getElementById('rsnaDemoForm');
  if (!form) return;
  var status = document.getElementById('rsnaFormStatus');
  var humanState = document.getElementById('rsnaHumanState');
  var button = document.getElementById('rsnaSubmit');
  var localPreview = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  var siteKey = '';
  var widgetId = null;

  function show(message, kind) {
    status.textContent = message;
    status.className = 'rsna-form-status ' + (kind || '');
  }

  async function loadConfig() {
    if (localPreview) {
      // Cloudflare's public test key only works for interface testing.
      siteKey = '1x00000000000000000000AA';
      show('Local preview: this form will not send an email.', '');
      return;
    }
    try {
      var response = await fetch('/api/rsna-config', {cache: 'no-store'});
      if (!response.ok) throw new Error('Form is not configured yet.');
      var config = await response.json();
      if (!config.siteKey) throw new Error('Human verification is not configured yet.');
      siteKey = config.siteKey;
    } catch (error) {
      show('Meeting requests are not available yet. Please email info@pancad.ai.', 'error');
      button.disabled = true;
    }
  }

  function renderVerification() {
    if (!siteKey) return;
    if (!window.turnstile || typeof window.turnstile.render !== 'function') {
      setTimeout(renderVerification, 150);
      return;
    }
    widgetId = window.turnstile.render('#rsnaTurnstile', {
      sitekey: siteKey,
      theme: 'light',
      callback: function () {
        humanState.textContent = localPreview ? 'Human verification complete (test mode).' : 'Human verification complete.';
        if (status.classList.contains('error')) show('', '');
      },
      'expired-callback': function () { humanState.textContent = 'Verification expired. Please verify again.'; },
      'error-callback': function () { humanState.textContent = 'Verification could not load. Please refresh this page.'; }
    });
  }

  function value(name) {
    return String(form.elements.namedItem(name).value || '').trim();
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    show('', '');
    if (!form.reportValidity()) return;
    var interests = Array.from(form.querySelectorAll('input[name="interests"]:checked')).map(function (item) { return item.value; });
    if (!interests.length) {
      show('Choose at least one topic you would like to discuss.', 'error');
      form.querySelector('.rsna-checks').scrollIntoView({behavior:'smooth',block:'center'});
      return;
    }
    if ((value('role') === 'Other' || interests.includes('Other')) && !value('otherDetails')) {
      show('Please describe your role or topic in the “Other” field.', 'error');
      form.elements.namedItem('otherDetails').focus();
      return;
    }
    if (value('website')) return;
    var token = window.turnstile && widgetId !== null ? window.turnstile.getResponse(widgetId) : '';
    if (!token) {
      show('Please complete the human verification.', 'error');
      return;
    }
    if (localPreview) {
      show('Preview validated. No email was sent from this local preview.', 'success');
      return;
    }
    var payload = {
      name: value('name'), email: value('email'), organization: value('organization'),
      country: value('country'), jobTitle: value('jobTitle'), phone: value('phone'),
      role: value('role'), interests: interests, day: value('day'), time: value('time'),
      otherDetails: value('otherDetails'),
      message: value('message'), consent: form.elements.namedItem('consent').checked,
      website: value('website'), turnstileToken: token
    };
    button.disabled = true;
    show('Sending your meeting request…', '');
    try {
      var response = await fetch('/api/rsna-demo', {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      });
      var result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || 'Unable to send the request.');
      form.reset();
      window.turnstile.reset(widgetId);
      show('Thank you. Your request was sent to PanCAD.ai. We will reply by email to confirm a meeting time.', 'success');
    } catch (error) {
      window.turnstile.reset(widgetId);
      show(error.message + ' You can also email info@pancad.ai.', 'error');
    } finally {
      button.disabled = false;
    }
  });

  loadConfig().then(renderVerification);
})();
