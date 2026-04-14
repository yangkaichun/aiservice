// app.js

// ==========================================
// YouTube 網址轉換工具
// ==========================================
function getYouTubeId(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// 防當機安全賦值函式 (確保 HTML 就算缺了某個 ID 也不會 Crash)
const safeSetText = (id, text) => { const el = document.getElementById(id); if (el) el.innerText = text; };
const safeSetHref = (id, url) => { const el = document.getElementById(id); if (el) el.href = url; };
const safeSetSrc = (id, url) => { const el = document.getElementById(id); if (el) el.src = url; };

// ==========================================
// 1. 網頁載入時去 Google Sheets 抓取最新內容 (CMS)
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const fetchUrl = CONFIG.GAS_URL + "?action=getContent";
        const res = await fetch(fetchUrl, { method: 'GET' });
        const result = await res.json();
        
        if (result.status === 'success' && result.data) {
            
            // --- 更新 News (方格子) ---
            if (result.data.news.title) {
                safeSetText('display-news-title', result.data.news.title);
                safeSetText('display-news-summary', result.data.news.summary);
                safeSetHref('display-news-url', result.data.news.url);
                
                // 動態顯示您在後台輸入的圖片網址
                if (result.data.news.image) {
                    const imgEl = document.getElementById('display-news-img');
                    const placeholder = document.getElementById('news-placeholder-text');
                    if (imgEl && placeholder) {
                        imgEl.src = result.data.news.image;
                        imgEl.style.display = 'block';
                        placeholder.style.display = 'none';
                    }
                }
            }
            
            // --- 更新 Video (YouTube) ---
            if (result.data.video.title) {
                safeSetText('display-video-title', result.data.video.title);
                safeSetText('display-video-summary', result.data.video.summary);
                safeSetHref('display-video-url', result.data.video.url); 
                
                const videoId = getYouTubeId(result.data.video.url);
                if (videoId) {
                    safeSetSrc('display-video-iframe', `https://www.youtube.com/embed/${videoId}?rel=0`);
                }
            }
        }
    } catch (e) {
        console.error("無法讀取動態內容，顯示預設值。", e);
        // 防呆預設值：使用您截圖中的真實文章標題
        safeSetText('display-news-title', "別讓胰臟癌輕易宣判死刑！AI 如何在早期攔截這個無聲殺手？");
        safeSetText('display-news-summary', "在醫療圈，只要聽到「胰臟癌」，許多人的第一反應往往是絕望。高居不下的致死率、極低的早期發現率...");
        safeSetText('display-video-title', "介紹「助胰見」 | Introducing PANCREASaver");
        safeSetText('display-video-summary', "PANCREASaver 助胰見能全自動偵測電腦斷層影像中是否有胰臟癌...");
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

function switchScreen(hide, show) {
    if (!hide || !show) return;
    hide.style.opacity = '0';
    setTimeout(() => {
        hide.classList.add('hidden'); hide.classList.remove('active');
        show.classList.remove('hidden'); show.classList.add('active');
        setTimeout(() => { show.style.opacity = '1'; }, 50);
    }, 300); 
}

const btnStart = document.getElementById('btn-start');
if (btnStart) btnStart.onclick = () => { switchScreen(screens.intro, screens.question); renderQ(); };

const btnRestart = document.getElementById('btn-restart');
if (btnRestart) btnRestart.onclick = () => { 
    currentQ = 0; totalScore = 0; userAnswers = []; 
    const emailInput = document.getElementById('user-email');
    if (emailInput) emailInput.value = ''; 
    switchScreen(screens.result, screens.intro); 
    const progBar = document.getElementById('progress-bar');
    if (progBar) progBar.style.width = '0%'; 
};

const btnSubmit = document.getElementById('btn-submit');
if (btnSubmit) btnSubmit.onclick = submitData;

function renderQ() {
    const q = questions[currentQ];
    safeSetText('question-counter', `問題 ${currentQ + 1} / ${questions.length}`);
    const qText = document.getElementById('question-text');
    if (qText) {
        qText.style.opacity = 0; 
        setTimeout(() => { qText.innerText = q.question; qText.style.opacity = 1; }, 200);
    }
    
    const progBar = document.getElementById('progress-bar');
    if (progBar) {
        setTimeout(() => { progBar.style.width = `${(currentQ / questions.length) * 100}%`; }, 100);
    }

    const opts = document.getElementById('options-container');
    if (opts) {
        opts.innerHTML = '';
        q.options.forEach(o => {
            const btn = document.createElement('button');
            btn.className = 'option-btn'; 
            btn.innerText = o.text;
            btn.onclick = () => {
                totalScore += o.score; 
                userAnswers.push({q: q.question, a: o.text}); 
                currentQ++; 
                if (currentQ < questions.length) { 
                    renderQ(); 
                } else {
                    if (progBar) progBar.style.width = '100%';
                    setTimeout(() => switchScreen(screens.question, screens.lead), 600);
                }
            };
            opts.appendChild(btn);
        });
    }
}

async function submitData() {
    const emailInput = document.getElementById('user-email');
    const email = emailInput ? emailInput.value : '';
    if (!email || !email.includes('@')) return alert("請輸入有效的 Email 以接收報告");
    
    const btnSub = document.getElementById('btn-submit');
    const loadingState = document.getElementById('loading-state');
    
    if (btnSub) btnSub.classList.add('hidden');
    if (loadingState) loadingState.classList.remove('hidden');
    
    const riskLevel = totalScore >= 5 ? "高風險" : (totalScore >= 3 ? "中風險" : "低風險");
    const payload = { action: 'submitForm', email: email, score: totalScore, risk: riskLevel, answers: JSON.stringify(userAnswers) };

    try { 
        // 使用 text/plain 避免瀏覽器在 POST 時攔截 CORS preflight
        await fetch(CONFIG.GAS_URL, { 
            method: 'POST', 
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload) 
        }); 
    } catch (e) { console.log(e); } 
    
    setTimeout(() => {
        if (btnSub) btnSub.classList.remove('hidden'); 
        if (loadingState) loadingState.classList.add('hidden');
        showResult(riskLevel);
    }, 800);
}

function showResult(riskLevel) {
    switchScreen(screens.lead, screens.result);
    const resultBox = document.getElementById('result-desc');
    const rTitle = document.getElementById('result-title');
    
    if (riskLevel === "高風險") {
        safeSetText('result-icon', "🚨"); 
        safeSetText('result-title', "警示：屬於高風險族群"); 
        if (rTitle) rTitle.style.color = "var(--danger)"; 
        if (resultBox) {
            resultBox.style.borderColor = "var(--danger)";
            resultBox.innerHTML = "具備多項高風險因子或疑似症狀。<br><br><strong>強烈建議儘速安排專業的腹部影像排查。</strong>";
        }
        safeSetText('result-cta', "就診時可主動詢問醫師是否備有「助胰見 (PANCREASaver)」等 AI 輔助系統協助判讀。");
    } else if (riskLevel === "中風險") {
        safeSetText('result-icon', "⚠️"); 
        safeSetText('result-title', "留意：屬於中風險族群"); 
        if (rTitle) rTitle.style.color = "var(--warning)"; 
        if (resultBox) {
            resultBox.style.borderColor = "var(--warning)";
            resultBox.innerHTML = "具備部分風險因子。改善習慣與定期健檢能降低威脅。"; 
        }
        safeSetText('result-cta', "已將相關衛教資訊發送至信箱。");
    } else {
        safeSetText('result-icon', "✅"); 
        safeSetText('result-title', "安心：屬於低風險族群"); 
        if (rTitle) rTitle.style.color = "var(--success)"; 
        if (resultBox) {
            resultBox.style.borderColor = "var(--success)";
            resultBox.innerHTML = "目前未發現明顯風險因子，請保持良好的生活習慣！"; 
        }
        safeSetText('result-cta', "衛教資訊已寄至您的信箱。");
    }
}