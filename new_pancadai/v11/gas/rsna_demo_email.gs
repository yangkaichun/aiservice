/**
 * Dedicated RSNA 2026 meeting relay.
 * Deploy as a Google Apps Script web app running as the PanCAD.ai owner.
 * Set Script Properties GAS_SHARED_SECRET and RSNA_SHEET_ID. The first must
 * match Cloudflare Pages; the second is a private Google spreadsheet ID.
 * Store the web-app URL in Cloudflare GAS_URL.
 * The Cloudflare Pages Function verifies Turnstile before calling this relay.
 */
function doPost(e) {
  var lock;
  var locked = false;
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
    var fields = [
      name, email, text(data.organization, 120), text(data.country, 80),
      text(data.jobTitle, 100), text(data.phone, 40), text(data.role, 80),
      topics, text(data.otherDetails, 160), text(data.day, 20),
      text(data.time, 30), text(data.message, 1500)
    ];
    var requestId = Utilities.base64EncodeWebSafe(
      Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, JSON.stringify(fields))
    ).slice(0, 32);
    lock = LockService.getScriptLock();
    lock.waitLock(15000);
    locked = true;
    var sheet = getRequestSheet_();
    var rowNumber = findRecentRequest_(sheet, requestId);
    if (rowNumber && sheet.getRange(rowNumber, 16).getValue() === 'Sent') {
      return json_({ok:true, sheetSaved:true, duplicate:true});
    }
    if (!rowNumber) {
      sheet.appendRow([
        requestId, new Date().toISOString(),
        fields[0], fields[1], fields[2], fields[3], fields[4], fields[5],
        fields[6], fields[7], fields[8], fields[9], fields[10], fields[11],
        'Yes', 'Pending'
      ].map(function (value, index) { return index >= 2 && index <= 13 ? safeCell_(value) : value; }));
      rowNumber = sheet.getLastRow();
    }
    var body = [
      'RSNA 2026 meeting request — Booth 5132',
      '',
      'Request ID: ' + requestId,
      'Name: ' + fields[0],
      'Email: ' + fields[1],
      'Organization: ' + fields[2],
      'Country or region: ' + fields[3],
      'Job title: ' + fields[4],
      'Phone: ' + fields[5],
      'Visitor role: ' + fields[6],
      'Topics: ' + topics,
      'Other details: ' + fields[8],
      'Preferred day: ' + fields[9],
      'Preferred time (Chicago CT): ' + fields[10],
      '',
      'Message:',
      fields[11],
      '',
      'Consent to follow-up: Yes',
      'Source: RSNA 2026 website form; Turnstile verified by Cloudflare Pages Function.'
    ].join(String.fromCharCode(10));
    try {
      MailApp.sendEmail({
        to: 'info@pancad.ai',
        subject: '[RSNA 2026] Meeting request — ' + name,
        body: body,
        replyTo: email,
        name: 'PanCAD.ai RSNA 2026'
      });
    } catch (mailError) {
      sheet.getRange(rowNumber, 16).setValue('Email error');
      throw mailError;
    }
    sheet.getRange(rowNumber, 16).setValue('Sent');
    SpreadsheetApp.flush();
    return json_({ok:true, sheetSaved:true});
  } catch (error) {
    console.error('RSNA relay failed: ' + error);
    return json_({ok:false});
  } finally {
    if (locked) lock.releaseLock();
  }
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}

function safeCell_(value) {
  var text = String(value || '');
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function getRequestSheet_() {
  var id = PropertiesService.getScriptProperties().getProperty('RSNA_SHEET_ID');
  if (!id) throw new Error('RSNA_SHEET_ID is not configured');
  var book = SpreadsheetApp.openById(id);
  var sheet = book.getSheetByName('RSNA 2026 Requests');
  if (!sheet) {
    var first = book.getSheets()[0];
    sheet = first && first.getLastRow() === 0 ? first : book.insertSheet();
    sheet.setName('RSNA 2026 Requests');
  }
  var headers = [
    'Request ID', 'Submitted at (UTC)', 'Full name', 'Work email',
    'Organization', 'Country or region', 'Job title', 'Phone', 'Visitor role',
    'Topics', 'Other details', 'Preferred day', 'Preferred time (Chicago CT)',
    'Message', 'Consent to follow-up', 'Email status'
  ];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  } else if (sheet.getRange(1, 1, 1, headers.length).getValues()[0].join('|') !== headers.join('|')) {
    throw new Error('RSNA request sheet headers do not match');
  }
  return sheet;
}

/** Run once in the Apps Script editor to authorize private sheet access. */
function authorizeRsnaSheet() {
  getRequestSheet_();
}

function findRecentRequest_(sheet, requestId) {
  var last = sheet.getLastRow();
  if (last < 2) return 0;
  var start = Math.max(2, last - 499);
  var rows = sheet.getRange(start, 1, last - start + 1, 2).getValues();
  for (var i = rows.length - 1; i >= 0; i--) {
    if (rows[i][0] === requestId &&
        Date.now() - Date.parse(rows[i][1]) < 15 * 60 * 1000) return start + i;
  }
  return 0;
}
