/**
 * HeyGen API Configuration & Helper Functions
 * 負責處理 HeyGen Talking Photo API v2 的串接
 * 修正重點：先註冊 Talking Photo ID，再生成影片
 */

const HEYGEN_CONFIG = {
    // 您的新 API Key
    API_KEY: "sk_V2_hgu_kSpjn87oKgN_ianxihtBBD8Ml0rzlfp05chlDCAaqZ4S",
    
    // API Endpoints
    // 1. 註冊 Talking Photo (從 URL)
    REGISTER_PHOTO_URL: "https://api.heygen.com/v2/talking_photos",
    // 2. 建立影片任務
    GENERATE_URL: "https://api.heygen.com/v2/video/generate",
    // 3. 檢查狀態
    STATUS_URL: "https://api.heygen.com/v1/video_status.get"
};

/**
 * 步驟 1: 將圖片 URL 註冊為 Talking Photo，取得 ID
 */
async function registerTalkingPhoto(imageUrl) {
    console.log("1. 正在註冊 Talking Photo...", imageUrl);

    const response = await fetch(HEYGEN_CONFIG.REGISTER_PHOTO_URL, {
        method: 'POST',
        headers: {
            'X-Api-Key': HEYGEN_CONFIG.API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            url: imageUrl
        })
    });

    if (!response.ok) {
        const errText = await response.text();
        console.error("Register Error:", errText);
        throw new Error("圖片註冊失敗: " + response.statusText);
    }

    const data = await response.json();
    console.log("Register Success, Talking Photo ID:", data.data.talking_photo_id);
    return data.data.talking_photo_id;
}

/**
 * 步驟 2: 建立影片生成任務
 */
async function createHeyGenTask(text, talkingPhotoId) {
    console.log("2. 正在建立影片任務 (ID: " + talkingPhotoId + ")...");

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
                        talking_photo_id: talkingPhotoId
                    },
                    voice: {
                        type: "text",
                        input_text: text,
                        // 使用 HeyGen 的通用中文語音 ID (Microsoft Xiaoxiao)
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
        const errText = await response.text();
        console.error("Generate Error:", errText);
        throw new Error("建立任務失敗: " + errText);
    }

    const data = await response.json();
    return data.data.video_id;
}

/**
 * 步驟 3: 輪詢狀態直到完成
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

    if (!response.ok) throw new Error("無法取得狀態");
    return await response.json();
}

/**
 * 主流程函式 (被 HTML 呼叫)
 */
async function generateAndPollVideo(text, imageUrl) {
    try {
        // 1. 註冊圖片為 Talking Photo (取得正確的 ID)
        const talkingPhotoId = await registerTalkingPhoto(imageUrl);
        
        // 2. 建立任務
        const videoId = await createHeyGenTask(text, talkingPhotoId);
        console.log("Task ID:", videoId);

        // 3. 輪詢
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 100; // 5分鐘逾時 (HeyGen 有時較慢)

            const interval = setInterval(async () => {
                attempts++;
                try {
                    const resp = await getHeyGenStatus(videoId);
                    const status = resp.data ? resp.data.status : "unknown";
                    console.log(`Status (${attempts}):`, status);

                    if (status === "completed") {
                        clearInterval(interval);
                        resolve(resp.data.video_url);
                    } else if (status === "failed" || status === "error") {
                        clearInterval(interval);
                        const errMsg = resp.data.error?.message || resp.data.error || "未知錯誤";
                        reject(new Error("生成失敗: " + errMsg));
                    } else if (attempts >= maxAttempts) {
                        clearInterval(interval);
                        reject(new Error("生成逾時"));
                    }
                } catch (err) {
                    console.error("Polling Error:", err);
                }
            }, 3000); // 每 3 秒檢查一次
        });
    } catch (e) {
        console.error("Process Error:", e);
        throw e;
    }
}