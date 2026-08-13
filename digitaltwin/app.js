document.addEventListener('DOMContentLoaded', () => {
    // 全局變數
    const socket = new WebSocket('ws://localhost:8080');
    const CHART_MAX_POINTS = 30; // 圖表最大數據點
    let heartRateChart, spo2Chart;
    let threeScene, threeCamera, threeRenderer, assets = {};

    // 視圖切換 DOM
    const btnPatient = document.getElementById('btn-patient');
    const btnHospital = document.getElementById('btn-hospital');
    const patientView = document.getElementById('patient-view');
    const hospitalView = document.getElementById('hospital-view');

    // KPI DOM
    const kpiSystolic = document.getElementById('kpi-systolic');
    const kpiDiastolic = document.getElementById('kpi-diastolic');
    const patientStatus = document.getElementById('patient-status');
    const assetListOverlay = document.getElementById('asset-list');

    // 視圖切換邏輯
    btnPatient.addEventListener('click', () => {
        patientView.classList.add('active');
        hospitalView.classList.remove('active');
        btnPatient.classList.add('active');
        btnHospital.classList.remove('active');
    });

    btnHospital.addEventListener('click', () => {
        hospitalView.classList.add('active');
        patientView.classList.remove('active');
        btnHospital.classList.add('active');
        btnPatient.classList.remove('active');
        // 第一次切換時初始化 3D 場景
        if (!threeScene) {
            initHospitalView();
        }
    });

    // WebSocket 連接處理
    socket.onopen = () => {
        console.log("WebSocket 已連接");
        initPatientView(); // 默認初始化病患視圖
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        // 數據路由
        if (data.type === 'patient_vitals') {
            updatePatientCharts(data);
        } else if (data.type === 'asset_update') {
            updateHospitalAsset(data);
        }
    };

    socket.onclose = () => {
        console.log("WebSocket 已斷開");
    };

    socket.onerror = (error) => {
        console.error("WebSocket 錯誤: ", error);
    };

    // --- 病患分身 (Chart.js) ---

    function initPatientView() {
        const createChartConfig = (label) => ({
            type: 'line',
            data: {
                labels:,
                datasets: [{
                    label: label,
                    data:,
                    borderColor: 'rgb(0, 123, 255)',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.3
                }]
            },
            options: {
                scales: {
                    x: { display: false },
                    y: { beginAtZero: false }
                },
                animation: false,
                maintainAspectRatio: false
            }
        });

        heartRateChart = new Chart(document.getElementById('heartRateChart').getContext('2d'), createChartConfig('心率 (BPM)'));
        spo2Chart = new Chart(document.getElementById('spo2Chart').getContext('2d'), createChartConfig('血氧 (SpO2 %)'));
    }

    function updateChart(chart, value) {
        const data = chart.data;
        const now = new Date().toLocaleTimeString();
        
        data.labels.push(now);
        data.datasets.data.push(value);

        // "推入並移出" 邏輯
        if (data.labels.length > CHART_MAX_POINTS) {
            data.labels.shift();
            data.datasets.data.shift();
        }
        
        // 使用 'none' 參數調用 update 以獲得最佳效能
        chart.update('none');
    }

    function updatePatientCharts(data) {
        updateChart(heartRateChart, data.heartRate);
        updateChart(spo2Chart, data.spO2);

        kpiSystolic.textContent = data.bpSystolic;
        kpiDiastolic.textContent = data.bpDiastolic;

        // 簡單的告警邏輯
        if (data.spO2 < 95 |

| data.heartRate > 100 |
| data.heartRate < 60) {
            patientStatus.textContent = "警告";
            patientStatus.className = "status-alert";
        } else {
            patientStatus.textContent = "穩定";
            patientStatus.className = "status-ok";
        }
    }

    // --- 醫院分身 (Three.js) ---

    function initHospitalView() {
        const canvas = document.getElementById('3d-canvas');
        const container = document.getElementById('hospital-view');

        // 1. 場景 (Scene)
        threeScene = new THREE.Scene();
        threeScene.background = new THREE.Color(0xeeeeee);

        // 2. 攝影機 (Camera)
        threeCamera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        threeCamera.position.set(0, 30, 40);
        threeCamera.lookAt(0, 0, 0);

        // 3. 渲染器 (Renderer)
        threeRenderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
        threeRenderer.setSize(container.clientWidth, container.clientHeight);

        // 燈光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        threeScene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 10, 5);
        threeScene.add(directionalLight);

        // 創建醫院佈局 (地板和牆壁)
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100),
            new THREE.MeshStandardMaterial({ color: 0xcccccc })
        );
        floor.rotation.x = -Math.PI / 2;
        threeScene.add(floor);

        // 創建資產 (代理物件)
        const assetMaterialAvailable = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); // 綠色
        const assetMaterialInUse = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // 紅色
        const assetMaterialMaintenance = new THREE.MeshStandardMaterial({ color: 0xffc107 }); // 黃色

        const assetGeo = new THREE.BoxGeometry(2, 4, 2); // 模擬輸液泵

        // 創建兩個資產實例
        assets['iv_pump_04'] = new THREE.Mesh(assetGeo, assetMaterialAvailable.clone());
        assets['iv_pump_04'].name = 'iv_pump_04'; // 關鍵的名稱綁定
        assets['iv_pump_04'].position.set(-10, 2, 0);
        threeScene.add(assets['iv_pump_04']);

        assets['iv_pump_05'] = new THREE.Mesh(assetGeo, assetMaterialAvailable.clone());
        assets['iv_pump_05'].name = 'iv_pump_05';
        assets['iv_pump_05'].position.set(10, 2, 0);
        threeScene.add(assets['iv_pump_05']);

        // 啟動渲染循環
        animate();
    }

    function animate() {
        if (!hospitalView.classList.contains('active')) {
            return; // 如果視圖未激活，則不渲染以節省資源
        }
        requestAnimationFrame(animate);
        
        // 簡單的攝影機旋轉
        const time = Date.now() * 0.0001;
        threeCamera.position.x = Math.sin(time) * 40;
        threeCamera.position.z = Math.cos(time) * 40;
        threeCamera.lookAt(0, 0, 0);

        threeRenderer.render(threeScene, threeCamera);
    }
    
    // 監聽視圖切換以重啟動畫
    btnHospital.addEventListener('click', () => {
        if (threeScene) {
            // 確保渲染器大小正確
            const container = document.getElementById('hospital-view');
            threeCamera.aspect = container.clientWidth / container.clientHeight;
            threeCamera.updateProjectionMatrix();
            threeRenderer.setSize(container.clientWidth, container.clientHeight);
            animate(); // 啟動動畫
        }
    });

    function updateHospitalAsset(data) {
        if (!threeScene) return; // 確保 3D 場景已初始化

        const asset = assets[data.assetId]; // scene.getObjectByName(data.assetId)
        if (asset) {
            // 1. 更新位置
            asset.position.set(data.location.x, data.location.y, data.location.z);

            // 2. 更新狀態 (顏色)
            let newColor = 0x00ff00; // 預設為可用 (綠色)
            let statusText = '可用';
            let statusClass = 'asset-available';
            
            if (data.status === 'in_use') {
                newColor = 0xff0000; // 使用中 (紅色)
                statusText = '使用中';
                statusClass = 'asset-in-use';
            } else if (data.status === 'maintenance') {
                newColor = 0xffc107; // 維護中 (黃色)
                statusText = '維護中';
                statusClass = 'asset-maintenance';
            }
            asset.material.color.setHex(newColor);

            // 3. 更新 2D 覆蓋層 (Overlay)
            let overlayEntry = document.getElementById(`asset-${data.assetId}`);
            if (!overlayEntry) {
                overlayEntry = document.createElement('div');
                overlayEntry.id = `asset-${data.assetId}`;
                assetListOverlay.appendChild(overlayEntry);
            }
            overlayEntry.innerHTML = `<strong>${data.assetId}:</strong> <span class="${statusClass}">${statusText}</span>`;
        }
    }
});
