// --- Google Apps Script (V13 - 整合使用者管理與進階病歷功能) ---
const ss = SpreadsheetApp.getActiveSpreadsheet();

function doGet(e) {
  const params = e.parameter;
  const action = params.action;
  let result = {};

  try {
    // ================= 寫入與更新操作 =================
    
    // 1. 新增生理數據 & 病歷資料 (共用 Observation 結構)
    // 說明：我們將病歷摘要、診斷碼、檢驗數據都視為廣義的 "Observation"
    if (action === 'addObservation') {
      result = addObservation(params);
    }
    // 2. 新增轉診單
    else if (action === 'addReferral') {
      result = addReferral(params);
    }
    // 3. 更新轉診狀態
    else if (action === 'updateReferralStatus') {
      result = updateReferralStatus(params);
    }
    // 4. 新增病患
    else if (action === 'addPatient') {
      const sheet = ss.getSheetByName('Patients');
      const newId = params.id || ('P' + new Date().getTime());
      sheet.appendRow([newId, params.name, params.nationalId, params.birthDate, params.gender]);
      result = { status: 'success', message: 'Patient Added' };
    }
    // 5. 新增使用者 (保留既有功能)
    else if (action === 'addUser') {
      const sheet = ss.getSheetByName('Users');
      sheet.appendRow(['U'+Date.now(), params.name, params.role, params.organization, params.email]);
      result = { status: 'success', message: 'User Added' };
    }
    // 6. 編輯使用者 (保留既有功能 - 重要)
    else if (action === 'editUser') {
      const sheet = ss.getSheetByName('Users');
      const data = sheet.getDataRange().getValues();
      let found = false;
      for (let i = 1; i < data.length; i++) {
        // 假設 ID 在第一欄 (Column A)
        if (String(data[i][0]) === String(params.id)) {
          sheet.getRange(i + 1, 2).setValue(params.name);         // Name
          sheet.getRange(i + 1, 3).setValue(params.role);         // Role
          sheet.getRange(i + 1, 4).setValue(params.organization); // Organization
          sheet.getRange(i + 1, 5).setValue(params.email);        // Email
          found = true; break;
        }
      }
      result = found ? { status: 'success', message: 'User Updated' } : { status: 'error', message: 'User ID not found' };
    }
    // 7. 刪除使用者 (保留既有功能 - 重要)
    else if (action === 'deleteUser') {
       const sheet = ss.getSheetByName('Users');
       const data = sheet.getDataRange().getValues();
       let found = false;
       for (let i = 1; i < data.length; i++) {
         if (String(data[i][0]) === String(params.id)) {
           sheet.deleteRow(i + 1);
           found = true; break;
         }
       }
       result = found ? { status: 'success', message: 'Deleted' } : { status: 'error', message: 'ID Not Found' };
    }
    // 8. [新增] 上傳 DICOM 紀錄 (模擬)
    else if (action === 'addDicom') {
      let sheet = ss.getSheetByName('Dicoms');
      if (!sheet) {
        sheet = ss.insertSheet('Dicoms');
        sheet.appendRow(['id', 'patientId', 'filename', 'summary', 'timestamp']);
      }
      const newId = 'D' + Date.now();
      const time = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd HH:mm:ss");
      sheet.appendRow([newId, params.patientId, params.filename, params.summary, time]);
      result = { status: 'success', message: 'DICOM Metadata Saved', id: newId, timestamp: time };
    }

    // ================= 讀取操作 (Read) =================
    
    // A. 讀取生理數據 (包含病歷摘要等)
    else if (params.endpoint === 'observations') {
      let data = getNormalizedSheetData('Observations');
      if (params.patientId) {
        data = data.filter(o => String(o.patientId) === String(params.patientId));
      }
      // 排序：最新的時間在前
      data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      result = { status: 'success', data: data };
    }
    // B. 讀取轉診單
    else if (params.endpoint === 'referrals') {
      let data = getNormalizedSheetData('Referrals');
      data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      result = { status: 'success', data: data };
    }
    // C. 讀取病患清單
    else if (params.endpoint === 'patients') {
      result = { status: 'success', data: getNormalizedSheetData('Patients') };
    }
    // D. 讀取使用者清單
    else if (params.endpoint === 'users') {
      result = { status: 'success', data: getNormalizedSheetData('Users') };
    }
    // E. [新增] 讀取 DICOM 清單
    else if (params.endpoint === 'dicoms') {
      let data = getNormalizedSheetData('Dicoms');
      if (params.patientId) {
        data = data.filter(d => String(d.patientId) === String(params.patientId));
      }
      data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      result = { status: 'success', data: data };
    }
    else {
      result = { status: 'error', message: 'Unknown action' };
    }

  } catch (error) {
    result = { status: 'error', message: error.toString() };
  }

  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

// ---------------------------------------------------------
// 核心功能函式庫
// ---------------------------------------------------------

function addReferral(p) {
  let sheet = ss.getSheetByName('Referrals');
  if (!sheet) {
    sheet = ss.insertSheet('Referrals');
    sheet.appendRow(['id', 'timestamp', 'status', 'fromOrg', 'toOrg', 'patientId', 'patientName', 'patientDob', 'patientIdNo', 'diagnosis', 'summary', 'purpose']);
  }
  const newId = 'R' + Date.now().toString().slice(-8);
  const time = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd HH:mm");
  
  const rowData = {
    'id': newId, 'timestamp': time, 'status': '未就診',
    'fromOrg': p.fromOrg, 'toOrg': p.toOrg, 'patientId': p.patientId,
    'patientName': p.patientName, 'patientDob': p.patientDob, 'patientIdNo': p.patientIdNo,
    'diagnosis': p.diagnosis, 'summary': p.summary, 'purpose': p.purpose
  };
  const lastCol = sheet.getLastColumn();
  const headers = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(h => h.toString().trim()) : [];
  const newHeaders = [];
  Object.keys(rowData).forEach(key => {
    const exists = headers.some(h => h.toLowerCase() === key.toLowerCase() || (key === 'patientId' && h === 'patientID'));
    if (!exists) { newHeaders.push(key); headers.push(key); }
  });
  if (newHeaders.length > 0) sheet.getRange(1, lastCol + 1, 1, newHeaders.length).setValues([newHeaders]);

  const newRow = headers.map(header => {
    const key = Object.keys(rowData).find(k => k.toLowerCase() === header.toLowerCase() || (k === 'patientId' && header === 'patientID'));
    return key ? rowData[key] : '';
  });
  sheet.appendRow(newRow);
  return { status: 'success', message: '建立成功', id: newId };
}

function updateReferralStatus(p) {
  const sheet = ss.getSheetByName('Referrals');
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const statusColIndex = headers.findIndex(h => h.toLowerCase() === 'status') + 1;
  if (statusColIndex === 0) return { status: 'error', message: '找不到 Status 欄位' };
  const finder = sheet.createTextFinder(p.id).matchEntireCell(true);
  const cell = finder.findNext();
  if (cell) {
    let finalStatus = p.newStatus;
    if (p.reason && p.reason.trim() !== '') finalStatus = `${p.newStatus}: ${p.reason}`;
    sheet.getRange(cell.getRow(), statusColIndex).setValue(finalStatus);
    return { status: 'success', message: '狀態更新為：' + finalStatus };
  }
  return { status: 'error', message: '找不到轉診單 ID' };
}

function addObservation(p) {
  const sheet = ss.getSheetByName('Observations');
  // 如果是第一次使用，建立標題列
  if (sheet.getLastRow() === 0) {
     sheet.appendRow(['id', 'patientId', 'timestamp', 'code', 'value', 'unit']);
  }
  const newId = 'O' + Date.now();
  const time = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd HH:mm:ss");
  // id, patientID, timestamp, code, value, unit
  sheet.appendRow([newId, p.patientId, time, p.code, p.value, p.unit]);
  return { status: 'success', id: newId, timestamp: time };
}

function getNormalizedSheetData(sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return [];
  const headers = rows[0].map(h => h.toString().trim());
  return rows.slice(1).map(row => {
    let obj = {};
    headers.forEach((h, i) => {
      let key = h;
      if (h === 'patientID') key = 'patientId';
      if (h === 'notionaID') key = 'nationalId'; 
      if (h === 'notionalID') key = 'nationalId';
      if (h === 'orgaization') key = 'organization'; 
      let val = row[i];
      if (val instanceof Date) val = Utilities.formatDate(val, "GMT+8", "yyyy-MM-dd HH:mm:ss");
      obj[key] = val;
    });
    return obj;
  });
}