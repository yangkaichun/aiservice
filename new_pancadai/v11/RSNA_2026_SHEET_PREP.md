# RSNA 2026 預約表單 Google 試算表整合準備紀錄

日期：2026-09-30。**尚未啟用於正式站**；正式站目前仍只寄送至 `info@pancad.ai`。

## 已準備

- 已連接的公司 Google Drive 帳戶：`kc.yang@pancad.ai`。
- 新建私人原生 Google 試算表：[PanCAD.ai RSNA 2026 Website Meeting Requests](https://docs.google.com/spreadsheets/d/1ZzNbcbWaB3Wr77mJ0LQd2k2FXpgiKsXPnopOSxg_qk0/edit)，ID `1ZzNbcbWaB3Wr77mJ0LQd2k2FXpgiKsXPnopOSxg_qk0`，工作表 `RSNA 2026 Requests`。
- 已建立 16 欄表頭與凍結列；截至此紀錄尚無預約資料列。檔案權限目前僅公司帳戶擁有者。
- 本地程式準備 commit：`60112f0f`，包含 Apps Script 雙寫入（先寫表，後寄信）、15 分鐘內相同資料去重、寄信狀態、試算表公式注入防護，以及英文隱私權頁說明。此 commit **未推送、未部署**。
- 本機模擬測試：首次送出會寫入一列並寄信一次；相同資料重試不重複寄信；錯誤密鑰被拒絕；以 `=` 開頭的姓名作為純文字儲存。

## 尚待執行

1. 確認資料表位置。既有寄信 Apps Script 由個人帳戶 `kaichun.yang@gmail.com` 執行，若沿用公司 Drive 試算表，須將**此單一檔案**的編輯權限授予該執行帳戶；不開放公開連結。
2. 在 Apps Script 專案 `1fuT9pqM1kgPdR03vm_DAHSqq5S4jNDDfdc29A8S5mqe9-4zk3OBLlweY` 設 Script Property `RSNA_SHEET_ID` 為上述 ID，不改現有私密 `GAS_SHARED_SECRET`。
3. 將 `gas/rsna_demo_email.gs` 完整程式上傳至同一 Apps Script 專案，授予新增的 Google Sheets 寫入權限，更新既有 Web App 部署版本並保留原 `/exec` URL（或同步更新 Cloudflare `GAS_URL`）。
4. 從乾淨的 Git commit 發布更新後的隱私權頁到 Cloudflare Pages。用標註為內部 QA 的資料走正式表單，確認頁面成功、寄信 API 成功與試算表出現相同 Request ID／`Sent` 狀態，再測重試去重。
5. 補寫正式發布紀錄與 Google Drive 紀錄副本，並更新 `rsna-2026-pancad-ai` 會後復原排程，保留歷史預約資料表而停止新增 RSNA 請求。
