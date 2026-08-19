/**
 * 仲智數位健康 — 聯絡表單後端（Google Apps Script）
 * 部署：extensions → Apps Script → 貼上此程式碼 → 部署 → 網頁應用程式
 * （執行身分：我；存取權：任何人）→ 複製 Web App URL 填入 contact.html 的 GAS_WEB_APP_URL
 */
var SHEET_NAME = '聯絡表單';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['時間', '姓名', '電話', 'Email', '想了解', '訊息', '來源頁面']);
    }
    sheet.appendRow([
      new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }),
      data.name || '', data.phone || '', data.email || '',
      data.topic || '', data.message || '', data.page || ''
    ]);
    MailApp.sendEmail({
      to: 'kc.yang@pancad.ai',
      subject: '【官網聯絡表單】' + (data.topic || '一般諮詢') + ' - ' + (data.name || '未署名'),
      body: '姓名: ' + data.name + '\n電話: ' + data.phone + '\nEmail: ' + data.email +
            '\n\n想了解: ' + data.topic + '\n\n訊息:\n' + data.message +
            '\n\n來源: ' + data.page
    });
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, err: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput('PanCAD.ai contact form backend is running.');
}
