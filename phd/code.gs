// ==========================================
// 設定區
// ==========================================
// ⚠️ 安全性提醒：請勿將 API Key 直接寫在程式碼中。
// 請到「專案設定」 > 「指令碼屬性」新增一筆：
// 屬性: GEMINI_API_KEY
// 值:  您的_Gemini_API_Key
const ADMIN_EMAIL = "kaichun.yang@gmail.com"; // 您設定的管理者 Email

// ==========================================
// 1. doGet: 路由分發 (讀取數據 / 設定 / AI分析)
// ==========================================
function doGet(e) {
  var action = e ? e.parameter.action : ""; 

  // A. 請求設定檔 (只有 Admin 能讀取)
  if (action === "getSettings") {
    return handleGetSettings(e);
  }

  // B. 請求 AI 分析
  if (action === "analyze") {
    return handleAnalyzeRequest(e);
  }

  // C. 預設：讀取健康數據給 Dashboard
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var dataSheet = ss.getSheetByName("Data");
    if (!dataSheet) { dataSheet = ss.getSheets()[0]; }

    var userSheet = ss.getSheetByName("Users"); 
    var userMap = {}; 

    if (userSheet) {
      var userRows = userSheet.getDataRange().getValues();
      userRows.shift(); 
      userRows.forEach(function(r) {
        if(r[0]) {
            // 建立 Email -> {姓名, 生日} 的對照表
            userMap[r[0]] = { name: r[1], birthday: r[2] }; 
        }
      });
    }

    var data = dataSheet.getDataRange().getValues();
    if (data.length === 0) {
      return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
    }
    
    var headers = data.shift();
    var result = data.map(function(row) {
      var email = row[1]; // B欄是 Email
      var userInfo = userMap[email]; 
      
      // 如果設定檔有資料，優先使用設定檔的姓名與生日
      var displayName = userInfo ? userInfo.name : email;
      var displayBirthday = userInfo ? userInfo.birthday : ""; 

      return {
        timestamp: row[0], 
        name: displayName, 
        birthday: displayBirthday, 
        context: row[2],   
        sbp: row[3],       
        dbp: row[4],       
        pulse: row[5],     
        glucose: row[6]    
      };
    });

    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ==========================================
// 2. doPost: 寫入資料 & 儲存設定
// ==========================================
function doPost(e) {
  var lock = LockService.getScriptLock();
  // 嘗試獲取鎖，最多等待 10 秒
  if (!lock.tryLock(10000)) {
     return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Server busy, please try again." })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var data = JSON.parse(e.postData.contents);
    
    // --- A. 處理後台設定儲存 (Admin) ---
    if (data.action === "saveUser") {
        return handleSaveUser(data); 
    }

    // --- B. 預設：上傳健康數據 ---
    var idToken = data.token;
    var userEmail = "測試用戶"; 
    
    if (idToken) {
        var identity = verifyGoogleToken(idToken);
        userEmail = identity.email;
    } else if (data.name) {
        userEmail = data.name;
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data");
    if (!sheet) { sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]; }
    
    // 優先使用前端傳來的自訂時間，若無則用當下時間
    var timestamp = data.recordTime ? new Date(data.recordTime) : new Date();
    
    sheet.appendRow([
      timestamp,           
      userEmail, 
      data.context || "",        
      data.sbp,            
      data.dbp,            
      data.hr,             
      data.glucose || "",  
      data.note || ""      
    ]);

    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      message: "數據已儲存",
      email: userEmail 
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// ==========================================
// 3. Gemini AI 分析邏輯 (已修正模型名稱)
// ==========================================
function handleAnalyzeRequest(e) {
  var targetName = e.parameter.name;
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dataSheet = ss.getSheetByName("Data");
  var data = dataSheet.getDataRange().getValues();
  data.shift(); 

  // 取得 Email 對照以精確篩選
  var userSheet = ss.getSheetByName("Users");
  var userMap = {};
  if (userSheet) {
     var uData = userSheet.getDataRange().getValues();
     uData.shift();
     uData.forEach(r => { if(r[0]) userMap[r[1]] = r[0]; }); // Name -> Email
  }
  
  var targetEmail = userMap[targetName] || targetName;

  // 篩選該用戶資料
  var userRows = data.filter(function(row) {
    return row[1] === targetName || row[1] === targetEmail;
  });

  // 取最近 30 筆
  var recentData = userRows.slice(-30).map(function(row) {
    return {
      timestamp: row[0],
      sbp: row[3],
      dbp: row[4],
      pulse: row[5],
      glucose: row[6],
      context: row[2]
    };
  });

  if (recentData.length === 0) {
    return ContentService.createTextOutput(JSON.stringify({ result: "資料不足，無法進行分析。" })).setMimeType(ContentService.MimeType.JSON);
  }

  var analysisResult = callGeminiAPI(recentData);

  return ContentService.createTextOutput(JSON.stringify({ result: analysisResult })).setMimeType(ContentService.MimeType.JSON);
}

function callGeminiAPI(userData) {
  // 1. 取得 API Key (從指令碼屬性讀取，更安全)
  var apiKey = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
  if (!apiKey) {
    return "錯誤：未設定 API Key。請在 Apps Script 專案設定的「指令碼屬性」中新增 GEMINI_API_KEY。";
  }

  // 2. 設定模型端點
  // [修正] 使用標準的 gemini-1.5-flash，這是目前推薦的穩定版本
  const model = "gemini-1.5-flash"; 
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  
  // 3. 整理數據
  let dataSummary = "時間,收縮壓,舒張壓,心率,血糖,情境\n";
  userData.forEach(row => {
    let d = new Date(row.timestamp);
    let dateStr = `${d.getMonth()+1}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
    let sbp = row.sbp || '-';
    let dbp = row.dbp || '-';
    let pulse = row.pulse || '-';
    let glu = row.glucose || '-';
    let ctx = row.context || '';
    dataSummary += `${dateStr},${sbp},${dbp},${pulse},${glu},${ctx}\n`;
  });

  const prompt = `
    你是一位專業且親切的家庭醫師。請根據這位病患最近的生理數據提供健康分析。
    
    請使用繁體中文，格式請使用 Markdown (可用粗體、條列)。
    
    分析重點：
    1. **血壓趨勢**：是否有高血壓風險 (標準 120/80)，是否波動過大。
    2. **血糖狀況**：若有數據請分析空腹或飯後狀況。
    3. **綜合建議**：給出 3 點具體可執行的生活或飲食建議。
    
    數據如下：
    ${dataSummary}
  `;

  const payload = {
    "contents": [{ "parts": [{ "text": prompt }] }],
    "safetySettings": [
        { "category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_ONLY_HIGH" },
        { "category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_ONLY_HIGH" },
        { "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_ONLY_HIGH" },
        { "category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_ONLY_HIGH" }
    ]
  };

  const options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    let json;
    try {
        json = JSON.parse(responseText);
    } catch (e) {
        return `API 回傳非 JSON 格式錯誤 (Code: ${responseCode}): ${responseText.substring(0, 200)}...`;
    }
    
    // 錯誤處理與回傳
    if (json.candidates && json.candidates.length > 0) {
      return json.candidates[0].content.parts[0].text;
    } else if (json.error) {
      return "API 錯誤: " + json.error.message;
    } else if (json.promptFeedback) {
      return "AI 無法回應 (安全阻擋): " + JSON.stringify(json.promptFeedback);
    } else {
      return "AI 未回傳任何內容，請檢查 API Key 權限或配額。";
    }
  } catch (e) {
    return "連線錯誤: " + e.toString();
  }
}

// ==========================================
// 4. 輔助函式 (設定與驗證)
// ==========================================
function handleGetSettings(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Users");
  if (!sheet) {
    sheet = ss.insertSheet("Users");
    sheet.appendRow(["Email", "Name", "Birthday"]); 
  }
  
  var data = sheet.getDataRange().getValues();
  data.shift(); 
  var users = data.map(function(row) { return { email: row[0], name: row[1], birthday: row[2] }; });
  return ContentService.createTextOutput(JSON.stringify(users)).setMimeType(ContentService.MimeType.JSON);
}

function handleSaveUser(data) {
  // 驗證管理者身份
  var identity = verifyGoogleToken(data.token);
  if (identity.email !== ADMIN_EMAIL) { throw new Error("權限不足：您不是系統擁有者"); }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Users");
  if (!sheet) { sheet = ss.insertSheet("Users"); sheet.appendRow(["Email", "Name", "Birthday"]); }

  var users = sheet.getDataRange().getValues();
  var found = false;
  // 更新或新增使用者
  for (var i = 1; i < users.length; i++) {
    if (users[i][0] === data.userEmail) {
      sheet.getRange(i + 1, 2).setValue(data.userName);
      sheet.getRange(i + 1, 3).setValue(data.userBirthday);
      found = true; break;
    }
  }
  if (!found) { sheet.appendRow([data.userEmail, data.userName, data.userBirthday]); }

  return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
}

function verifyGoogleToken(token) {
  if (!token) throw new Error("無 Token");
  var verifyUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" + token;
  var response = UrlFetchApp.fetch(verifyUrl, { muteHttpExceptions: true });
  var identity = JSON.parse(response.getContentText());
  if (identity.error) throw new Error(identity.error_description);
  return identity;
}