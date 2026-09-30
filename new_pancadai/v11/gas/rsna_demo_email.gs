/**
 * Dedicated RSNA 2026 meeting relay.
 * Deploy as a Google Apps Script web app running as the PanCAD.ai owner.
 * Set Script Property GAS_SHARED_SECRET to the same random value stored in
 * Cloudflare Pages; store the resulting web-app URL in Cloudflare GAS_URL.
 * The Cloudflare Pages Function verifies Turnstile before calling this relay.
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents || '{}');
    var expected = PropertiesService.getScriptProperties().getProperty('GAS_SHARED_SECRET');
    if (!expected || data.sharedSecret !== expected) throw new Error('Unauthorized');
    if (data.source !== 'RSNA 2026 website' || data.consent !== true) throw new Error('Invalid request');
    var text = function (value, limit) {
      return String(value || '').split('').filter(function (c) { return c.charCodeAt(0) >= 32 && c.charCodeAt(0) !== 127; }).join('').trim().slice(0, limit);
    };
    var name = text(data.name, 80);
    var email = text(data.email, 160);
    if (!name || email.indexOf('@') < 1 || email.indexOf('.', email.indexOf('@') + 2) < 0) throw new Error('Invalid contact');
    var topics = Array.isArray(data.interests) ? data.interests.map(function (v) { return text(v, 80); }).join(', ') : '';
    var body = [
      'RSNA 2026 meeting request — Booth 5132',
      '',
      'Name: ' + name,
      'Email: ' + email,
      'Organization: ' + text(data.organization, 120),
      'Country or region: ' + text(data.country, 80),
      'Job title: ' + text(data.jobTitle, 100),
      'Phone: ' + text(data.phone, 40),
      'Visitor role: ' + text(data.role, 80),
      'Topics: ' + topics,
      'Other details: ' + text(data.otherDetails, 160),
      'Preferred day: ' + text(data.day, 20),
      'Preferred time (Chicago CT): ' + text(data.time, 30),
      '',
      'Message:',
      text(data.message, 1500),
      '',
      'Consent to follow-up: Yes',
      'Source: RSNA 2026 website form; Turnstile verified by Cloudflare Pages Function.'
    ].join(String.fromCharCode(10));
    MailApp.sendEmail({
      to: 'info@pancad.ai',
      subject: '[RSNA 2026] Meeting request — ' + name,
      body: body,
      replyTo: email,
      name: 'PanCAD.ai RSNA 2026'
    });
    return ContentService.createTextOutput(JSON.stringify({ok:true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ok:false}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
