/**
 * PANCREASaver 助胰見® — v3 官網聯絡表單後端
 * Google Apps Script (Web App)
 *
 * 部署方式：
 * 1. 到 script.google.com 新建專案，貼上本程式碼
 * 2. 部署 → 新型部署 → Web App
 *    - 執行身分：我（使用者的 Google 帳戶）
 *    - 存取權限：僅限本人 / 任何人（視需求）
 * 3. 複製 /exec 網址，填入 v3 前端 CONFIG.GAS_API_URL
 * 4. 首次執行需授權（讀寫試算表）
 */
function doGet() {
  return ContentService.createTextOutput('PANCREASaver contact form API is live.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Contact') || ss.insertSheet('Contact');

    // 表頭（若無）
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['時間', '類別', '姓名', 'Email', '主題', '訊息']);
    }

    sheet.appendRow([
      new Date(),
      data.topic || '',
      data.name || '',
      data.email || '',
      data.subject || '',
      data.message || ''
    ]);

    // 寄通知信（可選）
    try {
      MailApp.sendEmail({
        to: 'contact@pancad.ai',
        subject: '[官網表單] ' + (data.topic || '諮詢') + ' - ' + (data.name || '匿名'),
        body: '類別: ' + (data.topic || '') + '\n'
            + '姓名: ' + (data.name || '') + '\n'
            + 'Email: ' + (data.email || '') + '\n'
            + '訊息: ' + (data.message || '')
      });
    } catch (mailErr) {}

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
