// ==========================================
// YangHome Health Backend API (v3.5 - Fix Voice Model)
// ==========================================

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
const SHEET_USERS = "Users";
const SHEET_DATA = "Data";

// [設定] Google Client ID
const GOOGLE_CLIENT_ID = "142808541856-1sfda1hcfk12p1r0a5fbmldugb1f99vn.apps.googleusercontent.com";
// [設定] Gemini API Key
const GEMINI_API_KEY = "AIzaSyDnRyQUyW-0EgB0hSzyPFZu6mT_0L12xSg"; 

// [設定] Google Cloud TTS API Key (請使用 AIza 開頭的標準 Key)
const GOOGLE_TTS_API_KEY = "AIzaSyDnRyQUyW-0EgB0hSzyPFZu6mT_0L12xSg"; 

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
    if (action === "bindAccount") return handleBindAccount(data);
    if (action === "socialLogin") return handleSocialLogin(data);
    if (action === "getTTS") return handleGetTTS(data);
    
    return responseJSON({ error: "Unknown action" });
  } catch (err) {
    return responseJSON({ error: "Invalid JSON data", details: err.message });
  }
}

// --- TTS 處理核心 (使用 WaveNet 模型) ---
function handleGetTTS(data) {
  if (!GOOGLE_TTS_API_KEY) return responseJSON({ error: "TTS API Key 未設定" });
  
  const text = data.text;
  if (!text) return responseJSON({ error: "No text provided" });

  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_TTS_API_KEY}`;
  
  const payload = {
    input: { text: text },
    voice: { 
      // [修正] 台灣繁中目前最高品質為 WaveNet
      languageCode: 'cmn-TW', 
      name: 'cmn-TW-Wavenet-A', // WaveNet 女性語音 (品質優於 Standard)
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

// --- 其他功能 (保持不變) ---

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
  const name = googleUser.name || "Google User";
  const providerType = 'google';
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_USERS);
  const rows = sheet.getDataRange().getValues();
  
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (String(row[1]).trim().toLowerCase() === email) {
      let currentProvider = String(row[5] || "");
      if (!currentProvider.toLowerCase().includes(providerType)) {
        currentProvider = currentProvider ? currentProvider + "," + providerType : providerType;
        sheet.getRange(i + 1, 6).setValue(currentProvider);
      }
      return responseJSON({
        success: true, isNewUser: false,
        user: { uid: row[0], email: row[1], name: row[2], role: row[4] || 'user', provider: currentProvider }
      });
    }
  }

  const newUid = "U" + new Date().getTime();
  const timestamp = new Date();
  sheet.appendRow([newUid, email, name, "", "user", providerType, timestamp]);
  return responseJSON({
    success: true, isNewUser: true,
    user: { uid: newUid, email: email, name: name, role: 'user', provider: providerType }
  });
}

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
      result.push({ date: row[0], context: row[2], sbp: row[3], dbp: row[4], hr: row[5], glucose: row[6], note: row[7] });
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