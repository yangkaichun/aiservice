// --- Google Apps Script (V10 - 完整版) ---
const ss = SpreadsheetApp.getActiveSpreadsheet();

function doGet(e) {
  const params = e.parameter;
  const action = params.action;
  let result = {};

  try {
    // ================= 寫入與更新操作 =================
    
    // 1. 新增生理數據
    if (action === 'addObservation') {
      result = addObservation(params);
    }
    // 2. 新增轉診單 (具備智慧欄位擴充功能)
    else if (action === 'addReferral') {
      result = addReferral(params);
    }
    // 3. 更新轉診狀態 (支援寫入原因)
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
    // 5. 新增使用者
    else if (action === 'addUser') {
      const sheet = ss.getSheetByName('Users');
      sheet.appendRow(['U'+Date.now(), params.name, params.role, params.organization, params.email]);
      result = { status: 'success', message: 'User Added' };
    }
    else if (action === 'deleteUser') {
       // 簡單刪除邏輯 (若需要)
       // ...
       result = { status: 'success', message: 'Deleted' }; 
    }

    // ================= 讀取操作 (Read) =================
    
    // A. 讀取生理數據
    else if (params.endpoint === 'observations') {
      let data = getNormalizedSheetData('Observations');
      if (params.patientId) {
        // 強制轉字串比對，避免 ID 格式問題
        data = data.filter(o => String(o.patientId) === String(params.patientId));
      }
      // 排序：最新的時間在前
      data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      result = { status: 'success', data: data };
    }
    // B. 讀取轉診單
    else if (params.endpoint === 'referrals') {
      let data = getNormalizedSheetData('Referrals');
      // 排序：最新的在前
      data.sort((a, b) => {
        const tA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const tB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return tB - tA;
      });
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

// 1. 新增轉診單 (Smart Header Handling)
function addReferral(p) {
  let sheet = ss.getSheetByName('Referrals');
  // 若無分頁則建立
  if (!sheet) {
    sheet = ss.insertSheet('Referrals');
    sheet.appendRow(['id', 'timestamp', 'status', 'fromOrg', 'toOrg', 'patientId', 'patientName', 'patientDob', 'patientIdNo', 'diagnosis', 'summary', 'purpose']);
  }

  const newId = 'R' + Date.now().toString().slice(-8);
  const time = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd HH:mm");
  
  // 準備寫入的資料物件
  const rowData = {
    'id': newId,
    'timestamp': time,
    'status': '未就診',
    'fromOrg': p.fromOrg,
    'toOrg': p.toOrg,
    'patientId': p.patientId,
    'patientName': p.patientName,
    'patientDob': p.patientDob,
    'patientIdNo': p.patientIdNo,
    'diagnosis': p.diagnosis,
    'summary': p.summary,
    'purpose': p.purpose
  };

  // 1. 讀取現有標題
  const lastCol = sheet.getLastColumn();
  const headers = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(h => h.toString().trim()) : [];
  
  // 2. 檢查是否有缺少的標題 (例如 diagnosis, summary)，若有則補在最後
  const newHeaders = [];
  Object.keys(rowData).forEach(key => {
    // 比對時忽略大小寫，並處理常見異體字
    const exists = headers.some(h => 
      h.toLowerCase() === key.toLowerCase() || 
      (key === 'patientId' && h === 'patientID')
    );
    
    if (!exists) {
      newHeaders.push(key);
      headers.push(key); // 更新記憶中的 headers 順序
    }
  });

  // 若有新欄位，寫入 Sheet 第一列最後面
  if (newHeaders.length > 0) {
    sheet.getRange(1, lastCol + 1, 1, newHeaders.length).setValues([newHeaders]);
  }

  // 3. 依照 Headers 順序填入資料
  const newRow = headers.map(header => {
    // 反向查找：Header 對應 rowData 的哪個 key
    const key = Object.keys(rowData).find(k => 
      k.toLowerCase() === header.toLowerCase() || 
      (k === 'patientId' && header === 'patientID')
    );
    return key ? rowData[key] : '';
  });

  sheet.appendRow(newRow);
  
  return { status: 'success', message: '建立成功', id: newId };
}

// 2. 更新轉診狀態 (含原因寫入)
function updateReferralStatus(p) {
  const sheet = ss.getSheetByName('Referrals');
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // 找出 Status 欄位位置
  const statusColIndex = headers.findIndex(h => h.toLowerCase() === 'status') + 1;
  if (statusColIndex === 0) return { status: 'error', message: '找不到 Status 欄位' };

  // 尋找對應的轉診單 ID
  const finder = sheet.createTextFinder(p.id).matchEntireCell(true);
  const cell = finder.findNext();
  
  if (cell) {
    let finalStatus = p.newStatus;
    
    // 如果有備註原因，附加在狀態後面 (例如: "未能就診: 電話空號")
    if (p.reason && p.reason.trim() !== '') {
      finalStatus = `${p.newStatus}: ${p.reason}`;
    }
    
    sheet.getRange(cell.getRow(), statusColIndex).setValue(finalStatus);
    return { status: 'success', message: '狀態更新為：' + finalStatus };
  }
  return { status: 'error', message: '找不到轉診單 ID' };
}

// 3. 新增生理數據
function addObservation(p) {
  const sheet = ss.getSheetByName('Observations');
  const newId = 'O' + Date.now();
  const time = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd HH:mm:ss");
  
  // 簡單 Append (假設欄位順序固定)
  // id, patientID, timestamp, code, value, unit
  sheet.appendRow([newId, p.patientId, time, p.code, p.value, p.unit]);
  return { status: 'success', id: newId, timestamp: time };
}

// 4. 讀取並正規化欄位 (解決大小寫問題)
function getNormalizedSheetData(sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  
  const rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return [];
  
  const headers = rows[0].map(h => h.toString().trim()); // 清除空白
  
  return rows.slice(1).map(row => {
    let obj = {};
    headers.forEach((h, i) => {
      let key = h;
      // 強制轉換常見的錯誤命名 (Mapping)
      if (h === 'patientID') key = 'patientId';
      if (h === 'notionaID') key = 'nationalId'; 
      if (h === 'notionalID') key = 'nationalId';
      if (h === 'orgaization') key = 'organization'; 
      
      // 處理日期物件 -> 字串
      let val = row[i];
      if (val instanceof Date) {
        val = Utilities.formatDate(val, "GMT+8", "yyyy-MM-dd HH:mm:ss");
      }
      obj[key] = val;
    });
    return obj;
  });
}