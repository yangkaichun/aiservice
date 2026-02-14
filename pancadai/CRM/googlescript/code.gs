/* Code.gs - PancadAI CRM Backend V5.0 (KPI Update) */

const SPREADSHEET_ID = '1hID8Hi42qNFyA_13BqSJgfjIE4FguQRR5wMEsXBRl0I';
const UPLOAD_FOLDER_ID = '1tmLX1lSEa_R26S5LAyIv7IPAhPuI67Db'; 

function doGet(e) { return ContentService.createTextOutput("PancadAI API is Running."); }

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    const userEmail = data.userEmail;
    
    // 權限驗證
    const userRole = checkUserAuth(userEmail);
    if (!userRole) {
      return responseJSON({ status: 'error', message: 'Unauthorized User' });
    }

    let result = {};

    switch (action) {
      case 'getDashboardData': result = getDashboardData(); break; // [更新]
      case 'getHospitals': result = getSheetData('Hospitals'); break;
      case 'getConfig': result = getSheetData('Dashboard_Config'); break;
      case 'saveHospital': result = saveHospital(data.payload, userEmail); break;
      case 'getKOLs': result = getKOLs(); break;
      case 'saveKOL': result = saveKOL(data.payload, userEmail); break;
      case 'getMonthlyStats': result = getSheetData('Monthly_Stats'); break;
      case 'saveMonthlyStat': result = saveMonthlyStat(data.payload, userEmail); break;
      case 'deleteMonthlyStat': result = deleteMonthlyStat(data.payload, userEmail); break;
      case 'updateInvoiceStatus': result = updateInvoiceStatus(data.payload, userEmail); break;
      case 'uploadFile': result = uploadFileToDrive(data.fileData, data.fileName, data.mimeType); break;
      case 'getUsers': if (userRole !== 'Admin') throw new Error("Permission Denied"); result = getSheetData('Users'); break;
      case 'saveUser': if (userRole !== 'Admin') throw new Error("Permission Denied"); result = saveUser(data.payload, userEmail); break;
      case 'getLogs': if (userRole !== 'Admin') throw new Error("Permission Denied"); result = getSheetData('Logs'); break;
      default: result = { status: 'error', message: 'Unknown Action' };
    }
    return responseJSON({ status: 'success', data: result, role: userRole });
  } catch (error) { return responseJSON({ status: 'error', message: error.toString() }); } 
  finally { lock.releaseLock(); }
}

// --- 核心邏輯 ---

function getDashboardData() {
  const hospitals = getSheetData('Hospitals');
  const kols = getSheetData('KOLs'); // [新增] 讀取 KOL 資料
  
  // 日期格式化 (V4.6+ 修正)
  const monthlyStats = getSheetData('Monthly_Stats').map(item => {
    let ym = item['Year_Month'];
    if (Object.prototype.toString.call(ym) === '[object Date]') {
      let y = ym.getFullYear();
      let m = String(ym.getMonth() + 1).padStart(2, '0');
      let d = String(ym.getDate()).padStart(2, '0');
      item['Year_Month'] = `${y}-${m}-${d}`;
    } else {
      item['Year_Month'] = String(ym);
    }
    return item;
  });
  
  let totalContractValue = 0;
  let regionStats = {};
  let levelStats = {};
  
  // 1. 醫院相關統計
  let signedCount = 0;      // 已簽約
  let developingCount = 0;  // 開發中
  
  hospitals.forEach(h => {
    const status = h['Status'];
    if (status === '已簽約') {
      signedCount++;
      totalContractValue += (Number(h['Contract_Amount']) || 0);
      
      let r = h['Region'] || 'Unknown'; 
      regionStats[r] = (regionStats[r] || 0) + 1;
      
      let l = h['Level'] || 'Unknown'; 
      levelStats[l] = (levelStats[l] || 0) + 1;
    } else if (status === '開發中') {
      developingCount++;
    }
  });

  // 2. KOL 相關統計
  let kolCount = kols.length; // 已接觸 KOL 總數
  
  // 3. 產品介紹醫院數量 (邏輯：計算有多少醫院的 KOL 處於 '產品展示' 階段)
  // 使用 Set 來計算不重複的醫院 ID
  const introHospitalIds = new Set();
  kols.forEach(k => {
    // 檢查 Visit_Stage 是否包含 "產品展示" (需對應您的選項設定)
    if (k['Visit_Stage'] && String(k['Visit_Stage']).includes('產品展示')) {
      if (k['Hospital_ID']) introHospitalIds.add(k['Hospital_ID']);
    }
  });
  let productIntroCount = introHospitalIds.size;

  return {
    kpi: {
      totalContractValue: totalContractValue,
      signedCount: signedCount,
      developingCount: developingCount,
      productIntroCount: productIntroCount,
      kolCount: kolCount,
      regionStats: regionStats,
      levelStats: levelStats,
      hospitalCount: signedCount // 保留舊變數以防萬一
    },
    monthlyStats: monthlyStats
  };
}

// ... (以下維持不變) ...
function checkUserAuth(email) { const users = getSheetData('Users'); const user = users.find(u => String(u.Email).toLowerCase() === String(email).toLowerCase() && u.Status === 'Active'); return user ? user.Role : null; }
function deleteMonthlyStat(p, u) { const ss = SpreadsheetApp.openById(SPREADSHEET_ID); const sheet = ss.getSheetByName('Monthly_Stats'); const data = sheet.getDataRange().getValues(); for (let i = 1; i < data.length; i++) { if (String(data[i][0]) === String(p.recordId)) { sheet.deleteRow(i + 1); logAction(u, 'Delete Settlement', `ID: ${p.recordId}`); return { status: 'success' }; } } return { status: 'error', message: 'Record not found' }; }
function saveMonthlyStat(p, u) { const ss = SpreadsheetApp.openById(SPREADSHEET_ID); const statsSheet = ss.getSheetByName('Monthly_Stats'); const hospitals = getSheetData('Hospitals'); const targetHosp = hospitals.find(h => String(h['Hospital_ID']) === String(p.hospitalId)); let unitPrice = targetHosp ? (Number(String(targetHosp['Unit_Price']).replace(/[^0-9.-]+/g,"")) || 0) : 0; let ebmRatio = targetHosp ? (Number(String(targetHosp['EBM_Share_Ratio']).replace(/[^0-9.-]+/g,"")) || 0) : 0; const usage = Number(p.usageCount) || 0; const gross = usage * unitPrice; const ebmFee = Math.round(gross * (ebmRatio / 100)); const net = gross - ebmFee; const rowData = [p.recordId || Utilities.getUuid(), p.yearMonth, p.hospitalId, usage, unitPrice, gross, ebmRatio, ebmFee, net, p.invoiceStatus || 'Unbilled', p.note || '', new Date()]; const data = statsSheet.getDataRange().getValues(); let rowIndex = -1; if (p.recordId) { for (let i = 1; i < data.length; i++) { if (String(data[i][0]) === String(p.recordId)) { rowIndex = i + 1; break; } } } if (rowIndex > 0) { statsSheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]); logAction(u, 'Update Settlement', `${p.yearMonth} - ${p.hospitalId}`); } else { statsSheet.appendRow(rowData); logAction(u, 'New Settlement', `${p.yearMonth} - ${p.hospitalId}`); } return { status: 'success' }; }
function getSheetData(name) { const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(name); if (!sheet) return []; const data = sheet.getDataRange().getValues(); if (data.length < 2) return []; const headers = data[0]; return data.slice(1).map(row => { let obj={}; headers.forEach((h,i)=>{obj[h.toString().trim()]=row[i]}); return obj; }); }
function saveHospital(p, u) { const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Hospitals'); const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]; const rowObj = { 'Hospital_ID': p.hospitalId || Utilities.getUuid(), 'Name': p.name, 'Region': p.region, 'Address': p.address, 'Level': p.level, 'Status': p.status, 'Exclusivity': p.exclusivity, 'Unit_Price': p.unitPrice, 'Contract_Start_Date': p.contractStart, 'Contract_End_Date': p.contractEnd, 'Contract_Amount': p.contractAmount, 'Contract_Link': p.contractLink, 'EBM_Share_Ratio': p.ebmShare, 'Sales_Rep': p.salesRep, 'Updated_At': new Date() }; const data = sheet.getDataRange().getValues(); let rowIndex = -1; const idIdx = headers.indexOf('Hospital_ID'); if (p.hospitalId && idIdx !== -1) { for (let i = 1; i < data.length; i++) { if (String(data[i][idIdx]) === String(p.hospitalId)) { rowIndex = i + 1; break; } } } const rowArray = headers.map(h => rowObj[h] || ''); if (rowIndex > 0) sheet.getRange(rowIndex, 1, 1, rowArray.length).setValues([rowArray]); else sheet.appendRow(rowArray); return { id: rowObj.Hospital_ID }; }
function getKOLs() { return getSheetData('KOLs'); }
function saveKOL(p, u) { const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('KOLs'); const data = sheet.getDataRange().getValues(); let r = -1; if(p.kolId) { for(let i=1;i<data.length;i++) if(data[i][0]===p.kolId){r=i+1;break;} } const id = p.kolId||Utilities.getUuid(); const row = [id, p.name, p.hospitalId, p.title, p.phone||'', p.email, p.visitStage, p.visitNote, p.probability, '', '', new Date()]; if(r>0) sheet.getRange(r,1,1,row.length).setValues([row]); else sheet.appendRow(row); return {id:id}; }
function saveUser(p, u) { const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Users'); const data = sheet.getDataRange().getValues(); let r = -1; for(let i=1;i<data.length;i++) if(data[i][0]===p.email){r=i+1;break;} const row = [p.email, p.name, p.role, p.status, r>0?data[r-1][4]:'']; if(r>0) sheet.getRange(r,1,1,row.length).setValues([row]); else sheet.appendRow(row); return {status:'success'}; }
function updateInvoiceStatus(p, u) { const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Monthly_Stats'); const data = sheet.getDataRange().getValues(); for(let i=1; i<data.length; i++) { if(String(data[i][0]) === String(p.recordId)) { sheet.getRange(i+1, 10).setValue(p.status); return {status:'success'}; } } return {status:'error'}; }
function uploadFileToDrive(b, n, m) { const folder = DriveApp.getFolderById(UPLOAD_FOLDER_ID); const blob = Utilities.newBlob(Utilities.base64Decode(b), m, n); const file = folder.createFile(blob); file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); return { url: file.getUrl() }; }
function logAction(u, a, d) { SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Logs').appendRow([new Date(), u, a, d]); }
function responseJSON(d) { return ContentService.createTextOutput(JSON.stringify(d)).setMimeType(ContentService.MimeType.JSON); }