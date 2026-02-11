// app.js V3.0

let currentUser = null;
let currentRole = null;
let globalHospitals = []; 
let globalKOLs = [];
let globalStats = []; // 財務數據
let globalConfig = { regions: [], levels: [] }; 
let kolModal, userModal, settlementModal;

window.onload = function() {
    const client_id = CONFIG.GOOGLE_CLIENT_ID;
    document.getElementById('g_id_onload').setAttribute('data-client_id', client_id);
    kolModal = new bootstrap.Modal(document.getElementById('modalKOL'));
    userModal = new bootstrap.Modal(document.getElementById('modalUser'));
    settlementModal = new bootstrap.Modal(document.getElementById('modalSettlement'));
    
    // 設定財務月份預設為當月
    const today = new Date();
    const monthStr = today.toISOString().slice(0, 7); // YYYY-MM
    document.getElementById('finance-month-picker').value = monthStr;
};

function handleCredentialResponse(response) {
    const responsePayload = decodeJwtResponse(response.credential);
    currentUser = responsePayload.email;
    document.getElementById('user-name').innerText = responsePayload.name;
    document.getElementById('user-avatar').src = responsePayload.picture;
    verifyBackendAuth(currentUser);
}

function decodeJwtResponse(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

async function verifyBackendAuth(email) {
    showLoading(true);
    const payload = { action: "getDashboardData", userEmail: email };
    try {
        const response = await fetch(CONFIG.SCRIPT_URL, { method: "POST", body: JSON.stringify(payload) });
        const json = await response.json();
        
        if (json.status === 'success') {
            currentRole = json.role;
            document.getElementById('login-view').classList.add('d-none');
            document.getElementById('app-view').classList.remove('d-none');
            
            if (currentRole === 'Admin') document.getElementById('nav-admin').classList.remove('d-none');

            await loadSystemConfig(); 
            // 預載資料
            loadRadarData(); // Hospitals
            // Dashboard KPI (簡易版)
            document.getElementById('kpi-contract-value').innerText = "$" + json.data.kpi.totalContractValue.toLocaleString();
        } else {
            alert("無權限或系統錯誤: " + json.message);
            logout();
        }
    } catch (e) { console.error(e); alert("連線失敗"); } finally { showLoading(false); }
}

async function loadSystemConfig() {
    try {
        const res = await fetch(CONFIG.SCRIPT_URL, { method: "POST", body: JSON.stringify({ action: "getConfig", userEmail: currentUser }) });
        const json = await res.json();
        const rawConfig = json.data;
        globalConfig.regions = rawConfig.filter(r => r.Category === 'Region').map(r => r.Option_Value);
        globalConfig.levels = rawConfig.filter(r => r.Category === 'Hospital_Level').map(r => r.Option_Value);
        populateSelect('radar-filter-region', globalConfig.regions, '全部區域');
        populateSelect('radar-filter-level', globalConfig.levels, '全部規模');
        populateSelect('h-region', globalConfig.regions);
        populateSelect('h-level', globalConfig.levels);
    } catch (e) { console.error(e); }
}

function populateSelect(id, opts, def) {
    const el = document.getElementById(id);
    if(!el) return;
    el.innerHTML = '';
    if(def) el.innerHTML += `<option value="All">${def}</option>`;
    opts.forEach(o => el.innerHTML += `<option value="${o}">${o}</option>`);
}

function showPage(pageId) {
    document.querySelectorAll('.page-content').forEach(el => el.classList.add('d-none'));
    document.getElementById('page-' + pageId).classList.remove('d-none');
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
    // Highlight Active Nav
    const links = document.querySelectorAll('.nav-link');
    for(let link of links) {
        if(link.getAttribute('onclick') && link.getAttribute('onclick').includes(pageId)) {
            link.classList.add('active');
        }
    }

    if (pageId === 'kols') loadKOLData();
    if (pageId === 'hospitals') loadRadarData();
    if (pageId === 'admin') loadAdminData();
    if (pageId === 'finance') loadFinanceData();
}

// --- Data Loaders ---
async function loadRadarData() {
    try {
        const res = await fetch(CONFIG.SCRIPT_URL, { method: "POST", body: JSON.stringify({ action: "getHospitals", userEmail: currentUser }) });
        const json = await res.json();
        globalHospitals = json.data;
        renderRadarTable();
        renderHospitalList();
    } catch (e) { console.error(e); }
}

async function loadKOLData() {
    try {
        const res = await fetch(CONFIG.SCRIPT_URL, { method: "POST", body: JSON.stringify({ action: "getKOLs", userEmail: currentUser }) });
        const json = await res.json();
        globalKOLs = json.data;
        renderKOLList();
    } catch (e) { console.error(e); }
}

async function loadFinanceData() {
    showLoading(true);
    try {
        // 同步確保有最新醫院名單 (為了計算單價)
        if(globalHospitals.length === 0) await loadRadarData();

        const res = await fetch(CONFIG.SCRIPT_URL, { method: "POST", body: JSON.stringify({ action: "getMonthlyStats", userEmail: currentUser }) });
        const json = await res.json();
        globalStats = json.data;
        renderFinanceTable();
    } catch (e) { console.error(e); } finally { showLoading(false); }
}

// --- Renderers ---
function renderRadarTable() { /* 同前一版, 省略細節 */ }
function renderHospitalList() {
    const tbody = document.getElementById('hospital-list-body');
    tbody.innerHTML = '';
    globalHospitals.forEach(h => {
        // 顯示 Unit Price
        tbody.innerHTML += `<tr><td>${h.Name}</td><td>${h.Level}</td><td>$${(h.Unit_Price||0).toLocaleString()}</td><td>${h.Exclusivity}</td><td>${h.Contract_End_Date ? h.Contract_End_Date.split('T')[0] : '-'}</td><td><button class="btn btn-sm btn-outline-primary" onclick="openHospitalInput('${h.Hospital_ID}')">Edit</button></td></tr>`;
    });
}
function renderKOLList() { /* 同前一版 */ }

// --- Finance Logic (New) ---

function renderFinanceTable() {
    const selectedMonth = document.getElementById('finance-month-picker').value; // YYYY-MM
    const tbody = document.getElementById('finance-table-body');
    tbody.innerHTML = '';

    let kpiGross = 0, kpiNet = 0, kpiAR = 0, kpiEBM = 0;

    globalStats.forEach(stat => {
        // Filter by Month
        if (stat.Year_Month !== selectedMonth) return;

        // Find Hospital Name
        const hosp = globalHospitals.find(h => h.Hospital_ID === stat.Hospital_ID);
        const hospName = hosp ? hosp.Name : stat.Hospital_ID;

        // Calc KPI
        kpiGross += Number(stat.Gross_Revenue);
        kpiNet += Number(stat.Net_Revenue);
        kpiEBM += Number(stat.EBM_Fee);
        if (stat.Invoice_Status !== 'Paid') kpiAR += Number(stat.Gross_Revenue); // Billed or Unbilled

        // Status Badge Style
        let badgeClass = 'bg-secondary';
        if (stat.Invoice_Status === 'Billed') badgeClass = 'bg-primary';
        if (stat.Invoice_Status === 'Paid') badgeClass = 'bg-success';

        tbody.innerHTML += `
            <tr>
                <td><strong>${hospName}</strong></td>
                <td>${stat.Usage_Count}</td>
                <td>$${stat.Unit_Price_Snapshot}</td>
                <td>$${Number(stat.Gross_Revenue).toLocaleString()}</td>
                <td class="text-muted small">${stat.EBM_Ratio_Snapshot}%</td>
                <td class="text-success fw-bold">$${Number(stat.Net_Revenue).toLocaleString()}</td>
                <td><span class="badge ${badgeClass} status-badge" onclick="toggleInvoiceStatus('${stat.Record_ID}', '${stat.Invoice_Status}')">${stat.Invoice_Status}</span></td>
                <td><button class="btn btn-sm btn-outline-dark" onclick="openSettlementModal('${stat.Record_ID}')"><i class="fas fa-edit"></i></button></td>
            </tr>
        `;
    });

    // Update KPI UI
    document.getElementById('fin-kpi-gross').innerText = "$" + kpiGross.toLocaleString();
    document.getElementById('fin-kpi-net').innerText = "$" + kpiNet.toLocaleString();
    document.getElementById('fin-kpi-ar').innerText = "$" + kpiAR.toLocaleString();
    document.getElementById('fin-kpi-ebm').innerText = "$" + kpiEBM.toLocaleString();
}

function openSettlementModal(recordId = null) {
    document.getElementById('form-settlement').reset();
    document.getElementById('s-record-id').value = '';
    
    // Set Default Month
    document.getElementById('s-month').value = document.getElementById('finance-month-picker').value;

    // Populate Hospital Select
    const sel = document.getElementById('s-hospital');
    sel.innerHTML = '<option value="">請選擇醫院...</option>';
    globalHospitals.filter(h => h.Status === '已簽約').forEach(h => {
        sel.innerHTML += `<option value="${h.Hospital_ID}">${h.Name}</option>`;
    });

    if (recordId) {
        const rec = globalStats.find(r => r.Record_ID === recordId);
        if (rec) {
            document.getElementById('s-record-id').value = rec.Record_ID;
            document.getElementById('s-month').value = rec.Year_Month;
            document.getElementById('s-hospital').value = rec.Hospital_ID;
            document.getElementById('s-usage').value = rec.Usage_Count;
            document.getElementById('s-note').value = rec.Note;
        }
    }
    calcPreview();
    settlementModal.show();
}

function calcPreview() {
    const hospId = document.getElementById('s-hospital').value;
    const usage = document.getElementById('s-usage').value;
    const hosp = globalHospitals.find(h => h.Hospital_ID === hospId);

    if (hosp) {
        const price = hosp.Unit_Price || 0;
        const share = hosp.EBM_Share_Ratio || 0;
        document.getElementById('s-hosp-info').innerText = `單價: $${price} | 分潤: ${share}%`;

        const gross = usage * price;
        const net = gross * (1 - (share/100));
        document.getElementById('s-prev-gross').innerText = "$" + gross.toLocaleString();
        document.getElementById('s-prev-net').innerText = "$" + Math.round(net).toLocaleString();
    } else {
        document.getElementById('s-hosp-info').innerText = "請選擇醫院";
        document.getElementById('s-prev-gross').innerText = "$0";
        document.getElementById('s-prev-net').innerText = "$0";
    }
}

async function submitSettlement() {
    const payload = {
        recordId: document.getElementById('s-record-id').value,
        yearMonth: document.getElementById('s-month').value,
        hospitalId: document.getElementById('s-hospital').value,
        usageCount: document.getElementById('s-usage').value,
        note: document.getElementById('s-note').value
    };

    if (!payload.hospitalId || !payload.yearMonth) { alert("請填寫完整"); return; }

    showLoading(true);
    try {
        const res = await fetch(CONFIG.SCRIPT_URL, { method: 'POST', body: JSON.stringify({ action: 'saveMonthlyStat', userEmail: currentUser, payload: payload }) });
        const json = await res.json();
        if(json.status === 'success') {
            settlementModal.hide();
            loadFinanceData(); // Reload Table
        } else {
            alert("儲存失敗");
        }
    } catch(e) { console.error(e); } finally { showLoading(false); }
}

async function toggleInvoiceStatus(recordId, currentStatus) {
    const nextStatus = { 'Unbilled': 'Billed', 'Billed': 'Paid', 'Paid': 'Unbilled' };
    const newStatus = nextStatus[currentStatus];

    if(!confirm(`確認更改狀態為 ${newStatus}?`)) return;

    showLoading(true);
    await fetch(CONFIG.SCRIPT_URL, { 
        method: 'POST', 
        body: JSON.stringify({ action: 'updateInvoiceStatus', userEmail: currentUser, payload: { recordId: recordId, status: newStatus } }) 
    });
    await loadFinanceData();
    showLoading(false);
}

// --- Admin & Utils ---
async function loadAdminData() { /* 同前一版 */ }
function renderUserTable(users) { /* 同前一版 */ }
function renderLogTable(logs) { /* 同前一版 */ }
function openUserModal() { /* 同前一版 */ }
function submitUser() { /* 同前一版 */ }

// --- Hospital Input (Updated with Unit Price) ---
function openHospitalInput(id = null) {
    showPage('hospital-input');
    document.getElementById('form-hospital').reset();
    document.getElementById('h-id').value = '';
    document.getElementById('h-link').value = '';
    document.getElementById('btn-view-contract').classList.add('d-none');
    
    if (id) {
        document.getElementById('input-page-title').innerText = "編輯醫院資料";
        const h = globalHospitals.find(x => x.Hospital_ID === id);
        if (h) {
            document.getElementById('h-id').value = h.Hospital_ID;
            document.getElementById('h-name').value = h.Name;
            document.getElementById('h-region').value = h.Region;
            document.getElementById('h-level').value = h.Level;
            document.getElementById('h-address').value = h.Address;
            document.getElementById('h-status').value = h.Status;
            document.getElementById('h-exclusivity').value = h.Exclusivity;
            document.getElementById('h-ebm').value = h.EBM_Share_Ratio;
            
            // [New] Unit Price
            document.getElementById('h-unit-price').value = h.Unit_Price;

            document.getElementById('h-amount').value = h.Contract_Amount;
            document.getElementById('h-link').value = h.Contract_Link;
            if (h.Contract_Link && h.Contract_Link.startsWith('http')) {
                const btnView = document.getElementById('btn-view-contract');
                btnView.href = h.Contract_Link;
                btnView.classList.remove('d-none');
            }
            if(h.Contract_Start_Date) document.getElementById('h-start').value = h.Contract_Start_Date.split('T')[0];
            if(h.Contract_End_Date) document.getElementById('h-end').value = h.Contract_End_Date.split('T')[0];
        }
    } else {
        document.getElementById('input-page-title').innerText = "新增醫院資料";
    }
}

async function submitHospital() {
    showLoading(true);
    let finalContractLink = document.getElementById('h-link').value;
    const fileInput = document.getElementById('h-file');

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const base64Data = await readFileAsBase64(file);
        const res = await fetch(CONFIG.SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({ action: 'uploadFile', userEmail: currentUser, fileData: base64Data, fileName: file.name, mimeType: file.type })
        });
        const json = await res.json();
        if (json.status === 'success') finalContractLink = json.data.url;
    }

    const payload = {
        hospitalId: document.getElementById('h-id').value,
        name: document.getElementById('h-name').value,
        region: document.getElementById('h-region').value,
        level: document.getElementById('h-level').value,
        address: document.getElementById('h-address').value,
        status: document.getElementById('h-status').value,
        exclusivity: document.getElementById('h-exclusivity').value,
        ebmShare: document.getElementById('h-ebm').value,
        
        // [New] Unit Price
        unitPrice: document.getElementById('h-unit-price').value,

        contractAmount: document.getElementById('h-amount').value,
        contractStart: document.getElementById('h-start').value,
        contractEnd: document.getElementById('h-end').value,
        contractLink: finalContractLink,
        salesRep: document.getElementById('user-name').innerText 
    };

    await fetch(CONFIG.SCRIPT_URL, { method: 'POST', body: JSON.stringify({ action: 'saveHospital', userEmail: currentUser, payload: payload }) });
    await loadRadarData(); 
    showPage('hospitals');
    showLoading(false);
}

function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}
function showLoading(show) {
    const el = document.getElementById('loading-overlay');
    if(show) el.classList.remove('d-none');
    else el.classList.add('d-none');
}
function logout() { currentUser = null; location.reload(); }