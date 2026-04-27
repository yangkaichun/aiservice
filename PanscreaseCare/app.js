// app.js

// ==========================================
// 🌟 Google Drive 圖片防破圖轉換器
// ==========================================
function getSafeImageUrl(url) {
    if (!url) return '';
    // 將舊版或會被擋的網址自動轉為安全的 thumbnail API 網址
    if (url.includes('drive.google.com')) {
        const match = url.match(/id=([^&]+)/) || url.match(/d\/([^/]+)/);
        if (match && match[1]) {
            return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
        }
    }
    return url;
}

let scrollObserver;
const initAnimations = () => {
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                scrollObserver.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-down, .reveal-scale').forEach(el => {
        scrollObserver.observe(el);
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

window.allArticlesData = [];

document.addEventListener('DOMContentLoaded', async () => {
    initAnimations();
    fetchContent();
    fetchArticles();
});

window.shareToFB = function(title, event) {
    if(event) event.stopPropagation(); 
    const url = encodeURIComponent(window.location.origin + window.location.pathname);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
};

window.shareToLine = function(title, event) {
    if(event) event.stopPropagation();
    const url = encodeURIComponent(window.location.origin + window.location.pathname);
    const text = encodeURIComponent(`分享一篇好文章給你：【${title}】\n`);
    window.open(`https://line.me/R/msg/text/?${text}${url}`, '_blank');
};

// 讀取首頁精選
async function fetchContent() {
    try {
        const res = await fetch(CONFIG.GAS_URL + "?action=getContent", { method: 'GET' });
        const result = await res.json();
        if (result.status === 'success' && result.data) {
            if (result.data.news.title) {
                safeSetText('display-news-title', result.data.news.title);
                safeSetText('display-news-summary', result.data.news.summary);
                safeSetHref('display-news-url', result.data.news.url);
                
                const imgEl = document.getElementById('display-news-img');
                const placeholder = document.getElementById('news-placeholder-text');
                
                if (imgEl && placeholder) {
                    if (result.data.news.image && result.data.news.image.trim() !== '') {
                        // 🌟 套用防破圖轉換與繞過 Referrer 阻擋
                        imgEl.src = getSafeImageUrl(result.data.news.image);
                        imgEl.setAttribute('referrerpolicy', 'no-referrer');
                        imgEl.style.display = 'block';
                        
                        imgEl.onerror = function() {
                            this.style.display = 'none';
                        };
                    } else {
                        imgEl.style.display = 'none';
                    }
                    placeholder.style.display = 'none';
                }
            }
            if (result.data.video.title) {
                safeSetText('display-video-title', result.data.video.title);
                safeSetText('display-video-summary', result.data.video.summary);
                safeSetHref('display-video-url', result.data.video.url); 
                const videoId = getYouTubeId(result.data.video.url);
                if (videoId) safeSetSrc('display-video-iframe', `https://www.youtube.com/embed/${videoId}?rel=0`);
            }
        }
    } catch (e) { console.error("無法讀取首頁內容", e); }
}

// 讀取分類文章
async function fetchArticles() {
    try {
        const res = await fetch(CONFIG.GAS_URL + "?action=getArticles", { method: 'GET' });
        const result = await res.json();
        if (result.status === 'success' && result.data && result.data.length > 0) {
            window.allArticlesData = result.data; 
            renderArticles(result.data);
        }
    } catch (e) { console.error("無法讀取子目錄文章", e); }
}

function renderArticles(articles) {
    const categoryContainers = {
        'about-pancreas': document.getElementById('cat-about-pancreas'),
        'cancer-analysis': document.getElementById('cat-cancer-analysis'),
        'diagnosis': document.getElementById('cat-diagnosis'),
        'treatment': document.getElementById('cat-treatment')
    };

    const hasData = {};
    articles.forEach(a => hasData[a.category] = true);
    for (let cat in hasData) {
        if (categoryContainers[cat]) categoryContainers[cat].innerHTML = ''; 
    }

    articles.forEach((article, index) => {
        const container = categoryContainers[article.category];
        if (!container) return;

        const card = document.createElement('div');
        card.className = `info-card reveal d-${(index % 3) + 1}`; 
        card.onclick = () => { try { openArticleModal(article); } catch (err) {} };
        
        // 🌟 套用防破圖轉換與 referrerpolicy
        const safeImgUrl = getSafeImageUrl(article.image);
        const imgHtml = safeImgUrl ? `<img src="${safeImgUrl}" class="card-img" alt="${article.title}" referrerpolicy="no-referrer" onerror="this.style.display='none'">` : '';
        const rawText = (article.content || '').replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim();
        const summary = rawText.length > 70 ? rawText.substring(0, 70) + '...' : rawText;
        
        card.innerHTML = `
            ${imgHtml}
            <h4>${article.title}</h4>
            <div class="card-desc">${summary}</div>
            <div class="card-footer">
                <div class="read-more-link">閱讀全文 ➔</div>
                <div class="share-actions">
                    <button class="share-btn" onclick="shareToFB('${article.title}', event)"><img src="images/fblogo.jpg" alt="FB" class="share-icon-img"></button>
                    <button class="share-btn" onclick="shareToLine('${article.title}', event)"><img src="images/linglogo.jpg" alt="LINE" class="share-icon-img"></button>
                </div>
            </div>
        `;
        container.appendChild(card);
        if (scrollObserver) scrollObserver.observe(card);
    });
}

// 歷史列表彈窗
window.openListModal = function(type) {
    const titleEl = document.getElementById('list-modal-title');
    const bodyEl = document.getElementById('list-modal-body');
    titleEl.innerText = type === 'news' ? '📰 所有熱門新知' : '🎞️ 所有影音專區';
    bodyEl.innerHTML = '';

    const items = window.allArticlesData.filter(a => a.category === type);
    if (items.length === 0) {
        bodyEl.innerHTML = '<p style="text-align:center; color: var(--text-muted); padding: 20px;">目前尚無歷史資料。</p>';
    } else {
        items.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(item => {
            const rawText = (item.content || '').replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim();
            const summary = rawText.length > 60 ? rawText.substring(0, 60) + '...' : rawText;
            
            let imgHtml = '';
            if (type === 'video') {
                const videoId = getYouTubeId(item.reference);
                const thumbUrl = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : 'images/indeximage.jpg';
                imgHtml = `<div style="position:relative; width: 140px; height: 90px; flex-shrink: 0;"><img src="${thumbUrl}" style="width:100%; height:100%; object-fit:cover; border-radius:8px;"><div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); color:white; background:rgba(0,0,0,0.6); border-radius:50%; width:30px; height:30px; display:flex; align-items:center; justify-content:center; font-size:12px;">▶</div></div>`;
            } else {
                // 🌟 套用防破圖轉換
                const safeImgUrl = getSafeImageUrl(item.image) || 'images/indeximage.jpg';
                imgHtml = `<img src="${safeImgUrl}" style="width: 140px; height: 90px; object-fit: cover; border-radius: 8px; flex-shrink: 0;" referrerpolicy="no-referrer" onerror="this.style.display='none'">`;
            }

            const card = document.createElement('div');
            card.className = "list-item-card";
            card.onclick = () => { if (item.reference) window.open(item.reference, '_blank'); };

            const dateObj = new Date(item.date);
            const dateStr = isNaN(dateObj.getTime()) ? '' : `<span style="font-size: 12px; color: var(--text-muted); margin-bottom: 5px; display:block;">${dateObj.toLocaleDateString('zh-TW')}</span>`;

            card.innerHTML = `
                ${imgHtml}
                <div style="flex: 1; overflow: hidden;">
                    ${dateStr}
                    <h4 style="margin: 0 0 5px 0; color: var(--primary-dark); font-size: 16px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.title}</h4>
                    <p style="margin: 0; font-size: 13px; color: var(--text-muted); line-height: 1.4;">${summary}</p>
                </div>
            `;
            bodyEl.appendChild(card);
        });
    }

    const modal = document.getElementById('list-modal');
    modal.classList.remove('hidden');
    setTimeout(() => { modal.classList.add('show'); }, 10);
    document.body.style.overflow = 'hidden';
}

window.closeListModal = function() {
    const modal = document.getElementById('list-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => { modal.classList.add('hidden'); }, 300);
        if (!document.getElementById('article-modal').classList.contains('show')) { document.body.style.overflow = 'auto'; }
    }
}

const listModalOverlay = document.getElementById('list-modal');
if (listModalOverlay) { listModalOverlay.addEventListener('click', (e) => { if (e.target === listModalOverlay) closeListModal(); }); }

function openArticleModal(article) {
    if (!article) return;
    safeSetText('modal-category', article.subcategory || article.category || '');
    safeSetText('modal-title', article.title || '無標題');
    
    let dateString = '';
    if (article.date) {
        const dateObj = new Date(article.date);
        if (!isNaN(dateObj.getTime())) dateString = `發布時間：${dateObj.toLocaleDateString('zh-TW')}`;
    }
    safeSetText('modal-date', dateString);

    const imgEl = document.getElementById('modal-image');
    if (article.image && article.image.trim() !== '') {
        // 🌟 套用防破圖轉換
        imgEl.src = getSafeImageUrl(article.image);
        imgEl.setAttribute('referrerpolicy', 'no-referrer');
        imgEl.classList.remove('hidden');
        imgEl.style.display = 'block';
    } else { imgEl.classList.add('hidden'); }

    const modalBody = document.getElementById('modal-body');
    if(modalBody) modalBody.innerHTML = article.content || '';

    const refBox = document.getElementById('modal-reference');
    if (refBox) {
        if (article.reference && article.reference.trim() !== '') {
            const refText = article.reference.startsWith('http') ? `<a href="${article.reference}" target="_blank" style="color:var(--primary);">${article.reference}</a>` : article.reference;
            refBox.innerHTML = `<strong>參考來源：</strong> ${refText}`;
            refBox.classList.remove('hidden');
        } else { refBox.classList.add('hidden'); }
    }

    const modal = document.getElementById('article-modal');
    if (modal) { modal.classList.remove('hidden'); setTimeout(() => { modal.classList.add('show'); }, 10); document.body.style.overflow = 'hidden'; }
}

function closeArticleModal() {
    const modal = document.getElementById('article-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => { modal.classList.add('hidden'); }, 300);
        if (!document.getElementById('list-modal').classList.contains('show')) { document.body.style.overflow = 'auto'; }
    }
}

const closeBtn = document.getElementById('close-modal');
const modalOverlay = document.getElementById('article-modal');
if (closeBtn) closeBtn.onclick = closeArticleModal;
if (modalOverlay) { modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeArticleModal(); }); }

// ==========================================
// 自我風險評估邏輯
// ==========================================
const questions = [
    { question: "1. 請問您的年齡是否大於 50 歲？", options: [{ text: "是", score: 1 }, { text: "否", score: 0 }] },
    { question: "2. 您的直系親屬（父母、手足）中，是否有人曾罹患胰臟癌？", options: [{ text: "是，有家族病史", score: 3 }, { text: "否，或不確定", score: 0 }] },
    { question: "3. 您是否有長期抽菸或過量飲酒的習慣？", options: [{ text: "兩者皆有", score: 2 }, { text: "僅有其中一項", score: 1 }, { text: "皆無", score: 0 }] },
    { question: "4. 您是否患有「慢性胰臟炎」，或是「50歲後才新確診為糖尿病」？", options: [{ text: "是，有上述病史", score: 3 }, { text: "否", score: 0 }] },
    { question: "5. 回顧最近三個月，您是否有出現以下任一症狀？\n(無痛性黃疸、不明原因體重驟降、持續上腹痛且蔓延至背部)", options: [{ text: "有出現上述疑似症狀", score: 5 }, { text: "無上述症狀", score: 0 }] }
];

let currentQ = 0, totalScore = 0, userAnswers = [];
const screens = { intro: document.getElementById('intro-screen'), question: document.getElementById('question-screen'), processing: document.getElementById('processing-screen'), result: document.getElementById('result-screen') };

function switchScreen(hide, show) {
    if (!hide || !show) return;
    hide.style.opacity = '0';
    setTimeout(() => { hide.classList.add('hidden'); hide.classList.remove('active'); show.classList.remove('hidden'); show.classList.add('active'); setTimeout(() => { show.style.opacity = '1'; }, 50); }, 300); 
}

const btnStart = document.getElementById('btn-start');
if (btnStart) btnStart.onclick = () => { switchScreen(screens.intro, screens.question); renderQ(); };

const btnRestart = document.getElementById('btn-restart');
if (btnRestart) btnRestart.onclick = () => { currentQ = 0; totalScore = 0; userAnswers = []; switchScreen(screens.result, screens.intro); const progBar = document.getElementById('progress-bar'); if (progBar) progBar.style.width = '0%'; };

function renderQ() {
    const q = questions[currentQ];
    safeSetText('question-counter', `問題 ${currentQ + 1} / ${questions.length}`);
    const qText = document.getElementById('question-text');
    if (qText) { qText.style.opacity = 0; setTimeout(() => { qText.innerText = q.question; qText.style.opacity = 1; }, 200); }
    const progBar = document.getElementById('progress-bar');
    if (progBar) setTimeout(() => { progBar.style.width = `${(currentQ / questions.length) * 100}%`; }, 100);

    const opts = document.getElementById('options-container');
    if (opts) {
        opts.innerHTML = '';
        q.options.forEach(o => {
            const btn = document.createElement('button'); btn.className = 'option-btn'; btn.innerText = o.text;
            btn.onclick = () => {
                totalScore += o.score; userAnswers.push({q: q.question, a: o.text}); currentQ++; 
                if (currentQ < questions.length) renderQ(); 
                else { if (progBar) progBar.style.width = '100%'; setTimeout(() => { switchScreen(screens.question, screens.processing); processAndShowResult(); }, 600); }
            };
            opts.appendChild(btn);
        });
    }
}

function processAndShowResult() {
    const riskLevel = totalScore >= 5 ? "高風險" : (totalScore >= 3 ? "中風險" : "低風險");
    const payload = { action: 'submitForm', email: '未提供 (匿名檢測)', score: totalScore, risk: riskLevel, answers: JSON.stringify(userAnswers) };
    fetch(CONFIG.GAS_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) }).catch(e => console.log(e)); 
    setTimeout(() => { showResult(riskLevel); }, 1500);
}

function showResult(riskLevel) {
    switchScreen(screens.processing, screens.result);
    const resultBox = document.getElementById('result-desc'); const rTitle = document.getElementById('result-title');
    if (riskLevel === "高風險") {
        safeSetText('result-icon', "🚨"); safeSetText('result-title', "警示：屬於高風險族群"); if (rTitle) rTitle.style.color = "var(--danger)"; 
        if (resultBox) { resultBox.style.borderColor = "var(--danger)"; resultBox.innerHTML = "根據評估，您具備高度風險因子或疑似症狀。<br><br><strong>強烈建議您儘速前往『胃腸肝膽科』進行專業影像排查。</strong>"; }
        safeSetText('result-cta', "就診時可主動向醫師詢問是否備有「助胰見 (PANCREASaver)」等 AI 輔助系統，協助在電腦斷層中揪出微小病灶。");
    } else if (riskLevel === "中風險") {
        safeSetText('result-icon', "⚠️"); safeSetText('result-title', "留意：屬於中風險族群"); if (rTitle) rTitle.style.color = "var(--warning)"; 
        if (resultBox) { resultBox.style.borderColor = "var(--warning)"; resultBox.innerHTML = "您具備部分風險因子。胰臟癌雖然隱密，但透過定期健檢能有效掌握健康。"; }
        safeSetText('result-cta', "建議安排健檢時，可考慮將腹部電腦斷層 (CT) 列入檢查項目，並多留意我們的衛教專欄文章。");
    } else {
        safeSetText('result-icon', "✅"); safeSetText('result-title', "安心：屬於低風險族群"); if (rTitle) rTitle.style.color = "var(--success)"; 
        if (resultBox) { resultBox.style.borderColor = "var(--success)"; resultBox.innerHTML = "目前未發現明顯風險因子，請繼續保持良好的生活習慣！"; }
        safeSetText('result-cta', "預防勝於治療，建議您將本評估工具分享給身邊滿 50 歲的親友，一同守護健康。");
    }
}