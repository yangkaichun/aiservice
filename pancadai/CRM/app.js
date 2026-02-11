// app.js V3.1 (Complete Fix)

let currentUser = null;
let currentRole = null;
let globalHospitals = []; 
let globalKOLs = [];
let globalStats = []; // 財務數據
let globalConfig = { regions: [], levels: [] }; 
let kolModal, userModal, settlementModal;

// --- 初始化與登入 ---

window.onload = function() {
    const client_id = CONFIG.GOOGLE_CLIENT_ID;
    document.getElementById('g_id_onload').setAttribute('data-client_id', client_id);
    
    // 初始化 Bootstrap Modals
    kolModal = new bootstrap.Modal(document.getElementById('modalKOL'));
    userModal = new bootstrap.Modal(document.getElementById('modalUser'));
    settlementModal = new bootstrap.Modal(document.getElementById('modalSettlement'));
    
    // 設定財務月份預設為當月
    const today = new Date();
    const monthStr = today.toISOString().slice(0, 7); // YYYY-MM
    const monthPicker = document.getElementById('finance-month-picker');
    if(monthPicker) monthPicker.value = monthStr;
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
    // 取得 Dashboard 資料同時驗證權限
    const payload = { action: "getDashboardData", userEmail: email };
    
    try {
        const response = await fetch(CONFIG.SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify(payload)
        });
        const json = await response.json();
        
        if (json.status === 'success') {
            currentRole = json.role;
            
            // 切換畫面
            document.getElementById('login-view').classList.add('d-none');
            document.getElementById('app-view').classList.remove('d-none');
            
            // Admin 選單顯示控制
            if (currentRole === 'Admin') {
                const adminNav = document.getElementById('nav-admin');
                if(adminNav) adminNav.classList.remove('d-none');
            }

            // 載入系統設定與初始資料
            await loadSystemConfig(); 
            renderDashboard(json.data); // 渲染 Dashboard
            loadRadarData(); // 預載醫院資料
        } else {
            alert("無權限或系統錯誤: " + json.message);
            logout();
        }
    } catch (e) {
        console.error(e);
        alert("系統連線失敗，請檢查網路或 Script URL");
    } finally {
        showLoading(false);
    }
}

// --- 系統設定載入 ---

async function loadSystemConfig() {
    try {
        const res = await fetch(CONFIG.SCRIPT_URL, { 
            method: "POST", 
            body: JSON.stringify({ action: "getConfig", userEmail: currentUser }) 
        });
        const json = await res.json();
        const rawConfig = json.data;

        // 解析設定檔
        globalConfig.regions = rawConfig.filter(r => r.Category === 'Region').map(r => r.Option_Value);
        globalConfig.levels = rawConfig.filter(r => r.Category === 'Hospital_Level').map(r => r.Option_Value);

        // 填入所有下拉選單
        populateSelect('radar-filter-region', globalConfig.regions, '全部區域');
        populateSelect('radar-filter-level', globalConfig.levels, '全部規模');
        populateSelect('h-region', globalConfig.regions);
        populateSelect('h-level', globalConfig.levels);

    } catch (e) {
        console.error("Config Load Failed", e);
    }
}

function populateSelect(elementId, options, defaultText = null) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.innerHTML = ''; 
    if (defaultText) {
        el.innerHTML += `<option value="All">${defaultText}</option>`;
    }
    options.forEach(opt => {
        el.innerHTML += `<option value="${opt}">${opt}</option>`;
    });
}

// --- 頁面導航 ---

function showPage(pageId) {
    document.querySelectorAll('.page-content').forEach(el => el.classList.add('d-none'));
    const target = document.getElementById('page-' + pageId);
    if(target) target.classList.remove('d-none');
    
    // 更新選單 Active 狀態
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
    const links = document.querySelectorAll('.nav-link');
    for(let link of links) {
        if(link.getAttribute('onclick') && link.getAttribute('onclick').includes(pageId)) {
            link.classList.add('active');
        }
    }

    // 依頁面載入數據
    if (pageId === 'kols') loadKOLData();
    if (pageId === 'hospitals') loadRadarData(); // 刷新醫院列表
    if (pageId === 'admin') loadAdminData();
    if (pageId === 'finance') loadFinanceData();
}

// --- 資料讀取 (Loaders) ---

async function loadRadarData() {
    showLoading(true);
    try {
        const res = await fetch(CONFIG.SCRIPT_URL, { 
            method: "POST", 
            body: JSON.stringify({ action: "getHospitals", userEmail: currentUser }) 
        });
        const json = await res.json();
        globalHospitals = json.data;
        renderRadarTable();
        renderHospitalList(); 
    } catch (e) { console.error(e); } finally { showLoading(false); }
}

async function loadKOLData() {
    showLoading(true);
    try {
        const res = await fetch(CONFIG.SCRIPT_URL, { 
            method: "POST", 
            body: JSON.stringify({ action: "getKOLs", userEmail: currentUser }) 
        });
        const json = await res.json();
        globalKOLs = json.data;
        renderKOLList();
    } catch (e) { console.error(e); } finally { showLoading(false); }
}

async function loadFinanceData() {
    showLoading(true);
    try {
        // 確保先有醫院資料 (算單價用)
        if(globalHospitals.length === 0) await loadRadarData();

        const res = await fetch(CONFIG.SCRIPT_URL, { 
            method: "POST", 
            body: JSON.stringify({ action: "getMonthlyStats", userEmail: currentUser }) 
        });
        const json = await res.json();
        globalStats = json.data;
        renderFinanceTable();
    } catch (e) { console.error(e); } finally { showLoading(false); }
}

// --- 資料渲染 (Renderers) ---

function renderDashboard(data) {
    const kpi = data.kpi;

    // 1. 填入 KPI 數值
    document.getElementById('kpi-contract-value').innerText = "$" + (kpi.totalContractValue || 0).toLocaleString();
    
    // 若 HTML 有這個元素則填入
    if(document.getElementById('kpi-hospital-count')) {
        document.getElementById('kpi-hospital-count').innerText = (kpi.hospitalCount || 0).toLocaleString();
    }
    
    // 區域覆蓋率
    const regionCount = Object.keys(kpi.regionStats || {}).length;
    if(document.getElementById('kpi-region-count')) {
         document.getElementById('kpi-region-count').innerText = regionCount;
    }

    // 2. 圓餅圖 (Region Stats)
    const ctxRegion = document.getElementById('chart-region');
    if (ctxRegion) {
        if(window.myRegionChart) window.myRegionChart.destroy();
        
        const rLabels = Object.keys(kpi.regionStats || {});
        const rData = Object.values(kpi.regionStats || {});
        
        // 防止空圖表
        if(rLabels.length === 0) { rLabels.push('無資料'); rData.push(1); }

        window.myRegionChart = new Chart(ctxRegion.getContext('2d'), {
            type: 'pie',
            data: {
                labels: rLabels,
                datasets: [{
                    data: rData,
                    backgroundColor: ['#3498db', '#e74c3c', '#f1c40f', '#2ecc71', '#9b59b6', '#34495e']
                }]
            }
        });
    }

    // 3. 折線圖 (Trend - 暫時用假資料，直到累積足夠月結數據)
    const ctxTrend = document.getElementById('chart-trend');
    if (ctxTrend) {
        if(window.myTrendChart) window.myTrendChart.destroy();
        window.myTrendChart = new Chart(ctxTrend.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    { label: '預估營收', data: [0, 0, 0, 0, 0, 0], borderColor: 'blue' },
                    { label: '實際營收', data: [0, 0, 0, 0, 0, 0], borderColor: 'red' }
                ]
            }
        });
    }
}

function renderRadarTable() {
    const regionFilter = document.getElementById('radar-filter-region').value;
    const levelFilter = document.getElementById('radar-filter-level').value;
    const statusFilter = document.getElementById('radar-filter-status').value;
    
    const tbody = document.getElementById('radar-table-body');
    tbody.innerHTML = '';

    globalHospitals.forEach(h => {
        // 使用 Header Mapping 後，屬性名稱對應 Sheet 的 Header
        if (regionFilter !== 'All' && h.Region !== regionFilter) return;
        if (levelFilter !== 'All' && h.Level !== levelFilter) return;
        if (statusFilter !== 'All' && h.Status !== statusFilter) return;

        let statusClass = 'bg-secondary';
        if(h.Status === '已簽約') statusClass = 'bg-success';
        if(h.Status === '開發中') statusClass = 'bg-warning text-dark';
        if(h.Status === '未接觸') statusClass = 'bg-danger';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${h.Name}</strong></td>
            <td>${h.Region || '-'}</td>
            <td>${h.Level || '-'}</td>
            <td><span class="badge ${statusClass}">${h.Status || 'Unknown'}</span></td>
            <td>${h.Exclusivity === 'Yes' ? '<i class="fas fa-check text-success"></i>' : '-'}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="openHospitalInput('${h.Hospital_ID}')">
                    編輯
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderHospitalList() {
    const tbody = document.getElementById('hospital-list-body');
    if(!tbody) return;
    tbody.innerHTML = '';
    globalHospitals.forEach(h => {
        // 顯示 Unit Price
        tbody.innerHTML += `
            <tr>
                <td>${h.Name}</td>
                <td>${h.Level}</td>
                <td>$${(Number(h.Unit_Price)||0).toLocaleString()}</td>
                <td>${h.Exclusivity}</td>
                <td>${h.Contract_End_Date ? h.Contract_End_Date.split('T')[0] : '-'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="openHospitalInput('${h.Hospital_ID}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>`;
    });
}

function renderKOLList() {
    const tbody = document.getElementById('kol-list-body');
    if(!tbody) return;
    tbody.innerHTML = '';
    globalKOLs.forEach(k => {
        const hosp = globalHospitals.find(h => h.Hospital_ID === k.Hospital_ID);
        const hospName = hosp ? hosp.Name : k.Hospital_ID;

        tbody.innerHTML += `
            <tr>
                <td><strong>${k.Name}</strong></td>
                <td>${hospName}</td>
                <td>${k.Title}</td>
                <td>${k.Visit_Stage}</td>
                <td>${k.Probability}</td>
                <td>
                    <button class="btn btn-sm btn-outline-success" onclick="openKOLModal('${k.KOL_ID}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>`;
    });
}

// --- 財務中心邏輯 ---

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
        const gross = Number(stat.Gross_Revenue) || 0;
        const net = Number(stat.Net_Revenue) || 0;
        const ebm = Number(stat.EBM_Fee) || 0;

        kpiGross += gross;
        kpiNet += net;
        kpiEBM += ebm;
        if (stat.Invoice_Status !== 'Paid') kpiAR += gross; 

        // Status Badge
        let badgeClass = 'bg-secondary';
        if (stat.Invoice_Status === 'Billed') badgeClass = 'bg-primary';
        if (stat.Invoice_Status === 'Paid') badgeClass = 'bg-success';

        tbody.innerHTML += `
            <tr>
                <td><strong>${hospName}</strong></td>
                <td>${stat.Usage_Count}</td>
                <td>$${stat.Unit_Price_Snapshot}</td>
                <td>$${gross.toLocaleString()}</td>
                <td class="text-muted small">${stat.EBM_Ratio_Snapshot}%</td>
                <td class="text-success fw-bold">$${net.toLocaleString()}</td>
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
    // 只列出已簽約的醫院
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
        const price = Number(hosp.Unit_Price) || 0;
        const share = Number(hosp.EBM_Share_Ratio) || 0;
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
        const res = await fetch(CONFIG.SCRIPT_URL, { 
            method: 'POST', 
            body: JSON.stringify({ action: 'saveMonthlyStat', userEmail: currentUser, payload: payload }) 
        });
        const json = await res.json();
        if(json.status === 'success') {
            settlementModal.hide();
            loadFinanceData(); // Reload Table
        } else {
            alert("儲存失敗: " + json.message);
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

// --- 醫院資料表單 (新增/編輯) ---

function openHospitalInput(id = null) {
    // 切換到輸入頁
    showPage('hospital-input');
    
    // 重置表單
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
            
            // 下拉選單賦值 (JS 自動匹配 value)
            document.getElementById('h-region').value = h.Region;
            document.getElementById('h-level').value = h.Level;
            
            document.getElementById('h-address').value = h.Address;
            document.getElementById('h-status').value = h.Status;
            document.getElementById('h-exclusivity').value = h.Exclusivity;
            document.getElementById('h-ebm').value = h.EBM_Share_Ratio;
            
            // [V3.0] Unit Price
            document.getElementById('h-unit-price').value = h.Unit_Price;

            document.getElementById('h-amount').value = h.Contract_Amount;
            
            // 合約連結
            document.getElementById('h-link').value = h.Contract_Link;
            if (h.Contract_Link && h.Contract_Link.startsWith('http')) {
                const btnView = document.getElementById('btn-view-contract');
                btnView.href = h.Contract_Link;
                btnView.classList.remove('d-none');
            }

            // 日期處理
            if(h.Contract_Start_Date) document.getElementById('h-start').value = h.Contract_Start_Date.split('T')[0];
            if(h.Contract_End_Date) document.getElementById('h-end').value = h.Contract_End_Date.split('T')[0];
        }
    } else {
        document.getElementById('input-page-title').innerText = "新增醫院資料";
    }
}

async function submitHospital() {
    showLoading(true);

    // 1. 處理檔案上傳
    let finalContractLink = document.getElementById('h-link').value;
    const fileInput = document.getElementById('h-file');

    if (fileInput.files.length > 0) {
        try {
            const file = fileInput.files[0];
            const base64Data = await readFileAsBase64(file);
            
            const res = await fetch(CONFIG.SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({ 
                    action: 'uploadFile', 
                    userEmail: currentUser, 
                    fileData: base64Data, 
                    fileName: file.name, 
                    mimeType: file.type 
                })
            });
            const json = await res.json();
            if (json.status === 'success') {
                finalContractLink = json.data.url;
            } else {
                alert("檔案上傳失敗");
                showLoading(false);
                return;
            }
        } catch (e) {
            console.error("Upload Error:", e);
            alert("上傳錯誤");
            showLoading(false);
            return;
        }
    }

    // 2. 準備 Payload
    const payload = {
        hospitalId: document.getElementById('h-id').value,
        name: document.getElementById('h-name').value,
        region: document.getElementById('h-region').value,
        level: document.getElementById('h-level').value,
        address: document.getElementById('h-address').value,
        status: document.getElementById('h-status').value,
        exclusivity: document.getElementById('h-exclusivity').value,
        ebmShare: document.getElementById('h-ebm').value,
        
        // [V3.0] Unit Price
        unitPrice: document.getElementById('h-unit-price').value,

        contractAmount: document.getElementById('h-amount').value,
        contractStart: document.getElementById('h-start').value,
        contractEnd: document.getElementById('h-end').value,
        contractLink: finalContractLink,
        salesRep: document.getElementById('user-name').innerText 
    };

    // 3. 送出
    try {
        await fetch(CONFIG.SCRIPT_URL, { 
            method: 'POST', 
            body: JSON.stringify({ action: 'saveHospital', userEmail: currentUser, payload: payload }) 
        });
        
        await loadRadarData(); 
        showPage('hospitals');
    } catch(e) { console.error(e); alert("儲存失敗"); } finally { showLoading(false); }
}

// --- 管理者後台與其他 ---

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
        
        tbody.innerHTML += `
            <tr>
                <td>${u.Email}</td>
                <td>${u.Name}</td>
                <td><span class="badge ${roleBadge}">${u.Role}</span></td>
                <td>${u.Status}</td>
                <td style="font-size:0.8em">${loginTime}</td>
                <td>
                    <button class="btn btn-sm btn-outline-dark" onclick="openUserModal('${u.Email}', '${u.Name}', '${u.Role}', '${u.Status}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>`;
    });
}

function renderLogTable(logs) {
    const tbody = document.getElementById('admin-logs-body');
    if(!tbody) return;
    tbody.innerHTML = '';
    logs.reverse().forEach(log => {
        tbody.innerHTML += `
            <tr>
                <td style="white-space:nowrap;">${new Date(log.Timestamp).toLocaleString()}</td>
                <td>${log.User}</td>
                <td><strong>${log.Action}</strong></td>
                <td class="text-muted">${log.Details}</td>
            </tr>`;
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

// --- KOL Modal ---

function openKOLModal(id = null) {
    document.getElementById('form-kol').reset();
    document.getElementById('k-id').value = '';
    const sel = document.getElementById('k-hospital-id');
    sel.innerHTML = '<option value="">請選擇醫院...</option>';
    globalHospitals.forEach(h => {
        sel.innerHTML += `<option value="${h.Hospital_ID}">${h.Name}</option>`;
    });

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

// --- Utilities ---

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