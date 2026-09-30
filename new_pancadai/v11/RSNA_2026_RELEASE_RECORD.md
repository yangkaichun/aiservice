# PanCAD.ai RSNA 2026 網站正式發布與會後復原紀錄

記錄日期：2026-09-30（Asia/Taipei）

## 正式發布

- 專案：Cloudflare Pages `pancadai-v11`，正式主域 `https://www.pancad.ai`。
- 活動前 Git 基準：`87ed532029f69b1f5f2b23b6fc7a3367e5f44617`；活動前 Cloudflare Pages 部署：`e8776039-d352-484e-a29d-1574b6805b6c`（`https://e8776039.pancadai-v11.pages.dev`）。
- 活動網站 commit：`b0c55564dd41a67dcfb3a2d196ca8a0c44ea217b`，已推送 `main`。
- 正式 Cloudflare Pages 部署 ID：`720c0b73-685c-4ea8-aa8f-7a1f7edad2c0`；不可變網址：`https://720c0b73.pancadai-v11.pages.dev`。
- 英文首頁：`https://www.pancad.ai/en/product.html`；活動頁：`https://www.pancad.ai/en/rsna-2026.html`。英文首頁展會資訊連往新視窗活動頁。活動頁標示 Booth 5132。
- 部署來源由上述 commit 封存為乾淨的 v11 靜態檔及 Cloudflare Pages Functions；`gas/` 未發布為公開靜態檔。

## 表單寄信設定與驗證

- Cloudflare Turnstile Managed widget 允許主域與 Pages 網域；公開 Site Key `0x4AAAAAAFJv_bX3AubQuhF-`。
- Pages 環境已設定 `TURNSTILE_SITE_KEY`、`TURNSTILE_SECRET`、`GAS_URL`、`GAS_SHARED_SECRET`。私密值只存於服務端，未寫入本紀錄或 Git。
- Google Apps Script 專案 ID：`1fuT9pqM1kgPdR03vm_DAHSqq5S4jNDDfdc29A8S5mqe9-4zk3OBLlweY`；Web App 部署 ID：`AKfycbzJ0Ycn4lkfXCKyQkahiCln8_EiS9evgAyvHAP7EUmxG3SvTODUyH_1A6TUbbT_iyNeQw`；執行身分為 `kaichun.yang@gmail.com`，寄件至 `info@pancad.ai`。使用者已同意設定並授予寄信權限。
- Google Apps Script 直接測試：錯誤密鑰 `ok:false`；正確密鑰並傳送標註為內部 QA 的資料 `ok:true`。
- 正式站 readback：英文首頁、活動頁、JS、CSS、圖片均 HTTP 200；`/api/rsna-config` HTTP 200 且回傳公開 Site Key；`GET /api/rsna-demo` HTTP 405；空 JSON `POST` HTTP 400。
- 正式站瀏覽器測試：Turnstile 顯示人機驗證完成；以 `RSNA website deployment verification`、`info@pancad.ai` 等內部測試資料送出，頁面顯示 `Thank you. Your request was sent to PanCAD.ai.` 並重設表單。這表示網站 API 與 Apps Script 回報寄送成功；尚未讀取收件匣確認郵件到達。
- 靜態檢查：`verify_site.py`、JavaScript 語法、`git diff --check` 通過。

## 預約資料表增補（2026-09-30）

- 公司 Google Drive 的私人原生試算表：[PanCAD.ai RSNA 2026 Website Meeting Requests](https://docs.google.com/spreadsheets/d/1ZzNbcbWaB3Wr77mJ0LQd2k2FXpgiKsXPnopOSxg_qk0/edit)；工作表 `RSNA 2026 Requests`，16 欄。使用者同意授予 `kaichun.yang@gmail.com` 此單一檔案編輯權限，未開放公開存取。
- 同一 Apps Script 專案設定 `RSNA_SHEET_ID`，授予試算表存取權並更新原部署至第 2 版，原 `/exec` URL 與 Cloudflare `GAS_URL` 不變。程式先寫入試算表，再寄信；記錄 `Sent`／`Email error`，並對短時間重送去重。
- 2026-09-30 12:59 台北時間由正式站送出內部 QA 資料。網頁顯示成功，表格第 2 列的 Request ID 為 `Cay-qmi5ZWB55Qa-6C9v_DpzP3P7ek9f`，`Email status` 為 `Sent`。此狀態證明 MailApp 呼叫成功，不等於已直接查核收件匣投遞。
- 英文隱私權頁加入私人 Google Drive 試算表保存說明；整合細節見 `RSNA_2026_SHEET_PREP.md`。

## 會後自動復原

- [RSNA 官方年會 FAQ](https://www.rsna.org/annual-meeting/faqs) 說明 2026 年會於 12 月 3 日 16:00 Chicago CT 結束；安排 2026-12-04 08:00 台北時間開始復原。
- Codex app 心跳排程 ID：`rsna-2026-pancad-ai`，此任務每天台北時間 08:00 執行；在 2026-12-04 08:00 前保持安靜且不變更網站。成功復原後須停用排程；失敗則翌日重試並通知。
- 復原時先核對當時 `main` 和正式站狀態，保留活動開始後的無關更新。以選擇性反轉活動 commit 或等價變更移除首頁宣傳、活動頁、表單後端與活動專用素材；**不可直接把 main 硬重設到活動前 commit**。保留預約資料表與既有資料，不刪除歷史紀錄，並讓新 RSNA 表單請求停止。
- 建立可追溯復原 commit 並推送，從乾淨 commit 重新部署 `pancadai-v11` production。確認英文首頁不再顯示 RSNA、活動頁／API 停止提供、其他語系與主要頁正常。另記錄新部署 ID 與復原驗證結果。
- Cloudflare Pages 保留本次與活動前的不可變部署網址，可供比對。若會前或會期間需提早下架，應先停用此排程並另做有紀錄的復原。

## 待確認事項

- `info@pancad.ai` 收件匣實際收件與郵件過濾規則尚未由本次測試直接確認。
- [RSNA 年會品牌指南](https://www.rsna.org/style-guide/rsna-brand/design/annual-meeting-branding) 要求參展商宣傳樣稿送 RSNA Marketing 核准；目前專案未見送審／核准證據，請品牌負責人補行確認。
