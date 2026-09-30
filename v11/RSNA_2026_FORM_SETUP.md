# RSNA 2026 英文活動頁：預覽與正式寄信設定

## 本機預覽

從 v11 目錄執行 `python3 -m http.server 8137`，開啟：

- 英文實際首頁：`http://127.0.0.1:8137/en/product.html`
- 新視窗活動頁：`http://127.0.0.1:8137/en/rsna-2026.html`

本機使用 Cloudflare 公開測試用 Turnstile key，送出時只顯示欄位驗證結果，**不會寄信**。不要把測試 key 當正式站人機驗證。

## 正式寄信與試算表設定（2026-09-30 已完成）

1. 以 `kaichun.yang@gmail.com` 建立獨立 Apps Script 專案並部署 Web App，執行身分為擁有者，提供公開中繼端點；程式碼取自 `gas/rsna_demo_email.gs`，Script Property 設私密 `GAS_SHARED_SECRET`。Google 寄信權限已由使用者同意並授予。
2. 為 `www.pancad.ai`、`pancad.ai`、`pancadai-v11.pages.dev` 建立 Cloudflare Turnstile Managed widget；公開 Site Key 為 `0x4AAAAAAFJv_bX3AubQuhF-`，私密金鑰保留於 Cloudflare。
3. Cloudflare Pages 專案 `pancadai-v11` 已設定 `TURNSTILE_SITE_KEY`、`TURNSTILE_SECRET`、`GAS_URL` 與 `GAS_SHARED_SECRET`；私密值未提交 Git。
4. Cloudflare Pages 正式版包含 `functions/api/rsna-config.js` 與 `functions/api/rsna-demo.js`。純靜態 GitHub Pages 鏡像排除 `functions/` 與 `gas/`，無寄信後端。
5. Apps Script 直接測試：錯誤密鑰回應 `ok:false`，正確密鑰與標註為內部測試的資料回應 `ok:true`。正式站表單含 Turnstile 的送出測試顯示成功訊息並重設表單。伺服端必填檢查以空 JSON 回應 HTTP 400；GET 預約 API 回應 HTTP 405。尚未讀取 `info@pancad.ai` 收件匣確認實際收件。
6. 後續依使用者授權，新增公司 Google Drive 私人試算表保存。原 Apps Script Web App 更新至第 2 版，先寫入試算表再寄信；正式站內部 QA 送出後，資料表出現對應列且 `Email status` 為 `Sent`。表格權限、測試 Request ID 與處理方式詳見 `RSNA_2026_SHEET_PREP.md`。

頁面只收會議安排所需資料；不接受病人資料或醫學影像。寄出請求不代表預約時段已確認。

## 來源與發布前複核

- Booth 5132：Marketing 共享雲端硬碟 `13_Events/2026 11 29-2 RSNA/行前計畫書/RSNA2026_重要TA_展位邀請信_EN_20260930.md`，其來源是 2026-09-29 官方目錄快照。發布前重新核對官方即時展位。
- 展覽日期和時段：[RSNA Current Exhibitors](https://www.rsna.org/annual-meeting/exhibitors-and-sponsors/current-exhibitors)。
- RSNA 2026 標誌：[RSNA Annual Meeting Branding](https://www.rsna.org/style-guide/rsna-brand/design/annual-meeting-branding)。RSNA 說明參展商使用年會標誌宣傳參展時，樣稿應送 RSNA Marketing 核准；本次已上線，但專案中尚無樣稿送審或核准證據，須由品牌負責人補件確認。
- PanCAD.ai 標誌：`assets/pancad-ai-logo.svg`。
- 參考頁：[PaxeraHealth at RSNA 2026](https://paxerahealth.com/corporate-news/paxerahealth-at-rsna-2026/)（僅參考活動頁與表單流程，文案和設計另行製作）。
