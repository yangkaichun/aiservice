// ==========================================
// YangHome Health Backend API (v16 - HAH Module Added)
// ==========================================

const ss = SpreadsheetApp.getActiveSpreadsheet();

// [設定] 資料表名稱定義
const SHEET_USERS = "Users";
const SHEET_PATIENTS = "Patients"; // 若您的表名是小寫 patients，請自行修改
const SHEET_OBSERVATIONS = "Observations";
const SHEET_DICOMS = "Dicoms";
const SHEET_REFERRALS = "Referrals";
const SHEET_HAH_CASES = "HAH_Cases"; // [NEW] 請務必在 Google Sheet 新增此頁籤

// 1. 處理 GET 請求 (保留原有功能 + 新增 HAH 讀取)
function doGet(e) {
  const params = e.parameter;
  const action = params.action;
  let result = {};

  try {
    // --- 寫入與更新操作 (原有功能) ---
    if (action === 'addObservation') {
      result = addObservation(params);
    }
    else if (action === 'addReferral') {
      result = addReferral(params);
    }
    else if (action === 'updateReferralStatus') {
      result = updateReferralStatus(params);
    }
    else if (action === 'addPatient') {
      result = addPatient(params);
    }
    else if (action === 'addUser') {
      result = addUser(params);
    }
    else if (action === 'editUser') {
      result = editUser(params);
    }
    else if (action === 'deleteUser') {
      result = deleteUser(params.id);
    }
    else if (action === 'login') {
      const users = getNormalizedSheetData(SHEET_USERS);
      const user = users.find(u => u.email === params.email); 
      if(user) {
        result = { status: 'success', user: user };
      } else {
        result = { status: 'success', user: { name: params.name, email: params.email, role: 'guest', organization: '訪客' } };
      }
    }

    // --- 讀取操作 (通用查詢) ---
    else if (params.endpoint) {
      let sheetName = "";
      // 自動對應或手動指定
      switch(params.endpoint) {
        case 'users': sheetName = SHEET_USERS; break;
        case 'patients': sheetName = SHEET_PATIENTS; break;
        case 'observations': sheetName = SHEET_OBSERVATIONS; break;
        case 'dicoms': sheetName = SHEET_DICOMS; break;
        case 'referrals': sheetName = SHEET_REFERRALS; break;
        case 'hah_cases': sheetName = SHEET_HAH_CASES; break; // [NEW] HAH 案件讀取
        default: sheetName = params.endpoint.charAt(0).toUpperCase() + params.endpoint.slice(1);
      }
      
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

// 2. 處理 POST 請求 (處理表單與 HAH 操作)
function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      return responseJSON({ status: "error", message: "No post data" });
    }

    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;

    // 處理評估表單存檔 (包含 HAH 護理紀錄)
    if (action === "saveAssessment") {
      return handleSaveAssessment(postData);
    }
    // [NEW] HAH 開案
    if (action === "addHahCase") {
      return handleAddHahCase(postData);
    }
    // [NEW] HAH 結案
    if (action === "closeHahCase") {
      return handleCloseHahCase(postData);
    }

    return responseJSON({ status: "error", message: "Unknown POST action" });

  } catch (error) {
    return responseJSON({ status: "error", message: error.toString() });
  }
}

// -----------------------------------------------------------
// HAH 專屬邏輯 [NEW]
// -----------------------------------------------------------

function handleAddHahCase(data) {
  const sheet = ss.getSheetByName(SHEET_HAH_CASES);
  if (!sheet) return responseJSON({ status: "error", message: `找不到 ${SHEET_HAH_CASES} 資料表` });

  const newId = "HAH" + new Date().getTime();
  // 欄位順序: id, patientId, patientName, nationalId, diagnosis, startDate, endDate, physician, nurse, status, meetLink
  sheet.appendRow([
    newId,
    data.patientId,
    data.patientName,
    data.nationalId,
    data.diagnosis,
    data.startDate,
    "", // endDate 初始為空
    data.physician,
    data.nurse,
    "Active",
    "https://meet.google.com/new" // 模擬產生視訊連結，實務上可串接 Google Calendar API
  ]);

  return responseJSON({ status: "success", id: newId });
}

function handleCloseHahCase(data) {
  const sheet = ss.getSheetByName(SHEET_HAH_CASES);
  if (!sheet) return responseJSON({ status: "error", message: "找不到資料表" });
  
  const rows = sheet.getDataRange().getValues();
  // 假設 ID 在第 1 欄 (index 0)
  // 假設 endDate 在第 7 欄 (index 6)
  // 假設 status 在第 10 欄 (index 9)
  
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(data.id)) {
      sheet.getRange(i + 1, 7).setValue(data.endDate); // 更新結案日
      sheet.getRange(i + 1, 10).setValue("Closed");    // 更新狀態
      return responseJSON({ status: "success" });
    }
  }
  return responseJSON({ status: "error", message: "Case not found" });
}

// -----------------------------------------------------------
// 核心邏輯函式 (原有功能保持不變)
// -----------------------------------------------------------

function handleSaveAssessment(data) {
  const sheet = ss.getSheetByName(SHEET_OBSERVATIONS);
  if (!sheet) return responseJSON({ status: "error", message: "找不到 Observations 資料表" });

  const patientId = data.patientId;
  const now = new Date();
  const timestamp = Utilities.formatDate(now, SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "yyyy-MM-dd HH:mm:ss");
  const records = data.records; 

  if (!records || records.length === 0) {
    return responseJSON({ status: "error", message: "沒有資料可寫入" });
  }

  const newRows = records.map(record => {
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

  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow + 1, 1, newRows.length, 6).setValues(newRows);

  return responseJSON({ status: "success", count: newRows.length });
}

// [保留] 新增單筆觀測值
function addObservation(p) {
  const sheet = ss.getSheetByName(SHEET_OBSERVATIONS);
  if (sheet.getLastRow() === 0) sheet.appendRow(['id', 'patientId', 'timestamp', 'code', 'value', 'unit']);
  const newId = 'O' + Date.now();
  const time = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd HH:mm:ss");
  sheet.appendRow([newId, p.patientId, time, p.code, p.value, p.unit]);
  return { status: 'success', id: newId, timestamp: time };
}

// [保留] 新增轉診單
function addReferral(p) {
  const sheet = ss.getSheetByName(SHEET_REFERRALS);
  const newId = 'R' + Date.now();
  const time = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd HH:mm:ss");
  sheet.appendRow([newId, time, '未就診', p.fromOrg, p.toOrg, p.patientId, p.patientName, p.patientDob, p.patientIdNo, p.diagnosis, p.summary, p.purpose]);
  return { status: 'success', id: newId };
}

// [保留] 更新轉診狀態
function updateReferralStatus(p) {
  const sheet = ss.getSheetByName(SHEET_REFERRALS);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(p.id)) {
      const finalStatus = p.status + (p.reason ? `: ${p.reason}` : '');
      sheet.getRange(i + 1, 3).setValue(finalStatus);
      return { status: 'success', message: '狀態更新為：' + finalStatus };
    }
  }
  return { status: 'error', message: '找不到轉診單 ID' };
}

// [保留] 新增病患
function addPatient(params) {
  const sheet = ss.getSheetByName(SHEET_PATIENTS); 
  if (!sheet) return { status: 'error', message: 'Patients sheet not found' };
  const newId = params.id || ('P' + new Date().getTime());
  sheet.appendRow([newId, params.name, params.nationalId, params.birthDate, params.gender]);
  return { status: 'success', message: 'Patient Added' };
}

// [保留] 使用者管理
function addUser(p) { ss.getSheetByName(SHEET_USERS).appendRow(['U'+Date.now(), p.name, p.role, p.organization, p.email]); return { status: 'success' }; }
function editUser(p) { const sheet = ss.getSheetByName(SHEET_USERS); const data = sheet.getDataRange().getValues(); for(let i=1; i<data.length; i++) { if(String(data[i][0]) === String(p.id)) { sheet.getRange(i+1, 2, 1, 4).setValues([[p.name, p.role, p.organization, p.email]]); return { status: 'success' }; } } return { status: 'error' }; }
function deleteUser(id) { const sheet = ss.getSheetByName(SHEET_USERS); const data = sheet.getDataRange().getValues(); for(let i=1; i<data.length; i++) { if(String(data[i][0]) === String(id)) { sheet.deleteRow(i+1); return { status: 'success' }; } } return { status: 'error' }; }

// [工具] 讀取 Sheet 資料
function getNormalizedSheetData(sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return [];
  const headers = rows[0].map(h => h.toString().trim());
  return rows.slice(1).map(row => {
    let obj = {}; headers.forEach((h, i) => { let val = row[i]; if (val instanceof Date) val = Utilities.formatDate(val, SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "yyyy-MM-dd HH:mm:ss"); obj[h] = val; });
    return obj;
  });
}

function responseJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}