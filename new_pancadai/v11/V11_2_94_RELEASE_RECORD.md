# PanCAD.ai v11.2.94 公告發布紀錄

日期：2026-10-08（Asia/Taipei）

## 授權、內容與期間

使用者提供合作夥伴聲明 PDF，確認正式發布日起一個曆月、公告期間中文瀏覽器留在中文版，並於本次明確要求「請部署」。

公告啟用：2026-10-08 14:44:00（台北時間）；自動到期：2026-11-08 14:44:00（台北時間，結束界線不包含）。發布包先上傳，至啟用時刻起顯示；完整聲明與 PDF 在期滿後留存。

設定 enabled=true、previewOnLocalhost=false；21個中文頁載入設定 v2。完整聲明及原始 PDF 內容沿用已核對版本；PDF SHA-256為 f67ef47b87a82d4df4641e559c9edf7e014136fdf88b8c56bea161687bf00389。

## 發布識別與回退基準

- 變更前 Git/GitHub main：3c3d86ef32f940e5a666e2e3403413946d11ffa2。
- 變更前 Cloudflare production：https://32c8daf3.pancadai-v11.pages.dev（32c8daf3-0389-487e-ae16-d89d1c1ab34c）。
- 本次 commit、Cloudflare 與 GitHub Pages 識別待實際發布後填入；目前不宣稱部署驗證已完成。

Cloudflare 發布包由限定 commit 的 git archive 建立；在實際 v11 根目錄執行 Wrangler，保留 functions/以編譯既有 API，排除 gas/。不納入其他本機修改、未追蹤預覽、生成暫存或 backups。

需回退時從最新版本選擇性反轉本次公告功能，保留v11.2.93許可說明句移除、Cookie、RSNA及其後無關更新；使用包含 Functions 的發布根目錄重新上傳並讀回。

## 驗證與證據

本機預覽驗證、全文與PDF比對通過，製作細節見 COMPANY_NOTICE_PREVIEW_20261008.md。發布前更新正式設定後再驗證靜態檢查與期間設定；發布後將讀回主域、不可變Cloudflare與GitHub雙路徑的設定/資產/PDF，確認21中文頁載入、中文首頁入口、Cookie協調及原有RSNA API。

修改前原檔、manifest及QA保存在 repository 外層 backups/v11_company_notice_20261008/，非公開網站資產。真實手機裝置驗證未執行。
