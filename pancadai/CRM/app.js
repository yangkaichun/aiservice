// app.js

let currentUser = null;
let currentRole = null;
let globalHospitals = []; 
let globalKOLs = [];
let globalConfig = { regions: [], levels: [] }; 
let kolModal, userModal;

window.onload = function() {
    const client_id = CONFIG.GOOGLE_CLIENT_ID;
    document.getElementById('g_id_onload').setAttribute('data-client_id', client_id);
    kolModal = new bootstrap.Modal(document.getElementById('modalKOL'));
    userModal = new bootstrap.Modal(document.getElementById('modalUser'));
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
            
            // Admin Check
            if (currentRole === 'Admin') {
                document.getElementById('nav-admin').classList.remove('d-none');
            }

            await loadSystemConfig(); 
            renderDashboard(json.data);
            loadRadarData();
        } else {
            alert("無權限或系統錯誤: " + json.message);
            logout();
        }
    } catch (e) {
        console.error(e);
        alert("連線失敗");
    } finally {
        showLoading(false);
    }
}

async function loadSystemConfig() {
    try {
        const res = await fetch(CONFIG.SCRIPT_URL, { 
            method: "POST", 
            body: JSON.stringify({ action: "getConfig", userEmail: currentUser }) 
        });
        const json = await res.json();
        const rawConfig = json.data;

        globalConfig.regions = rawConfig.filter(r => r.Category === 'Region').map(r => r.Option_Value);
        globalConfig.levels = rawConfig.filter(r => r.Category === 'Hospital_Level').map(r => r.Option_Value);

        populateSelect('radar-filter-region', globalConfig.regions, '全部區域');
        populateSelect('radar-filter-level', globalConfig.levels, '全部規模');
        populateSelect('h-region', globalConfig.regions);
        populateSelect('h-level', globalConfig.levels);

    } catch (e) { console.error("Config Load Failed", e); }
}

function populateSelect(elementId, options, defaultText = null) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.innerHTML = ''; 
    if (defaultText) el.innerHTML += `<option value="All">${defaultText}</option>`;
    options.forEach(opt => { el.innerHTML += `<option value="${opt}">${opt}</option>`; });
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
    if (pageId === 'hospitals') renderHospitalList();
    if (pageId === 'admin') loadAdminData();
}

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

// --- Admin Functions ---
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
    tbody.innerHTML = '';
    users.forEach(u => {
        let loginTime = u.Last_Login ? new Date(u.Last_Login).toLocaleString() : '-';
        const roleBadge = u.Role === 'Admin' ? 'bg-danger' : 'bg-info text-dark';
        tbody.innerHTML += `<tr><td>${u.Email}</td><td>${u.Name}</td><td><span class="badge ${roleBadge}">${u.Role}</span></td><td>${u.Status}</td><td style="font-size:0.8em">${loginTime}</td><td><button class="btn btn-sm btn-outline-dark" onclick="openUserModal('${u.Email}', '${u.Name}', '${u.Role}', '${u.Status}')"><i class="fas fa-edit"></i></button></td></tr>`;
    });
}

function renderLogTable(logs) {
    const tbody = document.getElementById('admin-logs-body');
    tbody.innerHTML = '';
    logs.reverse().forEach(log => {
        tbody.innerHTML += `<tr><td style="white-space:nowrap;">${new Date(log.Timestamp).toLocaleString()}</td><td>${log.User}</td><td><strong>${log.Action}</strong></td><td class="text-muted">${log.Details}</td></tr>`;
    });
}

function openUserModal(email = '', name = '', role = 'User', status = 'Active') {
    const isEdit = email !== '';
    document.getElementById('u-email').value = email;
    document.getElementById('u-name').value = name;
    document.getElementById('u-role').value = role;
    document.getElementById('u-status').value = status;
    document.getElementById('u-email').readOnly = isEdit;
    userModal.show();
}

async function submitUser() {
    const payload = {
        email: document.getElementById('u-email').value,
        name: document.getElementById('u-name').value,
        role: document.getElementById('u-role').value,
        status: document.getElementById('u-status').value
    };
    if(!payload.email || !payload.name) { alert("請填寫完整資訊"); return; }
    showLoading(true);
    await fetch(CONFIG.SCRIPT_URL, { method: 'POST', body: JSON.stringify({ action: 'saveUser', userEmail: currentUser, payload: payload }) });
    userModal.hide();
    loadAdminData();
    showLoading(false);
}

// --- Hospital & File Upload ---
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
        try {
            const file = fileInput.files[0];
            const base64Data = await readFileAsBase64(file);
            const res = await fetch(CONFIG.SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({ action: 'uploadFile', userEmail: currentUser, fileData: base64Data, fileName: file.name, mimeType: file.type })
            });
            const json = await res.json();
            if (json.status === 'success') {
                finalContractLink = json.data.url;
            } else {
                alert("檔案上傳失敗"); showLoading(false); return;
            }
        } catch (e) { console.error(e); alert("上傳錯誤"); showLoading(false); return; }
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

// --- Helper Functions ---
function renderRadarTable() {
    const region = document.getElementById('radar-filter-region').value;
    const level = document.getElementById('radar-filter-level').value;
    const status = document.getElementById('radar-filter-status').value;
    const tbody = document.getElementById('radar-table-body');
    tbody.innerHTML = '';
    globalHospitals.forEach(h => {
        if (region !== 'All' && h.Region !== region) return;
        if (level !== 'All' && h.Level !== level) return;
        if (status !== 'All' && h.Status !== status) return;
        let badge = h.Status === '已簽約' ? 'bg-success' : (h.Status === '開發中' ? 'bg-warning' : 'bg-secondary');
        tbody.innerHTML += `<tr><td><strong>${h.Name}</strong></td><td>${h.Region}</td><td>${h.Level}</td><td><span class="badge ${badge}">${h.Status}</span></td><td><button class="btn btn-sm btn-outline-primary" onclick="openHospitalInput('${h.Hospital_ID}')">編輯</button></td></tr>`;
    });
}

function renderHospitalList() {
    const tbody = document.getElementById('hospital-list-body');
    tbody.innerHTML = '';
    globalHospitals.forEach(h => {
        tbody.innerHTML += `<tr><td>${h.Name}</td><td>${h.Level}</td><td>${h.Status}</td><td>${h.Exclusivity}</td><td>${h.Contract_End_Date ? h.Contract_End_Date.split('T')[0] : '-'}</td><td>${h.Contract_Amount || '-'}</td><td><button class="btn btn-sm btn-outline-primary" onclick="openHospitalInput('${h.Hospital_ID}')"><i class="fas fa-edit"></i></button></td></tr>`;
    });
}

function renderKOLList() {
    const tbody = document.getElementById('kol-list-body');
    tbody.innerHTML = '';
    globalKOLs.forEach(k => {
        const hosp = globalHospitals.find(h => h.Hospital_ID === k.Hospital_ID);
        const hospName = hosp ? hosp.Name : k.Hospital_ID;
        tbody.innerHTML += `<tr><td><strong>${k.Name}</strong></td><td>${hospName}</td><td>${k.Title}</td><td>${k.Visit_Stage}</td><td>${k.Probability}</td><td><button class="btn btn-sm btn-outline-success" onclick="openKOLModal('${k.KOL_ID}')"><i class="fas fa-edit"></i></button></td></tr>`;
    });
}

function openKOLModal(id = null) {
    document.getElementById('form-kol').reset();
    document.getElementById('k-id').value = '';
    const sel = document.getElementById('k-hospital-id');
    sel.innerHTML = '<option value="">請選擇醫院...</option>';
    globalHospitals.forEach(h => { sel.innerHTML += `<option value="${h.Hospital_ID}">${h.Name}</option>`; });
    if (id) {
        const k = globalKOLs.find(x => x.KOL_ID === id);
        if (k) {
            document.getElementById('k-id').value = k.KOL_ID;
            document.getElementById('k-hospital-id').value = k.Hospital_ID;
            document.getElementById('k-name').value = k.Name;
            document.getElementById('k-title').value = k.Title;
            document.getElementById('k-email').value = k.Email;
            document.getElementById('k-stage').value = k.Visit_Stage;
            document.getElementById('k-prob').value = k.Probability;
            document.getElementById('k-note').value = k.Visit_Note;
        }
    }
    kolModal.show();
}

async function submitKOL() {
    const payload = {
        kolId: document.getElementById('k-id').value,
        hospitalId: document.getElementById('k-hospital-id').value,
        name: document.getElementById('k-name').value,
        title: document.getElementById('k-title').value,
        email: document.getElementById('k-email').value,
        visitStage: document.getElementById('k-stage').value,
        probability: document.getElementById('k-prob').value,
        visitNote: document.getElementById('k-note').value
    };
    showLoading(true);
    await fetch(CONFIG.SCRIPT_URL, { method: 'POST', body: JSON.stringify({ action: 'saveKOL', userEmail: currentUser, payload: payload }) });
    kolModal.hide();
    loadKOLData();
    showLoading(false);
}

function renderDashboard(data) {
    document.getElementById('kpi-contract-value').innerText = "$" + data.kpi.totalContractValue.toLocaleString();
    if(window.myRegionChart) window.myRegionChart.destroy();
    const ctxRegion = document.getElementById('chart-region').getContext('2d');
    window.myRegionChart = new Chart(ctxRegion, {
        type: 'pie',
        data: {
            labels: Object.keys(data.kpi.regionStats),
            datasets: [{
                data: Object.values(data.kpi.regionStats),
                backgroundColor: ['#3498db', '#e74c3c', '#f1c40f', '#2ecc71']
            }]
        }
    });
}

function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result;
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

function showLoading(show) {
    const el = document.getElementById('loading-overlay');
    if(show) el.classList.remove('d-none');
    else el.classList.add('d-none');
}

function logout() {
    currentUser = null;
    location.reload();
}