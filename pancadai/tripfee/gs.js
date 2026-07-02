const SPREADSHEET_ID = '1YroeUCjTPlZMrbHICwt-w2ZmfmgaYOYPqvVzhdSZ2fo';
const TEMPLATE_ID = '1f7DskFnXFRPC_aX838sTvnbWQWShLFxWV4mxSw9oR78';
const PDF_FOLDER_ID = '1nCVypKwagV9BzXfVxp-MUgjJExwMzwvy';

function doPost(e) {
  try {
    if (!e || !e.postData) return ContentService.createTextOutput("只接受 POST 請求");

    const requestData = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const appSheet = sheet.getSheetByName('Applications');
    const usersSheet = sheet.getSheetByName('Users');

    const action = requestData.action;

    // 🛡️ 動作一：登入驗證 (自動抓取 D 欄電話)
    if (action === 'login') {
      const email = requestData.email;
      const usersData = usersSheet.getDataRange().getValues();
      for (let i = 1; i < usersData.length; i++) {
        if (usersData[i][0] === email) {
          return ContentService.createTextOutput(JSON.stringify({
            status: 'success', name: usersData[i][1], role: usersData[i][2], phone: usersData[i][3] || ""
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }
      return ContentService.createTextOutput(JSON.stringify({status: 'error', message: '無權限使用此系統'})).setMimeType(ContentService.MimeType.JSON);
    }

    // 🛡️ 動作二：取得歷史紀錄 (Admin 看全部，User 看自己的)
    if (action === 'getRecords') {
      const role = requestData.role;
      const name = requestData.name;
      const appData = appSheet.getDataRange().getValues();
      let records = [];

      for (let i = 1; i < appData.length; i++) {
        // appData[i][3] 是申請人姓名
        if (role === 'Admin' || appData[i][3] === name) {
          records.push({
            formId: appData[i][0],
            date: appData[i][1],
            applicant: appData[i][3],
            summary: appData[i][5],
            amount: appData[i][6],
            pdfUrl: appData[i][8],
            status: appData[i][9]
          });
        }
      }
      return ContentService.createTextOutput(JSON.stringify({status: 'success', data: records.reverse()})).setMimeType(ContentService.MimeType.JSON);
    }

    // 🛡️ 動作三：前端送出完整申請 — 產生 PDF 底稿（mapping 前端欄位到 template）
    if (action === 'submit') {
      const timestamp = new Date();
      const formId = "EXP" + Utilities.formatDate(timestamp, "Asia/Taipei", "yyyyMMddHHmmss");

      const templateFile = DriveApp.getFileById(TEMPLATE_ID);
      const tempFolder = DriveApp.getFolderById(PDF_FOLDER_ID);
      const tempFile = templateFile.makeCopy(formId + "_temp", tempFolder);
      const tempDoc = DocumentApp.openById(tempFile.getId());
      const body = tempDoc.getBody();

      body.replaceText("{{申請單位}}", requestData.department || "");
      body.replaceText("{{申請人}}", requestData.applicant || "");
      body.replaceText("{{電話}}", requestData.phone || "");
      body.replaceText("{{用途摘要}}", requestData.summary || "");
      body.replaceText("{{總金額}}", requestData.totalAmount || "");

      if (requestData.details && requestData.details.length > 0) {
        for (let i = 0; i < Math.min(requestData.details.length, 10); i++) {
          const d = requestData.details[i];
          const dateStr = (d.month && d.day) ? `${d.month}/${d.day}` : "";
          const routeStr = (d.startLoc && d.endLoc) ? `${d.startLoc}→${d.endLoc}` : "";
          const descStr = [d.desc || "", routeStr].filter(Boolean).join(" ");
          const totalFee = [d.plane, d.taxi, d.train, d.hotel, d.meal, d.other]
            .reduce((sum, v) => sum + (parseInt(v) || 0), 0);

          body.replaceText(`{{date_${i+1}}}`, dateStr);
          body.replaceText(`{{desc_${i+1}}}`, descStr);
          body.replaceText(`{{price_${i+1}}}`, String(totalFee));
          body.replaceText(`{{qty_${i+1}}}`, "1");
          body.replaceText(`{{sub_${i+1}}}`, String(d.subtotal || totalFee));
        }
        // 清除未使用的 placeholder
        for (let i = requestData.details.length; i < 10; i++) {
          body.replaceText(`{{date_${i+1}}}`, "");
          body.replaceText(`{{desc_${i+1}}}`, "");
          body.replaceText(`{{price_${i+1}}}`, "");
          body.replaceText(`{{qty_${i+1}}}`, "");
          body.replaceText(`{{sub_${i+1}}}`, "");
        }
      }

      tempDoc.saveAndClose();
      const pdfBlob = tempFile.getAs(MimeType.PDF);
      const base64 = Utilities.base64Encode(pdfBlob.getBytes());
      tempFile.setTrashed(true);

      return ContentService.createTextOutput(JSON.stringify({
        success: true, formId: formId, base64Pdf: base64
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 🛡️ 動作四：接收前端合併好的最終 PDF 並寫入資料庫
    if (action === 'saveRecord') {
      const folder = DriveApp.getFolderById(PDF_FOLDER_ID);
      const formId = requestData.formId;
      const timestamp = new Date();

      const blob = Utilities.newBlob(Utilities.base64Decode(requestData.finalPdfBase64), 'application/pdf', formId + "_支出憑證黏存單.pdf");
      const file = folder.createFile(blob);
      const pdfUrl = file.getUrl();

      appSheet.appendRow([
        formId, Utilities.formatDate(timestamp, "Asia/Taipei", "yyyy-MM-dd HH:mm:ss"),
        requestData.department || "", requestData.applicantName || "", requestData.phone || "",
        requestData.summary || "", requestData.totalAmount || 0,
        "已合併於單一PDF", pdfUrl, "待審核"
      ]);

      const detailsSheet = sheet.getSheetByName('Details');
      if (requestData.details && requestData.details.length > 0) {
        requestData.details.forEach(detail => {
          detailsSheet.appendRow([
            formId, detail.date || "", detail.description || "",
            detail.price || 0, detail.quantity || 0, detail.subtotal || 0
          ]);
        });
      }
      return ContentService.createTextOutput(JSON.stringify({status: 'success', pdfUrl: pdfUrl})).setMimeType(ContentService.MimeType.JSON);
    }

    // ⚠️ 未匹配的 action — 加上這個避免 submit 呼叫不到任何 handler
    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: '未知的 action: ' + action})).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: error.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}

function doOptions(e) {
  return ContentService.createTextOutput('').setMimeType(ContentService.MimeType.TEXT)
    .getHeaders({'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type'});
}
