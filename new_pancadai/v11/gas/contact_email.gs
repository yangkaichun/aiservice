/**
 * v11.2.25 聯絡表單 — Google Apps Script 收信端
 * 部署：script.google.com → 新增專案 → 貼入此程式碼 → 部署 → 網頁應用程式
 *   執行身分：我（本人）/ 存取權限：任何人（匿名）
 * 貼入後可直接用，無需修改。
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var name = String(data.name || '').slice(0, 60);
    var email = String(data.email || '').slice(0, 120);
    var phone = String(data.phone || '').slice(0, 40);
    var type = String(data.type || '一般諮詢').slice(0, 40);
    var msg = String(data.message || '').slice(0, 2000);
    var lang = String(data.lang || 'zh').slice(0, 8);

    var subject = '【網站聯絡】' + type + ' — ' + name;
    var body = '姓名：' + name + '\n'
      + 'Email：' + email + '\n'
      + '電話：' + phone + '\n'
      + '詢問類型：' + type + '\n'
      + '頁面語言：' + lang + '\n'
      + '------------------------------\n'
      + '訊息內容：\n' + msg + '\n'
      + '------------------------------\n'
      + '（由 pancadai-v11.pages.dev 聯絡表單送出，Turnstile 已驗證）';

    // 寄給公司
    MailApp.sendEmail({
      to: 'info@pancad.ai',
      subject: subject,
      body: body,
      replyTo: email,
      name: 'PanCAD.ai 網站'
    });

    // 自動回覆給提交者（Email 格式正確時）
    var emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
    if (emailOk) {
      MailApp.sendEmail({
        to: email,
        subject: '✅ 已收到您的訊息 — 仲智數位健康 PanCAD.ai',
        body: name + ' 您好：\n\n我們已收到您的訊息，將於兩個工作天內回覆您。\n\n若您有緊急醫療問題，請務必直接聯繫您的醫療院所。\n\n仲智數位健康股份有限公司（PanCAD.ai）\n台北市大安區敦化南路一段367號11樓\ninfo@pancad.ai\n+886 02-2331-3971'
      });
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
