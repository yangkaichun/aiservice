/**
 * HeyGen API Configuration & Helper Functions
 * 負責處理 HeyGen Talking Photo API v2 的串接
 */

const HEYGEN_CONFIG = {
    // [修正] 移除了錯誤的前綴 "did.js"，保留正確的 sk_ 開頭 Key
    API_KEY: "sk_V2_hgu_kSpjn87oKgN_ianxihtBBD8Ml0rzlfp05chlDCAaqZ4S",
    
    // 建立影片任務 API (Talking Photo)
    GENERATE_URL: "https://api.heygen.com/v2/video/generate",
    
    // 檢查狀態 API
    STATUS_URL: "https://api.heygen.com/v1/video_status.get"
};

/**
 * 建立 HeyGen 說話任務
 * @param {string} text - 要朗讀的文字
 * @param {string} sourceUrl - Avatar 圖片的完整公開網址
 */
async function createHeyGenTask(text, sourceUrl) {
    console.log("正在呼叫 HeyGen API...");
    console.log("Text:", text.substring(0, 20) + "...");
    console.log("Image:", sourceUrl);

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
                        // 使用通用中文語音 ID (若此 ID 無效，API 會報錯，屆時需更換)
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
        // 嘗試讀取錯誤訊息
        const errText = await response.text();
        console.error("HeyGen API Error Response:", errText);
        
        let errMsg = "HeyGen API 請求失敗";
        try {
            const errJson = JSON.parse(errText);
            errMsg += ": " + (errJson.message || errJson.error?.message || "未知錯誤");
        } catch(e) {
            errMsg += ": " + response.statusText;
        }
        throw new Error(errMsg);
    }

    const data = await response.json();
    console.log("HeyGen Task Created:", data);
    
    // HeyGen v2 回傳結構通常是 data.data.video_id
    if (data.data && data.data.video_id) {
        return data.data.video_id;
    } else {
        throw new Error("無法取得 Video ID，API 回傳格式可能已變更");
    }
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

    if (!response.ok) throw new Error("無法取得 HeyGen 狀態: " + response.statusText);
    return await response.json();
}

/**
 * 主流程：建立並等待影片完成
 */
async function generateAndPollVideo(text, imageUrl) {
    // 1. 建立任務
    const videoId = await createHeyGenTask(text, imageUrl);
    console.log("HeyGen Video ID:", videoId);

    // 2. 輪詢直到完成 (每隔 3 秒檢查一次，最多 2 分鐘)
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 40; 

        const interval = setInterval(async () => {
            attempts++;
            try {
                const resp = await getHeyGenStatus(videoId);
                const status = resp.data ? resp.data.status : "unknown";
                console.log(`HeyGen Status (${attempts}):`, status);

                if (status === "completed") {
                    clearInterval(interval);
                    resolve(resp.data.video_url);
                } else if (status === "failed" || status === "error") {
                    clearInterval(interval);
                    reject(new Error("影片生成失敗: " + (resp.data.error || "未知原因")));
                } else if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    reject(new Error("生成逾時 (超過 2 分鐘)"));
                }
            } catch (err) {
                console.error("Polling Error:", err);
                // 網路錯誤不中斷，繼續重試直到逾時
                if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    reject(err);
                }
            }
        }, 3000); 
    });
}