// app.js

// ==========================================
// 0. 網頁捲動動畫引擎 (Scroll Reveal Animation)
// ==========================================
const initAnimations = () => {
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-down, .reveal-scale').forEach(el => {
        observer.observe(el);
    });
};

function getYouTubeId(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

const safeSetText = (id, text) => { const el = document.getElementById(id); if (el) el.innerText = text; };
const safeSetHref = (id, url) => { const el = document.getElementById(id); if (el) el.href = url; };
const safeSetSrc = (id, url) => { const el = document.getElementById(id); if (el) el.src = url; };

document.addEventListener('DOMContentLoaded', async () => {
    initAnimations();

    try {
        const fetchUrl = CONFIG.GAS_URL + "?action=getContent";
        const res = await fetch(fetchUrl, { method: 'GET' });
        const result = await res.json();
        
        if (result.status === 'success' && result.data) {
            if (result.data.news.title) {
                safeSetText('display-news-title', result.data.news.title);
                safeSetText('display-news-summary', result.data.news.summary);
                safeSetHref('display-news-url', result.data.news.url);
                
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
        safeSetText('display-news-title', "別讓胰臟癌輕易宣判死刑！AI 如何在早期攔截這個無聲殺手？");
        safeSetText('display-news-summary', "在醫療圈，只要聽到「胰臟癌」，許多人的第一反應往往是絕望。高居不下的致死率、極低的早期發現率...");
        safeSetText('display-video-title', "介紹「助胰見」 | Introducing PANCREASaver");
        safeSetText('display-video-summary', "PANCREASaver 助胰見能全自動偵測電腦斷層影像中是否有胰臟癌...");
    }
});

const questions = [
    { question: "1. 請問您的年齡是否大於 50 歲？", options: [{ text: "是", score: 1 }, { text: "否", score: 0 }] },
    { question: "2. 您的直系親屬（父母、手足）中，是否有人曾罹患胰臟癌？", options: [{ text: "是，有家族病史", score: 3 }, { text: "否，或不確定", score: 0 }] },
    { question: "3. 您是否有長期抽菸或過量飲酒的習慣？", options: [{ text: "兩者皆有", score: 2 }, { text: "僅有其中一項", score: 1 }, { text: "皆無", score: 0 }] },
    { question: "4. 您是否患有「慢性胰臟炎」，或是「50歲後才新確診為糖尿病」？", options: [{ text: "是，有上述病史", score: 3 }, { text: "否", score: 0 }] },
    { question: "5. 回顧最近三個月，您是否有出現以下任一症狀？\n(無痛性黃疸、不明原因體重驟降、持續上腹痛且蔓延至背部)", options: [{ text: "有出現上述疑似症狀", score: 5 }, { text: "無上述症狀", score: 0 }] }
];

let currentQ = 0, totalScore = 0, userAnswers = [];

const screens = { 
    intro: document.getElementById('intro-screen'), 
    question: document.getElementById('question-screen'), 
    processing: document.getElementById('processing-screen'),
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
    switchScreen(screens.result, screens.intro); 
    const progBar = document.getElementById('progress-bar');
    if (progBar) progBar.style.width = '0%'; 
};

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
                    setTimeout(() => {
                        switchScreen(screens.question, screens.processing);
                        processAndShowResult();
                    }, 600);
                }
            };
            opts.appendChild(btn);
        });
    }
}

function processAndShowResult() {
    const riskLevel = totalScore >= 5 ? "高風險" : (totalScore >= 3 ? "中風險" : "低風險");
    const payload = { action: 'submitForm', email: '未提供 (匿名檢測)', score: totalScore, risk: riskLevel, answers: JSON.stringify(userAnswers) };
    
    fetch(CONFIG.GAS_URL, { 
        method: 'POST', 
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload) 
    }).catch(e => console.log(e)); 
    
    setTimeout(() => {
        showResult(riskLevel);
    }, 1500);
}

function showResult(riskLevel) {
    switchScreen(screens.processing, screens.result);
    const resultBox = document.getElementById('result-desc');
    const rTitle = document.getElementById('result-title');
    
    if (riskLevel === "高風險") {
        safeSetText('result-icon', "🚨"); 
        safeSetText('result-title', "警示：屬於高風險族群"); 
        if (rTitle) rTitle.style.color = "var(--danger)"; 
        if (resultBox) {
            resultBox.style.borderColor = "var(--danger)";
            resultBox.innerHTML = "根據評估，您具備高度風險因子或疑似症狀。<br><br><strong>強烈建議您儘速前往『胃腸肝膽科』進行專業影像排查。</strong>";
        }
        safeSetText('result-cta', "就診時可主動向醫師詢問是否備有「助胰見 (PANCREASaver)」等 AI 輔助系統，協助在電腦斷層中揪出微小病灶。");
    } else if (riskLevel === "中風險") {
        safeSetText('result-icon', "⚠️"); 
        safeSetText('result-title', "留意：屬於中風險族群"); 
        if (rTitle) rTitle.style.color = "var(--warning)"; 
        if (resultBox) {
            resultBox.style.borderColor = "var(--warning)";
            resultBox.innerHTML = "您具備部分風險因子。胰臟癌雖然隱密，但透過定期健檢能有效掌握健康。"; 
        }
        safeSetText('result-cta', "建議安排健檢時，可考慮將腹部電腦斷層 (CT) 列入檢查項目，並多留意我們的衛教專欄文章。");
    } else {
        safeSetText('result-icon', "✅"); 
        safeSetText('result-title', "安心：屬於低風險族群"); 
        if (rTitle) rTitle.style.color = "var(--success)"; 
        if (resultBox) {
            resultBox.style.borderColor = "var(--success)";
            resultBox.innerHTML = "目前未發現明顯風險因子，請繼續保持良好的生活習慣！"; 
        }
        safeSetText('result-cta', "預防勝於治療，建議您將本評估工具分享給身邊滿 50 歲的親友，一同守護健康。");
    }
}