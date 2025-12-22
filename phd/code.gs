// ==========================================
// YangHome Health Backend API (v2.3 - Gemini 2.0)
// ==========================================

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
const SHEET_USERS = "Users";
const SHEET_DATA = "Data";

// 請填入您的 API Key
const GEMINI_API_KEY = "AIzaSyDnRyQUyW-0EgB0hSzyPFZu6mT_0L12xSg"; 

function doGet(e) {
  const action = e.parameter.action;
  
  if (action === "login") return handleLogin(e);
  if (action === "getData") return handleGetData(e);
  if (action === "getSettings") return handleGetSettings(e);
  if (action === "askAI") return handleAskAI(e);

  return responseJSON({ error: "Unknown action" });
}

function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      return responseJSON({ status: "success", message: "CORS preflight" });
    }
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    if (action === "addData") return handleAddData(data);
    if (action === "updateProfile") return handleUpdateProfile(data);
    
    return responseJSON({ error: "Unknown action" });
  } catch (err) {
    return responseJSON({ error: "Invalid JSON data", details: err.message });
  }
}

// --- 核心邏輯 ---

function handleLogin(e) {
  const email = e.parameter.email;
  const uid = e.parameter.uid; 
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_USERS);
  const rows = sheet.getDataRange().getValues();
  
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (String(row[1]).toLowerCase() === String(email).toLowerCase() && String(row[0]) === String(uid)) {
      return responseJSON({
        success: true,
        user: { uid: row[0], email: row[1], name: row[2], role: row[4] || 'user' }
      });
    }
  }
  return responseJSON({ success: false, message: "帳號或 UID 錯誤" });
}

function handleGetSettings(e) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_USERS);
  const rows = sheet.getDataRange().getValues();
  const users = rows.slice(1).map(row => ({
    uid: row[0], email: row[1], name: row[2], birthday: formatDate(row[3]), role: row[4], provider: row[5]
  }));
  return responseJSON(users);
}

function handleGetData(e) {
  const uid = e.parameter.uid;
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_DATA);
  const data = sheet.getDataRange().getValues();
  const result = [];
  
  for (let i = data.length - 1; i >= 1; i--) {
    const row = data[i];
    if (String(row[1]) === String(uid)) {
      result.push({
        date: row[0], context: row[2], sbp: row[3], dbp: row[4], hr: row[5], glucose: row[6], note: row[7]
      });
    }
  }
  return responseJSON(result);
}

function handleAddData(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_DATA);
  const timestamp = new Date();
  
  let context = '', sbp = '', dbp = '', hr = '', glucose = '', note = data.note || '';

  if (data.type === 'BloodPressure') {
    sbp = data.sbp; dbp = data.dbp; hr = data.hr; context = "一般量測";
  } else if (data.type === 'BloodSugar') {
    glucose = data.bs;
    const timeMap = { 'fasting': '空腹', 'postprandial': '飯後', 'wakeup': '起床', 'bedtime': '睡前' };
    context = timeMap[data.time] || data.time || '其他';
  }
  
  sheet.appendRow([timestamp, data.uid, context, sbp, dbp, hr, glucose, note]);
  return responseJSON({ success: true, message: "Data added" });
}

function handleUpdateProfile(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_USERS);
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][1] === data.userEmail) { 
      sheet.getRange(i + 1, 3).setValue(data.userName);
      sheet.getRange(i + 1, 4).setValue("'" + data.userBirthday);
      return responseJSON({ success: true, message: "Profile updated" });
    }
  }
  return responseJSON({ success: false, message: "User not found" });
}

function handleAskAI(e) {
  if (!GEMINI_API_KEY) return responseJSON({ result: "錯誤：未設定 Gemini API Key。" });

  const uid = e.parameter.uid;
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_DATA);
  const data = sheet.getDataRange().getValues();
  let historyText = "";
  let count = 0;
  
  for (let i = data.length - 1; i >= 1; i--) {
    if (String(data[i][1]) === String(uid)) {
      const row = data[i];
      let record = `[${formatDate(row[0])}] 情境:${row[2]}`;
      if(row[3]) record += `, 血壓:${row[3]}/${row[4]}, 心率:${row[5]}`;
      if(row[6]) record += `, 血糖:${row[6]}`;
      if(row[7]) record += `, 備註:${row[7]}`;
      historyText += record + "\n";
      count++;
      if (count >= 10) break;
    }
  }

  if (!historyText) return responseJSON({ result: "目前沒有足夠的數據可供 AI 分析。" });

  const prompt = `你是一位專業的家庭健康顧問。請根據以下使用者的生理數據給予簡短的健康評估與建議。
  請使用「台灣繁體中文」回答，語氣要親切、正面且專業。請針對異常數值給予具體的生活作息或飲食建議。
  
  數據如下：
  ${historyText}`;

  const response = callGemini(prompt);
  return responseJSON({ result: response });
}

function responseJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function formatDate(dateInput) {
  if (!dateInput) return '';
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    return Utilities.formatDate(d, SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "yyyy-MM-dd");
  } catch (e) { return ''; }
}

// [重點修改] 切換至 Gemini 2.0 Flash Experimental
function callGemini(prompt) {
  // 使用 v1beta 版本的 gemini-2.0-flash-exp 模型
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;
  
  const payload = {
    contents: [{ parts: [{ text: prompt }] }]
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
      return "AI API 錯誤: " + json.error.message;
    } else {
      return "AI 無法產生回應 (No candidates)。";
    }
  } catch (e) {
    return "連線錯誤: " + e.toString();
  }
}