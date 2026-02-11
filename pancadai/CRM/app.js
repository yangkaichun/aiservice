// app.js V3.4 (UI Gradients)

let currentUser = null;
let currentRole = null;
let globalHospitals = []; 
let globalKOLs = [];
let globalStats = []; 
let globalConfig = { regions: [], levels: [] }; 
let kolModal, userModal, settlementModal;

// --- 初始化 ---

window.onload = function() {
    const client_id = CONFIG.GOOGLE_CLIENT_ID;
    document.getElementById('g_id_onload').setAttribute('data-client_id', client_id);
    
    if(document.getElementById('modalKOL')) kolModal = new bootstrap.Modal(document.getElementById('modalKOL'));
    if(document.getElementById('modalUser')) userModal = new bootstrap.Modal(document.getElementById('modalUser'));
    if(document.getElementById('modalSettlement')) settlementModal = new bootstrap.Modal(document.getElementById('modalSettlement'));
    
    const today = new Date();
    const monthStr = today.toISOString().slice(0, 7); 
    const monthPicker = document.getElementById('finance-month-picker');
    if(monthPicker) monthPicker.value = monthStr;
};

// 安全讀寫
function getVal(id) { const el = document.getElementById(id); return el ? el.value : ''; }
function setVal(id, value) { const el = document.getElementById(id); if (el) el.value = value || ''; }

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
            
            if (currentRole === 'Admin') {
                const adminNav = document.getElementById('nav-admin');
                if(adminNav) adminNav.classList.remove('d-none');
            }

            await loadSystemConfig(); 
            renderDashboard(json.data);
            loadRadarData(); 
        } else {
            alert("無權限或系統錯誤: " + json.message);
            logout();
        }
    } catch (e) { console.error(e); alert("系統連線失敗"); } finally { showLoading(false); }
}

// --- Config & Nav ---

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

function populateSelect(elementId, options, defaultText = null) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.innerHTML = ''; 
    if (defaultText) el.innerHTML += `<option value="All">${defaultText}</option>`;
    options.forEach(opt => el.innerHTML += `<option value="${opt}">${opt}</option>`);
}

function showPage(pageId) {
    document.querySelectorAll('.page-content').forEach(el => el.classList.add('d-none'));
    const target = document.getElementById('page-' + pageId);
    if(target) target.classList.remove('d-none');
    
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
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
    showLoading(true);
    try {
        const res = await fetch(CONFIG.SCRIPT_URL, { method: "POST", body: JSON.stringify({ action: "getHospitals", userEmail: currentUser }) });
        const json = await res.json();
        globalHospitals = json.data;
        renderRadarTable();
        renderHospitalList(); 
    } catch (e) { console.error(e); } finally { showLoading(false); }
}

async function loadKOLData() {
    showLoading(true);
    try {
        const res = await fetch(CONFIG.SCRIPT_URL, { method: "POST", body: JSON.stringify({ action: "getKOLs", userEmail: currentUser }) });
        const json = await res.json();
        globalKOLs = json.data;
        renderKOLList();
    } catch (e) { console.error(e); } finally { showLoading(false); }
}

async function loadFinanceData() {
    showLoading(true);
    try {
        if(globalHospitals.length === 0) await loadRadarData();
        const res = await fetch(CONFIG.SCRIPT_URL, { method: "POST", body: JSON.stringify({ action: "getMonthlyStats", userEmail: currentUser }) });
        const json = await res.json();
        globalStats = json.data;
        renderFinanceTable();
    } catch (e) { console.error(e); } finally { showLoading(false); }
}

// --- Admin ---

async function loadAdminData() {
    if (currentRole !== 'Admin') return;
    showLoading(true);
    try {
        const [resUsers, resLogs] = await Promise.all([
            fetch(CONFIG.SCRIPT_URL, { method: "POST", body: JSON.stringify({ action: "getUsers", userEmail: currentUser }) }),
            fetch(CONFIG.SCRIPT_URL, { method: "POST", body: JSON.stringify({ action: "getLogs", userEmail: currentUser }) })
        ]);
        const jsonUsers = await resUsers.json();
        const jsonLogs = await resLogs.json();
        if (jsonUsers.status === 'success') renderUserTable(jsonUsers.data);
        if (jsonLogs.status === 'success') renderLogTable(jsonLogs.data);
    } catch (e) { console.error(e); } finally { showLoading(false); }
}

function renderUserTable(users) {
    const tbody = document.getElementById('admin-users-body');
    if(!tbody) return;
    tbody.innerHTML = '';
    users.forEach(u => {
        let loginTime = u.Last_Login ? new Date(u.Last_Login).toLocaleString() : '-';
        const roleBadge = u.Role === 'Admin' ? 'bg-danger' : 'bg-info text-dark';
        tbody.innerHTML += `<tr><td>${u.Email}</td><td>${u.Name}</td><td><span class="badge ${roleBadge}">${u.Role}</span></td><td>${u.Status}</td><td style="font-size:0.8em">${loginTime}</td><td><button class="btn btn-sm btn-outline-dark" onclick="openUserModal('${u.Email}', '${u.Name}', '${u.Role}', '${u.Status}')"><i class="fas fa-edit"></i></button></td></tr>`;
    });
}

function renderLogTable(logs) {
    const tbody = document.getElementById('admin-logs-body');
    if(!tbody) return;
    tbody.innerHTML = '';
    logs.reverse().forEach(log => {
        tbody.innerHTML += `<tr><td style="white-space:nowrap;">${new Date(log.Timestamp).toLocaleString()}</td><td>${log.User}</td><td><strong>${log.Action}</strong></td><td class="text-muted">${log.Details}</td></tr>`;
    });
}

// --- Dashboard & Charts with Gradients ---

function renderDashboard(data) {
    const kpi = data.kpi;
    document.getElementById('kpi-contract-value').innerText = "$" + (kpi.totalContractValue || 0).toLocaleString();
    if(document.getElementById('kpi-hospital-count')) document.getElementById('kpi-hospital-count').innerText = (kpi.hospitalCount || 0).toLocaleString();
    
    // Pie Chart
    const ctxRegion = document.getElementById('chart-region');
    if (ctxRegion) {
        if(window.myRegionChart) window.myRegionChart.destroy();
        
        const rStats = kpi.regionStats || {};
        const rLabels = Object.keys(rStats);
        const rData = Object.values(rStats);
        if(rLabels.length === 0) { rLabels.push('無資料'); rData.push(1); }

        window.myRegionChart = new Chart(ctxRegion.getContext('2d'), {
            type: 'doughnut', // Better than Pie for UI
            data: {
                labels: rLabels,
                datasets: [{
                    data: rData,
                    backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b'],
                    hoverOffset: 4
                }]
            }
        });
    }

    // Line Chart with Gradient Fill
    const ctxTrend = document.getElementById('chart-trend');
    if (ctxTrend) {
        const ctx = ctxTrend.getContext('2d');
        if(window.myTrendChart) window.myTrendChart.destroy();

        // Create Gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(78, 115, 223, 0.5)'); // Top color
        gradient.addColorStop(1, 'rgba(78, 115, 223, 0.05)'); // Bottom color

        window.myTrendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: '營收預估',
                    data: [50, 100, 150, 200, 250, 300], // 範例數據
                    backgroundColor: gradient,
                    borderColor: '#4e73df',
                    pointBackgroundColor: '#4e73df',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#4e73df',
                    fill: true,
                    tension: 0.4 // Smooth curve
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false } },
                    y: { grid: { borderDash: [2] }, beginAtZero: true }
                }
            }
        });
    }
}

// --- Table Renderers ---

function renderRadarTable() {
    const region = getVal('radar-filter-region');
    const level = getVal('radar-filter-level');
    const status = getVal('radar-filter-status');
    const tbody = document.getElementById('radar-table-body');
    if(!tbody) return;
    tbody.innerHTML = '';

    globalHospitals.forEach(h => {
        if (region !== 'All' && h.Region !== region) return;
        if (level !== 'All' && h.Level !== level) return;
        if (status !== 'All' && h.Status !== status) return;
        let badge = h.Status === '已簽約' ? 'bg-success' : (h.Status === '開發中' ? 'bg-warning text-dark' : 'bg-secondary');
        tbody.innerHTML += `<tr><td><strong>${h.Name}</strong></td><td>${h.Region||'-'}</td><td>${h.Level||'-'}</td><td><span class="badge ${badge}">${h.Status||''}</span></td><td>${h.Exclusivity==='Yes'?'<i class="fas fa-check text-success"></i>':'-'}</td><td><button class="btn btn-sm btn-outline-primary" onclick="openHospitalInput('${h.Hospital_ID}')">編輯</button></td></tr>`;
    });
}

function renderHospitalList() {
    const tbody = document.getElementById('hospital-list-body');
    if(!tbody) return;
    tbody.innerHTML = '';
    globalHospitals.forEach(h => {
        tbody.innerHTML += `<tr><td>${h.Name}</td><td>${h.Level}</td><td>$${(Number(h.Unit_Price)||0).toLocaleString()}</td><td>${h.Exclusivity}</td><td>${h.Contract_End_Date ? h.Contract_End_Date.split('T')[0] : '-'}</td><td><button class="btn btn-sm btn-outline-primary" onclick="openHospitalInput('${h.Hospital_ID}')"><i class="fas fa-edit"></i></button></td></tr>`;
    });
}

function renderKOLList() {
    const tbody = document.getElementById('kol-list-body');
    if(!tbody) return;
    tbody.innerHTML = '';
    globalKOLs.forEach(k => {
        const hosp = globalHospitals.find(h => h.Hospital_ID === k.Hospital_ID);
        const hospName = hosp ? hosp.Name : k.Hospital_ID;
        tbody.innerHTML += `<tr><td><strong>${k.Name}</strong></td><td>${hospName}</td><td>${k.Title}</td><td>${k.Visit_Stage}</td><td>${k.Probability}</td><td><button class="btn btn-sm btn-outline-success" onclick="openKOLModal('${k.KOL_ID}')"><i class="fas fa-edit"></i></button></td></tr>`;
    });
}

function renderFinanceTable() {
    const selMonth = getVal('finance-month-picker');
    const tbody = document.getElementById('finance-table-body');
    if(!tbody) return;
    tbody.innerHTML = '';
    let kpiGross = 0, kpiNet = 0, kpiAR = 0, kpiEBM = 0;

    globalStats.forEach(stat => {
        if (stat.Year_Month !== selMonth) return;
        const hosp = globalHospitals.find(h => h.Hospital_ID === stat.Hospital_ID);
        const gross = Number(stat.Gross_Revenue)||0, net = Number(stat.Net_Revenue)||0;
        kpiGross += gross; kpiNet += net; kpiEBM += (Number(stat.EBM_Fee)||0);
        if (stat.Invoice_Status !== 'Paid') kpiAR += gross;
        
        let badge = stat.Invoice_Status === 'Billed' ? 'bg-primary' : (stat.Invoice_Status === 'Paid' ? 'bg-success' : 'bg-secondary');
        tbody.innerHTML += `<tr><td><strong>${hosp?hosp.Name:stat.Hospital_ID}</strong></td><td>${stat.Usage_Count}</td><td>$${stat.Unit_Price_Snapshot}</td><td>$${gross.toLocaleString()}</td><td class="small text-muted">${stat.EBM_Ratio_Snapshot}%</td><td class="text-success fw-bold">$${net.toLocaleString()}</td><td><span class="badge ${badge} status-badge" onclick="toggleInvoiceStatus('${stat.Record_ID}', '${stat.Invoice_Status}')">${stat.Invoice_Status}</span></td><td><button class="btn btn-sm btn-outline-dark" onclick="openSettlementModal('${stat.Record_ID}')"><i class="fas fa-edit"></i></button></td></tr>`;
    });
    
    if(document.getElementById('fin-kpi-gross')) {
        document.getElementById('fin-kpi-gross').innerText = "$" + kpiGross.toLocaleString();
        document.getElementById('fin-kpi-net').innerText = "$" + kpiNet.toLocaleString();
        document.getElementById('fin-kpi-ar').innerText = "$" + kpiAR.toLocaleString();
        document.getElementById('fin-kpi-ebm').innerText = "$" + kpiEBM.toLocaleString();
    }
}

// --- Actions (Submit/Open) ---

function openKOLModal(id = null) {
    document.getElementById('form-kol').reset();
    setVal('k-id', '');
    const sel = document.getElementById('k-hospital-id');
    if(sel) {
        sel.innerHTML = '<option value="">請選擇醫院...</option>';
        globalHospitals.forEach(h => sel.innerHTML += `<option value="${h.Hospital_ID}">${h.Name}</option>`);
    }
    if (id) {
        const k = globalKOLs.find(x => x.KOL_ID === id);
        if (k) {
            setVal('k-id', k.KOL_ID);
            setVal('k-hospital-id', k.Hospital_ID);
            setVal('k-name', k.Name);
            setVal('k-title', k.Title);
            setVal('k-email', k.Email); 
            setVal('k-stage', k.Visit_Stage);
            setVal('k-prob', k.Probability);
            setVal('k-note', k.Visit_Note);
        }
    }
    kolModal.show();
}

async function submitKOL() {
    const payload = {
        kolId: getVal('k-id'),
        hospitalId: getVal('k-hospital-id'),
        name: getVal('k-name'),
        title: getVal('k-title'),
        email: getVal('k-email'), 
        visitStage: getVal('k-stage'),
        probability: getVal('k-prob'),
        visitNote: getVal('k-note')
    };
    if (!payload.name || !payload.hospitalId) { alert("請填寫姓名與醫院"); return; }
    showLoading(true);
    await fetch(CONFIG.SCRIPT_URL, { method: 'POST', body: JSON.stringify({ action: 'saveKOL', userEmail: currentUser, payload: payload }) });
    kolModal.hide();
    loadKOLData();
    showLoading(false);
}

function openHospitalInput(id = null) {
    showPage('hospital-input');
    document.getElementById('form-hospital').reset();
    setVal('h-id', '');
    setVal('h-link', '');
    if(document.getElementById('btn-view-contract')) document.getElementById('btn-view-contract').classList.add('d-none');
    
    if (id) {
        document.getElementById('input-page-title').innerText = "編輯醫院資料";
        const h = globalHospitals.find(x => x.Hospital_ID === id);
        if (h) {
            setVal('h-id', h.Hospital_ID);
            setVal('h-name', h.Name);
            setVal('h-region', h.Region);
            setVal('h-level', h.Level);
            setVal('h-address', h.Address);
            setVal('h-status', h.Status);
            setVal('h-exclusivity', h.Exclusivity);
            setVal('h-ebm', h.EBM_Share_Ratio);
            setVal('h-unit-price', h.Unit_Price); 
            setVal('h-amount', h.Contract_Amount);
            setVal('h-link', h.Contract_Link);

            if (h.Contract_Link && h.Contract_Link.startsWith('http')) {
                const btnView = document.getElementById('btn-view-contract');
                if(btnView) {
                    btnView.href = h.Contract_Link;
                    btnView.classList.remove('d-none');
                }
            }
            if(h.Contract_Start_Date) setVal('h-start', h.Contract_Start_Date.split('T')[0]);
            if(h.Contract_End_Date) setVal('h-end', h.Contract_End_Date.split('T')[0]);
        }
    } else {
        document.getElementById('input-page-title').innerText = "新增醫院資料";
    }
}

async function submitHospital() {
    showLoading(true);
    let finalContractLink = getVal('h-link');
    const fileInput = document.getElementById('h-file');

    if (fileInput && fileInput.files.length > 0) {
        try {
            const file = fileInput.files[0];
            const base64Data = await readFileAsBase64(file);
            const res = await fetch(CONFIG.SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({ action: 'uploadFile', userEmail: currentUser, fileData: base64Data, fileName: file.name, mimeType: file.type })
            });
            const json = await res.json();
            if (json.status === 'success') finalContractLink = json.data.url;
        } catch (e) { console.error(e); alert("上傳失敗"); showLoading(false); return; }
    }

    const payload = {
        hospitalId: getVal('h-id'),
        name: getVal('h-name'),
        region: getVal('h-region'),
        level: getVal('h-level'),
        address: getVal('h-address'),
        status: getVal('h-status'),
        exclusivity: getVal('h-exclusivity'),
        ebmShare: getVal('h-ebm'),
        unitPrice: getVal('h-unit-price'), 
        contractAmount: getVal('h-amount'),
        contractStart: getVal('h-start'),
        contractEnd: getVal('h-end'),
        contractLink: finalContractLink,
        salesRep: document.getElementById('user-name') ? document.getElementById('user-name').innerText : ''
    };

    await fetch(CONFIG.SCRIPT_URL, { method: 'POST', body: JSON.stringify({ action: 'saveHospital', userEmail: currentUser, payload: payload }) });
    await loadRadarData(); 
    showPage('hospitals');
    showLoading(false);
}

function openSettlementModal(id) { 
    document.getElementById('form-settlement').reset();
    setVal('s-record-id', '');
    setVal('s-month', getVal('finance-month-picker'));
    const sel = document.getElementById('s-hospital');
    sel.innerHTML = '<option value="">請選擇...</option>';
    globalHospitals.filter(h => h.Status==='已簽約').forEach(h => sel.innerHTML+=`<option value="${h.Hospital_ID}">${h.Name}</option>`);
    
    if(id) {
        const r = globalStats.find(x => x.Record_ID === id);
        if(r) {
            setVal('s-record-id', r.Record_ID);
            setVal('s-month', r.Year_Month);
            setVal('s-hospital', r.Hospital_ID);
            setVal('s-usage', r.Usage_Count);
            setVal('s-note', r.Note);
        }
    }
    calcPreview();
    settlementModal.show();
}

function calcPreview() {
    const hosp = globalHospitals.find(h => h.Hospital_ID === getVal('s-hospital'));
    if(hosp) {
        const p = Number(hosp.Unit_Price)||0, s = Number(hosp.EBM_Share_Ratio)||0, u = Number(getVal('s-usage'))||0;
        document.getElementById('s-hosp-info').innerText = `單價:$${p} | 分潤:${s}%`;
        document.getElementById('s-prev-gross').innerText = "$"+(u*p).toLocaleString();
        document.getElementById('s-prev-net').innerText = "$"+Math.round(u*p*(1-s/100)).toLocaleString();
    }
}

async function submitSettlement() {
    const payload = { recordId: getVal('s-record-id'), yearMonth: getVal('s-month'), hospitalId: getVal('s-hospital'), usageCount: getVal('s-usage'), note: getVal('s-note') };
    if(!payload.hospitalId) { alert("請選擇醫院"); return; }
    showLoading(true);
    await fetch(CONFIG.SCRIPT_URL, { method:'POST', body:JSON.stringify({action:'saveMonthlyStat', userEmail:currentUser, payload:payload})});
    settlementModal.hide(); loadFinanceData(); showLoading(false);
}

async function toggleInvoiceStatus(id, stat) {
    const map = {'Unbilled':'Billed','Billed':'Paid','Paid':'Unbilled'};
    if(confirm('變更狀態?')) {
        showLoading(true);
        await fetch(CONFIG.SCRIPT_URL, {method:'POST', body:JSON.stringify({action:'updateInvoiceStatus', userEmail:currentUser, payload:{recordId:id, status:map[stat]}})});
        loadFinanceData(); showLoading(false);
    }
}

function openUserModal(e='', n='', r='User', s='Active') {
    setVal('u-email', e); setVal('u-name', n); setVal('u-role', r); setVal('u-status', s);
    document.getElementById('u-email').readOnly = (e!=='');
    userModal.show();
}

async function submitUser() {
    const p = { email: getVal('u-email'), name: getVal('u-name'), role: getVal('u-role'), status: getVal('u-status') };
    if(!p.email) return;
    showLoading(true);
    await fetch(CONFIG.SCRIPT_URL, {method:'POST', body:JSON.stringify({action:'saveUser', userEmail:currentUser, payload:p})});
    userModal.hide(); 
    loadAdminData(); 
    showLoading(false);
}

function readFileAsBase64(file) {
    return new Promise((r, j) => {
        const reader = new FileReader();
        reader.onload = () => r(reader.result.split(',')[1]);
        reader.onerror = j;
        reader.readAsDataURL(file);
    });
}
function showLoading(show) { document.getElementById('loading-overlay').classList.toggle('d-none', !show); }
function logout() { currentUser = null; location.reload(); }