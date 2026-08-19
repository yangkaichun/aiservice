# v11 陽光旅程 — 版本紀錄（CHANGELOG）

> 部署：https://health.yangkaichun.net/new_pancadai/v11/（GitHub Pages，auto-sync cron 每 5 分鐘）＋ https://pancadai-v11.pages.dev（Cloudflare Pages，wrangler v3 手動部署）
> 主體：v7（患者旅程＋8 幕），整合 v2-v10 優點與 Siemens Healthineers 架構參考

## v11.2.25（2026-08-18）— AI SEO＋Cloudflare 部署＋表單定案＋文字調整
- **AI SEO 優化**（v11.2.23 尾聲）：
  - `llms.txt` 建立（AI 搜尋引擎/LLM 標準摘要：公司/產品/科學數據/頁面/FAQ/護胰大聯盟）
  - 全站 JSON-LD 強化（11 頁）：MedicalOrganization（統編/地址/電話/email/logo）＋BreadcrumbList；index＋WebSite/MedicalWebPage/Product（9 獎）；clinician＋MedicalDevice（TFDA 證號）；publications＋Article×5（PubMed）
  - canonical 補齊（product.html）、sitemap 11 URL、robots.txt 加 llms 引用
- **Cloudflare Pages 部署確立**：wrangler v3.114（v11 目錄內執行）→ `pancadai-v11.pages.dev`；**wrangler 4 已移除 Pages Functions 自動編譯**（需 Workers Static Assets）→ 固定用 v3
- **聯絡表單方案演進（定案：mailto）**：
  - 初案：Turnstile＋Pages Functions＋GAS 轉發（functions/contact.js＋gas/contact_email.gs＋FORM_SETUP.md）——Functions routing 測試失敗（405/靜態 fallback，wrangler 2/3/4 皆同）→ **棄用 Functions**
  - 定案：**表單提交 → mailto:info@pancad.ai（開啟使用者 email app，含姓名/電話/Email/訊息）**——使用者確認可接受
  - 按鈕「前往填寫表單」→「送出表單」（三語：Send form／送信フォーム）
  - **Troubleshoot 根除**：來源為 Turnstile widget（placeholder site key 驗證失敗顯示 troubleshooting 連結）→ 移除整個 Turnstile 區塊＋functions/ 目錄（零殘留）
- **「智財布局」→「專利佈局」**（全站 13 檔：nav/footer/mobile/字典）
- **環境變更**：git push 改用 keychain token（osxkeychain「Device not configured」）→ Authorization header 推送；sync 腳本在 `~/.hermes/profiles/work/scripts/`
- 版本 `?v=45`

## v11.2.24（2026-08-17 08:46）— A16/D1 修正採用；E1/E2 確定永久停用
- **A16（hero_sun_9）**：右側改為一位男性＋一位女性（v2 版採用，2560 HD＋1280 小圖）
- **D1（ct_scan_bed）**：完全平躺、無頭枕（v2 版採用，2560 HD＋1280 小圖）
- **E1/E2（dinner_zh_1/2）**：多輪重生成（v2-v6 共 5 版：30 歲男性/父母+2 小孩/溫馨/單桌/近景/斜俯視）仍不滿意 → **確定永久停用**（zh 晚餐池維持 dinner_ja_1/2；檔案保留於 assets/＋存檔區說明）
- 版本 `?v=41`

## v11.2.23（2026-08-14 15:41）— Cloudflare 部署＋專利/FDA 連結＋聯絡統一
- **Cloudflare Pages 部署**：wrangler login（OAuth，Safari 授權）→ `wrangler pages project create pancadai-v11` → `wrangler pages deploy new_pancadai/v11`（314 檔）→ https://pancadai-v11.pages.dev
- **專利列表超連結**：ip.html 10 件專利（US 4＋TW 6）→ Google Patents 深鏈（`patents.google.com/patent/{號}`），**全部 curl 驗證 200＋title 內容吻合**；st-tag 改 a 標籤（hover 藍底）＋↗
- **聯絡資訊統一公司登記**：全站 footer（11 頁）地址「台北市大安區敦化南路一段367號11樓」＋Email info@pancad.ai＋電話 +886 02-2331-3971（三語，同 contact 頁）
- **FDA Breakthrough 佐證連結**：clinician ev2 卡加 FDA 官方計畫頁＋自由時報報導（均驗證 200）；三語；`.cert-link` 樣式
- 坑：批次 replace 吃掉 ev2_p 值尾逗號（三語）→ JS 語法錯誤 → 逐一補回
- 版本 `?v=39`

## v11.2.22（2026-08-14 14:30）— 全站背景圖無 pad 滿版＋E1/E2 停用
- **38 張第二批重生成完成**：bike/bridge/coffee/forest/kayak/picnic/yoga（台灣情境）＋hero_v7_morning_intl（晨光多元人種海報）＋hero_intl_01-30（西歐情境）——全部無 pad 滿版（2560×1440 生成 → 1280 小圖＋2560 HD webp）
- **JS FULL 全池 cover**：sun 17 張＋intl 30 張全部無 pad → `cover` 顯示（不再 113% 放大）；C1 couple（使用者指定正確的 pad 版）維持 113%
- **E1/E2 停用存檔**：dinner_zh_1/2 不再顯示（zh 晚餐池改用亞裔 dinner_ja_1/2）；檔案保留於 assets/＋`停用圖檔存檔區.md`
- 版本 `?v=37`

## v11.2.21（2026-08-14 09:40）— 聯絡資訊＋預設中文
- 聯絡資訊：地址「台北市大安區敦化南路一段367號11樓」、Email info@pancad.ai、電話 **+886 02-2331-3971**
- 表單改為**新視窗**開啟 `https://www.pancad.ai/contact/getInTouch`（官方表單）
- 全站 kc.yang@pancad.ai → info@pancad.ai（零殘留）
- **網頁預設中文版**（i18n.js detect 一律回傳 zh，不依瀏覽器語言；手動切換仍記憶）
- 版本 `?v=35`

## v11.2.20（2026-08-14 08:43）— 17 張直接轉無 pad 版
- 找到原始檔（`assets/_gen_v11/*_raw.jpg`，1600×896 無 pad）：sun_1-10、ct_scan_bed、dinner 6 張 → PIL 批次轉 1280 滿版小圖＋HD webp
- JS FULL 例外清單擴充（cover 顯示）
- 版本 `?v=32`

## v11.2.19（2026-08-14 08:28）— 上下裁切修正＋內容圖滿版
- 背景圖 `118% → 113%`（垂直裁切主體 3% → 0.5%，左右仍滿版裁 pad 邊）
- 輪播圖 `object-position: 50% 30%`（顯示圖上部，不再中央硬切）
- product 頁 2 張內容圖（實機畫面/系統架構）移出 wrap 全寬滿版
- 版本 `?v=31`

## v11.2.18（2026-08-14 08:13）— 5 張重生成＋無 pad 產線確立
- 5 張圖重生成：A9 hero_sun_2（手拿咖啡杯、桌上無杯）、A16 hero_sun_9（右側女性）、D1 ct_scan_bed（平躺無頭枕）、E1 dinner_zh_1（左側 60 歲女性）、E2 dinner_zh_2（左側 30 歲女性、無小孩）
- **產線教訓**：mflux 5120×2880 直接生成 Peak 49.7GB＋→ multiprocessing 崩潰（semaphore leak、MTLCompilerService 掛點）→ **改用 2560×1440 生成＋SeedVR2 2x 放大 5120**（穩定）
- supervisor 監控（log mtime 180s 無更新 → 自動 kill 重試 ×3）
- system_arch 重新生成（先 CT 版 → 後抽象雷達版無 CT 全英文）
- 版本 `?v=30`

## v11.2.17（2026-08-14 07:20）— 產品介紹頁新增
- **product.html**（參考 v9/v10 產品頁＋v11 設計語言）：六道防線、判讀流程 4 步、真實系統畫面、系統架構、CTA 玻璃框
- nav 9→10 連結（產品介紹首位）、footer、sitemap 同步；i18n-product.js 三語
- 坑：漏載 `i18n.js`（lang 切換邏輯）→ 三語失靈 → 補回
- 版本 `?v=29`

## v11.2.16（2026-08-14 06:00）— v7 hero HD 補齊
- hero_v7_morning_couple/intl → SeedVR2 5120 HD（initPosterHD 漸進）
- 輪播大圖 HD 漸進（initCarouselHD）
- 版本 `?v=28`

## 部署修復（2026-08-14 08:30）— deploy.yml
- **根因**：deploy.yml mkdir 清單遺失 `_deploy/new_pancadai/assets/previews` → `cp previews` 失敗 → **最近 4 次部署全失敗**（線上一直舊版）
- 修復：補回 mkdir 項目 → Deploy success＋Pages build success

## 早前版本（摘要）
- v11.2.15（?v=27）：背景圖 118% 滿版填補機制確立
- v11.2.14（?v=26）：誤改回退（ct-frame/AUC 卡回原位）
- v11.2.13-12（?v=25/24）：幕 4 CT 滿版誤改（已回退）
- v11.2.11（?v=23）：100% 設定滿版（day-grid/carousel 移出 wrap）
- v11.2.10（?v=22）：內容大圖滿版
- v11.2.8（?v=20）：彩色滑動計數器 2156+（每 10 秒 +1）
- v11.2.7（?v=19）：動態判讀人次 2156+
- v11.2.6（?v=19）：CTA `</a>` 修復（批次正則吃標籤）
- v11.2.5（?v=18）：cta-panel 玻璃框（夜間可讀）
- v11.2.4（?v=17）：光子粒子改金黃圓點
- v11.2.3（?v=16）：HD 漸進載入（17 張 5120 webp）
- v11.2.0：背景池語言分流（sun 17 亞裔/intl 30 西歐）、幕 3 CT 固定、幕 7 晚餐池、HD 產線（SeedVR2 兩階段）
- v11.0：陽光旅程架構（以 v7 為主體）
