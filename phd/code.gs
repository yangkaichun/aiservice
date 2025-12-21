// ==========================================
// Code.gs v14.1 (SmartHealthDB 2 Compatible)
// ==========================================
const ADMIN_EMAIL = "kaichun.yang@gmail.com"; 
const GEMINI_API_KEY = "AIzaSyDnRyQUyW-0EgB0hSzyPFZu6mT_0L12xSg"; // ⚠️ 請確認 Key
const TTS_API = "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"; //TTS

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

// ----------------------------------------------------
// 核心讀取 (對應 SmartHealthDB (2).xlsx)
// ----------------------------------------------------
function handleGetAllData(ss) {
  try {
    var userMap = loadUsersMap(ss);
    var dataSheet = ss.getSheetByName("Data");
    if (!dataSheet) return outputJSON([]);
    
    // 使用 getDisplayValues() 確保讀到的是「看到的文字」
    var rows = dataSheet.getDataRange().getDisplayValues();
    var result = [];

    // 從第 2 列開始 (索引 1)，跳過標題
    for (var i = 1; i < rows.length; i++) {
        var row = rows[i];
        
        // Data 表結構: A=Timestamp(0), B=UID(1), C=Context(2), D=SBP(3), E=DBP(4), F=HR(5), G=Glucose(6), H=Note(7)
        var rawId = String(row[1]).trim();
        var key = rawId.toLowerCase();
        
        var userInfo = userMap[key];
        
        // 顯示名稱
        var displayName = (userInfo && userInfo.name) ? userInfo.name : rawId;
        // 統一 UID
        var finalUid = (userInfo && userInfo.uid) ? userInfo.uid : rawId;

        // 時間處理: 直接回傳字串，不要在後端轉 Date 物件
        var timeStr = String(row[0]);

        result.push({
            timestamp: timeStr,
            rawId: finalUid,   
            originalId: rawId, 
            name: displayName,
            birthday: (userInfo ? userInfo.birthday : ""),
            context: row[2],
            sbp: row[3], 
            dbp: row[4], 
            pulse: row[5], 
            glucose: row[6],
            note: row[7] || ""
        });
    }
    return outputJSON(result);

  } catch (error) { return outputJSON({ error: error.toString() }); }
}

function loadUsersMap(ss) {
    var sheet = ss.getSheetByName("Users");
    var map = {};
    if(!sheet) return map;

    var rows = sheet.getDataRange().getDisplayValues();
    for(var i=1; i<rows.length; i++) {
        var row = rows[i];
        // Users 表: A=UID(0), B=Email(1), C=Name(2), D=Birthday(3), E=Role(4), F=Provider(5), G=LineUserId(6)
        var uid = row[0] ? String(row[0]).trim() : "";
        var email = row[1] ? String(row[1]).trim() : "";
        // 修正：增加防呆檢查，避免 row[6] 不存在時變成 "undefined"
        var lineId = row[6] ? String(row[6]).trim() : "";
        
        var info = { uid: uid, email: email, name: row[2], birthday: row[3], lineUserId: lineId };

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
        if(!row[0] && !row[1]) continue;
        
        // 修正：增加防呆檢查
        list.push({
            uid: String(row[0]).trim(),
            email: String(row[1]).trim(),
            name: row[2] || "",
            birthday: row[3] || "",
            lineUserId: row[6] ? String(row[6]).trim() : ""
        });
    }
    return outputJSON(list);
}

// ==========================================
// 2. doPost (寫入對應)
// ==========================================
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

  } catch (error) { return outputJSON({ status: "error", message: error.toString() }); } 
  finally { lock.releaseLock(); }
}

// ... 驗證輔助 ...
function getUserEmailFromToken(token) { 
    if (token === "mock-token") return "test@example.com"; 
    if (token && token.startsWith("LINE_")) return token.replace("LINE_", ""); 
    try { return verifyGoogleToken(token).email; } catch (e) { return null; } 
}

function handleGetProfile(token) { 
    var email = getUserEmailFromToken(token); 
    if (!email) return outputJSON({ status: "error" }); 
    var ss = SpreadsheetApp.getActiveSpreadsheet(); 
    var userMap = loadUsersMap(ss); 
    var user = userMap[email.toLowerCase().trim()]; 
    if (!user) { 
        var sheet = ss.getSheetByName("Users"); 
        if(!sheet) { 
            sheet = ss.insertSheet("Users"); 
            sheet.appendRow(["UID", "Email", "Name", "Birthday", "Role", "Provider", "LineUserId"]); 
        } 
        var newUid = Utilities.getUuid(); 
        var provider = token.startsWith("LINE_") ? "LINE" : "Google"; 
        // 確保新增使用者時有完整的欄位 (7欄)
        sheet.appendRow([newUid, email, "", "", "user", provider, ""]); 
        return outputJSON({ status: "success", name: "", birthday: "", providers: provider, uid: newUid }); 
    } 
    return outputJSON({ status: "success", name: user.name, birthday: user.birthday, providers: user.provider, uid: user.uid }); 
}

function handleUpdateProfile(data) { 
    var email = getUserEmailFromToken(data.token); 
    if (!email && data.userEmail) email = data.userEmail; 
    if (!email) return outputJSON({ status: "error" }); 
    var ss = SpreadsheetApp.getActiveSpreadsheet(); 
    var sheet = ss.getSheetByName("Users"); 
    var rows = sheet.getDataRange().getDisplayValues(); 
    for(var i=1; i<rows.length; i++) { 
        if(String(rows[i][1]).trim().toLowerCase() === String(email).trim().toLowerCase()) { 
            sheet.getRange(i+1, 3).setValue(data.userName); // Col C
            sheet.getRange(i+1, 4).setValue(data.userBirthday); // Col D
            return outputJSON({ status: "success" }); 
        } 
    } 
    // 若找不到則新增 (保持一致性)
    sheet.appendRow([Utilities.getUuid(), email, data.userName, data.userBirthday, "user", "Unknown", ""]); 
    return outputJSON({ status: "success" }); 
}

function handleBindAccount(data) { 
    var email = getUserEmailFromToken(data.token); 
    if(!email && data.userEmail) email = data.userEmail; 
    var bindType = data.bindType; 
    var lineId = ""; 
    if (bindType === "LINE") { 
        try { 
            var l = verifyLineCodeAndGetProfile(data.bindPayload, data.redirectUri); 
            lineId = l.userId; 
        } catch(e) { return outputJSON({ status: "error", message: "Line Verify Failed" }); } 
    } else { 
        try { verifyGoogleToken(data.bindPayload); } catch(e) { return outputJSON({ status: "error" }); } 
    } 
    
    var ss = SpreadsheetApp.getActiveSpreadsheet(); 
    var sheet = ss.getSheetByName("Users"); 
    var rows = sheet.getDataRange().getDisplayValues(); 
    for(var i=1; i<rows.length; i++) { 
        // 比對 Email (Col B)
        if(String(rows[i][1]).toLowerCase().trim() === String(email).toLowerCase().trim()) { 
            var currentP = String(rows[i][5] || ""); // Col F
            if(!currentP.includes(bindType)) { 
                sheet.getRange(i+1, 6).setValue(currentP + (currentP ? ", " : "") + bindType); // 更新 Provider
            } 
            if(bindType === "LINE" && lineId) { 
                sheet.getRange(i+1, 7).setValue(lineId); // 更新 LineUserId (Col G)
            } 
            return outputJSON({ status: "success", message: "綁定成功" }); 
        } 
    } 
    return outputJSON({ status: "error", message: "User not found" }); 
}

function verifyGoogleToken(token) { var response = UrlFetchApp.fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + token, { muteHttpExceptions: true }); var identity = JSON.parse(response.getContentText()); if (identity.error) throw new Error(identity.error_description); return identity; }
function verifyLineCodeAndGetProfile(code, redirectUri) { var url = "https://api.line.me/oauth2/v2.1/token"; var payload = { grant_type: "authorization_code", code: code, redirect_uri: redirectUri, client_id: LINE_CHANNEL_ID, client_secret: LINE_CHANNEL_SECRET }; var options = { method: "post", payload: payload, muteHttpExceptions: true }; var res = UrlFetchApp.fetch(url, options); var json = JSON.parse(res.getContentText()); if (json.error) throw new Error(json.error_description); var profileRes = UrlFetchApp.fetch("https://api.line.me/v2/profile", { headers: { "Authorization": "Bearer " + json.access_token } }); return JSON.parse(profileRes.getContentText()); }
function handleLineLoginCode(code, redirectUri) { try { var data = verifyLineCodeAndGetProfile(code, redirectUri); return outputJSON({ status: "success", name: data.displayName, email: data.userId, picture: data.pictureUrl, idToken: "LINE_" + data.userId }); } catch (e) { return outputJSON({ status: "error", message: e.toString() }); } }
function verifyAdminAccess(token) { try { var id = verifyGoogleToken(token); if(id.email === ADMIN_EMAIL) return true; } catch(e){} throw new Error("Access Denied"); }
function handleSaveUser(data) { return outputJSON({status:"success"}); } 
function handleDeleteUserAccount(e) { return outputJSON({status:"success"}); }
function handleAnalyzeRequest(e) { return outputJSON({ result: "分析暫停" }); }
function outputJSON(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }