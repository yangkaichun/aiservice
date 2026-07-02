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

    // 🛡️ 動作一：登入驗證
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

    // 🛡️ 動作二：歷史紀錄
    if (action === 'getRecords') {
      const role = requestData.role;
      const name = requestData.name;
      const appData = appSheet.getDataRange().getValues();
      let records = [];

      for (let i = 1; i < appData.length; i++) {
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

    // 🛡️ 動作三：產生 PDF
    if (action === 'submit') {
      const timestamp = new Date();
      const formId = "EXP" + Utilities.formatDate(timestamp, "Asia/Taipei", "yyyyMMddHHmmss");

      const templateFile = DriveApp.getFileById(TEMPLATE_ID);
      const tempFolder = DriveApp.getFolderById(PDF_FOLDER_ID);
      const tempFile = templateFile.makeCopy(formId + "_temp", tempFolder);
      const tempDoc = DocumentApp.openById(tempFile.getId());
      const body = tempDoc.getBody();

      // ── 頁首主檔變數 ──
      body.replaceText("{{申請單位}}", requestData.department || "");
      body.replaceText("{{申請人}}", requestData.applicant || "");
      body.replaceText("{{電話}}", requestData.phone || "");
      body.replaceText("{{用途摘要}}", requestData.summary || "");
      body.replaceText("{{總金額}}", requestData.totalAmount || "");
      body.replaceText("{{出差開始日期}}", requestData.startDate || "");
      body.replaceText("{{出差結束日期}}", requestData.endDate || "");
      body.replaceText("{{總天數}}", requestData.totalDays || "");

      // ── 明細變數 ──
      if (requestData.details && requestData.details.length > 0) {
        for (let i = 0; i < Math.min(requestData.details.length, 10); i++) {
          const d = requestData.details[i];
          const n = i + 1;

          // 日期：月/日
          const dateStr = (d.month && d.day) ? `${d.month}/${d.day}` : "";
          body.replaceText(`{{date_${n}}}`, dateStr);

          // 描述：紀要 + 起迄點（無值就空白）
          const routeStr = (d.startLoc && d.endLoc) ? `${d.startLoc}→${d.endLoc}` : "";
          const descStr = [d.desc || "", routeStr].filter(Boolean).join(" ");
          body.replaceText(`{{desc_${n}}}`, descStr);

          // 費用總和（0 就留空白）
          const totalFee = [d.plane, d.taxi, d.train, d.hotel, d.meal, d.other]
            .reduce((sum, v) => sum + (parseInt(v) || 0), 0);
          body.replaceText(`{{price_${n}}}`, totalFee > 0 ? String(totalFee) : "");
          body.replaceText(`{{qty_${n}}}`, totalFee > 0 ? "1" : "");

          // 小計（0 留空白）
          body.replaceText(`{{sub_${n}}}`, (d.subtotal && parseInt(d.subtotal) > 0) ? String(d.subtotal) : "");
        }
        // 清除未使用的 placeholder
        for (let i = requestData.details.length; i < 10; i++) {
          const n = i + 1;
          body.replaceText(`{{date_${n}}}`, "");
          body.replaceText(`{{desc_${n}}}`, "");
          body.replaceText(`{{price_${n}}}`, "");
          body.replaceText(`{{qty_${n}}}`, "");
          body.replaceText(`{{sub_${n}}}`, "");
        }
      } else {
        // 完全沒有明細：清除全部 10 列
        for (let n = 1; n <= 10; n++) {
          body.replaceText(`{{date_${n}}}`, "");
          body.replaceText(`{{desc_${n}}}`, "");
          body.replaceText(`{{price_${n}}}`, "");
          body.replaceText(`{{qty_${n}}}`, "");
          body.replaceText(`{{sub_${n}}}`, "");
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

    // 🛡️ 動作四：儲存最終合併 PDF
    if (action === 'saveRecord') {
      const folder = DriveApp.getFolderById(PDF_FOLDER_ID);
      const formId = requestData.formId;
      const timestamp = new Date();

      const blob = Utilities.newBlob(Utilities.base64Decode(requestData.finalPdfBase64), 'application/pdf', formId + "_差旅報銷單.pdf");
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

    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: '未知的 action: ' + action})).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: error.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}

function doOptions(e) {
  return ContentService.createTextOutput('').setMimeType(ContentService.MimeType.TEXT)
    .getHeaders({'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type'});
}
