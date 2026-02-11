const SPREADSHEET_ID = '1yblDhfRoDT-Bb0MqdSW_Wun7-QxDOQ5qtKp7K4kkz30'; // <--- 請填入
const CLIENT_ID = '442690120777-f3skgcs0a38bfdieu7co92343l1c3kmd.apps.googleusercontent.com'; // <--- 請填入剛剛申請的 Client ID

/* =========================================
   API 入口 (只處理 POST)
   為了避開 CORS Preflight 問題，我們統一用 POST + text/plain 傳輸
   ========================================= */
function doPost(e) {
  try {
    // 1. 解析前端傳來的資料
    const request = JSON.parse(e.postData.contents);
    const action = request.action;
    const token = request.token;
    const payload = request.payload;

    // 2. 身分驗證 (Verify Token)
    const userEmail = verifyGoogleToken(token);
    if (!userEmail) {
      return responseJSON({ success: false, message: 'Invalid Token' });
    }

    // 3. 權限檢查 (Whitelist)
    const auth = checkUserPermission(userEmail);
    if (!auth.allowed) {
      return responseJSON({ success: false, message: 'Permission Denied: ' + userEmail });
    }

    // 4. 路由處理 (Router)
    let result = {};
    switch (action) {
      case 'getDashboard':
        result = getDashboardStats();
        break;
      case 'getRadarList':
        result = getRadarList();
        break;
      case 'updateStatus':
        result = updateHospitalStatus(payload.id, payload.status, payload.note, auth.email);
        break;
      case 'checkLogin':
        // 僅回傳使用者資訊
        result = { user: auth };
        break;
      default:
        throw new Error('Unknown Action');
    }

    return responseJSON({ success: true, data: result });

  } catch (err) {
    return responseJSON({ success: false, message: err.toString() });
  }
}

/* =========================================
   輔助函式
   ========================================= */

// 回傳 JSON 格式 (處理 CORS)
function responseJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// 驗證 Google ID Token
function verifyGoogleToken(token) {
  try {
    // 呼叫 Google 官方 API 驗證 Token
    const url = 'https://oauth2.googleapis.com/tokeninfo?id_token=' + token;
    const response = UrlFetchApp.fetch(url);
    const data = JSON.parse(response.getContentText());
    
    // 確保 Token 是發給我們自己的 Client ID (安全性檢查)
    if (data.aud !== CLIENT_ID) return null;
    
    return data.email;
  } catch (e) {
    return null;
  }
}

// 權限檢查 (讀取 Sheet)
function checkUserPermission(email) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('User_Auth');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === email && data[i][3] === 'Active') {
      return { allowed: true, role: data[i][2], name: data[i][1], email: email };
    }
  }
  return { allowed: false, email: email };
}

// 取得儀表板數據
function getDashboardStats() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const hSheet = ss.getSheetByName('Hospital_Master');
  const mSheet = ss.getSheetByName('Monthly_Stats');
  const hData = hSheet.getDataRange().getValues();
  const mData = mSheet.getDataRange().getValues();
  
  let stats = { totalContractValue: 0, activeContracts: 0, netRevenue: 0 };

  for(let i=1; i<hData.length; i++) {
    if(hData[i][5] === '已簽約') {
      stats.activeContracts++;
      stats.totalContractValue += Number(hData[i][8] || 0);
    }
  }
  for(let i=1; i<mData.length; i++) {
    stats.netRevenue += Number(mData[i][6] || 0);
  }
  return stats;
}

// 取得雷達列表
function getRadarList() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Hospital_Master');
  const data = sheet.getDataRange().getValues();
  // 簡化回傳
  return data.slice(1).map(row => ({
    Hospital_ID: row[0], Name: row[1], Region: row[2], 
    Scale: row[4], Touch_Status: row[5], Owner: row[6], Note: row[11]
  }));
}

// 更新狀態
function updateHospitalStatus(id, status, note, userEmail) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Hospital_Master');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == id) {
      if (status) sheet.getRange(i + 1, 6).setValue(status);
      if (note) sheet.getRange(i + 1, 12).setValue(note);
      sheet.getRange(i + 1, 13).setValue(new Date());
      // 可以在這裡加 Log 紀錄是誰改的 (userEmail)
      return "Updated";
    }
  }
  throw new Error("ID Not Found");
}