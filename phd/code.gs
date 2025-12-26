// ==========================================
// YangHome Health Backend API (v4.0 - Full Auth & Admin Flow)
// ==========================================

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
const SHEET_USERS = "Users";
const SHEET_DATA = "Data";

// [設定] Google Client ID
const GOOGLE_CLIENT_ID = "142808541856-1sfda1hcfk12p1r0a5fbmldugb1f99vn.apps.googleusercontent.com";
// [設定] Gemini API Key
const GEMINI_API_KEY = "AIzaSyDnRyQUyW-0EgB0hSzyPFZu6mT_0L12xSg"; 
// [設定] Google Cloud TTS API Key
const GOOGLE_TTS_API_KEY = "AIzaSyDnRyQUyW-0EgB0hSzyPFZu6mT_0L12xSg";
// [設定] 管理員 Email (必須小寫)
const ADMIN_EMAIL = "kaichun.yang@gmail.com"; 

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

    // --- 新增的路由 ---
    if (action === "socialLogin") return handleSocialLogin(data);
    if (action === "signup") return handleSignup(data); // 註冊
    if (action === "adminGetUsers") return handleAdminGetUsers(data); // 管理員取得清單
    if (action === "adminAuthorize") return handleAdminAuthorize(data); // 管理員授權
    
    // --- 原有的路由 ---
    if (action === "addData") return handleAddData(data);
    if (action === "updateProfile") return handleUpdateProfile(data);
    if (action === "bindAccount") return handleBindAccount(data);
    if (action === "getTTS") return handleGetTTS(data);
    
    return responseJSON({ error: "Unknown action" });
  } catch (err) {
    return responseJSON({ error: "Invalid JSON data", details: err.message });
  }
}

// ---------------------------------------------------------
// 核心驗證與登入邏輯
// ---------------------------------------------------------

function verifyGoogleToken(token) {
  try {
    const url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + token;
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    if (response.getResponseCode() !== 200) return null;
    const payload = JSON.parse(response.getContentText());
    if (payload.aud !== GOOGLE_CLIENT_ID) return null;
    return payload;
  } catch (e) { return null; }
}

function handleSocialLogin(data) {
  const googleUser = verifyGoogleToken(data.token);
  if (!googleUser) return responseJSON({ success: false, message: "Invalid ID Token" });

  const email = String(googleUser.email).trim().toLowerCase();
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_USERS);
  const rows = sheet.getDataRange().getValues();
  
  // 1. 檢查是否為現有用戶
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (String(row[1]).trim().toLowerCase() === email) {
      // 讀取狀態 (Column H, index 7)
      const status = row[7] || 'active'; // 舊資料若無狀態預設為 active
      
      // 更新 Provider (如果需要)
      let currentProvider = String(row[5] || "");
      if (!currentProvider.toLowerCase().includes('google')) {
        currentProvider = currentProvider ? currentProvider + ",google" : "google";
        sheet.getRange(i + 1, 6).setValue(currentProvider);
      }

      return responseJSON({
        success: true,
        isNewUser: false,
        user: { 
          uid: row[0], 
          email: row[1], 
          name: row[2], 
          birthday: formatDate(row[3]),
          role: row[4], 
          provider: currentProvider,
          status: status 
        }
      });
    }
  }

  // 2. 若找不到用戶，回傳 isNewUser: true，前端會導向 signup.html
  return responseJSON({
    success: true,
    isNewUser: true,
    email: email,
    picture: googleUser.picture,
    name: googleUser.name
  });
}

// [新增] 處理使用者註冊
function handleSignup(data) {
  const email = data.email.toLowerCase();
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_USERS);
  
  // 再次檢查是否已存在 (避免重複提交)
  const rows = sheet.getDataRange().getValues();
  for(let i=1; i<rows.length; i++) {
    if(String(rows[i][1]).toLowerCase() === email) {
      return responseJSON({ success: false, message: "用戶已存在" });
    }
  }

  const newUid = "U" + new Date().getTime();
  const timestamp = new Date();
  
  // 欄位順序: [UID, Email, Name, Birthday, Role, Provider, Timestamp, Status]
  // 預設狀態設為 'pending' (待審核)
  sheet.appendRow([
    newUid, 
    email, 
    data.name, 
    "'" + data.birthday, // 加單引號避免日期格式跑掉
    "user", 
    "google", 
    timestamp, 
    "pending" 
  ]);
  
  return responseJSON({ 
    success: true, 
    user: { 
      uid: newUid, 
      email: email, 
      name: data.name, 
      birthday: data.birthday, 
      role: 'user', 
      status: 'pending' 
    } 
  });
}

// ---------------------------------------------------------
// 管理員功能
// ---------------------------------------------------------

// 取得所有使用者清單 (僅限管理員)
function handleAdminGetUsers(data) {
  if (data.adminEmail.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    return responseJSON({ error: "無權限" });
  }
  
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_USERS);
  const rows = sheet.getDataRange().getValues();
  // 跳過標題列
  const users = rows.slice(1).map(row => ({
    uid: row[0],
    email: row[1],
    name: row[2],
    birthday: formatDate(row[3]),
    role: row[4],
    status: row[7] || 'active'
  }));
  
  return responseJSON({ success: true, users: users });
}

// 授權開通使用者 (僅限管理員)
function handleAdminAuthorize(data) {
  if (data.adminEmail.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    return responseJSON({ error: "無權限" });
  }
  
  const targetUid = data.targetUid;
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_USERS);
  const rows = sheet.getDataRange().getValues();
  
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === targetUid) {
      // 更新狀態欄位 (Column H -> Index 8, 但 getRange 是 1-based 所以是 8)
      sheet.getRange(i + 1, 8).setValue("active");
      return responseJSON({ success: true });
    }
  }
  
  return responseJSON({ success: false, message: "找不到該用戶" });
}

// ---------------------------------------------------------
// 一般資料功能 (保持原樣或微調)
// ---------------------------------------------------------

// 取得使用者列表 (Dashboard 下拉選單用)
function handleGetSettings(e) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_USERS);
  const rows = sheet.getDataRange().getValues();
  
  // 回傳所有使用者，並包含 status 欄位，前端會負責過濾掉 pending 的人
  const users = rows.slice(1).map(row => ({
    uid: row[0], 
    email: row[1], 
    name: row[2], 
    birthday: formatDate(row[3]), 
    role: row[4], 
    provider: row[5],
    status: row[7] || 'active'
  }));
  return responseJSON(users);
}

function handleGetData(e) {
  const uid = e.parameter.uid;
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_DATA);
  const data = sheet.getDataRange().getValues();
  const result = [];
  // 從最後一筆往回讀，確保順序
  for (let i = data.length - 1; i >= 1; i--) {
    const row = data[i];
    if (String(row[1]) === String(uid)) {
      result.push({ 
        date: row[0], 
        context: row[2], 
        sbp: row[3], 
        dbp: row[4], 
        hr: row[5], 
        glucose: row[6], 
        note: row[7] 
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
    sbp = data.sbp; dbp = data.dbp; hr = data.hr;
    context = "一般量測";
  } else if (data.type === 'BloodSugar') {
    glucose = data.bs;
    const timeMap = { 'fasting': '空腹', 'postprandial': '飯後', 'wakeup': '起床', 'bedtime': '睡前' };
    context = timeMap[data.time] || data.time || '其他';
  }
  sheet.appendRow([timestamp, data.uid, context, sbp, dbp, hr, glucose, note]);
  return responseJSON({ success: true, message: "Data added" });
}

// ---------------------------------------------------------
// AI 與 TTS 功能
// ---------------------------------------------------------

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
  請使用「台灣繁體中文」回答，語氣要親切、正面且專業。請針對異常數值給予具體的生活作息或飲食建議，日期顯示要如2025-12-16這樣的方式，總文字要少於600字。
  數據如下：
  ${historyText}`;

  const response = callGemini(prompt);
  return responseJSON({ result: response });
}

function handleGetTTS(data) {
  if (!GOOGLE_TTS_API_KEY) return responseJSON({ error: "TTS API Key 未設定" });
  
  const text = data.text;
  if (!text) return responseJSON({ error: "No text provided" });

  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_TTS_API_KEY}`;
  
  const payload = {
    input: { text: text },
    voice: { 
      languageCode: 'cmn-TW', 
      name: 'cmn-TW-Wavenet-A', // 使用品質較好的 WaveNet
      ssmlGender: 'FEMALE' 
    },
    audioConfig: { 
      audioEncoding: 'MP3',
      speakingRate: 1.0,
      pitch: 0
    }
  };

  try {
    const response = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });

    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();

    if (responseCode !== 200) {
      return responseJSON({ error: "Google TTS Error: " + responseText });
    }

    return ContentService.createTextOutput(responseText).setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    return responseJSON({ error: "Backend Fetch Error: " + e.toString() });
  }
}

// ---------------------------------------------------------
// 工具函式
// ---------------------------------------------------------

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

function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;
  const payload = { contents: [{ parts: [{ text: prompt }] }] };
  const options = { method: 'post', contentType: 'application/json', payload: JSON.stringify(payload), muteHttpExceptions: true };
  try {
    const response = UrlFetchApp.fetch(url, options);
    const json = JSON.parse(response.getContentText());
    if (json.candidates && json.candidates.length > 0) return json.candidates[0].content.parts[0].text;
    else if (json.error) return "AI API 錯誤: " + json.error.message;
    else return "AI 無法產生回應 (No candidates)。";
  } catch (e) { return "連線錯誤: " + e.toString(); }
}

// 舊的登入方法 (若還有其他地方用到)
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

function handleUpdateProfile(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_USERS);
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][1]).toLowerCase() === String(data.userEmail).toLowerCase()) { 
      sheet.getRange(i + 1, 3).setValue(data.userName);
      sheet.getRange(i + 1, 4).setValue("'" + data.userBirthday);
      return responseJSON({ success: true, message: "Profile updated" });
    }
  }
  return responseJSON({ success: false, message: "User not found" });
}

function handleBindAccount(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_USERS);
  const rows = sheet.getDataRange().getValues();
  const targetEmail = String(data.userEmail).toLowerCase();
  const newProvider = data.newProvider;
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][1]).toLowerCase() === targetEmail) {
      let currentProvider = String(rows[i][5] || "");
      if (!currentProvider.includes(newProvider)) {
        if (currentProvider.length > 0) currentProvider += "," + newProvider;
        else currentProvider = newProvider;
        sheet.getRange(i + 1, 6).setValue(currentProvider);
      }
      return responseJSON({ success: true, message: "Account bound successfully", provider: currentProvider });
    }
  }
  return responseJSON({ success: false, message: "User not found for binding" });
}