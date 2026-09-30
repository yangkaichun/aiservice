# PanCAD.ai Cookie 同意稽核與改善草案

日期：2026-09-30
狀態：**已部署**；部署 ID、正式站驗證與回退基準見 `COOKIE_CONSENT_RELEASE_RECORD.md`。本文件描述技術與使用者介面查核，不取代公司法務對服務地區及個資告知內容的審核。

## 現況與風險

- 檢查的正式站 `https://www.pancad.ai/en/product` 和本次基線原始碼：44 個 HTML 頁面直接放入 Google `gtag.js`，頁面載入時立即執行 `gtag('config', 'G-8DNS20C93N')`；沒有先選擇的同意介面。既有訪問紀錄的瀏覽器可見 `_ga`、`_ga_8DNS20C93N`、`_ga_Y0D8WJM75R` 和 `cf_clearance`。既有 Cookie 本身無法判斷首次造訪時何時建立，但原始碼可確認 GA4 無條件載入。
- 原隱私權頁稱 GA4 統計「匿名」，只建議用瀏覽器封鎖 Cookie。GA 的 `_ga` Cookie 用來區分使用者／工作階段，該說法不夠準確。
- `pancad-lang` 使用 localStorage 記住語言；RSNA 頁使用 Cloudflare Turnstile 防濫用。YouTube 影片現由訪客點播放後才加入 `youtube-nocookie.com` iframe。Cloudflare 的 `cf_clearance` 屬安全驗證情境，與 GA4 分開處理。
- Cloudflare Pages 管理介面可能額外注入或啟用分析、挑戰與安全功能；目前僅根據網站原始碼、正式站瀏覽器觀察及回應標頭檢查，**尚未完成帳戶層設定盤點**。

## 本機草案

1. 移除 44 個頁面的 GA4 即時載入碼，讓全站 54 個追蹤中的 HTML 頁面共用 `css/cookie-consent.css` 與 `js/cookie-consent.js`。
2. 中／英／日顯示相同級別的接受與拒絕按鈕；自訂分析選項預設關閉。未作選擇或拒絕時不載入 `gtag.js`。使用基本同意模式：明確同意後才載入 Google 標籤。
3. 儲存選擇 180 天，頁面角落持續提供 Cookie 設定。撤回同意時更新 GA 同意狀態、清除第一方 `_ga*` Cookie 並重新載入，以停止已載入的標籤。
4. GA4 Cookie 設為 180 天且不於每次頁面造訪時延長；廣告儲存、個人化及 Google signals 保持關閉。
5. 三語隱私權頁補上分析 Cookie、必要儲存、安全驗證、Turnstile、YouTube 的說明。Google 服務仍可能處理網路及裝置資訊；正式政策應由公司確認資料控制者、接收者、跨境傳輸及保留方式。
6. 依介面回饋把英文操作字詞精簡為 `Accept`／`Deny`／`Customize`；接受鈕以品牌藍色吸引注意，拒絕鈕保持相同尺寸、清楚對比與直接操作，以兼顧訪客選擇。

## 核對結果

- `node --check js/cookie-consent.js`、`node --check js/i18n-privacy.js`、`git diff --check`、`python3 verify_site.py`：通過。
- 本機瀏覽器英文頁：無選擇時顯示橫幅，無 GA 腳本、無 `_ga*` Cookie；拒絕後仍無 GA，設定按鈕可再次開啟橫幅。
- 中文、日文頁：選擇可跨語言保留；自訂分析核取方塊預設不勾選。接受後才載入 GA，實測 `_ga`、`_ga_8DNS20C93N`、`_ga_Y0D8WJM75R` 的有效期均約 180 天；撤回後重新載入，GA 腳本與上述 Cookie 消失。
- 已檢查 RSNA 頁共用介面；本機頁面不代表 Pages Function、實際寄信或 Cloudflare 生產環境的驗證。
- 390px 手機寬度實際渲染檢查：橫幅寬 374px，Accept／Deny 各 340×44px，Customize 340×36px，選項均可見。
- 正式站 `https://www.pancad.ai/en/product`：未選與拒絕時無 GA 腳本及 `_ga*` Cookie；接受後 GA 腳本載入、三個 `_ga*` Cookie 均約 180 天；撤回後重新載入，GA 腳本及 `_ga*` Cookie 均消失。RSNA 頁及 `/api/rsna-config` 回應 HTTP 200，`GET /api/rsna-demo` 預期回應 HTTP 405。

## 上線前仍需確認

- 在 Cloudflare 帳戶核對 Web Analytics、Zaraz、Bot Management／Challenge、Turnstile 等是否有頁外注入或額外儲存；對各第三方服務建立實際用途、名稱、有效期清單。
- 確認 YouTube 點播放後實際寫入或讀取的資料；若有非必要儲存，播放前應另外以清楚文字取得對該影片服務的選擇，不能只依賴 GA4 的同意。
- 以乾淨的跨瀏覽器設定再抽查正式網域，包括拒絕後網路請求、`Set-Cookie`、CSP 與跨頁切換；本站各不同網域會各自保存選擇。
- 以真實手機硬體及螢幕閱讀器再抽查橫幅與表單、鍵盤焦點；390px 瀏覽器渲染已檢查，實機尚未檢查。
- 公司確認隱私權政策中的個資處理、Google 與 Cloudflare 資料傳輸、聯絡方式、保存期限，以及對實際服務地區適用的法規口徑。本次不宣稱已取得完整法律合規認定。

## 參考依據（官方）

- [EU ePrivacy Directive Article 5(3)](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX%3A02002L0058-20091219+)：非必要終端儲存與存取的同意及必要性例外。
- [EDPB Cookie Banner Taskforce report](https://www.edpb.europa.eu/documents/task-force-report/report-of-the-work-undertaken-by-the-cookie-banner-taskforce_en)：同意介面與拒絕／撤回的實務討論。
- [UK ICO: Managing consent in practice](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/how-do-we-manage-consent-in-practice/)：接受、拒絕及自訂的可見性與選擇方式。
- [Google: Basic versus advanced consent mode](https://developers.google.com/tag-platform/security/concepts/consent-mode)：基本模式在同意前封鎖 Google 標籤；進階模式可能送出無 Cookie 訊號。
- [Google: GA4 cookie usage](https://developers.google.com/analytics/devguides/collection/ga4/tag-options)：`_ga` 與 `_ga_<id>` 用於區分使用者和工作階段。
