/**
 * D-ID API Configuration & Helper Functions
 */

const DID_CONFIG = {
    // 注意：在前端暴露 API Key 有安全風險，建議僅供演示或測試使用
    API_KEY: "a2FpY2h1bi55YW5nQGdtYWlsLmNvbQ:IniYTncDijNhAvNuyXByt",
    URL: "https://api.d-id.com/talks"
};

/**
 * 建立 D-ID 說話任務
 * @param {string} text - 要朗讀的文字
 * @param {string} sourceUrl - Avatar 圖片的完整公開網址
 */
async function createDidTalk(text, sourceUrl) {
    const response = await fetch(DID_CONFIG.URL, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${DID_CONFIG.API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            script: {
                type: "text",
                subtitles: "false",
                provider: { type: "microsoft", voice_id: "zh-TW-HsiaoChenNeural" }, // 設定為台灣中文女聲
                ssml: "false",
                input: text
            },
            config: {
                fluent: "false",
                pad_audio: "0.0"
            },
            source_url: sourceUrl
        })
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.description || "D-ID API 請求失敗");
    }

    const data = await response.json();
    return data.id;
}

/**
 * 檢查影片生成狀態
 * @param {string} id - 任務 ID
 */
async function getDidTalkStatus(id) {
    const response = await fetch(`${DID_CONFIG.URL}/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${DID_CONFIG.API_KEY}`
        }
    });

    if (!response.ok) throw new Error("無法取得狀態");
    return await response.json();
}

/**
 * 主流程：建立並等待影片完成
 */
async function generateAndPollVideo(text, imageUrl) {
    // 1. 建立任務
    const id = await createDidTalk(text, imageUrl);
    console.log("D-ID Task Created ID:", id);

    // 2. 輪詢直到完成 (每隔 2 秒檢查一次)
    return new Promise((resolve, reject) => {
        const interval = setInterval(async () => {
            try {
                const statusData = await getDidTalkStatus(id);
                console.log("D-ID Status:", statusData.status);

                if (statusData.status === "done") {
                    clearInterval(interval);
                    resolve(statusData.result_url);
                } else if (statusData.status === "error" || statusData.status === "rejected") {
                    clearInterval(interval);
                    reject(new Error("影片生成失敗"));
                }
            } catch (err) {
                clearInterval(interval);
                reject(err);
            }
        }, 2000); // 每 2 秒檢查一次
    });
}