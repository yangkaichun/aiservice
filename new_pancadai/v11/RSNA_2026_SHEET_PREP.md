# RSNA 2026 預約表單 Google 試算表整合紀錄

日期：2026-09-30。**已啟用於正式站**：表單送出會寫入私人 Google 試算表，並寄信至 `info@pancad.ai`。

## 資料表與權限

- 已連接的公司 Google Drive 帳戶：`kc.yang@pancad.ai`。
- 新建私人原生 Google 試算表：[PanCAD.ai RSNA 2026 Website Meeting Requests](https://docs.google.com/spreadsheets/d/1ZzNbcbWaB3Wr77mJ0LQd2k2FXpgiKsXPnopOSxg_qk0/edit)，ID `1ZzNbcbWaB3Wr77mJ0LQd2k2FXpgiKsXPnopOSxg_qk0`，工作表 `RSNA 2026 Requests`。
- 已建立 16 欄表頭與凍結列。使用者同意將此單一檔案的編輯權限授予既有 Apps Script 執行帳戶 `kaichun.yang@gmail.com`；未開放公開存取。
- 程式基礎 commit：`60112f0f`，包含 Apps Script 雙寫入（先寫表，後寄信）、15 分鐘內相同資料去重、寄信狀態、試算表公式注入防護，以及英文隱私權頁說明。
- 本機模擬測試：首次送出會寫入一列並寄信一次；相同資料重試不重複寄信；錯誤密鑰被拒絕；以 `=` 開頭的姓名作為純文字儲存。

## 正式啟用與驗證

1. Apps Script 專案 `1fuT9pqM1kgPdR03vm_DAHSqq5S4jNDDfdc29A8S5mqe9-4zk3OBLlweY` 已設定 `RSNA_SHEET_ID`，保留原有 `GAS_SHARED_SECRET`。使用者同意試算表存取授權；`authorizeRsnaSheet` 在編輯器內執行完畢。
2. 現有 Web App 部署 ID `AKfycbzJ0Ycn4lkfXCKyQkahiCln8_EiS9evgAyvHAP7EUmxG3SvTODUyH_1A6TUbbT_iyNeQw` 更新至第 2 版（2026-09-30 12:57 台北時間），原 `/exec` URL 保持不變。
3. 正式站表單以 `RSNA Sheet Integration QA 20260930`、`kc.yang@pancad.ai`、`PanCAD.ai internal QA` 及「無需預約」訊息測試，頁面顯示送出成功；資料表新增 Request ID `Cay-qmi5ZWB55Qa-6C9v_DpzP3P7ek9f`，`Email status` 為 `Sent`。`Sent` 表示 MailApp 接受寄送，仍未直接核對 `info@pancad.ai` 收件匣。
4. 英文隱私權頁已補上此私人 Google Drive 試算表的資料保存說明。會後復原時應停止新 RSNA 預約請求，保留既有資料與寄信紀錄。
