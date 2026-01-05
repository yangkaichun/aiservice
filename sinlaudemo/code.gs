// ==========================================
// YangHome Health Backend API (v15 - 成人健檢資料整合版)
// ==========================================

const ss = SpreadsheetApp.getActiveSpreadsheet();

// 1. 處理 GET 請求 (保留您原有的所有讀取與單筆寫入功能，不做任何刪減)
function doGet(e) {
  const params = e.parameter;
  const action = params.action;
  let result = {};

  try {
    // --- 寫入與更新操作 (原有功能保持不變) ---
    
    // 1. 新增生理數據 & 病歷資料 (單筆)
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
      result = addPatient(params);
    }
    // 5. 新增使用者
    else if (action === 'addUser') {
      result = addUser(params);
    }
    // 6. 編輯使用者
    else if (action === 'editUser') {
      result = editUser(params);
    }
    // 7. 刪除使用者
    else if (action === 'deleteUser') {
      result = deleteUser(params.id);
    }
    // 8. 登入驗證
    else if (action === 'login') {
      const users = getNormalizedSheetData('Users');
      const user = users.find(u => u.email === params.email); 
      if(user) {
        result = { status: 'success', user: user };
      } else {
        // 若找不到人但登入成功，回傳訪客身份
        result = { status: 'success', user: { name: params.name, email: params.email, role: 'guest', organization: '訪客' } };
      }
    }

    // --- 讀取操作 (通用查詢) ---
    else if (params.endpoint) {
      // 自動對應 Sheet 名稱 (首字大寫)
      // 例如: patients -> Patients, observations -> Observations
      let sheetName = params.endpoint.charAt(0).toUpperCase() + params.endpoint.slice(1);
      
      // 特殊處理：若前端傳 'dicoms' 對應 Sheet 可能為 'Dicoms'
      // 請確保 Google Sheet 下方的頁籤名稱與此邏輯一致
      
      result = { status: 'success', data: getNormalizedSheetData(sheetName) };
    } 
    
    else {
      result = { status: 'success', message: 'YangHome API is running' };
    }

  } catch (err) {
    result = { status: 'error', message: err.toString() };
  }

  return responseJSON(result);
}

// 2. 處理 POST 請求 (處理 form.html 的評估表單存檔)
function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      return responseJSON({ status: "error", message: "No post data" });
    }

    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;

    // 處理評估表單的批次存檔
    // 包含此次新增的成人健檢欄位 (如 history_htn, lab_got, lab_gpt 等)
    if (action === "saveAssessment") {
      return handleSaveAssessment(postData);
    }

    return responseJSON({ status: "error", message: "Unknown POST action" });

  } catch (error) {
    return responseJSON({ status: "error", message: error.toString() });
  }
}

// -----------------------------------------------------------
// 核心邏輯函式
// -----------------------------------------------------------

// [核心] 批次寫入評估結果到 Observations
function handleSaveAssessment(data) {
  const sheet = ss.getSheetByName('Observations');
  if (!sheet) return responseJSON({ status: "error", message: "找不到 Observations 資料表" });

  const patientId = data.patientId;
  const now = new Date();
  const timestamp = Utilities.formatDate(now, SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "yyyy-MM-dd HH:mm:ss");
  const records = data.records; // 前端傳來的陣列

  if (!records || records.length === 0) {
    return responseJSON({ status: "error", message: "沒有資料可寫入" });
  }

  // 準備寫入資料 (二維陣列)
  // 欄位順序: id, patientID, timestamp, code, value, unit
  const newRows = records.map(record => {
    // 產生隨機 ID
    const obsId = "O" + now.getTime().toString().slice(-9) + Math.floor(Math.random() * 1000);
    return [
      obsId,
      patientId,
      timestamp,
      record.code,
      record.value,
      record.unit || ""
    ];
  });

  // 一次寫入，提升效能
  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow + 1, 1, newRows.length, 6).setValues(newRows);

  return responseJSON({ status: "success", count: newRows.length });
}

// [保留] 新增單筆觀測值 (原有功能)
function addObservation(p) {
  const sheet = ss.getSheetByName('Observations');
  if (sheet.getLastRow() === 0) {
     sheet.appendRow(['id', 'patientId', 'timestamp', 'code', 'value', 'unit']);
  }
  const newId = 'O' + Date.now();
  const time = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd HH:mm:ss");
  sheet.appendRow([newId, p.patientId, time, p.code, p.value, p.unit]);
  return { status: 'success', id: newId, timestamp: time };
}

// [保留] 新增轉診單 (原有功能)
function addReferral(p) {
  const sheet = ss.getSheetByName('Referrals');
  const newId = 'R' + Date.now();
  const time = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd HH:mm:ss");
  sheet.appendRow([newId, time, '未就診', p.fromOrg, p.toOrg, p.patientId, p.patientName, p.patientDob, p.patientIdNo, p.diagnosis, p.summary, p.purpose]);
  return { status: 'success', id: newId };
}

// [保留] 更新轉診狀態 (原有功能)
function updateReferralStatus(p) {
  const sheet = ss.getSheetByName('Referrals');
  const data = sheet.getDataRange().getValues();
  const idColIndex = 0;
  const statusColIndex = 3; // 假設 status 在第 3 欄 (C欄)
  
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][idColIndex]) === String(p.id)) {
      const finalStatus = p.status + (p.reason ? `: ${p.reason}` : '');
      sheet.getRange(i + 1, statusColIndex).setValue(finalStatus);
      return { status: 'success', message: '狀態更新為：' + finalStatus };
    }
  }
  return { status: 'error', message: '找不到轉診單 ID' };
}

// [保留] 新增病患 (原有功能)
function addPatient(params) {
  const sheet = ss.getSheetByName('Patients'); // 請確保 Sheet 名稱為 Patients
  if (!sheet) return { status: 'error', message: 'Patients sheet not found' };
  
  const newId = params.id || ('P' + new Date().getTime());
  sheet.appendRow([newId, params.name, params.nationalId, params.birthDate, params.gender]);
  return { status: 'success', message: 'Patient Added' };
}

// [保留] 使用者管理 (原有功能)
function addUser(p) {
  const sheet = ss.getSheetByName('Users');
  const newId = 'U' + Date.now();
  sheet.appendRow([newId, p.name, p.role, p.organization, p.email]);
  return { status: 'success' };
}

function editUser(p) {
  const sheet = ss.getSheetByName('Users');
  const data = sheet.getDataRange().getValues();
  for(let i=1; i<data.length; i++) {
    if(String(data[i][0]) === String(p.id)) {
      sheet.getRange(i+1, 2, 1, 4).setValues([[p.name, p.role, p.organization, p.email]]);
      return { status: 'success' };
    }
  }
  return { status: 'error', message: 'User not found' };
}

function deleteUser(id) {
  const sheet = ss.getSheetByName('Users');
  const data = sheet.getDataRange().getValues();
  for(let i=1; i<data.length; i++) {
    if(String(data[i][0]) === String(id)) {
      sheet.deleteRow(i+1);
      return { status: 'success' };
    }
  }
  return { status: 'error', message: 'User not found' };
}

// [工具] 讀取 Sheet 資料並轉為 JSON 陣列 (Key-Value)
function getNormalizedSheetData(sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return [];
  
  const headers = rows[0].map(h => h.toString().trim());
  return rows.slice(1).map(row => {
    let obj = {};
    headers.forEach((h, i) => {
      let val = row[i];
      if (val instanceof Date) {
        val = Utilities.formatDate(val, SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "yyyy-MM-dd HH:mm:ss");
      }
      obj[h] = val;
    });
    return obj;
  });
}

// [工具] 回傳 JSON 格式
function responseJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}