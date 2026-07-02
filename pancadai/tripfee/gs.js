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

    // 🛡️ 動作三：產生 PDF（對應範本詳細欄位，無值留空白）
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

      // ── 明細變數：對應範本的詳細欄位（每欄獨立，無值就空白）──
      var details = requestData.details || [];
      for (var i = 0; i < 10; i++) {
        var n = i + 1;
        var d = (i < details.length) ? details[i] : null;

        // 無值就留空白（不顯示 "0"）
        var v = function(val) { return (val && String(val).trim() !== "" && String(val) !== "0") ? String(val) : ""; };

        body.replaceText("{{m_" + n + "}}", d ? v(d.month) : "");
        body.replaceText("{{d_" + n + "}}", d ? v(d.day) : "");
        body.replaceText("{{start_" + n + "}}", d ? v(d.startLoc) : "");
        body.replaceText("{{end_" + n + "}}", d ? v(d.endLoc) : "");
        body.replaceText("{{desc_" + n + "}}", d ? v(d.desc) : "");
        body.replaceText("{{plane_" + n + "}}", d ? v(d.plane) : "");
        body.replaceText("{{taxi_" + n + "}}", d ? v(d.taxi) : "");
        body.replaceText("{{train_" + n + "}}", d ? v(d.train) : "");
        body.replaceText("{{hotel_" + n + "}}", d ? v(d.hotel) : "");
        body.replaceText("{{meal_" + n + "}}", d ? v(d.meal) : "");
        body.replaceText("{{other_" + n + "}}", d ? v(d.other) : "");
        body.replaceText("{{sub_" + n + "}}", d ? v(d.subtotal) : "");
      }

      tempDoc.saveAndClose();
      var pdfBlob = tempFile.getAs(MimeType.PDF);
      var base64 = Utilities.base64Encode(pdfBlob.getBytes());
      tempFile.setTrashed(true);

      return ContentService.createTextOutput(JSON.stringify({
        success: true, formId: formId, base64Pdf: base64
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 🛡️ 動作四：儲存最終合併 PDF
    if (action === 'saveRecord') {
      var folder = DriveApp.getFolderById(PDF_FOLDER_ID);
      var formId = requestData.formId;
      var timestamp = new Date();

      var blob = Utilities.newBlob(Utilities.base64Decode(requestData.finalPdfBase64), 'application/pdf', formId + "_差旅報銷單.pdf");
      var file = folder.createFile(blob);
      var pdfUrl = file.getUrl();

      appSheet.appendRow([
        formId, Utilities.formatDate(timestamp, "Asia/Taipei", "yyyy-MM-dd HH:mm:ss"),
        requestData.department || "", requestData.applicantName || "", requestData.phone || "",
        requestData.summary || "", requestData.totalAmount || 0,
        "已合併於單一PDF", pdfUrl, "待審核"
      ]);

      var detailsSheet = sheet.getSheetByName('Details');
      if (requestData.details && requestData.details.length > 0) {
        requestData.details.forEach(function(detail) {
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
