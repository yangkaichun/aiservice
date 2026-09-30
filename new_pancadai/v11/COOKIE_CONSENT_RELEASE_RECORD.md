# PanCAD.ai Cookie 同意介面發布紀錄

日期：2026-09-30（Asia/Taipei）

## 版本與發布

- 變更前 Git 基準：`8d836dc588344c0e782574a1f17d53ad9d50a33a`。變更前 Cloudflare Pages production：`f766adb9-871b-4dab-a883-1e3ffd340f75`，其來源為 `723c393`；兩個 Git 基準之間只有 RSNA 紀錄文件更新，沒有網站程式差異。
- 功能程式 commit：`23d8e1eb2d6433d6c9e935425b37b1db677d5e79`，已推送 GitHub `main`。部署包由該 commit 的 `new_pancadai/v11` 封存建立，保留 `functions/` 並排除 `gas/`，以 Wrangler 3.114.0 發布。
- GitHub Actions [Deploy #36690715668](https://github.com/yangkaichun/aiservice/actions/runs/36690715668) 已完成且成功；GitHub Pages 的 `/v11/` 與 `/new_pancadai/v11/` 兩條路徑均讀回相同的 Cookie JS SHA-256。
- Cloudflare Pages 專案：`pancadai-v11`，production branch `main`。**現行正式部署**：`eddb90d9-7800-490a-91d2-d9981885d341`；不可變網址：`https://eddb90d9.pancadai-v11.pages.dev`；主域：`https://www.pancad.ai`。
- 第一次同內容上傳產生 `0d9f03f0-7073-4821-9c2a-4c691c20690d`，但附加的完整 Git SHA 識別有誤；已立即以正確 SHA 重發為 `eddb90d9`。後者是現行 production，前者僅供歷史追溯，不作為發布依據。

## 發布後讀回

- `www.pancad.ai/en/product` HTTP 200，HTML 載入 `cookie-consent.css?v=1` 與 `cookie-consent.js?v=1`，無原先的即時 Google 標籤。正式主域與不可變部署的 JS SHA-256 均為 `355dc2403d64d083f8af9ad0b6e56d47f3f1f816c688592f8338704104616784`，與提交版一致；CSS SHA-256 為 `68784bab3d9611f3b4e907ffc7f445b1fcdcf700c90a6f55319f9a771bc7e470`。
- 正式瀏覽器：首次未選及按 `Deny` 時不載入 `gtag.js` 且沒有 `_ga*` Cookie；重新開啟設定後按 `Accept` 才載入 Google 標籤，`_ga`、`_ga_8DNS20C93N`、`_ga_Y0D8WJM75R` 均約 180 天；再按 `Deny` 撤回後，頁面重新載入，Google 標籤與上述 Cookie 消失。
- RSNA 活動頁及 `/api/rsna-config` 均 HTTP 200；`GET /api/rsna-demo` 保持預期的 HTTP 405。本次沒有送出表單，也沒有驗證實際寄信或試算表新增資料。
- 本機發版前 `verify_site.py`、JS 語法、`git diff --check` 通過；英文預覽 390px 寬度時三個操作按鈕可見且可點選。

## 後續與回退

- Cloudflare 帳戶層分析／挑戰功能、其他瀏覽器及實際手機、法律文案仍列在 `COOKIE_CONSENT_AUDIT.md` 待確認；技術改善不等於全面合規認定。
- 若需回退本功能，應在當時最新 `main` 上選擇性反轉功能 commit，保留 RSNA 及其後其他無關更新，再以乾淨 commit 重新發布 Cloudflare Pages；變更前不可變部署 `f766adb9.pancadai-v11.pages.dev` 可供比對。RSNA 會後復原排程也必須保留 Cookie 同意功能。
