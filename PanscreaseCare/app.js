// app.js
const questions = [
    { question: "您的家族中（一等親）是否有胰臟癌病史？", options: [{ text: "是", score: 3 }, { text: "否", score: 0 }, { text: "不確定", score: 0 }] },
    { question: "您是否患有糖尿病，且為近期（50歲後）才初次確診？", options: [{ text: "是", score: 3 }, { text: "否，或已罹患多年", score: 0 }] },
    { question: "您是否有抽菸或過量飲酒的習慣？", options: [{ text: "兩者皆有", score: 2 }, { text: "其中一項", score: 1 }, { text: "皆無", score: 0 }] },
    { question: "近期是否出現：無痛性黃疸、不明原因上腹痛或背痛、體重無故驟降？", options: [{ text: "有出現", score: 5 }, { text: "無", score: 0 }] }
];

let currentQ = 0, totalScore = 0, userAnswers = [];

const screens = {
    intro: document.getElementById('intro-screen'),
    question: document.getElementById('question-screen'),
    lead: document.getElementById('lead-screen'),
    result: document.getElementById('result-screen')
};

document.getElementById('btn-start').onclick = () => { switchScreen(screens.intro, screens.question); renderQ(); };
document.getElementById('btn-restart').onclick = () => { currentQ = 0; totalScore = 0; userAnswers = []; document.getElementById('user-email').value = ''; switchScreen(screens.result, screens.intro); };
document.getElementById('btn-submit').onclick = submitData;

function switchScreen(hide, show) { hide.classList.add('hidden'); hide.classList.remove('active'); show.classList.remove('hidden'); show.classList.add('active'); }

function renderQ() {
    const q = questions[currentQ];
    document.getElementById('question-counter').innerText = `問題 ${currentQ + 1} / ${questions.length}`;
    document.getElementById('question-text').innerText = q.question;
    document.getElementById('progress-bar').style.width = `${(currentQ / questions.length) * 100}%`;
    const opts = document.getElementById('options-container');
    opts.innerHTML = '';
    q.options.forEach(o => {
        const btn = document.createElement('button');
        btn.className = 'option-btn'; btn.innerText = o.text;
        btn.onclick = () => { totalScore += o.score; userAnswers.push({q: q.question, a: o.text}); currentQ++; currentQ < questions.length ? renderQ() : (document.getElementById('progress-bar').style.width = '100%', setTimeout(() => switchScreen(screens.question, screens.lead), 300)); };
        opts.appendChild(btn);
    });
}

async function submitData() {
    const email = document.getElementById('user-email').value;
    if (!email || !email.includes('@')) return alert("請輸入有效的 Email");
    
    document.getElementById('btn-submit').classList.add('hidden');
    document.getElementById('loading-msg').classList.remove('hidden');

    const risk = totalScore >= 5 ? "高風險" : (totalScore >= 3 ? "中風險" : "低風險");
    const payload = { email, score: totalScore, risk, answers: JSON.stringify(userAnswers) };

    try {
        await fetch(CONFIG.GAS_URL, { method: 'POST', body: JSON.stringify(payload) });
    } catch (e) { console.log(e); } // 略過CORS報錯維持前端運行
    
    document.getElementById('btn-submit').classList.remove('hidden');
    document.getElementById('loading-msg').classList.add('hidden');
    showResult(risk);
}

function showResult(riskLevel) {
    switchScreen(screens.lead, screens.result);
    const title = document.getElementById('result-title');
    const desc = document.getElementById('result-desc');
    const cta = document.getElementById('result-cta');

    if (riskLevel === "高風險") {
        title.innerText = "⚠️ 高風險族群"; title.style.color = "#ef4444";
        desc.innerHTML = "建議儘速安排專業影像排查。";
        cta.innerHTML = "就診時可詢問醫師是否備有「助胰見」等 AI 系統，協助揪出微小病灶。";
    } else if (riskLevel === "中風險") {
        title.innerText = "⚠️ 中風險族群"; title.style.color = "#f59e0b";
        desc.innerHTML = "具備部分風險因子，請改善生活習慣並定期健檢。";
        cta.innerHTML = "我們已將專題發送至您的信箱，也歡迎前往方格子專欄閱讀更多分析。";
    } else {
        title.innerText = "✅ 低風險族群"; title.style.color = "#10b981";
        desc.innerHTML = "未發現明顯風險，請保持良好習慣！";
        cta.innerHTML = "衛教資訊已寄至信箱，歡迎分享給親友。";
    }
}