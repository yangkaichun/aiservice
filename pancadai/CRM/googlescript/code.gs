/* Code.gs - PancadAI CRM Backend V6.1 */

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
    
    // 權限驗證：現在會回傳 role 與 name
    const authInfo = checkUserAuth(userEmail);
    if (!authInfo) {
      return responseJSON({ status: 'error', message: 'Access Denied: User not authorized or suspended.' });
    }

    const userRole = authInfo.role;
    const userName = authInfo.name;

    let result = {};

    switch (action) {
      case 'getDashboardData': result = getDashboardData(); break;
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
    // 將 name 也傳回前端
    return responseJSON({ status: 'success', data: result, role: userRole, name: userName });
  } catch (error) { return responseJSON({ status: 'error', message: error.toString() }); } 
  finally { lock.releaseLock(); }
}

// --- 核心邏輯 ---

// 比對 Users Sheet，回傳包含 Role 與 Name 的物件
function checkUserAuth(email) { 
  const users = getSheetData('Users'); 
  const user = users.find(u => String(u.Email).trim().toLowerCase() === String(email).trim().toLowerCase() && u.Status === 'Active'); 
  return user ? { role: user.Role, name: user.Name } : null; 
}

function getDashboardData() {
  const hospitals = getSheetData('Hospitals');
  const kols = getSheetData('KOLs'); 
  
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
  
  let totalContractValue = 0, signedCount = 0, developingCount = 0;
  let regionStats = {};     // 已簽約區域統計
  let devRegionStats = {};  // 開發中區域統計
  let levelStats = {};
  
  hospitals.forEach(h => {
    const status = h['Status'];
    let r = h['Region'] || 'Unknown'; 
    let l = h['Level'] || 'Unknown'; 

    if (status === '已簽約') {
      signedCount++;
      totalContractValue += (Number(h['Contract_Amount']) || 0);
      regionStats[r] = (regionStats[r] || 0) + 1;
      levelStats[l] = (levelStats[l] || 0) + 1;
    } else if (status === '開發中') {
      developingCount++;
      // 統計開發中醫院的區域
      devRegionStats[r] = (devRegionStats[r] || 0) + 1;
    }
  });

  let kolCount = kols.length; 
  const introHospitalIds = new Set();
  kols.forEach(k => {
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
      devRegionStats: devRegionStats, // 回傳開發中區域資料
      levelStats: levelStats,
      hospitalCount: signedCount
    },
    monthlyStats: monthlyStats
  };
}

function deleteMonthlyStat(p, u) { const ss = SpreadsheetApp.openById(SPREADSHEET_ID); const sheet = ss.getSheetByName('Monthly_Stats'); const data = sheet.getDataRange().getValues(); for (let i = 1; i < data.length; i++) { if (String(data[i][0]) === String(p.recordId)) { sheet.deleteRow(i + 1); logAction(u, 'Delete Settlement', `ID: ${p.recordId}`); return { status: 'success' }; } } return { status: 'error', message: 'Record not found' }; }
function saveMonthlyStat(p, u) { const ss = SpreadsheetApp.openById(SPREADSHEET_ID); const statsSheet = ss.getSheetByName('Monthly_Stats'); const hospitals = getSheetData('Hospitals'); const targetHosp = hospitals.find(h => String(h['Hospital_ID']) === String(p.hospitalId)); let unitPrice = targetHosp ? (Number(String(targetHosp['Unit_Price']).replace(/[^0-9.-]+/g,"")) || 0) : 0; let ebmRatio = targetHosp ? (Number(String(targetHosp['EBM_Share_Ratio']).replace(/[^0-9.-]+/g,"")) || 0) : 0; const usage = Number(p.usageCount) || 0; const gross = usage * unitPrice; const ebmFee = Math.round(gross * (ebmRatio / 100)); const net = gross - ebmFee; const rowData = [p.recordId || Utilities.getUuid(), p.yearMonth, p.hospitalId, usage, unitPrice, gross, ebmRatio, ebmFee, net, p.invoiceStatus || 'Unbilled', p.note || '', new Date()]; const data = statsSheet.getDataRange().getValues(); let rowIndex = -1; if (p.recordId) { for (let i = 1; i < data.length; i++) { if (String(data[i][0]) === String(p.recordId)) { rowIndex = i + 1; break; } } } if (rowIndex > 0) { statsSheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]); logAction(u, 'Update Settlement', `${p.yearMonth} - ${p.hospitalId}`); } else { statsSheet.appendRow(rowData); logAction(u, 'New Settlement', `${p.yearMonth} - ${p.hospitalId}`); } return { status: 'success' }; }
function getSheetData(name) { const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(name); if (!sheet) return []; const data = sheet.getDataRange().getValues(); if (data.length < 2) return []; const headers = data[0]; return data.slice(1).map(row => { let obj={}; headers.forEach((h,i)=>{obj[h.toString().trim()]=row[i]}); return obj; }); }
function saveHospital(p, u) { const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Hospitals'); const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]; const rowObj = { 'Hospital_ID': p.hospitalId || Utilities.getUuid(), 'Name': p.name, 'Region': p.region, 'Address': p.address, 'Level': p.level, 'Status': p.status, 'Exclusivity': p.exclusivity, 'Unit_Price': p.unitPrice, 'Contract_Start_Date': p.contractStart, 'Contract_End_Date': p.contractEnd, 'Contract_Amount': p.contractAmount, 'Contract_Link': p.contractLink, 'EBM_Share_Ratio': p.ebmShare, 'Sales_Rep': p.salesRep, 'Updated_At': new Date() }; const data = sheet.getDataRange().getValues(); let rowIndex = -1; const idIdx = headers.indexOf('Hospital_ID'); if (p.hospitalId && idIdx !== -1) { for (let i = 1; i < data.length; i++) { if (String(data[i][idIdx]) === String(p.hospitalId)) { rowIndex = i + 1; break; } } } const rowArray = headers.map(h => rowObj[h] || ''); if (rowIndex > 0) sheet.getRange(rowIndex, 1, 1, rowArray.length).setValues([rowArray]); else sheet.appendRow(rowArray); return { id: rowObj.Hospital_ID }; }
function getKOLs() { return getSheetData('KOLs'); }
function saveKOL(p, u) { 
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('KOLs');
    const data = sheet.getDataRange().getValues(); let r = -1;
    if(p.kolId) { for(let i=1;i<data.length;i++) if(data[i][0]===p.kolId){r=i+1;break;} }
    const id = p.kolId||Utilities.getUuid();
    const row = [id, p.name, p.hospitalId, p.title, p.phone||'', p.email, p.visitStage, p.visitNote, p.probability, '', '', new Date()];
    if(r>0) { sheet.getRange(r,1,1,row.length).setValues([row]); logAction(u, 'Update KOL', `${p.name}`); } 
    else { sheet.appendRow(row); logAction(u, 'New KOL', `${p.name}`); }
    
    // 自動連動醫院
    if (p.visitStage && p.visitStage.includes('已成交')) {
        const hospSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Hospitals');
        const hospData = hospSheet.getDataRange().getValues();
        if(hospData.length > 0) {
            const hospHeaders = hospData[0];
            const idIdx = hospHeaders.indexOf('Hospital_ID');
            const statusIdx = hospHeaders.indexOf('Status');
            if (idIdx !== -1 && statusIdx !== -1) {
                for (let i = 1; i < hospData.length; i++) {
                    if (String(hospData[i][idIdx]) === String(p.hospitalId)) {
                        if (hospData[i][statusIdx] !== '已簽約') {
                            hospSheet.getRange(i + 1, statusIdx + 1).setValue('已簽約');
                            logAction(u, 'Auto Sync', `Hospital ${p.hospitalId} -> 已簽約 (KOL Won)`);
                        }
                        break;
                    }
                }
            }
        }
    }
    return {id:id};
}
function saveUser(p, u) { const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Users'); const data = sheet.getDataRange().getValues(); let r = -1; for(let i=1;i<data.length;i++) if(data[i][0]===p.email){r=i+1;break;} const row = [p.email, p.name, p.role, p.status, r>0?data[r-1][4]:'']; if(r>0) sheet.getRange(r,1,1,row.length).setValues([row]); else sheet.appendRow(row); return {status:'success'}; }
function updateInvoiceStatus(p, u) { const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Monthly_Stats'); const data = sheet.getDataRange().getValues(); for(let i=1; i<data.length; i++) { if(String(data[i][0]) === String(p.recordId)) { sheet.getRange(i+1, 10).setValue(p.status); return {status:'success'}; } } return {status:'error'}; }
function uploadFileToDrive(b, n, m) { const folder = DriveApp.getFolderById(UPLOAD_FOLDER_ID); const blob = Utilities.newBlob(Utilities.base64Decode(b), m, n); const file = folder.createFile(blob); file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); return { url: file.getUrl() }; }
function logAction(u, a, d) { SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Logs').appendRow([new Date(), u, a, d]); }
function responseJSON(d) { return ContentService.createTextOutput(JSON.stringify(d)).setMimeType(ContentService.MimeType.JSON); }