// ==========================================
// YangHome Health Backend API (v2.0 Fixed)
// ==========================================

// 設定試算表 (自動取得當前綁定的試算表)
const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
const SHEET_USERS = "Users";
const SHEET_DATA = "Data";

// 請在「專案設定」->「指令碼屬性」中設定 GEMINI_API_KEY，或在此處填入
const GEMINI_API_KEY = PropertiesService.getScriptProperties().getProperty("AIzaSyDnRyQUyW-0EgB0hSzyPFZu6mT_0L12xSg") || "在此填入您的GeminiAPIKey";

/**
 * 處理 GET 請求 (讀取資料)
 */
function doGet(e) {
  const action = e.parameter.action;
  
  if (action === "login") {
    return handleLogin(e);
  } else if (action === "getData") {
    return handleGetData(e);
  } else if (action === "getSettings") {
    return handleGetSettings(e);
  } else if (action === "askAI") {
    return handleAskAI(e);
  }

  return responseJSON({ error: "Unknown action" });
}

/**
 * 處理 POST 請求 (寫入/更新資料)
 */
function doPost(e) {
  try {
    // 處理 CORS 預檢請求或空內容
    if (!e.postData || !e.postData.contents) {
      return responseJSON({ status: "success", message: "CORS preflight" });
    }

    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    if (action === "addData") {
      return handleAddData(data);
    } else if (action === "updateProfile") {
      return handleUpdateProfile(data);
    }
    
    return responseJSON({ error: "Unknown action" });
  } catch (err) {
    return responseJSON({ error: "Invalid JSON data", details: err.message });
  }
}

// ----------------------------------------------------------------
// 核心邏輯函式
// ----------------------------------------------------------------

// 1. 登入驗證
function handleLogin(e) {
  const email = e.parameter.email;
  const uid = e.parameter.uid; 
  
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_USERS);
  const rows = sheet.getDataRange().getValues();
  
  // Users Sheet 結構: [UID, Email, Name, Birthday, Role, Provider, LineUserId]
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    // 比對 Email (忽略大小寫) 和 UID
    if (String(row[1]).toLowerCase() === String(email).toLowerCase() && 
        String(row[0]) === String(uid)) {
      
      return responseJSON({
        success: true,
        user: {
          uid: row[0],
          email: row[1],
          name: row[2],
          role: row[4] || 'user'
        }
      });
    }
  }
  
  return responseJSON({ success: false, message: "帳號或 UID 錯誤" });
}

// 2. 取得使用者列表 (給 Dashboard 左側選單 & Admin 用)
function handleGetSettings(e) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_USERS);
  const rows = sheet.getDataRange().getValues();
  
  // 跳過標題列
  const users = rows.slice(1).map(row => {
    return {
      uid: row[0],
      email: row[1],
      name: row[2],
      birthday: formatDate(row[3]),
      role: row[4],
      provider: row[5]
    };
  });
  
  return responseJSON(users);
}

// 3. [修正] 取得歷史數據
// 對應 Data.csv 結構: Timestamp(A), UID(B), Context(C), SBP(D), DBP(E), HR(F), Glucose(G), Note(H)
function handleGetData(e) {
  const uid = e.parameter.uid;
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_DATA);
  const data = sheet.getDataRange().getValues();
  
  const result = [];
  
  // 從最後一筆開始讀取 (倒序)，讓最新的資料排在前面
  for (let i = data.length - 1; i >= 1; i--) {
    const row = data[i];
    // 比對 UID (B欄 / Index 1)
    if (String(row[1]) === String(uid)) {
      result.push({
        date: row[0],       // A欄: Timestamp
        // uid: row[1],     // B欄 (前端已有，可不傳)
        context: row[2],    // C欄: Context (情境)
        sbp: row[3],        // D欄: 收縮壓
        dbp: row[4],        // E欄: 舒張壓
        hr: row[5],         // F欄: 心率
        glucose: row[6],    // G欄: 血糖
        note: row[7],       // H欄: 備註
        
        // 為了相容舊版前端邏輯，我們可以補上 type 與 value (可選)
        // type: row[6] ? 'BloodSugar' : 'BloodPressure',
        // value: row[6] ? row[6] : (row[3] ? `${row[3]}/${row[4]}` : '')
      });
    }
  }
  
  return responseJSON(result);
}

// 4. [修正] 新增健康數據
function handleAddData(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_DATA);
  const timestamp = new Date(); // 當前時間
  
  // Data Sheet 欄位: [Timestamp, UID, Context, SBP, DBP, HR, Glucose, Note]
  // 預設為空字串
  let context = '';
  let sbp = '';
  let dbp = '';
  let hr = '';
  let glucose = '';
  let note = data.note || '';

  if (data.type === 'BloodPressure') {
    // 血壓模式
    sbp = data.sbp;
    dbp = data.dbp;
    hr = data.hr;
    context = "一般量測"; // 預設情境
  } else if (data.type === 'BloodSugar') {
    // 血糖模式
    glucose = data.bs;
    // 將前端的 code 轉換為中文 Context
    const timeMap = {
      'fasting': '空腹',
      'postprandial': '飯後',
      'wakeup': '起床',
      'bedtime': '睡前'
    };
    context = timeMap[data.time] || data.time || '其他';
  }
  
  // 寫入 Sheet
  sheet.appendRow([
    timestamp,
    data.uid,
    context,
    sbp,
    dbp,
    hr,
    glucose,
    note
  ]);
  
  return responseJSON({ success: true, message: "Data added" });
}

// 5. 更新使用者資料
function handleUpdateProfile(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_USERS);
  const rows = sheet.getDataRange().getValues();
  const email = data.userEmail;
  
  for (let i = 1; i < rows.length; i++) {
    // 比對 Email (B欄)
    if (rows[i][1] === email) { 
      // 更新 C欄(Name) 和 D欄(Birthday)
      sheet.getRange(i + 1, 3).setValue(data.userName);
      sheet.getRange(i + 1, 4).setValue("'" + data.userBirthday); // 強制字串避免格式跑掉
      
      return responseJSON({ success: true, message: "Profile updated" });
    }
  }
  return responseJSON({ success: false, message: "User not found" });
}

// 6. Gemini AI 分析
function handleAskAI(e) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY.includes("填入")) {
    return responseJSON({ result: "系統錯誤：未設定 Gemini API Key。" });
  }

  const uid = e.parameter.uid;
  // 取得該用戶最近 10 筆數據作為 Context
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_DATA);
  const data = sheet.getDataRange().getValues();
  let historyText = "";
  let count = 0;
  
  // 倒序找資料
  for (let i = data.length - 1; i >= 1; i--) {
    if (String(data[i][1]) === String(uid)) {
      const row = data[i];
      const date = formatDate(row[0]);
      // 簡單格式化數據
      let record = `[${date}] 情境:${row[2]}`;
      if(row[3]) record += `, 血壓:${row[3]}/${row[4]}, 心率:${row[5]}`;
      if(row[6]) record += `, 血糖:${row[6]}`;
      if(row[7]) record += `, 備註:${row[7]}`;
      
      historyText += record + "\n";
      count++;
      if (count >= 10) break;
    }
  }

  if (!historyText) {
    return responseJSON({ result: "目前沒有足夠的數據可供 AI 分析。" });
  }

  const prompt = `你是一位專業的健康管理顧問。請根據這位使用者的最近生理數據給予簡短的健康評估與建議(繁體中文)。
  
數據如下：
${historyText}

請分析血壓和血糖的趨勢，並給出飲食或生活作息的建議。語氣要親切、專業。`;

  const response = callGemini(prompt);
  return responseJSON({ result: response });
}

// ----------------------------------------------------------------
// 工具函式
// ----------------------------------------------------------------

function responseJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function formatDate(dateInput) {
  if (!dateInput) return '';
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    return Utilities.formatDate(d, SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "yyyy-MM-dd");
  } catch (e) {
    return '';
  }
}

function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const payload = {
    contents: [{
      parts: [{ text: prompt }]
    }]
  };
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    const json = JSON.parse(response.getContentText());
    
    if (json.candidates && json.candidates.length > 0) {
      return json.candidates[0].content.parts[0].text;
    } else if (json.error) {
      return "AI 錯誤: " + json.error.message;
    } else {
      return "AI 無法產生回應。";
    }
  } catch (e) {
    return "連線錯誤: " + e.toString();
  }
}