// ==========================================
// Code.gs v14.1 (SmartHealthDB 2 Compatible)
// ==========================================
const ADMIN_EMAIL = "kaichun.yang@gmail.com"; 
const GEMINI_API_KEY = "AIzaSyDnRyQUyW-0EgB0hSzyPFZu6mT_0L12xSg";
// ⚠️ 注意：這裡應填入 Google Cloud "API Key" (通常以 AIza 開頭)。
// 如果您原本的 GOCSPX... 是 OAuth Client Secret，請改用類似 GEMINI_API_KEY 的 API Key，並在 GCP Console 開啟 Text-to-Speech API 權限。
const TTS_API = "AIzaSyDnRyQUyW-0EgB0hSzyPFZu6mT_0L12xSg";
// LINE 設定
const LINE_CHANNEL_ID = "2008700923"; 
const LINE_CHANNEL_SECRET = "37ae02487f993a1fc1d0702d9b704c84";

function doGet(e) {
  var action = e ? e.parameter.action : ""; 
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (action === "getSettings") { return handleGetSettings(ss); }
  if (action === "analyze") { return handleAnalyzeRequest(e); }

  // [Dashboard] 讀取數據
  return handleGetAllData(ss);
}

// ... (handleGetAllData, loadUsersMap, handleGetSettings 保持不變) ...
// 為了版面簡潔，此處省略中間未修改的讀取函式，請保留原有的程式碼
// ...

// ==========================================
// 2. doPost (寫入對應)
// ==========================================
function doPost(e) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return outputJSON({ status: "error" });

  try {
    // 必須使用 JSON.parse 解析前端傳來的 JSON 字串
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (data.action === "lineLogin") return handleLineLoginCode(data.code, data.redirectUri);
    if (data.action === "getProfile") return handleGetProfile(data.token);
    if (data.action === "updateProfile") return handleUpdateProfile(data);
    if (data.action === "bindAccount") return handleBindAccount(data);
    
    // [新增] TTS 處理路由
    if (data.action === "tts") return handleTTS(data);

    // Data 寫入
    if (!data.action) {
        var sheet = ss.getSheetByName("Data");
        if (!sheet) sheet = ss.insertSheet("Data");
        
        var userIdentifier = "Unknown";
        var idToken = data.token;
        var userMap = loadUsersMap(ss);
        var foundUser = null;

        if (idToken) {
            if (String(idToken).startsWith("LINE_")) {
                var key = idToken.replace("LINE_", "").toLowerCase().trim();
                foundUser = userMap[key];
            } else {
                try { 
                    var identity = verifyGoogleToken(idToken);
                    var emailKey = identity.email.toLowerCase().trim();
                    foundUser = userMap[emailKey];
                    if(!foundUser) userIdentifier = identity.email;
                } catch(e) { if(data.userEmail) userIdentifier = data.userEmail; }
            }
        } else if (data.name) { userIdentifier = data.name; }

        if (foundUser) userIdentifier = foundUser.uid;
        var timestamp = Utilities.formatDate(new Date(), "Asia/Taipei", "yyyy-MM-dd HH:mm:ss");
        // 對應 Data Sheet 結構
        sheet.appendRow([timestamp, userIdentifier, data.context||"", data.sbp, data.dbp, data.hr, data.glucose||"", data.note||""]);
        return outputJSON({ status: "success", message: "Saved", uid: userIdentifier });
    }
    
    // Admin 略...
    if (data.action === "deleteRow") { var r = parseInt(data.rowIndex); var sh = ss.getSheetByName("Data"); if(r>1){ sh.deleteRow(r); return outputJSON({status:"success"}); } }
    if (data.action === "saveUser") return handleSaveUser(data);
    if (data.action === "deleteUserAccount") return handleDeleteUserAccount(data.targetEmail);

  } catch (error) { return outputJSON({ status: "error", message: error.toString() });
  } finally { lock.releaseLock(); }
}

// ... (getUserEmailFromToken, handleGetProfile 等保持不變) ...
// ...

// [新增] 處理 TTS 請求的函式
function handleTTS(data) {
  var text = data.text;
  if (!text) return outputJSON({ error: "No text provided" });

  // Google Cloud TTS API Endpoint
  // 注意：這裡使用 POST 方法
  var url = "https://texttospeech.googleapis.com/v1/text:synthesize?key=" + TTS_API;
  
  var payload = {
    "input": { "text": text },
    "voice": { "languageCode": "zh-TW", "name": "zh-TW-Standard-A" }, // 設定為繁體中文
    "audioConfig": { "audioEncoding": "MP3" }
  };
  
  try {
    var options = {
      "method": "post",
      "contentType": "application/json",
      "payload": JSON.stringify(payload),
      "muteHttpExceptions": true
    };
    
    var response = UrlFetchApp.fetch(url, options);
    var json = JSON.parse(response.getContentText());
    
    if (json.error) {
      return outputJSON({ error: json.error.message });
    }
    
    // 回傳 API 產生的 Base64 音訊
    return outputJSON({ audioContent: json.audioContent });
    
  } catch (e) {
    return outputJSON({ error: e.toString() });
  }
}

// ... (其他原有 Helper Functions 保持不變) ...
// ... 
function outputJSON(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }