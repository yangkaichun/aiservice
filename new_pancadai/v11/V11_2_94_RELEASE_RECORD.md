# PanCAD.ai v11.2.94 公告發布紀錄

日期：2026-10-08（Asia/Taipei）

## 授權、內容與期間

使用者提供合作夥伴聲明 PDF，確認正式發布日起一個曆月、公告期間中文瀏覽器留在中文版，並於本次明確要求「請部署」。

公告啟用：2026-10-08 14:44:00（台北時間）；自動到期：2026-11-08 14:44:00（台北時間，結束界線不包含）。發布包先上傳，至啟用時刻起顯示；完整聲明與 PDF 在期滿後留存。

設定 enabled=true、previewOnLocalhost=false；21個中文頁載入設定 v2。完整聲明及原始 PDF 內容沿用已核對版本；PDF SHA-256為 f67ef47b87a82d4df4641e559c9edf7e014136fdf88b8c56bea161687bf00389。

## 發布識別與回退基準

- 變更前 Git/GitHub main：3c3d86ef32f940e5a666e2e3403413946d11ffa2。
- 變更前 Cloudflare production：https://32c8daf3.pancadai-v11.pages.dev（32c8daf3-0389-487e-ae16-d89d1c1ab34c）。
- 功能 commit：`5affa4b6530d906214d9bd42195cef4a1d3ddebe`，已推送 GitHub main。
- Cloudflare 功能部署：`https://491e9553.pancadai-v11.pages.dev`，識別 `491e9553-3441-424f-9fc9-c4b8626c2d85`；Worker/Functions編譯及上傳成功。
- GitHub source Deploy：[37739154736](https://github.com/yangkaichun/aiservice/actions/runs/37739154736)，completed/success。
- GitHub Pages build：[37739215371](https://github.com/yangkaichun/aiservice/actions/runs/37739215371)，completed/success；gh-pages commit `8b2a3172542ab96db1a5260b55f243afd4070210`。
- 正式站：https://www.pancad.ai/；鏡像：https://health.yangkaichun.net/new_pancadai/v11/ 及 https://health.yangkaichun.net/v11/。

Cloudflare 發布包由限定 commit 的 git archive 建立；在實際 v11 根目錄執行 Wrangler，保留 functions/以編譯既有 API，排除 gas/。不納入其他本機修改、未追蹤預覽、生成暫存或 backups。

需回退時從最新版本選擇性反轉本次公告功能，保留v11.2.93許可說明句移除、Cookie、RSNA及其後無關更新；使用包含 Functions 的發布根目錄重新上傳並讀回。

## 驗證與證據

本機預覽驗證、全文與PDF比對通過，製作細節見 COMPANY_NOTICE_PREVIEW_20261008.md。發布前更新正式設定後，靜態 verifier、JavaScript syntax、git diff --check、啟用/到期界線及31日的一個曆月區間均通過。

不可變Cloudflare及主域共72項讀回檢查全部通過：33個可公開本次檔案、原有兩個RSNA唯讀端點及設定檔Cache-Control。不可變來源雜湊相同；主域HTML含既有Cloudflare注入，核對公告script v2及內容，其餘資產/PDF逐一同雜湊。GET /api/rsna-config 為200有效JSON，GET /api/rsna-demo 維持405，未送出表單。

正式主域瀏覽器QA共50項通過，時間2026-10-08 14:44:47至14:46:08（台北）：中文直接首頁留中文、臺大案例1440/390px公告完整無裁切/溢出、同分頁不重複及獨立新分頁提醒、關閉後Cookie與焦點正常、未同意/拒絕0 GA請求、全文直接入口不彈摘要、英日無公告；全文與來源一致、PDF220119bytes及SHA256相同。真實裝置與全瀏覽器未測，檢查是桌機Chromium的桌機/手機寬度。

GitHub雙路徑33個發布檔案共66項內容讀回全部通過，均與功能commit來源雜湊完全相同。

修改前原檔、manifest及QA保存在 repository 外層 backups/v11_company_notice_20261008/，非公開網站資產。真實手機裝置驗證未執行。

本紀錄標示首次經驗證的功能部署；其後僅同步發布紀錄與CHANGELOG時，公告、期間、PDF與Functions功能不變。最後文件同步的部署識別另保存在本機發布證據JSON，避免識別自我引用。
