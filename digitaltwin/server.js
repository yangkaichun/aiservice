// 引入所需模組
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const PORT = 8080;

// 初始化 Express 和 HTTP 伺服器
const app = express();
const server = http.createServer(app);

// 初始化 WebSocket 伺服器
const wss = new WebSocket.Server({ server });

// 托管靜態檔案 (index.html, app.js, style.css)
// 讓伺服器能提供當前目錄下的檔案
app.use(express.static(path.join(__dirname))); 

// --- 模擬數據生成 ---

// 模擬病患生理訊號
let patientVitals = {
    type: 'patient_vitals',
    patientId: 'P001',
    heartRate: 75,
    spO2: 98,
    bpSystolic: 120,
    bpDiastolic: 80
};

function generatePatientVitals() {
    // 心率模擬：在 70-85 之間隨機行走
    patientVitals.heartRate += (Math.random() - 0.5) * 2;
    patientVitals.heartRate = Math.max(60, Math.min(105, patientVitals.heartRate)); // 範圍限制

    // 血氧模擬：在 95-99 之間小幅波動
    patientVitals.spO2 += (Math.random() - 0.4) * 0.5;
    patientVitals.spO2 = Math.max(93, Math.min(99, patientVitals.spO2));

    // 血壓模擬
    patientVitals.bpSystolic += (Math.random() - 0.5) * 2;
    patientVitals.bpDiastolic = patientVitals.bpSystolic - 40 + (Math.random() - 0.5) * 5;

    // 返回四捨五入的整數值
    return {
        type: 'patient_vitals',
        patientId: 'P001',
        heartRate: Math.round(patientVitals.heartRate),
        spO2: Math.round(patientVitals.spO2),
        bpSystolic: Math.round(patientVitals.bpSystolic),
        bpDiastolic: Math.round(patientVitals.bpDiastolic),
    };
}

// 模擬資產狀態
let assets = {
    'iv_pump_04': { x: -10, y: 2, z: 0, status: 'available', targetX: -10 },
    'iv_pump_05': { x: 10, y: 2, z: 0, status: 'available', targetX: 10 }
};

function generateAssetUpdate(assetId) {
    const asset = assets[assetId];

    // 模擬資產移動
    if (Math.abs(asset.x - asset.targetX) < 1) {
        // 到達目的地，隨機設置新目標或新狀態
        if (Math.random() < 0.1) { // 10% 機率改變狀態
            if (asset.status === 'available') {
                asset.status = 'in_use';
                asset.targetX = 0; // 移動到中間區域
            } else {
                asset.status = 'available';
                asset.targetX = (Math.random() < 0.5)? -10 : 10; // 返回儲藏室
            }
        }
    }
    // 向目標移動
    asset.x += Math.sign(asset.targetX - asset.x) * 0.5;

    return {
        type: 'asset_update',
        assetId: assetId,
        location: { x: asset.x, y: asset.y, z: asset.z },
        status: asset.status
    };
}

// --- WebSocket 連接處理 ---

wss.on('connection', (ws) => {
    console.log('用戶端已連接');

    // 為此用戶端啟動數據模擬 "心跳"
    const interval = setInterval(() => {
        // 廣播病患數據
        ws.send(JSON.stringify(generatePatientVitals()));
        
        // 廣播資產數據
        ws.send(JSON.stringify(generateAssetUpdate('iv_pump_04')));
        ws.send(JSON.stringify(generateAssetUpdate('iv_pump_05')));

    }, 1000); // 每秒發送一次

    ws.on('close', () => {
        console.log('用戶端已斷開');
        clearInterval(interval); // 清除此用戶端的心跳
    });

    ws.on('error', (error) => {
        console.error('WebSocket 發生錯誤: ', error);
        clearInterval(interval);
    });
});

// 啟動伺服器
server.listen(PORT, () => {
    console.log(`伺服器正在 http://localhost:${PORT} 上運行`);
    console.log(`請在瀏覽器中打開 index.html 檔案，或訪問上述地址。`);
});
