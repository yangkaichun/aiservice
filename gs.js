const SPREADSHEET_ID = '1YroeUCjTPlZMrbHICwt-w2ZmfmgaYOYPqvVzhdSZ2fo';
const PDF_FOLDER_ID = '1nCVypKwagV9BzXfVxp-MUgjJExwMzwvy';

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    var act = d.action;

    if (act === 'login')       return handleLogin(d);
    if (act === 'getRecords')  return handleGetRecords(d);
    if (act === 'submit')      return handleSubmit(d);
    if (act === 'saveRecord')  return handleSaveRecord(d);

    return json({status:'error', message:'未知動作: '+act});
  } catch(err) {
    return json({status:'error', message:err.toString()});
  }
}

function handleLogin(d) {
  var users = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Users').getDataRange().getValues();
  for (var i=1; i<users.length; i++) {
    if (users[i][0] === d.email) {
      return json({status:'success', name:users[i][1], role:users[i][2], phone:users[i][3]||''});
    }
  }
  return json({status:'error', message:'無權限使用此系統'});
}

function handleGetRecords(d) {
  var app = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Applications').getDataRange().getValues();
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
  var file = DriveApp.getFolderById(PDF_FOLDER_ID).createFile(
    Utilities.newBlob(Utilities.base64Decode(d.finalPdfBase64), 'application/pdf', d.formId+'_差旅申報單.pdf')
  );
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
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
  r1.appendTableCell('出差期間：中華民國 '+v(data.startDate)+' 至 '+v(data.endDate)+'  共計 '+v(data.totalDays)+' 日。').setFontSize(10).merge();
  var r2 = ti.appendTableRow();
  r2.appendTableCell('出差事由：'+v(data.summary)).setFontSize(10).merge();
  b.appendParagraph('');

  var hdrs = ['序','月','日','起點','迄點','訪洽對象及工作紀要','飛機\n高鐵','自行開車\n計程車','火車\n捷運','住宿費','膳雜費','其他費用','小計'];
  var t = b.appendTable(); t.setBorderWidth(0.5);
  var hr = t.appendTableRow();
  hdrs.forEach(function(h) { hr.appendTableCell(h).setFontSize(7).setBold(true).setBackgroundColor('#295daa').setForegroundColor('#ffffff'); });

  var details = data.details || [], gt = 0;
  for (var i=0; i<10; i++) {
    var row = t.appendTableRow(), d = (i<details.length) ? details[i] : null;
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
  for (var j=1; j<12; j++) tr.getCell(j).merge();
  tr.getCell(12).setText(gt>0 ? String(gt) : '');
  [0,12].forEach(function(j){ tr.getCell(j).setFontSize(9).setBold(true).setBackgroundColor('#e8f0fe'); });

  b.appendParagraph('');
  b.appendParagraph('備註：* 國外出差應註明匯率並附結匯水單或出國前一天台銀匯率證明；搭乘飛機請附上電子機票.登機證.機票購票證明單').setFontSize(8);
  b.appendParagraph('');

  var st = b.appendTable(); st.setBorderWidth(0.5);
  var sr = st.appendTableRow();
  ['申請人','部門主管','財務單位','權核主管'].forEach(function(s){ sr.appendTableCell(s+'\n\n\n\n').setFontSize(9).setBold(true); });
  st.appendTableRow().appendTableCell('填報日期：').setFontSize(9).merge();

  doc.saveAndClose();
  var pdf = Utilities.base64Encode(doc.getAs(MimeType.PDF).getBytes());
  DriveApp.getFileById(doc.getId()).setTrashed(true);
  return pdf;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doOptions(e) {
  return ContentService.createTextOutput('').setMimeType(ContentService.MimeType.TEXT)
    .getHeaders({'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST,GET,OPTIONS','Access-Control-Allow-Headers':'Content-Type'});
}
