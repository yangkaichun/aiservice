// app.js V6.0 (User Name Fix & Dev Region Chart)

let currentUser = null;
let currentRole = null;
let globalHospitals = []; 
let globalKOLs = [];
let globalStats = []; 
let globalMonthlyData = []; 
let globalConfig = { regions: [], levels: [] }; 
let kolModal, userModal, settlementModal, drilldownModal;

window.onload = function() {
    const client_id = CONFIG.GOOGLE_CLIENT_ID;
    document.getElementById('g_id_onload').setAttribute('data-client_id', client_id);
    
    if(document.getElementById('modalKOL')) kolModal = new bootstrap.Modal(document.getElementById('modalKOL'));
    if(document.getElementById('modalUser')) userModal = new bootstrap.Modal(document.getElementById('modalUser'));
    if(document.getElementById('modalSettlement')) settlementModal = new bootstrap.Modal(document.getElementById('modalSettlement'));
    if(document.getElementById('modalDrilldown')) drilldownModal = new bootstrap.Modal(document.getElementById('modalDrilldown'));

    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    if(document.getElementById('dash-start')) document.getElementById('dash-start').value = `${y}-01`;
    if(document.getElementById('dash-end')) document.getElementById('dash-end').value = `${y}-12`;
    if(document.getElementById('finance-month-picker')) document.getElementById('finance-month-picker').value = `${y}-${m}`;

    const savedUser = localStorage.getItem('pancad_user');
    if (savedUser) {
        currentUser = savedUser;
        verifyBackendAuth(savedUser);
    }
};

function getVal(id) { const el = document.getElementById(id); return el ? el.value : ''; }
function setVal(id, value) { const el = document.getElementById(id); if (el) el.value = value || ''; }
function showLoading(show) { document.getElementById('loading-overlay').classList.toggle('d-none', !show); }
function logout() { 
    currentUser = null; 
    localStorage.removeItem('pancad_user'); 
    location.reload(); 
}
function toggleSidebar() { document.getElementById('main-sidebar').classList.toggle('show'); }

function getStageBadge(stage) {
    if(!stage) return '';
    if(stage.includes('初次接觸')) return '<span class="badge bg-secondary">1.初次接觸</span>';
    if(stage.includes('產品展示')) return '<span class="badge bg-primary">2.產品展示</span>';
    if(stage.includes('試用中')) return '<span class="badge bg-info text-dark">3.試用中</span>';
    if(stage.includes('議價中')) return '<span class="badge bg-warning text-dark">4.議價中</span>';
    if(stage.includes('已成交')) return '<span class="badge bg-success">5.已成交</span>';
    return `<span class="badge bg-secondary">${stage}</span>`;
}

function handleCredentialResponse(r) { 
    const payload = decodeJwtResponse(r.credential);
    currentUser = payload.email; 
    localStorage.setItem('pancad_user', currentUser); 
    
    document.getElementById('user-name').innerText = payload.name;
    document.getElementById('user-avatar').src = payload.picture;
    document.getElementById('mobile-user-name').innerText = payload.name;
    document.getElementById('mobile-user-avatar').src = payload.picture;
    
    verifyBackendAuth(currentUser); 
}

function decodeJwtResponse(token) { return JSON.parse(decodeURIComponent(window.atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''))); }

// [修改] 處理後端回傳的 Name，強制覆寫 UI
async function verifyBackendAuth(email) {
    showLoading(true);
    try {
        const res = await fetch(CONFIG.SCRIPT_URL, { method: "POST", body: JSON.stringify({ action: "getDashboardData", userEmail: email }) });
        const json = await res.json();
        
        if (json.status === 'success') {
            currentRole = json.role;
            document.getElementById('login-view').classList.add('d-none');
            document.getElementById('app-view').classList.remove('d-none');
            
            if (currentRole === 'Admin') document.getElementById('nav-admin').classList.remove('d-none');
            
            // 強制覆寫名字：若後端有回傳真實姓名則使用，否則取 Email 前綴
            if (json.name) {
                document.getElementById('user-name').innerText = json.name;
                document.getElementById('mobile-user-name').innerText = json.name;
            } else if (document.getElementById('user-name').innerText === 'User') {
                 document.getElementById('user-name').innerText = email.split('@')[0];
            }

            globalMonthlyData = json.data.monthlyStats || []; 
            await loadSystemConfig(); 
            renderDashboard(json.data);
            loadRadarData(); 
        } else { 
            alert("存取被拒：您的帳號不在允許清單中，或已被停用。"); 
            logout(); 
        }
    } catch (e) { console.error(e); logout(); } finally { showLoading(false); }
}

async function loadSystemConfig() {
    try {
        const res = await fetch(CONFIG.SCRIPT_URL, { method: "POST", body: JSON.stringify({ action: "getConfig", userEmail: currentUser }) });
        const json = await res.json();
        globalConfig.regions = json.data.filter(r => r.Category === 'Region').map(r => r.Option_Value);
        globalConfig.levels = json.data.filter(r => r.Category === 'Hospital_Level').map(r => r.Option_Value);
        populateSelect('radar-filter-region', globalConfig.regions, '全部區域');
        populateSelect('radar-filter-level', globalConfig.levels, '全部規模');
        populateSelect('h-region', globalConfig.regions);
        populateSelect('h-level', globalConfig.levels);
    } catch (e) {}
}
function populateSelect(id, opts, def) { const el = document.getElementById(id); if(!el)return; el.innerHTML = ''; if(def) el.innerHTML+=`<option value="All">${def}</option>`; opts.forEach(o=>el.innerHTML+=`<option value="${o}">${o}</option>`); }

function showPage(pageId) {
    document.querySelectorAll('.page-content').forEach(el => el.classList.add('d-none'));
    document.getElementById('page-' + pageId).classList.remove('d-none');
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
    const links = document.querySelectorAll('.nav-link');
    for(let l of links) if(l.getAttribute('onclick') && l.getAttribute('onclick').includes(pageId)) l.classList.add('active');
    if (window.innerWidth < 768) toggleSidebar();

    if (pageId === 'kols') loadKOLData();
    if (pageId === 'hospitals') loadRadarData();
    if (pageId === 'admin') loadAdminData();
    if (pageId === 'finance') loadFinanceData();
    if (pageId === 'dashboard') updateDashboardCharts(); 
}

function updateKOLFilterOptions() {
    const sel = document.getElementById('kol-filter-hospital');
    if(!sel) return;
    const currentVal = sel.value; 
    sel.innerHTML = '<option value="All">篩選醫院：全部</option>';
    globalHospitals.forEach(h => {
        sel.innerHTML += `<option value="${h.Hospital_ID}">${h.Name}</option>`;
    });
    sel.value = currentVal || 'All';
}

async function loadRadarData() { 
    try { 
        const r = await fetch(CONFIG.SCRIPT_URL, { method: "POST", body: JSON.stringify({ action: "getHospitals", userEmail: currentUser }) }); 
        globalHospitals = (await r.json()).data; 
        renderRadarTable(); 
        renderHospitalList(); 
        updateKOLFilterOptions(); 
    } catch(e){} 
}
async function loadKOLData() { try { const r = await fetch(CONFIG.SCRIPT_URL, { method: "POST", body: JSON.stringify({ action: "getKOLs", userEmail: currentUser }) }); globalKOLs = (await r.json()).data; renderKOLList(); } catch(e){} }

async function loadFinanceData() { 
    showLoading(true); 
    try { 
        if(!globalHospitals.length) {
            const hRes = await fetch(CONFIG.SCRIPT_URL, { method: "POST", body: JSON.stringify({ action: "getHospitals", userEmail: currentUser }) });
            globalHospitals = (await hRes.json()).data;
        }
        const r = await fetch(CONFIG.SCRIPT_URL, { method: "POST", body: JSON.stringify({ action: "getMonthlyStats", userEmail: currentUser }) }); 
        const json = await r.json();
        
        if (json.status === 'success') {
            globalStats = json.data; 
            renderFinanceTable(); 
        }
    } catch(e){ console.error(e); } finally{showLoading(false);} 
}

async function loadAdminData() { if(currentRole!=='Admin')return; showLoading(true); try{ const [u,l] = await Promise.all([fetch(CONFIG.SCRIPT_URL,{method:"POST",body:JSON.stringify({action:"getUsers",userEmail:currentUser})}), fetch(CONFIG.SCRIPT_URL,{method:"POST",body:JSON.stringify({action:"getLogs",userEmail:currentUser})})]); renderUserTable((await u.json()).data); renderLogTable((await l.json()).data); }catch(e){}finally{showLoading(false);} }

// [修改] 繪製兩個圓餅圖
function renderDashboard(data) {
    const kpi = data.kpi;
    
    if(document.getElementById('kpi-kol-count')) document.getElementById('kpi-kol-count').innerText = (kpi.kolCount || 0).toLocaleString();
    if(document.getElementById('kpi-dev-hospital-count')) document.getElementById('kpi-dev-hospital-count').innerText = (kpi.developingCount || 0).toLocaleString();
    if(document.getElementById('kpi-intro-hospital-count')) document.getElementById('kpi-intro-hospital-count').innerText = (kpi.productIntroCount || 0).toLocaleString();
    if(document.getElementById('kpi-signed-hospital-count')) document.getElementById('kpi-signed-hospital-count').innerText = (kpi.signedCount || 0).toLocaleString();

    // 1. 已簽約醫院圓餅圖
    const ctxRegion = document.getElementById('chart-region');
    if (ctxRegion) {
        if(window.myRegionChart) window.myRegionChart.destroy();
        const rLabels = Object.keys(kpi.regionStats || {});
        const rData = Object.values(kpi.regionStats || {});
        if(rLabels.length === 0) { rLabels.push('無資料'); rData.push(1); }
        
        const ctx1 = ctxRegion.getContext('2d');
        const gradients1 = rLabels.map((_, i) => {
            const colors = [['#4e73df', '#224abe'], ['#1cc88a', '#138e62'], ['#36b9cc', '#1cb5e0'], ['#f6c23e', '#f4a221'], ['#e74a3b', '#be2617']];
            const colorPair = colors[i % colors.length];
            let grad = ctx1.createLinearGradient(0, 0, 0, 250);
            grad.addColorStop(0, colorPair[0]); grad.addColorStop(1, colorPair[1]);
            return grad;
        });

        window.myRegionChart = new Chart(ctx1, {
            type: 'doughnut',
            data: { labels: rLabels, datasets: [{ data: rData, backgroundColor: gradients1, borderWidth: 2, borderColor: '#ffffff' }] },
            options: { maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'right', labels: { boxWidth: 12 } } } }
        });
    }

    // 2. 開發中醫院圓餅圖 (新增)
    const ctxDevRegion = document.getElementById('chart-dev-region');
    if (ctxDevRegion) {
        if(window.myDevRegionChart) window.myDevRegionChart.destroy();
        const devLabels = Object.keys(kpi.devRegionStats || {});
        const devData = Object.values(kpi.devRegionStats || {});
        if(devLabels.length === 0) { devLabels.push('無資料'); devData.push(1); }
        
        const ctx2 = ctxDevRegion.getContext('2d');
        const gradients2 = devLabels.map((_, i) => {
            // 刻意使用不同顏色順序
            const colors = [['#36b9cc', '#1cb5e0'], ['#f6c23e', '#f4a221'], ['#4e73df', '#224abe'], ['#1cc88a', '#138e62'], ['#e74a3b', '#be2617']];
            const colorPair = colors[i % colors.length];
            let grad = ctx2.createLinearGradient(0, 0, 0, 250);
            grad.addColorStop(0, colorPair[0]); grad.addColorStop(1, colorPair[1]);
            return grad;
        });

        window.myDevRegionChart = new Chart(ctx2, {
            type: 'doughnut',
            data: { labels: devLabels, datasets: [{ data: devData, backgroundColor: gradients2, borderWidth: 2, borderColor: '#ffffff' }] },
            options: { maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'right', labels: { boxWidth: 12 } } } }
        });
    }

    updateDashboardCharts();
}

function updateDashboardCharts() {
    const start = getVal('dash-start'), end = getVal('dash-end'), ctxTrend = document.getElementById('chart-trend');
    if (!ctxTrend || !globalMonthlyData) return;
    
    let aggData = {};
    let totalGross = 0; 
    let totalNet = 0; 

    globalMonthlyData.forEach(item => {
        let ym = String(item.Year_Month).substring(0, 7); 
        let gross = Number(item.Gross_Revenue) || 0, net = Number(item.Net_Revenue) || 0;
        
        if (ym >= start && ym <= end) {
            if (!aggData[ym]) aggData[ym] = { gross: 0, net: 0 };
            aggData[ym].gross += gross; 
            aggData[ym].net += net;
            totalGross += gross;
            totalNet += net;
        }
    });

    const grossEl = document.getElementById('kpi-gross-display');
    const netEl = document.getElementById('kpi-net-display');
    if (grossEl && netEl) {
        grossEl.innerText = "$" + totalGross.toLocaleString();
        netEl.innerText = "$" + totalNet.toLocaleString();
    }

    const labels = Object.keys(aggData).sort();
    const grossData = labels.map(m => aggData[m].gross), netData = labels.map(m => aggData[m].net);
    const ctx = ctxTrend.getContext('2d');
    if (window.myTrendChart) window.myTrendChart.destroy();
    const gradGross = ctx.createLinearGradient(0, 0, 0, 300); gradGross.addColorStop(0, 'rgba(78, 115, 223, 0.4)'); gradGross.addColorStop(1, 'rgba(78, 115, 223, 0.0)');
    const gradNet = ctx.createLinearGradient(0, 0, 0, 300); gradNet.addColorStop(0, 'rgba(28, 200, 138, 0.4)'); gradNet.addColorStop(1, 'rgba(28, 200, 138, 0.0)');
    window.myTrendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{ label: 'Gross', data: grossData, borderColor: '#4e73df', backgroundColor: gradGross, fill: true, tension: 0.4 }, { label: 'Net', data: netData, borderColor: '#1cc88a', backgroundColor: gradNet, fill: true, tension: 0.4 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', align: 'end' } }, scales: { x: { grid: { display: false } }, y: { grid: { borderDash: [2], color: '#f0f0f0' }, beginAtZero: true } } }
    });
}

function openDrilldown(type) {
    if (!globalHospitals.length || !globalKOLs.length) return; 

    const titleEl = document.getElementById('drilldown-title');
    const theadEl = document.getElementById('drilldown-thead');
    const tbodyEl = document.getElementById('drilldown-tbody');
    
    tbodyEl.innerHTML = '';
    theadEl.innerHTML = '';

    if (type === 'kols') {
        titleEl.innerText = '已接觸 KOL 總覽';
        theadEl.innerHTML = '<tr><th>姓名</th><th>醫院</th><th>職稱</th><th>目前階段</th><th>機率</th></tr>';
        globalKOLs.forEach(k => {
            const hName = (globalHospitals.find(h => h.Hospital_ID === k.Hospital_ID) || {}).Name || '-';
            tbodyEl.innerHTML += `<tr><td><strong>${k.Name}</strong></td><td>${hName}</td><td>${k.Title}</td><td>${getStageBadge(k.Visit_Stage)}</td><td>${k.Probability}%</td></tr>`;
        });
    } else if (type === 'developing') {
        titleEl.innerText = '開發中醫院清單';
        theadEl.innerHTML = '<tr><th>醫院名稱</th><th>區域</th><th>規模等級</th></tr>';
        globalHospitals.filter(h => h.Status === '開發中').forEach(h => {
            tbodyEl.innerHTML += `<tr><td><strong>${h.Name}</strong></td><td>${h.Region}</td><td>${h.Level}</td></tr>`;
        });
    } else if (type === 'intro') {
        titleEl.innerText = '產品介紹階段 - 重點推廣清單';
        theadEl.innerHTML = '<tr><th>醫院名稱</th><th>KOL 姓名</th><th>職稱</th></tr>';
        globalKOLs.filter(k => k.Visit_Stage && k.Visit_Stage.includes('產品展示')).forEach(k => {
            const hName = (globalHospitals.find(h => h.Hospital_ID === k.Hospital_ID) || {}).Name || '-';
            tbodyEl.innerHTML += `<tr><td><strong>${hName}</strong></td><td>${k.Name}</td><td>${k.Title}</td></tr>`;
        });
    } else if (type === 'signed') {
        titleEl.innerText = '已簽約醫院清單';
        theadEl.innerHTML = '<tr><th>醫院名稱</th><th>單價</th><th>合約迄日</th></tr>';
        globalHospitals.filter(h => h.Status === '已簽約').forEach(h => {
            let dateStr = h.Contract_End_Date ? String(h.Contract_End_Date).substring(0, 10) : '-';
            tbodyEl.innerHTML += `<tr><td><strong>${h.Name}</strong></td><td>$${(Number(h.Unit_Price)||0).toLocaleString()}</td><td>${dateStr}</td></tr>`;
        });
    }

    if(tbodyEl.innerHTML === '') {
        tbodyEl.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">目前尚無資料</td></tr>';
    }

    drilldownModal.show();
}

function renderFinanceTable() {
    const selMonth = getVal('finance-month-picker'); 
    const tbody = document.getElementById('finance-table-body'); 
    if(!tbody) return;
    tbody.innerHTML = '';
    
    let kpiG=0, kpiN=0, kpiA=0, kpiE=0;
    let hasData = false;

    const sortedStats = [...globalStats].sort((a, b) => new Date(b.Created_At) - new Date(a.Created_At));

    sortedStats.forEach(s => {
        let dataMonth = String(s.Year_Month).substring(0, 7);

        if (dataMonth !== selMonth) return;
        
        hasData = true;
        const hosp = globalHospitals.find(h => String(h.Hospital_ID) === String(s.Hospital_ID));
        const hName = hosp ? hosp.Name : `(ID: ${s.Hospital_ID})`;

        const g = Number(s.Gross_Revenue)||0, n = Number(s.Net_Revenue)||0;
        kpiG+=g; kpiN+=n; kpiE+=(Number(s.EBM_Fee)||0); 
        if (s.Invoice_Status!=='Paid') kpiA+=g;
        
        let badge = s.Invoice_Status==='Billed'?'bg-primary':(s.Invoice_Status==='Paid'?'bg-success':'bg-secondary');
        let displayDate = String(s.Year_Month).substring(0, 10);

        tbody.innerHTML += `
            <tr>
                <td><strong>${hName}</strong><br><small class="text-muted">${displayDate}</small></td>
                <td>${s.Usage_Count}</td>
                <td>$${s.Unit_Price_Snapshot}</td>
                <td>$${g.toLocaleString()}</td>
                <td class="fw-bold text-success">$${n.toLocaleString()}</td>
                <td><span class="badge ${badge} status-badge" onclick="toggleInvoiceStatus('${s.Record_ID}', '${s.Invoice_Status}')">${s.Invoice_Status}</span></td>
                <td><button class="btn btn-sm btn-light" onclick="openSettlementModal('${s.Record_ID}')"><i class="fas fa-edit"></i></button></td>
            </tr>`;
    });
    
    if(!hasData) tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">本月尚無結算資料</td></tr>`;
}

function renderRadarTable() { const reg = getVal('radar-filter-region'), lvl = getVal('radar-filter-level'), sts = getVal('radar-filter-status'); const tbody = document.getElementById('radar-table-body'); tbody.innerHTML = ''; globalHospitals.forEach(h => { if (reg!=='All' && h.Region!==reg) return; if (lvl!=='All' && h.Level!==lvl) return; if (sts!=='All' && h.Status!==sts) return; let badge = h.Status==='已簽約'?'bg-success':(h.Status==='開發中'?'bg-warning text-dark':'bg-secondary'); tbody.innerHTML += `<tr><td><strong>${h.Name}</strong></td><td>${h.Region||'-'}</td><td>${h.Level||'-'}</td><td><span class="badge ${badge}">${h.Status||''}</span></td><td>${h.Exclusivity==='Yes'?'<i class="fas fa-check text-success"></i>':'-'}</td><td><button class="btn btn-sm btn-outline-primary" onclick="openHospitalInput('${h.Hospital_ID}')">編輯</button></td></tr>`; }); }
function renderHospitalList() { const tbody = document.getElementById('hospital-list-body'); tbody.innerHTML = ''; globalHospitals.forEach(h => { tbody.innerHTML += `<tr><td>${h.Name}</td><td>${h.Level}</td><td>$${(Number(h.Unit_Price)||0).toLocaleString()}</td><td>${h.Exclusivity}</td><td>${h.Contract_End_Date ? h.Contract_End_Date.split('T')[0] : '-'}</td><td><button class="btn btn-sm btn-outline-primary" onclick="openHospitalInput('${h.Hospital_ID}')">Edit</button></td></tr>`; }); }

function renderKOLList() { 
    const tbody = document.getElementById('kol-list-body'); 
    const filterHosp = getVal('kol-filter-hospital');
    tbody.innerHTML = ''; 
    
    globalKOLs.forEach(k => { 
        if (filterHosp !== 'All' && k.Hospital_ID !== filterHosp) return;

        const hName = (globalHospitals.find(h=>h.Hospital_ID===k.Hospital_ID)||{}).Name || k.Hospital_ID; 
        const emailLink = k.Email ? `<a href="mailto:${k.Email}" class="text-decoration-none text-primary fw-medium"><i class="fas fa-envelope me-1"></i>${k.Email}</a>` : '<span class="text-muted">-</span>';
        
        tbody.innerHTML += `
            <tr>
                <td><strong>${k.Name}</strong></td>
                <td>${hName}</td>
                <td>${k.Title}</td>
                <td>${emailLink}</td>
                <td>${getStageBadge(k.Visit_Stage)}</td>
                <td>${k.Probability}%</td>
                <td><button class="btn btn-sm btn-outline-success" onclick="openKOLModal('${k.KOL_ID}')">Edit</button></td>
            </tr>`; 
    }); 
}

function renderUserTable(u) { const t=document.getElementById('admin-users-body'); t.innerHTML=''; u.forEach(x=>t.innerHTML+=`<tr><td>${x.Email}</td><td>${x.Name}</td><td>${x.Role}</td><td>${x.Status}</td><td>${x.Last_Login?new Date(x.Last_Login).toLocaleDateString():'-'}</td><td><button class="btn btn-sm btn-light" onclick="openUserModal('${x.Email}','${x.Name}','${x.Role}','${x.Status}')">Edit</button></td></tr>`); }
function renderLogTable(l) { const t=document.getElementById('admin-logs-body'); t.innerHTML=''; l.reverse().forEach(x=>t.innerHTML+=`<tr><td>${new Date(x.Timestamp).toLocaleString()}</td><td>${x.User}</td><td>${x.Action}</td><td class="text-muted small">${x.Details}</td></tr>`); }

function openHospitalInput(id){ showPage('hospital-input'); document.getElementById('form-hospital').reset(); setVal('h-id',''); setVal('h-link',''); if(id){ const h=globalHospitals.find(x=>x.Hospital_ID===id); if(h){ setVal('h-id',h.Hospital_ID); setVal('h-name',h.Name); setVal('h-region',h.Region); setVal('h-level',h.Level); setVal('h-address',h.Address); setVal('h-status',h.Status); setVal('h-exclusivity',h.Exclusivity); setVal('h-unit-price',h.Unit_Price); setVal('h-ebm',h.EBM_Share_Ratio); setVal('h-amount',h.Contract_Amount); setVal('h-link',h.Contract_Link); if(h.Contract_Start_Date)setVal('h-start',h.Contract_Start_Date.split('T')[0]); if(h.Contract_End_Date)setVal('h-end',h.Contract_End_Date.split('T')[0]); } } }
async function submitHospital(){ showLoading(true); let link=getVal('h-link'); const f=document.getElementById('h-file'); if(f.files.length){ link=(await uploadFile(f.files[0])).url; } const p={hospitalId:getVal('h-id'), name:getVal('h-name'), region:getVal('h-region'), level:getVal('h-level'), address:getVal('h-address'), status:getVal('h-status'), exclusivity:getVal('h-exclusivity'), unitPrice:getVal('h-unit-price'), ebmShare:getVal('h-ebm'), contractAmount:getVal('h-amount'), contractStart:getVal('h-start'), contractEnd:getVal('h-end'), contractLink:link, salesRep:document.getElementById('user-name').innerText}; await fetch(CONFIG.SCRIPT_URL,{method:'POST',body:JSON.stringify({action:'saveHospital',userEmail:currentUser,payload:p})}); await loadRadarData(); showPage('hospitals'); showLoading(false); }

function openKOLModal(id){ 
    document.getElementById('form-kol').reset(); 
    setVal('k-id',''); 
    document.getElementById('k-prob-val').innerText = '20%';
    const s=document.getElementById('k-hospital-id'); 
    s.innerHTML='<option value="">選擇醫院</option>'; 
    globalHospitals.forEach(h=>s.innerHTML+=`<option value="${h.Hospital_ID}">${h.Name}</option>`); 
    
    if(id){
        const k=globalKOLs.find(x=>x.KOL_ID===id);
        if(k){
            setVal('k-id',k.KOL_ID);
            setVal('k-hospital-id',k.Hospital_ID);
            setVal('k-name',k.Name);
            setVal('k-title',k.Title);
            setVal('k-email',k.Email);
            setVal('k-phone',k.Phone); 
            setVal('k-stage',k.Visit_Stage);
            let prob = k.Probability || 20;
            setVal('k-prob', prob);
            document.getElementById('k-prob-val').innerText = prob + '%';
            setVal('k-note',k.Visit_Note);
        }
    } 
    kolModal.show(); 
}

async function submitKOL(){ 
    const p={
        kolId:getVal('k-id'), 
        hospitalId:getVal('k-hospital-id'), 
        name:getVal('k-name'), 
        title:getVal('k-title'), 
        phone:getVal('k-phone'), 
        email:getVal('k-email'), 
        visitStage:getVal('k-stage'), 
        probability:getVal('k-prob'), 
        visitNote:getVal('k-note')
    }; 
    if(!p.name)return; 
    showLoading(true); 
    await fetch(CONFIG.SCRIPT_URL,{method:'POST',body:JSON.stringify({action:'saveKOL',userEmail:currentUser,payload:p})}); 
    kolModal.hide(); 
    await loadKOLData(); 
    await loadRadarData(); 
    const dashRes = await fetch(CONFIG.SCRIPT_URL, { method: "POST", body: JSON.stringify({ action: "getDashboardData", userEmail: currentUser }) });
    const dashJson = await dashRes.json();
    if (dashJson.status === 'success') {
        globalMonthlyData = dashJson.data.monthlyStats || []; 
        renderDashboard(dashJson.data);
    }
    showLoading(false); 
}

function openSettlementModal(id) { 
    document.getElementById('form-settlement').reset();
    setVal('s-record-id', '');
    
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    setVal('s-date', `${year}-${month}-${day}`);
    
    const delBtn = document.getElementById('btn-delete-settlement');
    if(delBtn) delBtn.style.display = id ? 'block' : 'none';

    const sel = document.getElementById('s-hospital');
    sel.innerHTML = '<option value="">請選擇醫院...</option>';
    globalHospitals.filter(h => h.Status==='已簽約').forEach(h => sel.innerHTML+=`<option value="${h.Hospital_ID}">${h.Name}</option>`);
    
    if(id) {
        const r = globalStats.find(x => String(x.Record_ID) === String(id));
        if(r) {
            setVal('s-record-id', r.Record_ID);
            let dateVal = String(r.Year_Month).substring(0, 10);
            setVal('s-date', dateVal);
            setVal('s-hospital', r.Hospital_ID);
            setVal('s-usage', r.Usage_Count);
            setVal('s-note', r.Note);
        }
    }
    calcPreview();
    settlementModal.show(); 
}

async function deleteSettlement() {
    const id = getVal('s-record-id');
    if(!id) return;
    if(!confirm("確定要刪除此筆資料嗎？此動作無法復原。")) return;

    showLoading(true);
    try {
        const res = await fetch(CONFIG.SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({ action: 'deleteMonthlyStat', userEmail: currentUser, payload: { recordId: id } })
        });
        const json = await res.json();
        if(json.status === 'success') {
            settlementModal.hide();
            await loadFinanceData();
        } else {
            alert("刪除失敗");
        }
    } catch(e) { console.error(e); alert("連線錯誤"); } finally { showLoading(false); }
}

function calcPreview(){ const h=globalHospitals.find(x=>String(x.Hospital_ID)===String(getVal('s-hospital'))); if(h){ const u=Number(getVal('s-usage'))||0, p=Number(h.Unit_Price)||0, s=Number(h.EBM_Share_Ratio)||0; document.getElementById('s-hosp-info').innerText=`單價:${p} | 分潤:${s}%`; document.getElementById('s-prev-gross').innerText="$"+(u*p).toLocaleString(); document.getElementById('s-prev-net').innerText="$"+Math.round(u*p*(1-s/100)).toLocaleString(); } }
async function submitSettlement() { const p={recordId:getVal('s-record-id'), yearMonth:getVal('s-date'), hospitalId:getVal('s-hospital'), usageCount:getVal('s-usage'), note:getVal('s-note')}; if(!p.hospitalId)return; showLoading(true); await fetch(CONFIG.SCRIPT_URL,{method:'POST',body:JSON.stringify({action:'saveMonthlyStat',userEmail:currentUser,payload:p})}); settlementModal.hide(); loadFinanceData(); showLoading(false); }
async function toggleInvoiceStatus(id,s){ const m={'Unbilled':'Billed','Billed':'Paid','Paid':'Unbilled'}; if(confirm('變更狀態?')){showLoading(true); await fetch(CONFIG.SCRIPT_URL,{method:'POST',body:JSON.stringify({action:'updateInvoiceStatus',userEmail:currentUser,payload:{recordId:id,status:m[s]}})}); loadFinanceData(); showLoading(false);} }
function openUserModal(e='',n='',r='User',s='Active'){ setVal('u-email',e); setVal('u-name',n); setVal('u-role',r); setVal('u-status',s); userModal.show(); }
async function submitUser(){ const p={email:getVal('u-email'),name:getVal('u-name'),role:getVal('u-role'),status:getVal('u-status')}; if(!p.email)return; showLoading(true); await fetch(CONFIG.SCRIPT_URL,{method:'POST',body:JSON.stringify({action:'saveUser',userEmail:currentUser,payload:p})}); userModal.hide(); loadAdminData(); showLoading(false); }
async function uploadFile(f){ return new Promise((resolve, reject) => { const r = new FileReader(); r.onload=async()=>{ const b=r.result.split(',')[1]; const res=await fetch(CONFIG.SCRIPT_URL,{method:'POST',body:JSON.stringify({action:'uploadFile',userEmail:currentUser,fileData:b,fileName:f.name,mimeType:f.type})}); resolve(await res.json()); }; r.readAsDataURL(f); }); }