// --- 模擬資料庫 ---
const mockPatientsList = [
    { id: 'P25001', name: '王大明', gender: '男', age: 65, diag: 'E11.9 (第2型糖尿病)', plan: '糖尿病共照網', lastVisit: '2025-12-10' },
    { id: 'P25002', name: '林美麗', gender: '女', age: 58, diag: 'I10 (高血壓)', plan: '居家血壓管理', lastVisit: '2025-12-14' },
    { id: 'P25003', name: '張志豪', gender: '男', age: 42, diag: 'J45 (氣喘)', plan: '一般追蹤', lastVisit: '2025-11-20' },
    { id: 'P25004', name: '陳小芬', gender: '女', age: 70, diag: 'I50 (心臟衰竭)', plan: '遠距心臟監控', lastVisit: '2025-12-15' },
];

const mockReferrals = [
    { status: 'pending', source: '陳耳鼻喉科診所', name: '李國強', refId: 'REF-2025-088', reason: '疑似鼻咽腫瘤，需進一步切片', date: '2025-12-16' },
    { status: 'accepted', source: '安心家醫科', name: '王大明', refId: 'REF-2025-085', reason: '血糖控制不佳，轉介新陳代謝科', date: '2025-12-15' },
    { status: 'accepted', source: '康寧診所', name: '黃小玉', refId: 'REF-2025-082', reason: '胸痛，懷疑心絞痛', date: '2025-12-14' },
    { status: 'rejected', source: '美好診所', name: '測試病患A', refId: 'REF-2025-001', reason: '資料缺漏', date: '2025-12-10' },
];

const mockIoTData = [
    { name: '王大明', type: '血壓', value: '168/98', unit: 'mmHg', status: 'danger', time: '10分鐘前', device: 'Omron BP' },
    { name: '陳小芬', type: '心率', value: '110', unit: 'bpm', status: 'danger', time: '5分鐘前', device: 'Apple Watch' },
    { name: '林美麗', type: '血糖', value: '115', unit: 'mg/dL', status: 'success', time: '1小時前', device: 'Fora GD40' },
    { name: '張志豪', type: '血氧', value: '98', unit: '%', status: 'success', time: '20分鐘前', device: 'Garmin' },
];

const mockVideoAppts = [
    { time: '14:00 - 14:15', name: '林美麗', purpose: '高血壓用藥調整回診', status: 'ready' },
    { time: '14:20 - 14:35', name: '張志豪', purpose: '氣喘症狀諮詢', status: 'waiting' },
    { time: '14:40 - 14:55', name: '未知病患', purpose: '初診諮詢', status: 'future' },
];

// --- 頁面切換邏輯 ---
function switchView(viewId, element) {
    // 1. 隱藏所有內容區塊
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    
    // 2. 顯示選定的區塊
    const targetSection = document.getElementById(`view-${viewId}`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // 3. 更新側邊選單樣式
    if (element) {
        document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
        element.classList.add('active');
    }

    // 4. 更新頁面標題
    const titles = {
        'dashboard': '總覽儀表板',
        'patients': '病患列表 (FHIR Resource List)',
        'referrals': '跨院轉診管理 (Referral Request)',
        'iot': 'IoT 遠距監控中心',
        'video': '視訊門診管理'
    };
    document.getElementById('pageTitle').innerText = titles[viewId] || '個案管理平台';

    // 5. 延遲渲染 (Lazy Load Rendering)
    if(viewId === 'patients') renderPatients();
    if(viewId === 'referrals') renderReferrals();
    if(viewId === 'iot') renderIoT();
    if(viewId === 'video') renderVideo();
}

// --- 渲染函式 ---
function renderPatients() {
    const tbody = document.getElementById('patientListBody');
    if(tbody.innerHTML.trim() !== "") return; // 避免重複渲染
    tbody.innerHTML = mockPatientsList.map(p => `
        <tr>
            <td><span class="badge bg-light text-dark border">${p.id}</span></td>
            <td class="fw-bold text-primary">${p.name}</td>
            <td>${p.gender} / ${p.age}</td>
            <td>${p.diag}</td>
            <td><span class="badge bg-info text-dark">${p.plan}</span></td>
            <td>${p.lastVisit}</td>
            <td><button class="btn btn-sm btn-outline-primary">詳情</button></td>
        </tr>
    `).join('');
}

function renderReferrals() {
    const tbody = document.getElementById('referralListBody');
    if(tbody.innerHTML.trim() !== "") return;
    tbody.innerHTML = mockReferrals.map(r => {
        let badgeClass = r.status === 'pending' ? 'status-pending' : 
                         r.status === 'accepted' ? 'status-accepted' : 'status-rejected';
        let statusText = r.status === 'pending' ? '待接收' : 
                         r.status === 'accepted' ? '已收案' : '退回';
        return `
        <tr>
            <td><span class="status-badge ${badgeClass}">${statusText}</span></td>
            <td>${r.source}</td>
            <td class="fw-bold">${r.name}</td>
            <td class="small text-muted">${r.refId}</td>
            <td>${r.reason}</td>
            <td>${r.date}</td>
            <td>${r.status === 'pending' ? 
                `<button class="btn btn-sm btn-success me-1"><i class="fas fa-check"></i></button><button class="btn btn-sm btn-danger"><i class="fas fa-times"></i></button>` : 
                `<button class="btn btn-sm btn-outline-secondary" disabled>已處理</button>`}</td>
        </tr>`;
    }).join('');
}

function renderIoT() {
    const container = document.getElementById('iotCardsContainer');
    if(container.innerHTML.trim() !== "") return;
    container.innerHTML = mockIoTData.map(d => {
        let borderClass = d.status === 'danger' ? 'border-danger border-2' : d.status === 'warning' ? 'border-warning' : 'border-success';
        let textClass = d.status === 'danger' ? 'text-danger' : d.status === 'warning' ? 'text-warning' : 'text-success';
        return `
        <div class="col-md-4 col-lg-3">
            <div class="card shadow-sm h-100 ${borderClass}">
                <div class="card-body">
                    <div class="iot-card-header d-flex justify-content-between align-items-center">
                        <h5 class="card-title m-0">${d.name}</h5>
                        <span class="badge bg-light text-dark">${d.device}</span>
                    </div>
                    <div class="text-center py-3">
                        <div class="display-6 fw-bold ${textClass}">${d.value}</div>
                        <div class="text-muted">${d.type} (${d.unit})</div>
                    </div>
                    <div class="d-flex justify-content-between small text-muted mt-2">
                        <span><i class="far fa-clock"></i> ${d.time}</span>
                        <span class="${textClass}"><i class="fas fa-circle"></i> ${d.status === 'danger' ? '異常' : '正常'}</span>
                    </div>
                </div>
            </div>
        </div>`;
    }).join('');
}

function renderVideo() {
    const container = document.getElementById('videoListContainer');
    if(container.innerHTML.trim() !== "") return;
    container.innerHTML = mockVideoAppts.map(v => {
        let btnClass = v.status === 'ready' ? 'btn-primary' : 'btn-secondary disabled';
        return `
        <div class="video-slot">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <div class="fw-bold fs-5"><i class="far fa-clock me-2"></i>${v.time}</div>
                    <div class="text-primary mt-1">${v.name}</div>
                    <div class="text-muted small">${v.purpose}</div>
                </div>
                <div><button class="btn ${btnClass}"><i class="fas fa-video me-1"></i> ${v.status === 'ready' ? '進入診間' : '等待中'}</button></div>
            </div>
        </div>`;
    }).join('');
}

// --- 圖表初始化 (等待 DOM 載入完成) ---
document.addEventListener("DOMContentLoaded", function() {
    const ctx = document.getElementById('dashboardChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['週一', '週二', '週三', '週四', '週五', '週六', '週日'],
                datasets: [{
                    label: '新增收案',
                    data: [12, 19, 3, 5, 2, 3, 10],
                    borderColor: '#006b5e',
                    backgroundColor: 'rgba(0, 107, 94, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }, {
                    label: '轉診申請',
                    data: [5, 10, 2, 8, 1, 5, 2],
                    borderColor: '#ffc107',
                    backgroundColor: 'rgba(255, 193, 7, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // 重要：配合 CSS 高度
                plugins: {
                    legend: { position: 'bottom' }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
});