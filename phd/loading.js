/**
 * loading.js - 全域酷炫載入動畫模組
 * 功能：自動注入 CSS 與 HTML，並提供 window.hideLoading() 解除鎖定
 */

(function() {
    // 1. 定義酷炫動畫的 CSS
    const loaderStyles = `
        #global-loader-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #312e81 100%);
            z-index: 99999; /* 確保在最上層 */
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.8s;
        }
        
        .loader-hidden { opacity: 0; visibility: hidden; pointer-events: none; }

        /* Logo 動畫 */
        .loader-logo {
            width: 120px; height: 120px;
            filter: drop-shadow(0 0 15px rgba(99, 102, 241, 0.6));
            animation: loaderHeartbeat 2s ease-in-out infinite;
        }
        @media (min-width: 768px) { .loader-logo { width: 150px; height: 150px; } }

        @keyframes loaderHeartbeat {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); filter: drop-shadow(0 0 25px rgba(244, 63, 94, 0.8)); }
            100% { transform: scale(1); }
        }

        /* 載入圈圈 (Tech Ring) */
        .loader-ring-container { position: relative; width: 60px; height: 60px; margin-top: 2rem; }
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

        /* 文字動畫 */
        .loader-text {
            margin-top: 1rem; font-family: 'Inter', sans-serif;
            font-size: 0.9rem; letter-spacing: 0.3em; color: #818cf8;
            animation: loaderTextPulse 2s ease-in-out infinite;
            font-weight: bold;
        }
        @keyframes loaderTextPulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
    `;

    // 2. 注入 CSS 到 Head
    const styleSheet = document.createElement("style");
    styleSheet.innerText = loaderStyles;
    document.head.appendChild(styleSheet);

    // 3. 注入 HTML 到 Body 開頭
    // 注意：這裡假設圖片路徑是 image/yanghealth.png，若路徑不同請修改
    const loaderHTML = `
        <div class="relative">
            <div class="absolute inset-0 bg-indigo-500 blur-[60px] opacity-20 rounded-full animate-pulse"></div>
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
    
    // 確保 DOM 載入後插入 (若 script 放在 head，需等待 body)
    if (document.body) {
        document.body.prepend(loaderDiv);
        document.body.style.overflow = 'hidden'; // 鎖定滾動
    } else {
        window.addEventListener('DOMContentLoaded', () => {
            document.body.prepend(loaderDiv);
            document.body.style.overflow = 'hidden';
        });
    }

    // 4. 定義全域隱藏函式 (讓其他頁面呼叫)
    window.hideLoading = function() {
        const overlay = document.getElementById('global-loader-overlay');
        if (overlay) {
            overlay.classList.add('loader-hidden');
            document.body.style.overflow = ''; // 解除鎖定
            
            // 動畫結束後移除元素 (節省記憶體)
            setTimeout(() => {
                overlay.remove();
            }, 1000);
        }
    };

    // 5. 安全機制：如果 10 秒都沒有資料回應，強制關閉 (避免永久卡死)
    setTimeout(() => {
        if (document.getElementById('global-loader-overlay')) {
            console.warn("Loading timeout, forcing hide.");
            window.hideLoading();
        }
    }, 5000);

})();