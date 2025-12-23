/**
 * loading.js - YangHome Health UI/UX Core (Fix v2)
 * 修復：解決快速載入時導致動畫無法關閉的問題
 */

(function() {
    // 1. 定義樣式
    const loaderStyles = `
        #global-loader-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #312e81 100%);
            z-index: 99999;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            transition: opacity 0.5s ease-out, visibility 0.5s;
        }
        .loader-hidden { opacity: 0; visibility: hidden; pointer-events: none; }

        /* Logo 動畫 */
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

        /* 旋轉圈 */
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

    // 3. 準備 HTML
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

    // 4. 定義全域隱藏函式 (最重要)
    window.hideLoading = function() {
        const overlay = document.getElementById('global-loader-overlay');
        if (overlay) {
            overlay.classList.add('loader-hidden');
            document.body.style.overflow = ''; // 解鎖滾動
            setTimeout(() => {
                if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
            }, 600);
        }
    };

    // 5. 全域函式：Dashboard 用的 Loader HTML
    window.getLoaderHTML = function() {
        return `
            <div class="tech-loader" style="position:relative; width:80px; height:80px; display:flex; align-items:center; justify-content:center;">
                <div class="loader-ring"></div>
                <div class="loader-ring" style="width:70%; height:70%; border-color:transparent #06b6d4 transparent #8b5cf6;"></div>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4338ca" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity" style="animation: pulse 1s infinite;"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <p style="margin-top:1rem; color:#4f46e5; font-weight:bold; letter-spacing:0.1em; font-size:0.8rem; animation:pulse 2s infinite;">SYNCING DATA...</p>
        `;
    };

    // 6. 注入 DOM (安全模式)
    function inject() {
        if (document.getElementById('global-loader-overlay')) return; // 避免重複
        const loaderDiv = document.createElement("div");
        loaderDiv.id = "global-loader-overlay";
        loaderDiv.innerHTML = loaderHTML;
        document.body.prepend(loaderDiv);
        document.body.style.overflow = 'hidden';
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inject);
    } else {
        inject();
    }

    // 7. 強制安全閥 (15秒後無論如何強制關閉，避免永遠卡死)
    setTimeout(() => {
        if (document.getElementById('global-loader-overlay')) {
            console.warn("Loader forced close by timeout protection.");
            window.hideLoading();
        }
    }, 15000);

})();