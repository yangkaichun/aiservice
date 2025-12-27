/**
 * HeyGen API Configuration & Helper Functions
 * 負責處理 HeyGen Talking Photo API v2 的串接 (包含自動上傳圖片)
 */

const HEYGEN_CONFIG = {
    // 使用您指定的 API Key
    API_KEY: "sk_V2_hgu_kSpjn87oKgN_ianxihtBBD8Ml0rzlfp05chlDCAaqZ4S",
    
    // API Endpoints
    UPLOAD_URL: "https://upload.heygen.com/v1/asset",
    GENERATE_URL: "https://api.heygen.com/v2/video/generate",
    STATUS_URL: "https://api.heygen.com/v1/video_status.get"
};

/**
 * 步驟 1: 上傳圖片到 HeyGen 取得 ID
 * HeyGen v2 必須使用 ID，不支援直接傳 URL
 */
async function uploadImageToHeyGen(imageUrl) {
    console.log("1. 正在下載並上傳 Avatar 圖片...", imageUrl);
    
    // 1. 先從本地/網路抓取圖片轉為 Blob
    const imgResp = await fetch(imageUrl);
    if (!imgResp.ok) throw new Error("無法讀取本地 Avatar 圖片");
    const blob = await imgResp.blob();

    // 2. 上傳到 HeyGen
    const response = await fetch(HEYGEN_CONFIG.UPLOAD_URL, {
        method: 'POST',
        headers: {
            'X-Api-Key': HEYGEN_CONFIG.API_KEY,
            'Content-Type': blob.type // e.g., image/png
        },
        body: blob
    });

    if (!response.ok) {
        const errText = await response.text();
        console.error("Upload Error:", errText);
        throw new Error("圖片上傳失敗: " + response.statusText);
    }

    const data = await response.json();
    console.log("Upload Success, ID:", data.data.id);
    return data.data.id;
}

/**
 * 步驟 2: 建立影片生成任務
 */
async function createHeyGenTask(text, imageId) {
    console.log("2. 正在建立影片任務...");

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
                        // 關鍵修正：這裡必須用 talking_photo_id
                        talking_photo_id: imageId
                    },
                    voice: {
                        type: "text",
                        input_text: text,
                        // 使用 HeyGen 的通用中文語音 ID
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
        // 1. 上傳圖片
        const imageId = await uploadImageToHeyGen(imageUrl);
        
        // 2. 建立任務
        const videoId = await createHeyGenTask(text, imageId);
        console.log("Task ID:", videoId);

        // 3. 輪詢
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 60; // 3分鐘逾時

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
                        reject(new Error("生成失敗: " + (resp.data.error?.message || "未知錯誤")));
                    } else if (attempts >= maxAttempts) {
                        clearInterval(interval);
                        reject(new Error("生成逾時"));
                    }
                } catch (err) {
                    console.error("Polling Error:", err);
                    // 網路錯誤不中斷，繼續重試
                }
            }, 3000); 
        });
    } catch (e) {
        console.error("Process Error:", e);
        throw e;
    }
}