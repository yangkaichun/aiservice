const SS_ID = '1YroeUCjTPlZMrbHICwt-w2ZmfmgaYOYPqvVzhdSZ2fo';
const PDF_FOLDER = '1nCVypKwagV9BzXfVxp-MUgjJExwMzwvy';
const TEMPLATE_SS_ID = '12_Y-KVIpzLIWrJUTigJIegpJBbl4ym0r';

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    if (d.action === 'login')       return handleLogin(d);
    if (d.action === 'getRecords')  return handleGetRecords(d);
    if (d.action === 'submit')      return handleSubmit(d);
    if (d.action === 'saveRecord')  return handleSaveRecord(d);
    return json({status:'error', message:'未知動作: '+d.action});
  } catch(err) { return json({status:'error', message:err.toString()}); }
}

function handleLogin(d) {
  var users = SpreadsheetApp.openById(SS_ID).getSheetByName('Users').getDataRange().getValues();
  for (var i=1; i<users.length; i++) {
    if (users[i][0] === d.email) return json({status:'success', name:users[i][1], role:users[i][2], phone:users[i][3]||''});
  }
  return json({status:'error', message:'無權限使用此系統'});
}

function handleGetRecords(d) {
  var app = SpreadsheetApp.openById(SS_ID).getSheetByName('Applications').getDataRange().getValues();
  var recs = [];
  for (var i=1; i<app.length; i++) {
    if (d.role==='Admin' || app[i][3]===d.name) {
      recs.push({formId:app[i][0], date:app[i][1], applicant:app[i][3], summary:app[i][5], amount:app[i][6], pdfUrl:app[i][8], status:app[i][9]});
    }
  }
  return json({status:'success', data:recs.reverse()});
}

function handleSubmit(d) {
  var fid = 'EXP'+Utilities.formatDate(new Date(),'Asia/Taipei','yyyyMMddHHmmss');
  return json({success:true, formId:fid, base64Pdf:buildPdf(d,fid)});
}

function handleSaveRecord(d) {
  var file = DriveApp.getFolderById(PDF_FOLDER).createFile(
    Utilities.newBlob(Utilities.base64Decode(d.finalPdfBase64), 'application/pdf', d.formId+'_差旅申報單.pdf')
  );
  var ss = SpreadsheetApp.openById(SS_ID);
  ss.getSheetByName('Applications').appendRow([
    d.formId, Utilities.formatDate(new Date(),'Asia/Taipei','yyyy-MM-dd HH:mm:ss'),
    d.department||'', d.applicantName||'', d.phone||'',
    d.summary||'', d.totalAmount||0, '已合併於單一PDF', file.getUrl(), '待審核'
  ]);
  if (d.details && d.details.length>0) {
    d.details.forEach(function(r) {
      ss.getSheetByName('Details').appendRow([d.formId, r.date||'', r.description||'', r.price||0, r.quantity||0, r.subtotal||0]);
    });
  }
  return json({status:'success', pdfUrl:file.getUrl()});
}

function buildPdf(data, formId) {
  try {
    var templateFile = DriveApp.getFileById(TEMPLATE_SS_ID);
    var copyFile = templateFile.makeCopy(formId);
    var copySs = SpreadsheetApp.openById(copyFile.getId());
    var sheet = copySs.getSheets()[0];
  } catch(e) {
    return buildPdfDirect(data, formId);
  }
  
  var v = function(x) { return (x!=null && String(x).trim()!=='' && String(x)!=='0') ? String(x) : ''; };
  // 轉換西元年為中華民國年
  var toRoc = function(ymd) { 
    if (!ymd) return '';
    var p = ymd.split('-');
    return String(parseInt(p[0]) - 1911);
  };

  sheet.getRange('A4').setValue('姓　名：' + v(data.applicant));
  sheet.getRange('K4').setValue('部 門：' + v(data.department));

  // 公司標題列高 1.5 倍
  sheet.setRowHeight(1, 54);

  // 出差期間：清除舊的分割欄位，寫入合併字串
  sheet.getRange('B6:AF6').clearContent();
  var dateStr = '';
  if (data.startDate && data.endDate) {
    var s = data.startDate.split('-'), e = data.endDate.split('-');
    dateStr = '中華民國' + toRoc(data.startDate) + '年' + parseInt(s[1]) + '月' + parseInt(s[2]) + '日至'
            + toRoc(data.endDate) + '年' + parseInt(e[1]) + '月' + parseInt(e[2]) + '日  共計' + v(data.totalDays) + '日。';
  }
  sheet.getRange('B6').setValue(dateStr);

  // 出差事由：寫入右側合併欄位
  sheet.getRange('B7').setValue(v(data.summary));

  // 114年 → 改為出差起始年份（中華民國）
  if (data.startDate) {
    sheet.getRange('A8').setValue(toRoc(data.startDate) + '年');
  }

  // ── 頁面設定：不跨頁、符合頁寬 ──
  sheet.setColumnWidths(1, 2, 40);  // A-B: 月日
  sheet.setColumnWidths(3, 4, 60);  // C-F: 起點迄點
  sheet.setColumnWidths(7, 6, 180); // G-L: 紀要
  
  // 填入資料前先設定列高避免文字換行
  sheet.setRowHeightsForced(12, 10, 20);

  var details = data.details || [];
  for (var i=0; i<10; i++) {
    var r = 12+i, d = (i<details.length) ? details[i] : null;
    if (d) {
      sheet.getRange('A'+r).setValue(v(d.month));     sheet.getRange('B'+r).setValue(v(d.day));
      sheet.getRange('C'+r).setValue(v(d.startLoc));  sheet.getRange('E'+r).setValue(v(d.endLoc));
      sheet.getRange('G'+r).setValue(v(d.desc));
      sheet.getRange('M'+r).setValue(v(d.plane));     sheet.getRange('N'+r).setValue(v(d.taxi));
      sheet.getRange('P'+r).setValue(v(d.train));     sheet.getRange('T'+r).setValue(v(d.hotel));
      sheet.getRange('V'+r).setValue(v(d.meal));      sheet.getRange('AC'+r).setValue(v(d.other));
    }
  }

  SpreadsheetApp.flush(); Utilities.sleep(3000);

  // 用 UrlFetch 匯出 PDF（避免 getAs 轉換失敗）
  var token = ScriptApp.getOAuthToken();
  var url = 'https://docs.google.com/spreadsheets/d/' + copySs.getId() + '/export?format=pdf&size=A4&portrait=true&fitw=true&gridlines=true&scale=4&top_margin=0.5&bottom_margin=0.5&left_margin=0.3&right_margin=0.3';
  var resp = UrlFetchApp.fetch(url, { headers: { Authorization: 'Bearer ' + token }, muteHttpExceptions: true });
  
  if (resp.getResponseCode() === 200) {
    var b64 = Utilities.base64Encode(resp.getBlob().getBytes());
    copyFile.setTrashed(true);
    return b64;
  }
  
  copyFile.setTrashed(true);
  return buildPdfDirect(data, formId);
}

// Fallback: 直接生成 PDF（不用範本）
function buildPdfDirect(data, formId) {
  var doc = DocumentApp.create(formId);
  var b = doc.getBody();
  b.setMarginTop(36).setMarginBottom(36).setMarginLeft(54).setMarginRight(54);
  var v = function(x) { return (x!=null && String(x).trim()!=='' && String(x)!=='0') ? String(x) : ''; };

  b.appendParagraph('仲智數位健康股份有限公司').setAlignment(DocumentApp.HorizontalAlignment.CENTER).setFontSize(14).setBold(true);
  b.appendParagraph('出差旅費申報單').setAlignment(DocumentApp.HorizontalAlignment.CENTER).setFontSize(12).setBold(true);
  b.appendParagraph('');

  var ti = b.appendTable(); ti.setBorderWidth(0.5);
  var r0 = ti.appendTableRow();
  r0.appendTableCell('姓　名：'+v(data.applicant)).setFontSize(10);
  r0.appendTableCell('部 門：'+v(data.department)).setFontSize(10);
  r0.appendTableCell('請款總金額：'+v(data.totalAmount)).setFontSize(10);
  var r1 = ti.appendTableRow();
  r1.appendTableCell('出差期間：中華民國 '+v(data.startDate)+' 至 '+v(data.endDate)+'  共計 '+v(data.totalDays)+' 日。').setFontSize(10);
  r1.appendTableCell('').setFontSize(10);
  r1.appendTableCell('').setFontSize(10);
  r1.getCell(1).merge(); r1.getCell(1).merge();
  var r2 = ti.appendTableRow();
  r2.appendTableCell('出差事由：'+v(data.summary)).setFontSize(10);
  r2.appendTableCell('').setFontSize(10);
  r2.appendTableCell('').setFontSize(10);
  r2.getCell(1).merge(); r2.getCell(1).merge();
  b.appendParagraph('');

  var hdrs = ['序','月','日','起點','迄點','訪洽對象及工作紀要',
              '飛機\n高鐵','自行開車\n計程車','火車\n捷運',
              '住宿費','膳雜費','其他費用','小計'];
  var t = b.appendTable(); t.setBorderWidth(0.5);
  var hr = t.appendTableRow();
  hdrs.forEach(function(h) { hr.appendTableCell(h).setFontSize(7).setBold(true); });

  var details = data.details || [], gt = 0;
  for (var i=0; i<10; i++) {
    var d = (i < details.length) ? details[i] : null;
    var row = t.appendTableRow();
    row.appendTableCell(String(i+1)).setFontSize(8);
    row.appendTableCell(d ? v(d.month) : '').setFontSize(8);
    row.appendTableCell(d ? v(d.day) : '').setFontSize(8);
    row.appendTableCell(d ? v(d.startLoc) : '').setFontSize(8);
    row.appendTableCell(d ? v(d.endLoc) : '').setFontSize(8);
    row.appendTableCell(d ? v(d.desc) : '').setFontSize(8);
    row.appendTableCell(d ? v(d.plane) : '').setFontSize(8);
    row.appendTableCell(d ? v(d.taxi) : '').setFontSize(8);
    row.appendTableCell(d ? v(d.train) : '').setFontSize(8);
    row.appendTableCell(d ? v(d.hotel) : '').setFontSize(8);
    row.appendTableCell(d ? v(d.meal) : '').setFontSize(8);
    row.appendTableCell(d ? v(d.other) : '').setFontSize(8);
    var sub = d ? (parseInt(d.subtotal)||0) : 0;
    row.appendTableCell(sub>0 ? String(sub) : '').setFontSize(8);
    gt += sub;
  }

  var tr = t.appendTableRow();
  for (var j=0; j<13; j++) tr.appendTableCell('').setFontSize(8);
  tr.getCell(0).setText('合　　　　計');
  for (var j=11; j>=1; j--) tr.getCell(j).merge();
  tr.getCell(0).setText(gt>0 ? '合　　　　計　　　　　　'+String(gt) : '合　　　　計');
  tr.getCell(0).setFontSize(9).setBold(true);

  b.appendParagraph('');
  b.appendParagraph('備註：* 國外出差應註明匯率並附結匯水單或出國前一天台銀匯率證明；搭乘飛機請附上電子機票.登機證.機票購票證明單').setFontSize(8);
  b.appendParagraph('');

  var st = b.appendTable(); st.setBorderWidth(0.5);
  var sr = st.appendTableRow();
  ['申請人','部門主管','財務單位','權核主管'].forEach(function(s){ sr.appendTableCell(s+'\n\n\n\n').setFontSize(9).setBold(true); });
  st.appendTableRow().appendTableCell('填報日期：').setFontSize(9);

  doc.saveAndClose();
  var b64 = Utilities.base64Encode(doc.getAs(MimeType.PDF).getBytes());
  DriveApp.getFileById(doc.getId()).setTrashed(true);
  return b64;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doOptions(e) {
  return ContentService.createTextOutput('').setMimeType(ContentService.MimeType.TEXT)
    .getHeaders({'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST,GET,OPTIONS','Access-Control-Allow-Headers':'Content-Type'});
}
