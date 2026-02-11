/* Code.gs - PancadAI CRM Backend */

// 設定 Sheet ID (請替換為您的 Google Sheet ID)
const SPREADSHEET_ID = '1hID8Hi42qNFyA_13BqSJgfjIE4FguQRR5wMEsXBRl0I';
const UPLOAD_FOLDER_ID = '1tmLX1lSEa_R26S5LAyIv7IPAhPuI67Db'; // 用於存儲合約和簡報

function doGet(e) {
  return ContentService.createTextOutput("PancadAI API is Running.");
}

// 處理所有 POST 請求 (CORS 處理)
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    const userEmail = data.userEmail; // 前端傳來的 Google User Email
    
    // 1. 權限驗證 (簡易版：檢查 Users Sheet 是否有此 Email 且為 Active)
    const userRole = checkUserAuth(userEmail);
    if (!userRole) {
      return responseJSON({ status: 'error', message: 'Unauthorized User' });
    }

    let result = {};

    // 2. 路由分發
    switch (action) {
      case 'getDashboardData':
        result = getDashboardData();
        break;
      case 'getHospitals':
        result = getSheetData('Hospitals');
        break;
      case 'saveHospital':
        result = saveHospital(data.payload, userEmail);
        break;
      case 'getKOLs':
        result = getKOLs();
        break;
      case 'saveKOL':
        result = saveKOL(data.payload, userEmail);
        break;
      case 'getMonthlyStats':
        result = getSheetData('Monthly_Stats');
        break;
      case 'saveMonthlyStat': // 輸入每月數據並計算分潤
        result = saveMonthlyStat(data.payload, userEmail);
        break;
      case 'uploadFile':
        result = uploadFileToDrive(data.fileData, data.fileName, data.mimeType);
        break;
      default:
        result = { status: 'error', message: 'Unknown Action' };
    }

    return responseJSON({ status: 'success', data: result, role: userRole });

  } catch (error) {
    return responseJSON({ status: 'error', message: error.toString() });
  } finally {
    lock.releaseLock();
  }
}

// --- 核心邏輯函式 ---

function checkUserAuth(email) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Users');
  const data = sheet.getDataRange().getValues();
  // Skip header
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === email && data[i][3] === 'Active') {
      return data[i][2]; // Return Role (Admin/User)
    }
  }
  return null;
}

function getDashboardData() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const hospSheet = ss.getSheetByName('Hospitals');
  const statsSheet = ss.getSheetByName('Monthly_Stats');
  
  // 取得原始資料
  const hospitals = hospSheet.getDataRange().getValues();
  const stats = statsSheet.getDataRange().getValues();

  // 計算 KPI
  let totalContractValue = 0;
  let regionStats = {};
  let levelStats = {};
  
  // 遍歷醫院 (Skip header)
  for (let i = 1; i < hospitals.length; i++) {
    const row = hospitals[i];
    if (row[5] === '已簽約') { // Status
      totalContractValue += (Number(row[9]) || 0); // Contract_Amount
      
      // 區域統計
      let region = row[2];
      regionStats[region] = (regionStats[region] || 0) + 1;
      
      // 規模統計
      let level = row[4];
      levelStats[level] = (levelStats[level] || 0) + 1;
    }
  }

  return {
    kpi: {
      totalContractValue: totalContractValue,
      regionStats: regionStats,
      levelStats: levelStats
    },
    rawStats: stats.slice(1) // 傳回統計數據供前端畫圖
  };
}

function saveMonthlyStat(payload, user) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Monthly_Stats');
  
  // 計算邏輯：分潤計算
  // 假設 payload 包含: hospitalId, yearMonth, usageCount, selfPayPrice, discount, ebmShareRatio
  const revenue = payload.usageCount * payload.selfPayPrice * (1 - (payload.discount/100));
  // EBM 分潤扣除 (例如 revenue * (1 - shareRatio))
  const netRevenue = revenue * (1 - (payload.ebmShareRatio/100));

  const rowData = [
    Utilities.getUuid(), // ID
    payload.hospitalId,
    payload.yearMonth,
    payload.usageCount,
    revenue,
    payload.selfPayPrice,
    payload.discount,
    netRevenue,
    'Unpaid', // Default status
    new Date()
  ];
  
  sheet.appendRow(rowData);
  logAction(user, 'Add Monthly Stat', `Hospital: ${payload.hospitalId}, Rev: ${revenue}`);
  return { status: 'saved', netRevenue: netRevenue };
}

function saveHospital(payload, user) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Hospitals');
  // 簡易 Upsert 邏輯：如果有 ID 則更新，無則新增
  // 實際開發可根據 payload.hospitalId 搜尋並更新
  // 這裡示範新增
  const id = payload.hospitalId || Utilities.getUuid();
  const row = [
    id, payload.name, payload.region, payload.address, payload.level,
    payload.status, payload.exclusivity, payload.contractStart, payload.contractEnd,
    payload.contractAmount, payload.contractLink, payload.ebmShare, payload.salesRep, new Date()
  ];
  sheet.appendRow(row);
  return { id: id };
}

function getKOLs() {
    // 這裡應包含 Join Logic (把 Hospital Name 帶進來)，為簡化直接回傳
    return getSheetData('KOLs');
}

// 通用讀取
function getSheetData(sheetName) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1).map(row => {
    let obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
  return rows;
}

// 檔案上傳
function uploadFileToDrive(base64Data, fileName, mimeType) {
  const folder = DriveApp.getFolderById(UPLOAD_FOLDER_ID);
  const decoded = Utilities.base64Decode(base64Data);
  const blob = Utilities.newBlob(decoded, mimeType, fileName);
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return { url: file.getUrl(), id: file.getId() };
}

// Helper: Log
function logAction(user, action, details) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Logs');
  sheet.appendRow([new Date(), user, action, details]);
}

// Helper: JSON Response
function responseJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}