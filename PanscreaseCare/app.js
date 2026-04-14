// app.js

// ==========================================
// YouTube 網址轉換工具 (提取影片 ID 並轉成 embed 格式)
// ==========================================
function getYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// ==========================================
// 1. 網頁載入時去 Google Sheets 抓取最新內容 (CMS)
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 使用 GET 方法避開 CORS 問題，並帶入 action 參數
        const fetchUrl = CONFIG.GAS_URL + "?action=getContent";
        const res = await fetch(fetchUrl, { method: 'GET' });
        const result = await res.json();
        
        if (result.status === 'success' && result.data) {
            // --- 更新 News (方格子) 區塊 ---
            if (result.data.news.title) {
                document.getElementById('display-news-title').innerText = result.data.news.title;
                document.getElementById('display-news-summary').innerText = result.data.news.summary;
                document.getElementById('display-news-url').href = result.data.news.url;
                
                // 動態顯示抓取到的首圖
                if (result.data.news.image) {
                    const imgEl = document.getElementById('display-news-img');
                    imgEl.src = result.data.news.image;
                    imgEl.style.display = 'block';
                    document.getElementById('news-placeholder-text').style.display = 'none';
                }
            }
            
            // --- 更新 Video (YouTube) 區塊 ---
            if (result.data.video.title) {
                document.getElementById('display-video-title').innerText = result.data.video.title;
                document.getElementById('display-video-summary').innerText = result.data.video.summary;
                
                // 自動將一般 YouTube 網址轉換成 iframe 可讀取的 embed 網址
                const videoId = getYouTubeId(result.data.video.url);
                if (videoId) {
                    document.getElementById('display-video-iframe').src = `https://www.youtube.com/embed/${videoId}?rel=0`;
                }
            }
        }
    } catch (e) {
        console.error("無法讀取動態內容，顯示預設值。", e);
        // 防呆預設值
        document.getElementById('display-news-title').innerText = "台灣胰臟癌發生率攀升！AI「助胰見」有助早期揪出病灶";
        document.getElementById('display-news-summary').innerText = "胰臟癌被稱為無聲殺手，近年來發病率有年輕化趨勢。透過最新的 AI 輔助軟體，能顯著提升微小病灶檢出率...";
        document.getElementById('display-news-url').href = "#";
        
        document.getElementById('display-video-title').innerText = "你對【胰臟癌】了解多少？";
        document.getElementById('display-video-summary').innerText = "介紹胰臟癌的分類、好發族群、常見症狀以及目前的診斷方式。帶您快速了解為何早期篩檢如此重要...";
    }
});

// ==========================================
// 2. 自我風險評估邏輯與互動
// ==========================================
const questions = [
    { question: "您的家族中（一等親）是否有胰臟癌病史？", options: [{ text: "是", score: 3 }, { text: "否", score: 0 }, { text: "不確定", score: 0 }] },
    { question: "您是否患有糖尿病，且為近期（50歲後）才初次確診？", options: [{ text: "是", score: 3 }, { text: "否，或已罹患多年", score: 0 }] },
    { question: "您是否有抽菸或過量飲酒的習慣？", options: [{ text: "兩者皆有", score: 2 }, { text: "其中一項", score: 1 }, { text: "皆無", score: 0 }] },
    { question: "近期是否出現：無痛性黃疸、不明原因上腹痛或背痛、體重無故驟降？", options: [{ text: "有出現上述症狀", score: 5 }, { text: "無", score: 0 }] }
];

let currentQ = 0, totalScore = 0, userAnswers = [];

const screens = { 
    intro: document.getElementById('intro-screen'), 
    question: document.getElementById('question-screen'), 
    lead: document.getElementById('lead-screen'), 
    result: document.getElementById('result-screen') 
};

// 畫面切換動畫
function switchScreen(hide, show) {
    hide.style.opacity = '0';
    setTimeout(() => {
        hide.classList.add('hidden'); hide.classList.remove('active');
        show.classList.remove('hidden'); show.classList.add('active');
        setTimeout(() => { show.style.opacity = '1'; }, 50);
    }, 300); 
}

document.getElementById('btn-start').onclick = () => { switchScreen(screens.intro, screens.question); renderQ(); };
document.getElementById('btn-restart').onclick = () => { currentQ = 0; totalScore = 0; userAnswers = []; document.getElementById('user-email').value = ''; switchScreen(screens.result, screens.intro); document.getElementById('progress-bar').style.width = '0%'; };
document.getElementById('btn-submit').onclick = submitData;

function renderQ() {
    const q = questions[currentQ];
    document.getElementById('question-counter').innerText = `問題 ${currentQ + 1} / ${questions.length}`;
    const qText = document.getElementById('question-text');
    qText.style.opacity = 0; 
    setTimeout(() => { qText.innerText = q.question; qText.style.opacity = 1; }, 200);
    setTimeout(() => { document.getElementById('progress-bar').style.width = `${(currentQ / questions.length) * 100}%`; }, 100);

    const opts = document.getElementById('options-container');
    opts.innerHTML = '';
    q.options.forEach(o => {
        const btn = document.createElement('button');
        btn.className = 'option-btn'; btn.innerText = o.text;
        btn.onclick = () => handleAnswer(q.question, o);
        opts.appendChild(btn);
    });
}

function handleAnswer(questionText, option) {
    totalScore += option.score; userAnswers.push({q: questionText, a: option.text}); currentQ++; 
    if (currentQ < questions.length) { renderQ(); } else {
        document.getElementById('progress-bar').style.width = '100%';
        setTimeout(() => switchScreen(screens.question, screens.lead), 600);
    }
}

async function submitData() {
    const email = document.getElementById('user-email').value;
    if (!email || !email.includes('@')) return alert("請輸入有效的 Email 以接收報告");
    
    document.getElementById('btn-submit').classList.add('hidden');
    document.getElementById('loading-state').classList.remove('hidden');
    const riskLevel = totalScore >= 5 ? "高風險" : (totalScore >= 3 ? "中風險" : "低風險");
    
    // 將資料打包成 JSON，action 指定為 submitForm 以驅動後端邏輯
    const payload = { action: 'submitForm', email: email, score: totalScore, risk: riskLevel, answers: JSON.stringify(userAnswers) };

    try { 
        await fetch(CONFIG.GAS_URL, { method: 'POST', body: JSON.stringify(payload) }); 
    } catch (e) { 
        console.log("CORS 提示：", e); 
        // 跨域問題通常不影響 GAS 寫入，讓流程繼續
    } 
    
    setTimeout(() => {
        document.getElementById('btn-submit').classList.remove('hidden');
        document.getElementById('loading-state').classList.add('hidden');
        showResult(riskLevel);
    }, 800);
}

function showResult(riskLevel) {
    switchScreen(screens.lead, screens.result);
    const title = document.getElementById('result-title'); const desc = document.getElementById('result-desc');
    const cta = document.getElementById('result-cta'); const icon = document.getElementById('result-icon');
    const resultBox = document.getElementById('result-desc');

    if (riskLevel === "高風險") {
        icon.innerText = "🚨"; title.innerText = "警示：屬於高風險族群"; title.style.color = "var(--danger)"; resultBox.style.borderColor = "var(--danger)";
        desc.innerHTML = "根據評估，您具備多項高風險因子或疑似症狀。<br><br><strong>強烈建議儘速安排專業的腹部影像排查。</strong>";
        cta.innerHTML = "就診時可主動詢問醫師是否備有<strong>「助胰見」</strong>等 AI 輔助系統協助判讀。";
    } else if (riskLevel === "中風險") {
        icon.innerText = "⚠️"; title.innerText = "留意：屬於中風險族群"; title.style.color = "var(--warning)"; resultBox.style.borderColor = "var(--warning)";
        desc.innerHTML = "具備部分風險因子。胰臟癌雖然隱密，但改善習慣與定期健檢能降低威脅。"; 
        cta.innerHTML = "已將相關衛教資訊發送至信箱，也建議您多關注健康專欄。";
    } else {
        icon.innerText = "✅"; title.innerText = "安心：屬於低風險族群"; title.style.color = "var(--success)"; resultBox.style.borderColor = "var(--success)";
        desc.innerHTML = "目前未發現明顯風險因子，請繼續保持良好的生活習慣！"; 
        cta.innerHTML = "預防勝於治療，衛教資訊已寄至您的信箱。";
    }
}