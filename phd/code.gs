// ==========================================
// Code.gs v20.0 (TTS Key Updated)
// ==========================================
const ADMIN_EMAIL = "kaichun.yang@gmail.com"; 

// 1. Gemini 分析用 Key
const GEMINI_API_KEY = "AIzaSyDnRyQUyW-0EgB0hSzyPFZu6mT_0L12xSg"; 

// 2. TTS 語音專用 Key (已更新)
// 務必確認此 Key 的專案已啟用 "Cloud Text-to-Speech API"
const TTS_API_KEY = "AIzaSyDnRyQUyW-0EgB0hSzyPFZu6mT_0L12xSg";

// LINE 設定
const LINE_CHANNEL_ID = "2008700923"; 
const LINE_CHANNEL_SECRET = "37ae02487f993a1fc1d0702d9b704c84";

function doGet(e) {
  var action = e ? e.parameter.action : ""; 
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  if (action === "getSettings") { return handleGetSettings(ss); }
  if (action === "analyze") { return handleAnalyzeRequest(e); }
  if (action === "tts") { return handleTTS(e); } // 語音路由

  return handleGetAllData(ss);
}

// ==========================================
// [核心] Google TTS 處理函式 (標準 API)
// ==========================================
function handleTTS(e) {
  var text = e.parameter.text;
  if (!text) return outputJSON({ error: "未提供文字內容" });

  if (text.length > 1500) text = text.substring(0, 1500);

  var url = "https://texttospeech.googleapis.com/v1/text:synthesize?key=" + TTS_API_KEY;
  
  var payload = {
    "input": { "text": text },
    "voice": { 
      "languageCode": "cmn-TW", 
      "name": "cmn-TW-Wavenet-A" // 台灣女聲 (Wavenet 品質較佳)
    },
    "audioConfig": { 
      "audioEncoding": "MP3", 
      "speakingRate": 1.0
    }
  };

  try {
    var options = {
      "method": "post",
      "contentType": "application/json",
      "payload": JSON.stringify(payload),
      "muteHttpExceptions": true
    };
    
    var response = UrlFetchApp.fetch(url, options);
    var content = response.getContentText();
    var json = JSON.parse(content);
    
    // 檢查 API 是否回傳錯誤
    if (response.getResponseCode() !== 200 || json.error) {
      var errMsg = json.error ? json.error.message : "API Error " + response.getResponseCode();
      return outputJSON({ error: "TTS 錯誤: " + errMsg });
    }
    
    return outputJSON({ audioContent: json.audioContent });
    
  } catch (err) {
    return outputJSON({ error: "系統連線錯誤: " + err.toString() });
  }
}

// ----------------------------------------------------
// Data 表讀取 (維持不變)
// ----------------------------------------------------
function handleGetAllData(ss) {
  try {
    var userMap = loadUsersMap(ss);
    var dataSheet = ss.getSheetByName("Data");
    if (!dataSheet) return outputJSON([]);
    
    var rows = dataSheet.getDataRange().getDisplayValues();
    var result = [];

    // Data 表結構: A=Time(0), B=UID(1)
    for (var i = 1; i < rows.length; i++) {
        var row = rows[i];
        var rawId = String(row[1]).trim();
        var key = rawId.toLowerCase();
        
        var userInfo = userMap[key];
        // 優先顯示姓名
        var displayName = (userInfo && userInfo.name) ? userInfo.name : rawId;
        var finalUid = (userInfo && userInfo.uid) ? userInfo.uid : rawId;

        result.push({
            timestamp: String(row[0]),
            rawId: finalUid,   
            name: displayName,
            birthday: (userInfo ? userInfo.birthday : ""),
            context: row[2],
            sbp: row[3], dbp: row[4], pulse: row[5], glucose: row[6], note: row[7] || ""
        });
    }
    return outputJSON(result);
  } catch (error) { return outputJSON({ error: error.toString() }); }
}

// ----------------------------------------------------
// Users 表讀取 (位移修正版)
// ----------------------------------------------------
function loadUsersMap(ss) {
    var sheet = ss.getSheetByName("Users");
    var map = {};
    if(!sheet) return map;
    
    var rows = sheet.getDataRange().getDisplayValues();
    for(var i=1; i<rows.length; i++) {
        var row = rows[i];
        if (row.length < 3) continue;

        // A=Time(0), B=UID(1), C=Email(2), D=Name(3)...
        var uid = String(row[1]).trim();      
        var email = String(row[2]).trim();    
        var name = (row.length > 3) ? row[3] : "";
        var birth = (row.length > 4) ? row[4] : "";
        var lineId = (row.length > 7) ? String(row[7]).trim() : "";
        
        var info = { uid: uid, email: email, name: name, birthday: birth, lineUserId: lineId };
        
        if(uid) map[uid.toLowerCase()] = info;
        if(email) map[email.toLowerCase()] = info;
        if(lineId) map[lineId.toLowerCase()] = info;
    }
    return map;
}

function handleGetSettings(ss) {
    var sheet = ss.getSheetByName("Users");
    if(!sheet) return outputJSON([]);
    var rows = sheet.getDataRange().getDisplayValues();
    var list = [];
    for(var i=1; i<rows.length; i++) {
        var row = rows[i];
        if(!row[1] && !row[2]) continue; 
        list.push({
            uid: String(row[1]).trim(),
            email: String(row[2]).trim(),
            name: row[3] || "",
            birthday: row[4] || "",
            lineUserId: row[7] ? String(row[7]).trim() : ""
        });
    }
    return outputJSON(list);
}

// ... (doPost 保持不變) ...
function doPost(e) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return outputJSON({ status: "error" });
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (data.action === "lineLogin") return handleLineLoginCode(data.code, data.redirectUri);
    if (data.action === "getProfile") return handleGetProfile(data.token);
    if (data.action === "updateProfile") return handleUpdateProfile(data);
    if (data.action === "bindAccount") return handleBindAccount(data);

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
                    foundUser = userMap[identity.email.toLowerCase().trim()];
                    if(!foundUser) userIdentifier = identity.email;
                } catch(e) { if(data.userEmail) userIdentifier = data.userEmail; }
            }
        } else if (data.name) userIdentifier = data.name;
        if (foundUser) userIdentifier = foundUser.uid;
        var timestamp = Utilities.formatDate(new Date(), "Asia/Taipei", "yyyy-MM-dd HH:mm:ss");
        sheet.appendRow([timestamp, userIdentifier, data.context||"", data.sbp, data.dbp, data.hr, data.glucose||"", data.note||""]);
        return outputJSON({ status: "success", message: "Saved", uid: userIdentifier });
    }
    if (data.action === "deleteRow") { var r = parseInt(data.rowIndex); var sh = ss.getSheetByName("Data"); if(r>1){ sh.deleteRow(r); return outputJSON({status:"success"}); } }
    if (data.action === "saveUser") return outputJSON({status:"success"}); 
    if (data.action === "deleteUserAccount") return outputJSON({status:"success"});
  } catch (error) { return outputJSON({ status: "error", message: error.toString() }); } 
  finally { lock.releaseLock(); }
}
function getUserEmailFromToken(token) { if (token === "mock-token") return "test@example.com"; if (token && token.startsWith("LINE_")) return token.replace("LINE_", ""); try { return verifyGoogleToken(token).email; } catch (e) { return null; } }
function handleGetProfile(token) { var email = getUserEmailFromToken(token); if (!email) return outputJSON({ status: "error" }); var ss = SpreadsheetApp.getActiveSpreadsheet(); var userMap = loadUsersMap(ss); var user = userMap[email.toLowerCase().trim()]; if (!user) { var sheet = ss.getSheetByName("Users"); if(!sheet) { sheet = ss.insertSheet("Users"); sheet.appendRow(["Timestamp", "UID", "Email", "Name", "Birthday", "Role", "Provider", "LineUserId"]); } var newUid = Utilities.getUuid(); var provider = token.startsWith("LINE_") ? "LINE" : "Google"; var ts = new Date(); sheet.appendRow([ts, newUid, email, "", "", "user", provider, ""]); return outputJSON({ status: "success", name: "", birthday: "", providers: provider, uid: newUid }); } return outputJSON({ status: "success", name: user.name, birthday: user.birthday, providers: user.provider, uid: user.uid }); }
function handleUpdateProfile(data) { var email = getUserEmailFromToken(data.token); if (!email && data.userEmail) email = data.userEmail; if (!email) return outputJSON({ status: "error" }); var ss = SpreadsheetApp.getActiveSpreadsheet(); var sheet = ss.getSheetByName("Users"); var rows = sheet.getDataRange().getDisplayValues(); for(var i=1; i<rows.length; i++) { if(String(rows[i][2]).trim().toLowerCase() === String(email).trim().toLowerCase()) { sheet.getRange(i+1, 4).setValue(data.userName); sheet.getRange(i+1, 5).setValue(data.userBirthday); return outputJSON({ status: "success" }); } } sheet.appendRow([new Date(), Utilities.getUuid(), email, data.userName, data.userBirthday, "user", "Unknown", ""]); return outputJSON({ status: "success" }); }
function handleBindAccount(data) { var email = getUserEmailFromToken(data.token); if(!email && data.userEmail) email = data.userEmail; var bindType = data.bindType; var lineId = ""; if (bindType === "LINE") { try { var l = verifyLineCodeAndGetProfile(data.bindPayload, data.redirectUri); lineId = l.userId; } catch(e) { return outputJSON({ status: "error" }); } } else { try { verifyGoogleToken(data.bindPayload); } catch(e) { return outputJSON({ status: "error" }); } } var ss = SpreadsheetApp.getActiveSpreadsheet(); var sheet = ss.getSheetByName("Users"); var rows = sheet.getDataRange().getDisplayValues(); for(var i=1; i<rows.length; i++) { if(String(rows[i][2]).toLowerCase().trim() === String(email).toLowerCase().trim()) { var currentP = String(rows[i][6] || ""); if(!currentP.includes(bindType)) { sheet.getRange(i+1, 7).setValue(currentP + ", " + bindType); } if(bindType === "LINE" && lineId) { sheet.getRange(i+1, 8).setValue(lineId); } return outputJSON({ status: "success", message: "綁定成功" }); } } return outputJSON({ status: "error" }); }
function verifyGoogleToken(token) { var response = UrlFetchApp.fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + token, { muteHttpExceptions: true }); var identity = JSON.parse(response.getContentText()); if (identity.error) throw new Error(identity.error_description); return identity; }
function verifyLineCodeAndGetProfile(code, redirectUri) { var url = "https://api.line.me/oauth2/v2.1/token"; var payload = { grant_type: "authorization_code", code: code, redirect_uri: redirectUri, client_id: LINE_CHANNEL_ID, client_secret: LINE_CHANNEL_SECRET }; var options = { method: "post", payload: payload, muteHttpExceptions: true }; var res = UrlFetchApp.fetch(url, options); var json = JSON.parse(res.getContentText()); if (json.error) throw new Error(json.error_description); var profileRes = UrlFetchApp.fetch("https://api.line.me/v2/profile", { headers: { "Authorization": "Bearer " + json.access_token } }); return JSON.parse(profileRes.getContentText()); }
function handleLineLoginCode(code, redirectUri) { try { var data = verifyLineCodeAndGetProfile(code, redirectUri); return outputJSON({ status: "success", name: data.displayName, email: data.userId, picture: data.pictureUrl, idToken: "LINE_" + data.userId }); } catch (e) { return outputJSON({ status: "error", message: e.toString() }); } }
function handleAnalyzeRequest(e) { 
  var name = e.parameter.name;
  if (!name) return outputJSON({ result: "請提供姓名" });
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var userMap = loadUsersMap(ss); 
  var targetUid = null;
  for (var key in userMap) { if (userMap[key].name === name) { targetUid = userMap[key].uid; break; } }
  if (!targetUid && userMap[name.toLowerCase()]) targetUid = userMap[name.toLowerCase()].uid;
  if (!targetUid) targetUid = name; 
  var dataSheet = ss.getSheetByName("Data");
  var rows = dataSheet.getDataRange().getDisplayValues();
  var history = [];
  for (var i = 1; i < rows.length; i++) {
      if (String(rows[i][1]) === targetUid || String(rows[i][1]) === name) {
          history.push({ time: rows[i][0], sbp: rows[i][3], dbp: rows[i][4], hr: rows[i][5], glucose: rows[i][6], note: rows[i][7] });
      }
  }
  var recentData = history.slice(-10);
  if (recentData.length === 0) return outputJSON({ result: "該用戶尚無足夠數據進行分析。" });
  var prompt = "請擔任一位專業的家庭醫師，分析以下病患的近期生理數據 (依時間排序)：\n" + JSON.stringify(recentData) + "\n請給出 1. 整體趨勢評估 2. 針對血壓與血糖的具體建議 3. 若有異常請標示注意。請用繁體中文回答，語氣親切專業。";
  try {
    var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=" + GEMINI_API_KEY;
    var payload = { "contents": [{ "parts": [{ "text": prompt }] }] };
    var options = { "method": "post", "contentType": "application/json", "payload": JSON.stringify(payload) };
    var response = UrlFetchApp.fetch(url, options);
    var json = JSON.parse(response.getContentText());
    return outputJSON({ result: json.candidates[0].content.parts[0].text });
  } catch(e) { return outputJSON({ result: "Gemini 分析連線失敗: " + e.toString() }); }
}
function outputJSON(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }