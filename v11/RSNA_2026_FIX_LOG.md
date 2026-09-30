# RSNA 2026 英文活動頁與預約表單修正紀錄

紀錄日期：2026-09-30（Asia/Taipei）

## 修正歷程

| 階段 | 問題與需求 | 修正內容 | 版本與結果 |
| --- | --- | --- | --- |
| 活動頁發布 | 英文首頁需呈現 RSNA 2026、Booth 5132 與預約入口 | 新增英文首頁活動資訊、獨立活動頁、訪客身份及需求選項、Cloudflare Turnstile 驗證，以及寄至 `info@pancad.ai` 的表單中繼 | 網站 commit `b0c55564`；初次正式部署 `720c0b73-685c-4ea8-aa8f-7a1f7edad2c0` |
| 跨帳戶資料表權限 | 原寄信程式以 `kaichun.yang@gmail.com` 執行，需寫入公司 `kc.yang@pancad.ai` 的表格；使用者未收到跨帳戶分享確認 | 經使用者明確同意，僅將指定 Google 試算表授予該執行帳戶編輯權限；Drive 權限讀回確認為 writer，未開放公開存取。分享通知郵件是否送達未作確認 | 指定表格：[PanCAD.ai RSNA 2026 Website Meeting Requests](https://docs.google.com/spreadsheets/d/1ZzNbcbWaB3Wr77mJ0LQd2k2FXpgiKsXPnopOSxg_qk0/edit)；此表為原生 Google 試算表，可匯出 Excel |
| 表單雙寫入 | 預約資料除寄信外，也須保存到公司 Google Drive | Apps Script 新增 `RSNA_SHEET_ID`、16 欄資料列、15 分鐘重送去重、寄信狀態與試算表公式注入防護；先寫表，再呼叫 MailApp。使用者另同意試算表 OAuth 存取授權 | Apps Script 既有 Web App 部署更新至第 2 版，保留原 `/exec` URL；程式來源 commit `60112f0f` |
| 隱私說明及網站發布 | 表單資料新增保存位置，公開說明需同步 | 英文隱私權頁加入私人 Google Drive 試算表保存說明；使用乾淨 Git commit 發布至 Cloudflare Pages | Git commit `723c393074710adec88bc166d5148c72cb4f24b3` 已推送；正式部署 `f766adb9-871b-4dab-a883-1e3ffd340f75` |
| 會後復原 | 年會結束後須還原原本英文網站 | 更新既有 Codex 排程，於 2026-12-04 08:00 台北時間起移除活動宣傳與新預約入口，保留無關網站更新及既有預約資料表 | 排程 `rsna-2026-pancad-ai` 保持啟用；復原結果須於執行後另記 |

## 驗證紀錄

- Apps Script 本機模擬涵蓋首次寫入與寄信、相同資料重試去重、錯誤密鑰拒絕、公式樣式文字安全儲存；JavaScript 語法、`verify_site.py`、`git diff --check` 通過。
- 2026-09-30 12:59 台北時間，從正式站以 `RSNA Sheet Integration QA 20260930` 送出內部測試資料，頁面顯示成功。表格新增 Request ID `Cay-qmi5ZWB55Qa-6C9v_DpzP3P7ek9f`，`Email status` 為 `Sent`。
- `Sent` 表示 Apps Script 的 MailApp 呼叫完成；尚未直接核對 `info@pancad.ai` 收件匣實際投遞。內部 QA 資料明確標示「無需預約」。
- 新版正式隱私權頁與活動頁讀回 HTTP 200，隱私權頁包含私人試算表保存說明。Cloudflare 部署來源是 Git commit `723c393`，`gas/` 原始碼未放進公開靜態目錄。

## 待獨立確認

- `info@pancad.ai` 收件匣是否實際收到測試郵件，以及郵件過濾規則。
- RSNA 年會標誌宣傳樣稿的品牌核准紀錄。
- 跨帳戶分享通知郵件是否到達；檔案的實際編輯權限已透過 Drive 權限資料確認。開啟表格需登入已獲授權的帳戶。

相關細節見 `RSNA_2026_RELEASE_RECORD.md`、`RSNA_2026_SHEET_PREP.md` 與公司 Google Drive `Codex_Records/20260930_v11.2.91_RSNA2026_sheet_integration.md`。本文件僅補寫修正紀錄，沒有修改或重新部署正式網站。
