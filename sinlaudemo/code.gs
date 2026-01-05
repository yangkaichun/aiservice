// ==========================================
// YangHome Health Backend API (v6.2 - HeyGen Flow Fix)
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
// [設定] 管理員 Email
const ADMIN_EMAIL = "kaichun.yang@gmail.com"; 

// [設定] HeyGen API Key (更新為您提供的 Key)
const HEYGEN_API_KEY = "sk_V2_hgu_kSpjn87oKgN_ianxihtBBD8Ml0rzlfp05chlDCAaqZ4S";

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

    // --- HeyGen 路由 ---
    if (action === "heygen_generate") return handleHeyGenGenerate(data);
    if (action === "heygen_check") return handleHeyGenCheck(data);

    // --- 其他原有路由 ---
    if (action === "socialLogin") return handleSocialLogin(data);
    if (action === "signup") return handleSignup(data);
    if (action === "adminGetUsers") return handleAdminGetUsers(data);
    if (action === "adminAuthorize") return handleAdminAuthorize(data);
    if (action === "adminUpdateUser") return handleAdminUpdateUser(data);
    if (action === "addData") return handleAddData(data);
    if (action === "updateProfile") return handleUpdateProfile(data);
    if (action === "bindAccount") return handleBindAccount(data);
    if (action === "getTTS") return handleGetTTS(data);

    return responseJSON({ error: "Unknown action" });
  } catch (err) {
    // 捕捉所有錯誤並回傳 JSON，防止前端出現 SyntaxError
    return responseJSON({ error: "Backend Error: " + err.message });
  }
}

// ---------------------------------------------------------
// [核心修正] HeyGen 處理邏輯 (註冊 Talking Photo -> 生成)
// ---------------------------------------------------------

function handleHeyGenGenerate(data) {
  const text = data.text;
  const imageUrl = data.imageUrl; // 必須是公開可存取的 URL

  if (!text || !imageUrl) return responseJSON({ error: "Missing text or imageUrl" });

  try {
    // --- 步驟 1: 註冊 Talking Photo (Create Talking Photo from URL) ---
    // 這一步是必須的，不能直接在 generate 用 URL
    const registerResp = UrlFetchApp.fetch("https://api.heygen.com/v2/talking_photos", {
      method: "POST",
      headers: {
        "X-Api-Key": HEYGEN_API_KEY,
        "Content-Type": "application/json"
      },
      payload: JSON.stringify({
        url: imageUrl 
      }),
      muteHttpExceptions: true
    });

    const registerJson = JSON.parse(registerResp.getContentText());
    
    if (registerJson.error) {
      throw new Error("Register Photo Failed: " + (registerJson.error.message || JSON.stringify(registerJson.error)));
    }
    
    // 取得真正的 Talking Photo ID
    const talkingPhotoId = registerJson.data.talking_photo_id; 

    // --- 步驟 2: 建立影片生成任務 ---
    const generateResp = UrlFetchApp.fetch("https://api.heygen.com/v2/video/generate", {
      method: "POST",
      headers: {
        "X-Api-Key": HEYGEN_API_KEY,
        "Content-Type": "application/json"
      },
      payload: JSON.stringify({
        video_inputs: [
          {
            character: {
              type: "talking_photo",
              talking_photo_id: talkingPhotoId // 使用剛剛註冊取得的 ID
            },
            voice: {
              type: "text",
              input_text: text,
              voice_id: "c0c32607530846069905d63f03672522" // Microsoft Xiaoxiao (通用中文)
            }
          }
        ],
        dimension: { width: 1280, height: 720 }
      }),
      muteHttpExceptions: true
    });

    const genJson = JSON.parse(generateResp.getContentText());
    if (genJson.error) {
      throw new Error("Generate Failed: " + (genJson.error.message || JSON.stringify(genJson.error)));
    }

    return responseJSON({ success: true, video_id: genJson.data.video_id });

  } catch (e) {
    return responseJSON({ error: "Backend HeyGen Error: " + e.toString() });
  }
}

function handleHeyGenCheck(data) {
  const videoId = data.video_id;
  if (!videoId) return responseJSON({ error: "Missing video_id" });

  try {
    const statusResp = UrlFetchApp.fetch(`https://api.heygen.com/v1/video_status.get?video_id=${videoId}`, {
      method: "GET",
      headers: {
        "X-Api-Key": HEYGEN_API_KEY,
        "Content-Type": "application/json"
      },
      muteHttpExceptions: true
    });

    const statusData = JSON.parse(statusResp.getContentText());
    return responseJSON(statusData);

  } catch (e) {
    return responseJSON({ error: "Check Status Error: " + e.toString() });
  }
}

// ---------------------------------------------------------
// (原有功能保持不變)
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
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (String(row[1]).trim().toLowerCase() === email) {
      const status = row[7] || 'active';
      return responseJSON({
        success: true,
        isNewUser: false,
        user: { 
          uid: row[0], 
          email: row[1], 
          name: row[2], 
          birthday: formatDate(row[3]),
          role: row[4], 
          provider: row[5],
          status: status 
        }
      });
    }
  }
  return responseJSON({
    success: true,
    isNewUser: true,
    email: email,
    picture: googleUser.picture,
    name: googleUser.name
  });
}

function handleSignup(data) {
  const email = data.email.toLowerCase();
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_USERS);
  const rows = sheet.getDataRange().getValues();
  for(let i=1; i<rows.length; i++) {
    if(String(rows[i][1]).toLowerCase() === email) {
      return responseJSON({ success: false, message: "用戶已存在" });
    }
  }
  const newUid = "U" + new Date().getTime();
  const timestamp = new Date();
  sheet.appendRow([newUid, email, data.name, "'" + data.birthday, "user", "google", timestamp, "pending"]);
  return responseJSON({ 
    success: true, 
    user: { uid: newUid, email: email, name: data.name, birthday: data.birthday, role: 'user', status: 'pending' } 
  });
}

function handleAdminGetUsers(data) {
  if (data.adminEmail.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    return responseJSON({ error: "無權限" });
  }
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_USERS);
  const rows = sheet.getDataRange().getValues();
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

function handleAdminAuthorize(data) {
  if (data.adminEmail.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    return responseJSON({ error: "無權限" });
  }
  const targetUid = data.targetUid;
  const newStatus = data.status || "active"; 
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_USERS);
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === targetUid) {
      sheet.getRange(i + 1, 8).setValue(newStatus);
      return responseJSON({ success: true, status: newStatus });
    }
  }
  return responseJSON({ success: false, message: "找不到該用戶" });
}

function handleAdminUpdateUser(data) {
  if (data.adminEmail.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    return responseJSON({ error: "無權限" });
  }
  const targetUid = data.targetUid;
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_USERS);
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === targetUid) {
      sheet.getRange(i + 1, 3).setValue(data.newName);
      sheet.getRange(i + 1, 4).setValue("'" + data.newBirthday);
      return responseJSON({ success: true });
    }
  }
  return responseJSON({ success: false, message: "User not found" });
}

function handleGetTTS(data) {
  if (!GOOGLE_TTS_API_KEY) return responseJSON({ error: "TTS API Key 未設定" });
  const text = data.text;
  if (!text) return responseJSON({ error: "No text provided" });
  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_TTS_API_KEY}`;
  const payload = { input: { text: text }, voice: { languageCode: 'cmn-TW', name: 'cmn-TW-Wavenet-A', ssmlGender: 'FEMALE' }, audioConfig: { audioEncoding: 'MP3', speakingRate: 1.0, pitch: 0 } };
  try {
    const response = UrlFetchApp.fetch(url, { method: 'post', contentType: 'application/json', payload: JSON.stringify(payload), muteHttpExceptions: true });
    return ContentService.createTextOutput(response.getContentText()).setMimeType(ContentService.MimeType.JSON);
  } catch (e) { return responseJSON({ error: e.toString() }); }
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

function handleGetSettings(e) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_USERS);
  const rows = sheet.getDataRange().getValues();
  const users = rows.slice(1).map(row => ({
    uid: row[0], email: row[1], name: row[2], birthday: formatDate(row[3]), role: row[4], provider: row[5], status: row[7] || 'active'
  }));
  return responseJSON(users);
}

function handleAddData(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_DATA);
  const timestamp = new Date();
  let context = '', sbp = '', dbp = '', hr = '', glucose = '', note = data.note || '';
  if (data.type === 'BloodPressure') { sbp = data.sbp; dbp = data.dbp; hr = data.hr; context = "一般量測";
  } else if (data.type === 'BloodSugar') { glucose = data.bs;
  const timeMap = { 'fasting': '空腹', 'postprandial': '飯後', 'wakeup': '起床', 'bedtime': '睡前' }; context = timeMap[data.time] || data.time || '其他';
  }
  sheet.appendRow([timestamp, data.uid, context, sbp, dbp, hr, glucose, note]);
  return responseJSON({ success: true, message: "Data added" });
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
  const prompt = `你是一位專業的家庭健康顧問。請根據以下使用者的生理數據給予簡短的健康評估與建議。請使用「台灣繁體中文」回答，回答內容要小於500字，日期要以年月日來說明，如2025年11月15日，血壓值要說舒張壓然後數字，收縮壓然後數字，血糖值要說出中文的單位。數據如下：${historyText}`;
  const response = callGemini(prompt);
  return responseJSON({ result: response });
}

function responseJSON(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }
function formatDate(dateInput) { try { const d = new Date(dateInput); if (isNaN(d.getTime())) return String(dateInput); return Utilities.formatDate(d, SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "yyyy-MM-dd"); } catch (e) { return ''; } }
function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;
  const payload = { contents: [{ parts: [{ text: prompt }] }] };
  const options = { method: 'post', contentType: 'application/json', payload: JSON.stringify(payload), muteHttpExceptions: true };
  try { const response = UrlFetchApp.fetch(url, options);
  const json = JSON.parse(response.getContentText()); if (json.candidates && json.candidates.length > 0) return json.candidates[0].content.parts[0].text; else return "AI Error";
  } catch (e) { return "Conn Error"; }
}
function handleLogin(e){/*...*/} function handleUpdateProfile(data){/*...*/} function handleBindAccount(data){/*...*/}