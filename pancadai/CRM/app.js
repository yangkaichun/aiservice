// app.js

let currentUser = null;
let currentRole = null;
let globalHospitals = []; // Cache data

// Initialize Google Sign-In
window.onload = function() {
    const client_id = CONFIG.GOOGLE_CLIENT_ID;
    document.getElementById('g_id_onload').setAttribute('data-client_id', client_id);
};

// Handle Google Login Response
function handleCredentialResponse(response) {
    const responsePayload = decodeJwtResponse(response.credential);
    currentUser = responsePayload.email;
    const userName = responsePayload.name;
    const userPic = responsePayload.picture;

    document.getElementById('user-name').innerText = userName;
    document.getElementById('user-avatar').src = userPic;

    console.log("Logged in as: " + currentUser);
    
    // Check Auth with Backend
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
    // 這裡我們發送一個 dummy request 來測試權限並獲取 Role
    const payload = { action: "getDashboardData", userEmail: email };
    
    try {
        const response = await fetch(CONFIG.SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify(payload)
        });
        const json = await response.json();
        
        if (json.status === 'success') {
            currentRole = json.role;
            document.getElementById('login-view').classList.add('d-none');
            document.getElementById('app-view').classList.remove('d-none');
            // Load initial data
            renderDashboard(json.data);
            // Pre-load hospitals for Radar
            loadRadarData(); 
        } else {
            alert("您沒有權限存取此系統，請聯繫管理員。");
            logout();
        }
    } catch (e) {
        console.error(e);
        alert("系統連線錯誤");
    } finally {
        showLoading(false);
    }
}

// --- Navigation ---
function showPage(pageId) {
    document.querySelectorAll('.page-content').forEach(el => el.classList.add('d-none'));
    document.getElementById('page-' + pageId).classList.remove('d-none');
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

// --- Dashboard Logic ---
function renderDashboard(data) {
    // KPI
    document.getElementById('kpi-contract-value').innerText = "$" + data.kpi.totalContractValue.toLocaleString();
    // 這裡需要更多後端計算，目前暫示範
    
    // Region Chart
    const ctxRegion = document.getElementById('chart-region').getContext('2d');
    new Chart(ctxRegion, {
        type: 'pie',
        data: {
            labels: Object.keys(data.kpi.regionStats),
            datasets: [{
                data: Object.values(data.kpi.regionStats),
                backgroundColor: ['#3498db', '#e74c3c', '#f1c40f', '#2ecc71']
            }]
        }
    });

    // Trend Chart (Fake Data for MVP demo if rawStats empty)
    const ctxTrend = document.getElementById('chart-trend').getContext('2d');
    new Chart(ctxTrend, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                { label: '總營收', data: [100, 120, 150, 170, 160, 200], borderColor: 'blue' },
                { label: '實際營收', data: [70, 84, 105, 119, 112, 140], borderColor: 'red' }
            ]
        }
    });
}

// --- Tactical Radar Logic ---
async function loadRadarData() {
    showLoading(true);
    const payload = { action: "getHospitals", userEmail: currentUser };
    
    try {
        const response = await fetch(CONFIG.SCRIPT_URL, { method: "POST", body: JSON.stringify(payload) });
        const json = await response.json();
        globalHospitals = json.data;
        renderRadarTable();
    } catch (e) {
        console.error(e);
    } finally {
        showLoading(false);
    }
}

function renderRadarTable() {
    const regionFilter = document.getElementById('radar-filter-region').value;
    const levelFilter = document.getElementById('radar-filter-level').value;
    const statusFilter = document.getElementById('radar-filter-status').value;
    
    const tbody = document.getElementById('radar-table-body');
    tbody.innerHTML = '';

    globalHospitals.forEach(h => {
        // Filter Logic
        if (regionFilter !== 'All' && h.Region !== regionFilter) return;
        if (levelFilter !== 'All' && h.Level !== levelFilter) return;
        if (statusFilter !== 'All' && h.Status !== statusFilter) return;

        const tr = document.createElement('tr');
        
        // Dynamic Status Badge
        let statusClass = 'bg-secondary';
        if(h.Status === '已簽約') statusClass = 'bg-success';
        if(h.Status === '開發中') statusClass = 'bg-warning text-dark';
        if(h.Status === '未接觸') statusClass = 'bg-danger';

        tr.innerHTML = `
            <td><strong>${h.Name}</strong></td>
            <td>${h.Region}</td>
            <td>${h.Level}</td>
            <td><span class="badge ${statusClass}">${h.Status}</span></td>
            <td>${h.Exclusivity === 'Yes' ? '<i class="fas fa-check text-success"></i>' : '-'}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="editHospital('${h.Hospital_ID}')">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
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