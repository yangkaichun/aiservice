/**
 * HeyGen API Configuration & Helper Functions
 * 取代原有的 D-ID 邏輯，改用 HeyGen Talking Photo API v2
 */

const HEYGEN_CONFIG = {
    // 您提供的 HeyGen API Key
    API_KEY: "sk_V2_hgu_kSpjn87oKgN_ianxihtBBD8Ml0rzlfp05chlDCAaqZ4S",
    // 建立影片任務 API (Talking Photo)
    GENERATE_URL: "https://api.heygen.com/v2/video/generate",
    // 檢查狀態 API
    STATUS_URL: "https://api.heygen.com/v1/video_status.get"
};

/**
 * 建立 HeyGen 說話任務
 * @param {string} text - 要朗讀的文字
 * @param {string} sourceUrl - Avatar 圖片的完整公開網址 (必須是 Public URL)
 */
async function createHeyGenTask(text, sourceUrl) {
    const response = await fetch(HEYGEN_CONFIG.GENERATE_URL, {
        method: 'POST',
        headers: {
            'X-Api-Key': HEYGEN_CONFIG.API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            video_inputs: [
                {
                    character: {
                        type: "talking_photo",
                        avatar_url: sourceUrl
                    },
                    voice: {
                        type: "text",
                        input_text: text,
                        // 預設使用台灣中文女聲 (若 HeyGen 不支援此 ID，請更換為 HeyGen 列表中的有效 voice_id)
                        // 常見 HeyGen 中文 ID 範例: "c0c32607530846069905d63f03672522" 或類似
                        // 這裡嘗試指定 provider (視 HeyGen 支援度而定，若失敗請改用純 ID)
                        voice_id: "c0c32607530846069905d63f03672522" 
                    }
                }
            ],
            dimension: {
                width: 1280,
                height: 720
            }
        })
    });

    if (!response.ok) {
        const err = await response.json();
        console.error("HeyGen Create Error:", err);
        throw new Error(err.message || "HeyGen API 請求失敗");
    }

    const data = await response.json();
    // HeyGen v2 回傳的是 data.data.video_id
    return data.data.video_id; 
}

/**
 * 檢查影片生成狀態
 * @param {string} videoId - 任務 ID
 */
async function getHeyGenStatus(videoId) {
    const url = `${HEYGEN_CONFIG.STATUS_URL}?video_id=${videoId}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'X-Api-Key': HEYGEN_CONFIG.API_KEY,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) throw new Error("無法取得 HeyGen 狀態");
    return await response.json();
}

/**
 * 主流程：建立並等待影片完成 (供 dashboard2.html 呼叫)
 */
async function generateAndPollVideo(text, imageUrl) {
    console.log("Starting HeyGen process with image:", imageUrl);
    
    // 1. 建立任務
    const videoId = await createHeyGenTask(text, imageUrl);
    console.log("HeyGen Video ID:", videoId);

    // 2. 輪詢直到完成 (每隔 3 秒檢查一次，HeyGen 生成較慢)
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 60; // 最多等待 3 分鐘

        const interval = setInterval(async () => {
            attempts++;
            try {
                const resp = await getHeyGenStatus(videoId);
                const status = resp.data.status;
                console.log(`HeyGen Status (${attempts}):`, status);

                if (status === "completed") {
                    clearInterval(interval);
                    // 回傳影片網址
                    resolve(resp.data.video_url);
                } else if (status === "failed" || status === "error") {
                    clearInterval(interval);
                    reject(new Error("HeyGen 影片生成失敗: " + (resp.data.error || "未知錯誤")));
                } else if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    reject(new Error("生成逾時，請稍後再試"));
                }
                // 若是 "pending" 或 "processing" 則繼續等待
            } catch (err) {
                console.error("Polling Error:", err);
                // 網路錯誤不一定代表生成失敗，繼續嘗試
                if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    reject(err);
                }
            }
        }, 3000); 
    });
}