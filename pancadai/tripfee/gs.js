const SPREADSHEET_ID = '1YroeUCjTPlZMrbHICwt-w2ZmfmgaYOYPqvVzhdSZ2fo';
const PDF_FOLDER_ID = '1nCVypKwagV9BzXfVxp-MUgjJExwMzwvy';

function doPost(e) {
  try {
    if (!e || !e.postData) return ContentService.createTextOutput("只接受 POST 請求");
    const requestData = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const appSheet = sheet.getSheetByName('Applications');
    const usersSheet = sheet.getSheetByName('Users');
    const action = requestData.action;

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

    if (action === 'getRecords') {
      const role = requestData.role;
      const name = requestData.name;
      const appData = appSheet.getDataRange().getValues();
      let records = [];
      for (let i = 1; i < appData.length; i++) {
        if (role === 'Admin' || appData[i][3] === name) {
          records.push({ formId: appData[i][0], date: appData[i][1], applicant: appData[i][3], summary: appData[i][5], amount: appData[i][6], pdfUrl: appData[i][8], status: appData[i][9] });
        }
      }
      return ContentService.createTextOutput(JSON.stringify({status: 'success', data: records.reverse()})).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'submit') {
      const timestamp = new Date();
      const formId = "EXP" + Utilities.formatDate(timestamp, "Asia/Taipei", "yyyyMMddHHmmss");
      const base64 = buildPdf(requestData, formId);
      return ContentService.createTextOutput(JSON.stringify({ success: true, formId: formId, base64Pdf: base64 })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'saveRecord') {
      var folder = DriveApp.getFolderById(PDF_FOLDER_ID);
      var blob = Utilities.newBlob(Utilities.base64Decode(requestData.finalPdfBase64), 'application/pdf', requestData.formId + "_差旅報銷單.pdf");
      var file = folder.createFile(blob);
      var pdfUrl = file.getUrl();
      var ts = new Date();

      appSheet.appendRow([
        requestData.formId, Utilities.formatDate(ts, "Asia/Taipei", "yyyy-MM-dd HH:mm:ss"),
        requestData.department || "", requestData.applicantName || "", requestData.phone || "",
        requestData.summary || "", requestData.totalAmount || 0, "已合併於單一PDF", pdfUrl, "待審核"
      ]);

      var detailsSheet = sheet.getSheetByName('Details');
      if (requestData.details && requestData.details.length > 0) {
        requestData.details.forEach(function(d) {
          detailsSheet.appendRow([ requestData.formId, d.date || "", d.description || "", d.price || 0, d.quantity || 0, d.subtotal || 0 ]);
        });
      }
      return ContentService.createTextOutput(JSON.stringify({status: 'success', pdfUrl: pdfUrl})).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: '未知的 action: ' + action})).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: error.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}

// ═══ 直接生成 PDF（無需 Google Doc 範本）═══
function buildPdf(data, formId) {
  var doc = DocumentApp.create(formId + "_temp");
  var body = doc.getBody();
  body.setMarginTop(36).setMarginBottom(36).setMarginLeft(54).setMarginRight(54);

  var fmt = function(v) { return (v != null && String(v).trim() !== "" && String(v) !== "0") ? String(v) : ""; };
  var s = function(v) { return DocumentApp.Attribute.FONT_SIZE; };

  // ── 標題 ──
  var p = body.appendParagraph("仲智數位健康股份有限公司");
  p.setAlignment(DocumentApp.HorizontalAlignment.CENTER).setFontSize(14).setBold(true);
  p = body.appendParagraph("出差旅費報銷單");
  p.setAlignment(DocumentApp.HorizontalAlignment.CENTER).setFontSize(12).setBold(true);
  body.appendParagraph("");

  // ── 資訊表格 ──
  var ti = body.appendTable();
  ti.setBorderWidth(0.5);

  var r0 = ti.appendTableRow();
  r0.appendTableCell("姓　名：" + fmt(data.applicant)).setFontSize(10);
  r0.appendTableCell("部 門：" + fmt(data.department)).setFontSize(10);
  r0.appendTableCell("請款總金額：" + fmt(data.totalAmount)).setFontSize(10);

  var r1 = ti.appendTableRow();
  var c1 = r1.appendTableCell("出差期間：中華民國 " + fmt(data.startDate) + " 至 " + fmt(data.endDate) + "  共計 " + fmt(data.totalDays) + " 日。");
  c1.setFontSize(10);
  c1.merge();  // 合併整列

  var r2 = ti.appendTableRow();
  var c2 = r2.appendTableCell("出差事由：" + fmt(data.summary));
  c2.setFontSize(10);
  c2.merge();

  body.appendParagraph("");

  // ── 費用明細表 ──
  var headers = ["序","月","日","起點","迄點","訪洽對象及工作紀要",
                 "飛機\n高鐵","自行開車\n計程車","火車\n捷運",
                 "住宿費","膳雜費","其他費用","小計"];

  var t = body.appendTable();
  t.setBorderWidth(0.5);

  // Header row
  var hr = t.appendTableRow();
  headers.forEach(function(h) {
    var cell = hr.appendTableCell(h);
    cell.setFontSize(8).setBold(true).setBackgroundColor("#295daa");
    cell.setForegroundColor("#ffffff");
  });

  // Data rows
  var details = data.details || [];
  var grandTotal = 0;

  for (var i = 0; i < 10; i++) {
    var d = (i < details.length) ? details[i] : null;
    var row = t.appendTableRow();

    row.appendTableCell(String(i + 1)).setFontSize(8);
    row.appendTableCell(d ? fmt(d.month) : "").setFontSize(8);
    row.appendTableCell(d ? fmt(d.day) : "").setFontSize(8);
    row.appendTableCell(d ? fmt(d.startLoc) : "").setFontSize(8);
    row.appendTableCell(d ? fmt(d.endLoc) : "").setFontSize(8);
    row.appendTableCell(d ? fmt(d.desc) : "").setFontSize(8);
    row.appendTableCell(d ? fmt(d.plane) : "").setFontSize(8);
    row.appendTableCell(d ? fmt(d.taxi) : "").setFontSize(8);
    row.appendTableCell(d ? fmt(d.train) : "").setFontSize(8);
    row.appendTableCell(d ? fmt(d.hotel) : "").setFontSize(8);
    row.appendTableCell(d ? fmt(d.meal) : "").setFontSize(8);
    row.appendTableCell(d ? fmt(d.other) : "").setFontSize(8);

    var sub = d ? (parseInt(d.subtotal) || 0) : 0;
    row.appendTableCell(sub > 0 ? String(sub) : "").setFontSize(8);
    grandTotal += sub;
  }

  // 合計列
  var totalRow = t.appendTableRow();
  for (var j = 0; j < 13; j++) {
    totalRow.appendTableCell("").setFontSize(8);
  }
  totalRow.getCell(0).setText("合　　　　計");
  for (var j = 1; j < 12; j++) {
    totalRow.getCell(j).merge();
  }
  totalRow.getCell(12).setText(grandTotal > 0 ? String(grandTotal) : "");
  [0, 12].forEach(function(j) {
    totalRow.getCell(j).setFontSize(9).setBold(true).setBackgroundColor("#e8f0fe");
  });

  body.appendParagraph("");

  // ── 備註 ──
  var pn = body.appendParagraph("備註：* 國外出差應註明匯率並附結匯水單或出國前一天台銀匯率證明；搭乘飛機請附上電子機票.登機證.機票購票證明單");
  pn.setFontSize(8);

  body.appendParagraph("");

  // ── 簽名區 ──
  var st = body.appendTable();
  st.setBorderWidth(0.5);
  var sr = st.appendTableRow();
  ["申請人","部門主管","財務單位","權核主管"].forEach(function(sig) {
    var sc = sr.appendTableCell(sig + "\n\n\n\n");
    sc.setFontSize(9).setBold(true);
  });

  var sbr = st.appendTableRow();
  var sbc = sbr.appendTableCell("填報日期：");
  sbc.setFontSize(9);
  sbc.merge();

  doc.saveAndClose();

  // 轉 PDF
  var pdfBlob = doc.getAs(MimeType.PDF);
  var b64 = Utilities.base64Encode(pdfBlob.getBytes());

  // 清理暫存
  DriveApp.getFileById(doc.getId()).setTrashed(true);

  return b64;
}

function doOptions(e) {
  return ContentService.createTextOutput('').setMimeType(ContentService.MimeType.TEXT)
    .getHeaders({'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type'});
}
