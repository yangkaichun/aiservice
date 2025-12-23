/**
 * loading.js - 全域酷炫載入動畫模組
 * 功能：注入動畫層，並提供 hideLoading() 供主程式在資源載入完畢後呼叫
 */

(function() {
    // 1. 定義酷炫動畫 CSS (RWD + Tech Style)
    const loaderStyles = `
        #global-loader-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #312e81 100%);
            z-index: 99999;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.8s;
        }
        
        .loader-hidden { opacity: 0; visibility: hidden; pointer-events: none; }

        /* Logo 呼吸燈效果 */
        .loader-logo {
            width: 120px; height: 120px;
            filter: drop-shadow(0 0 15px rgba(99, 102, 241, 0.6));
            animation: loaderHeartbeat 2s ease-in-out infinite;
        }
        @media (min-width: 768px) { .loader-logo { width: 160px; height: 160px; } }

        @keyframes loaderHeartbeat {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); filter: drop-shadow(0 0 30px rgba(244, 63, 94, 0.9)); }
            100% { transform: scale(1); }
        }

        /* 科技感旋轉圈 */
        .loader-ring-container { position: relative; width: 70px; height: 70px; margin-top: 2rem; }
        .loader-ring {
            position: absolute; border-radius: 50%; border: 3px solid transparent;
            border-top-color: #a5b4fc; border-bottom-color: #ec4899;
            width: 100%; height: 100%; animation: loaderSpin 1.5s linear infinite;
        }
        .loader-ring:nth-child(2) {
            width: 70%; height: 70%; top: 15%; left: 15%;
            border: 3px solid transparent;
            border-left-color: #06b6d4; border-right-color: #8b5cf6;
            animation: loaderSpinReverse 1s linear infinite;
        }

        @keyframes loaderSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes loaderSpinReverse { 0% { transform: rotate(0deg); } 100% { transform: rotate(-360deg); } }

        /* 文字閃爍 */
        .loader-text {
            margin-top: 1rem; font-family: 'Inter', sans-serif;
            font-size: 0.8rem; letter-spacing: 0.3em; color: #818cf8;
            font-weight: bold; animation: loaderTextPulse 2s ease-in-out infinite;
        }
        @keyframes loaderTextPulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
    `;

    // 2. 注入 CSS
    const styleSheet = document.createElement("style");
    styleSheet.innerText = loaderStyles;
    document.head.appendChild(styleSheet);

    // 3. 注入 HTML
    const loaderHTML = `
        <div class="relative">
            <div class="absolute inset-0 bg-indigo-500 blur-[80px] opacity-20 rounded-full animate-pulse"></div>
            <img src="image/yanghealth.png" class="loader-logo relative z-10" alt="Loading...">
        </div>
        <div class="loader-ring-container">
            <div class="loader-ring"></div>
            <div class="loader-ring"></div>
        </div>
        <p class="loader-text">SYSTEM LOADING...</p>
    `;

    const loaderDiv = document.createElement("div");
    loaderDiv.id = "global-loader-overlay";
    loaderDiv.innerHTML = loaderHTML;
    
    // 確保插入 Body 並鎖定滾動
    const injectLoader = () => {
        document.body.prepend(loaderDiv);
        document.body.style.overflow = 'hidden'; 
    };

    if (document.body) injectLoader();
    else window.addEventListener('DOMContentLoaded', injectLoader);

    // 4. 定義全域隱藏函式 (Window Hide Function)
    window.hideLoading = function() {
        const overlay = document.getElementById('global-loader-overlay');
        if (overlay && !overlay.classList.contains('loader-hidden')) {
            // 為了視覺平滑，至少給 500ms 的緩衝，避免一閃而過
            // 如果您希望「完全無延遲」，請將下方的 500 改為 0
            setTimeout(() => {
                overlay.classList.add('loader-hidden');
                document.body.style.overflow = ''; // 解除鎖定
                setTimeout(() => overlay.remove(), 1000); // 清除 DOM
            }, 500); 
        }
    };

    // 5. 安全機制：20秒超時強制關閉 (避免網路太慢卡死)
    setTimeout(() => {
        if (document.getElementById('global-loader-overlay')) window.hideLoading();
    }, 20000);

})();