/**
 * HeyGen Proxy Client
 * 透過 Google Apps Script 後端轉發請求，解決 CORS 與 Talking Photo ID 問題
 */

async function generateAndPollVideo(text, imageUrl) {
    console.log("正在呼叫後端生成影片...", text.length, imageUrl);

    // 1. 呼叫後端建立任務 (包含 註冊 Talking Photo -> 生成)
    const genResponse = await fetch(API_URL, {
        method: 'POST',
        // 移除 Content-Type 以避免 GAS CORS 預檢失敗 (GAS 會自動處理純文字 body)
        body: JSON.stringify({
            action: "heygen_generate",
            text: text,
            imageUrl: imageUrl
        })
    });

    const genData = await genResponse.json();
    
    // 如果後端回傳錯誤
    if (genData.error) {
        throw new Error(genData.error);
    }
    
    const videoId = genData.video_id;
    console.log("任務建立成功，Video ID:", videoId);

    // 2. 輪詢狀態 (透過後端轉發)
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 100; // 5分鐘逾時

        const interval = setInterval(async () => {
            attempts++;
            try {
                const statusResponse = await fetch(API_URL, {
                    method: 'POST',
                    body: JSON.stringify({
                        action: "heygen_check",
                        video_id: videoId
                    })
                });
                
                const statusData = await statusResponse.json();
                
                // HeyGen 回傳結構通常在 data.status
                const status = statusData.data ? statusData.data.status : "unknown";
                console.log(`生成狀態 (${attempts}):`, status);

                if (status === "completed") {
                    clearInterval(interval);
                    resolve(statusData.data.video_url);
                } else if (status === "failed" || status === "error") {
                    clearInterval(interval);
                    reject(new Error("生成失敗: " + (statusData.data?.error?.message || statusData.data?.error || "未知錯誤")));
                } else if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    reject(new Error("生成逾時"));
                }
            } catch (err) {
                console.error("Polling Error:", err);
                // 網路錯誤繼續重試
            }
        }, 3000); // 每 3 秒檢查一次
    });
}