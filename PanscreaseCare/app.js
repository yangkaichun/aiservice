// app.js
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
    hide.style.opacity = '0';
    setTimeout(() => {
        hide.classList.add('hidden');
        hide.classList.remove('active');
        show.classList.remove('hidden');
        show.classList.add('active');
        setTimeout(() => { show.style.opacity = '1'; }, 50);
    }, 300); 
}

document.getElementById('btn-start').onclick = () => { 
    switchScreen(screens.intro, screens.question); 
    renderQ(); 
};

document.getElementById('btn-restart').onclick = () => { 
    currentQ = 0; totalScore = 0; userAnswers = []; 
    document.getElementById('user-email').value = ''; 
    switchScreen(screens.result, screens.intro); 
    document.getElementById('progress-bar').style.width = '0%';
};

document.getElementById('btn-submit').onclick = submitData;

function renderQ() {
    const q = questions[currentQ];
    document.getElementById('question-counter').innerText = `問題 ${currentQ + 1} / ${questions.length}`;
    
    const qText = document.getElementById('question-text');
    qText.style.opacity = 0; 
    setTimeout(() => {
        qText.innerText = q.question;
        qText.style.opacity = 1;
    }, 200);

    setTimeout(() => {
        document.getElementById('progress-bar').style.width = `${(currentQ / questions.length) * 100}%`;
    }, 100);

    const opts = document.getElementById('options-container');
    opts.innerHTML = '';
    q.options.forEach(o => {
        const btn = document.createElement('button');
        btn.className = 'option-btn'; 
        btn.innerText = o.text;
        btn.onclick = () => handleAnswer(q.question, o);
        opts.appendChild(btn);
    });
}

function handleAnswer(questionText, option) {
    totalScore += option.score; 
    userAnswers.push({q: questionText, a: option.text}); 
    currentQ++; 

    if (currentQ < questions.length) {
        renderQ();
    } else {
        document.getElementById('progress-bar').style.width = '100%';
        setTimeout(() => switchScreen(screens.question, screens.lead), 600);
    }
}

async function submitData() {
    const email = document.getElementById('user-email').value;
    if (!email || !email.includes('@')) {
        alert("請輸入有效的 Email 以接收報告");
        return;
    }
    
    document.getElementById('btn-submit').classList.add('hidden');
    document.getElementById('loading-state').classList.remove('hidden');

    const risk = totalScore >= 5 ? "高風險" : (totalScore >= 3 ? "中風險" : "低風險");
    const payload = { email, score: totalScore, risk, answers: JSON.stringify(userAnswers) };

    try {
        await fetch(CONFIG.GAS_URL, { method: 'POST', body: JSON.stringify(payload) });
    } catch (e) { 
        console.log("CORS/Network Notice: ", e); 
    } 
    
    setTimeout(() => {
        document.getElementById('btn-submit').classList.remove('hidden');
        document.getElementById('loading-state').classList.add('hidden');
        showResult(risk);
    }, 800);
}

function showResult(riskLevel) {
    switchScreen(screens.lead, screens.result);
    const title = document.getElementById('result-title');
    const desc = document.getElementById('result-desc');
    const cta = document.getElementById('result-cta');
    const icon = document.getElementById('result-icon');
    const resultBox = document.getElementById('result-desc');

    if (riskLevel === "高風險") {
        icon.innerText = "🚨";
        title.innerText = "警示：屬於高風險族群"; 
        title.style.color = "var(--danger)";
        resultBox.style.borderColor = "var(--danger)";
        desc.innerHTML = "根據評估，您具備多項高風險因子或疑似症狀。<br><br><strong>強烈建議您儘速安排專業的腹部影像排查。</strong>";
        cta.innerHTML = "就診時可主動向醫師詢問是否備有<strong>「助胰見 (PANCREASaver)」</strong>等 AI 輔助系統，協助在 CT 影像中揪出微小病灶。";
    } else if (riskLevel === "中風險") {
        icon.innerText = "⚠️";
        title.innerText = "留意：屬於中風險族群"; 
        title.style.color = "var(--warning)";
        resultBox.style.borderColor = "var(--warning)";
        desc.innerHTML = "您具備部分風險因子。胰臟癌雖然隱密，但透過改善生活習慣與定期健檢，能有效降低威脅。";
        cta.innerHTML = "我們已將相關專題發送至您的信箱，也歡迎前往我們的方格子專欄閱讀更多預防醫學的文章。";
    } else {
        icon.innerText = "✅";
        title.innerText = "安心：屬於低風險族群"; 
        title.style.color = "var(--success)";
        resultBox.style.borderColor = "var(--success)";
        desc.innerHTML = "目前未發現明顯風險因子，請繼續保持良好的生活習慣！";
        cta.innerHTML = "預防勝於治療，衛教資訊已寄至您的信箱。歡迎將本網頁分享給關心的親友。";
    }
}