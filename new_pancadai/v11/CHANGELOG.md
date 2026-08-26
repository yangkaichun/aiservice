# v11 陽光旅程 — 版本紀錄（CHANGELOG）

> 部署：https://pancad.ai（主域）＋ https://pancadai-v11.pages.dev（Cloudflare）＋ https://health.yangkaichun.net/new_pancadai/v11/（GitHub Pages）
> 主體：v7（患者旅程＋8 幕），整合 v2-v10 優點與 Siemens Healthineers 架構參考

---

## v11.2.38（2026-08-26）— RWD 手機版優化（首輪稽核＋修正，`?v=85`）
- **RWD 稽核方法**（Playwright 無頭瀏覽器，venv `~/venvs/rwd-audit`）：11 頁 × 375/768/1024 三斷點 → 水平溢出/文字裁剪/柵格單欄化/觸控目標/字級/互動（burger、carousel）全自動化檢查
- **稽核結果基線**：33/33 零水平溢出、11/11 零文字裁剪、柵格單欄化正確——v11 手機版底子良好
- **P0 修正**：
  - ① **手機版語言切換**：mobile menu 尾端加 `.mobile-lang` 三語按鈕（繁體中文/English/日本語，data-lang 綁定 i18n.js 自動生效）——原 ≤820px 隱藏 `.lang` 且 menu 無語言鈕，手機用戶完全無法切語言
  - ② **桌面 nav 補「產品介紹」首位**：全站 11 頁 `.nav-links` 補 `<a class="nav-a" href="product.html" data-i18n="nav_product">`（v11.2.19 並行子代理改 nav 結構時被弄丟，桌面只剩 footer/mobile 可達產品頁）
  - ③ **index mobile menu 補 deep-plan 連結**（其他頁都有，index 獨缺；`zh-only` 三語隱藏正確）
- **P1 觸控/可讀性**（≤640px 斷點）：`.burger` min-height 40px、`.nav-logo` padding、`.gate-cta`/`.pub-link`/`.ev-go` padding 加大（24px→≥34px 高）、`.car-dot` 9→12px；`.pub-tag` 11.5→12.5px、`.pub-journal`/`.ss-tag` 12.5→13px、`.pub-card p` 13.5px
- **P2**：Escape 關閉 mobile menu（main.js keydown）、語言切換後自動關閉 menu
- **驗證**：check_tags 11/11 平衡、node --check 過、33/33 溢出複查過、點 English→html lang=en＋menu 自動關閉、Escape 生效
- commit 待 auto-sync；CF Pages（pancadai-v11.pages.dev）需另跑 wrangler deploy

---

## v11.2.37（2026-08-26）— 全站 footer 地址 fallback 修正
- **地址 376 號定案**：10 頁 footer `data-i18n="foot_addr"` 靜態 fallback「台北市（依公司登記）」→ **「台北市大安區敦化南路一段376號11樓」**（JS 未執行也顯示完整地址）
- 三語對應：zh「台北市大安區敦化南路一段376號11樓」/ en「11F., No.376, Sec.1, Dunhua S. Rd., Taipei City, Taiwan」/ ja「台北市大安區敦化南路一段376号11階」
- JSON-LD（11 頁 PostalAddress）同步 376 號
- 版本 `?v=84`；commit `c175f6b`

---

## v11.2.36（2026-08-26）— 護胰大聯盟衛教知識庫＋語言系統定案

### 知識庫（vocus 自動同步，v11.2.30→36）
- **v11.2.30**：`sync_vocus_kb.py` 抓取 vocus 沙龍（`__NEXT_DATA__` 解析 title/_id/abstract）→ `assets/data-pancreas-kb.json`（20 篇）→ education 頁 kbList 卡片（標題→新視窗原文＋摘要）；cron 每 6 小時自動同步（`sync_vocus_kb.sh`——有變化才 commit/push/CF deploy，無變化靜默）
- **v11.2.31**：**方格子封面圖同步**（thumbnailUrl 20/20；卡片左圖右文；修正節點覆蓋——「優先保留含圖版本」）
- **v11.2.32**：noscript 靜態前 5 篇（無 JS 也可見＋SEO）
- **v11.2.33**：**資料內嵌 HTML**（`window.__KB__`——移除 fetch 依賴；pancad.ai 的 CF assets 保護下仍顯示——先前 fetch JSON 失敗為文章消失主因之一）
- **v11.2.35/36 兩個關鍵 bug 修復**：
  - ① `'zh-TW'.replace('-','')` = `'zhtw'` ≠ `'zh'` → 中文版知識庫被誤判不渲染 → 改 `indexOf('zh')===0`（首碼判斷）
  - ② 內嵌定義 `window.__KB__` 被 sync regex 弄丟（只剩使用）→ 標記機制 `/* __KB_EMBED__ */` 定位更新（sync 腳本同步改標記法）

### 語言系統（v11.2.34）
- **預設依 OS 語系**：navigator.language——zh→中文、ja→日文、**其他一律英文**（localStorage 手動記憶覆寫）
- **各語言分頁標題對應**：每頁字典 meta_title 三語齊全（11 頁 ×3）＋i18n.js 切換即更新 document.title/og:title
- **知識庫 zh-only**：CSS `html[lang="en"/"ja"] .kb-section{display:none}`＋JS lang 首碼檢查（雙保險——en/ja 不顯示方格子文章）

### 部署
- GitHub（多 commit）＋ Cloudflare Pages（?v=83 最終）

---

## v11.2.29（2026-08-24）— 三語配圖分流＋健康台灣深耕計畫＋效能收官

### 圖像與配圖
- **患者旅程 8 幕全部固定背景**（不再隨機池）：幕1 bike+sun_3（10 秒交替，新機制 data-bg-pair）、幕2 咖啡、幕3 CT、幕4 互動比較、幕5 醫師討論、幕6 sun_6、幕7 dinner_ja_2、幕8 新生成陽台星空圖
- **英文版配圖西歐化**：mflux **img2img**（--image-path + --image-strength 0.55）以 zh 圖為底換西歐人種（同場景構圖）——coffee_en/doctor_en/stars_en/bike_en/dinner_ja_en
- **三語背景分流機制**：data-bg-fixed / -en / -ja ＋ data-bg-hd-en/ja ＋ data-bg-pair-en（語言切換即換圖）
- **ip 頁三語擬真圖**（科技護城河意象：R&D 實驗室＋專利文件）moat_zh/en/ja＋固定
- **publications hero 擬真圖**：V1 研究圖書館＋V2 國際會議，**15 秒交替**（data-pair-ms）
- **AUC 章節**：改用論文實際 Figure 3（Radiology 220152——4150×6032 原始圖）＋來源標注（三語＋論文 URL）

### 文字與內容
- 判讀人次 **2156+ → 2000+** 且**移除自動遞增**（靜態）
- 「從實驗室到病床」→「從基礎研究到臨床照護」（三語）
- 里程碑修正：**2019→2016**（王偉仲＋廖偉智團隊啟動研究）、**2021→2019**（多中心驗證）——依新聞佐證（FDA Breakthrough 實為 2023/11 非 2024）
- hero 文案：「天亮之前的第一道光」→「影像診斷 AI…治療時機」；day_t「看似平常的一天…」；product「掃描剛結束，AI 已完成分析」
- **數字統一 logo 橘單色**（移除所有漸層：.hm b/.v622-num/.live-count/.stat b/.hero-title .hl 等 8 處）
- 服務時間 09:00–17:00（三語）
- 英文「台／美」→「Taiwan / US」（en p3_hx 補齊）

### 動態與效能
- 光子粒子慢速（上升 6-13s）、光束慢速（18-46s）、重生 3 秒 1 顆
- **所有文字背景色移除**（hero-badge/st-tag/ss-tag/pub-journal/pub-tag；含「不胰憾」殘留漸層）
- **語言偵測改回瀏覽器語言**（zh→中文、ja→日文、其他一律英文；localStorage 記憶覆寫）
- data-i18n HTML 值修正（flow2_d/ui_sub/ui_shot → data-i18n-html——sup® 亂碼修復）

### 健康台灣深耕計畫（中文版）
- **deep-plan 獨立頁**（deep-plan/index.html——完整複製 pancadai/index.html 架構與圖；「聯繫我們」改 mailto:info@pancad.ai；**加衛生福利部許可證：衛部醫器製字第007946號**）
- **3 個入口**（zh-only）：①首屏 CTA 橘色按鈕（btn-deep）②右下浮動按鈕（deep-float）③footer 網站導覽連結
- sitemap 加入 deep-plan/（12 URL）
- about 深耕區擴充為「三大核心精神」（痛點＋PanCAD 解方）

---

## v11.2.28（2026-08-14 15:40）— 12 項修改批次
- 文案 4 處（hero_sub/day_t/ph_h1）、數字單色、粒子/光束慢速、標題漸層移除、里程碑 2016/2019、服務時間 09:00–17:00

## v11.2.27（2026-08-21 14:39）— 2000+ 靜態＋文案
- 2156→2000 靜態（移除每秒 +1）、「從實驗室到臨床」、FAQ 修正（顯影劑＋高風險族群）

## v11.2.26（2026-08-21）— 手機效能＋AUC 圖
- hero 影片手機停用、光子減量、img srcset（480 webp -90%）、背景 640 webp（54 張）、LCP preload（fetchpriority=high）、CLS 修復（img 尺寸）、AUC 擬真圖（後改論文原圖）

## v11.2.25（2026-08-14 15:20）— 敘事性專利描述
- ip 頁「保護主題」改敘事性（無編號/無術語/無連結）——美 4 台 6 敘事段落

## v11.2.24（2026-08-17 08:46）— A16/D1 採用＋E1/E2 永久停用
- A16 男+女、D1 平躺無頭枕（2560 HD 採用）；E1/E2 多輪重生成不滿意→永久停用（存檔）

## v11.2.23（2026-08-14 15:41）— Cloudflare＋專利/FDA 連結＋聯絡統一
- Cloudflare Pages 部署（wrangler）、專利 10 件 Google Patents 深鏈（全驗證）、FDA Breakthrough 佐證連結、聯絡資訊統一公司登記

## v11.2.22（2026-08-14 14:30）— 全站無 pad 滿版
- 38 張第二批重生成（bike..yoga+C2+intl30）＋17 張 raw 轉換——全部無 pad cover

---

## 部署與 SEO 附錄
- **Cloudflare**：pancadai-v11.pages.dev（wrangler）＋主域 pancad.ai 綁定（API）
- **AI SEO**：llms.txt＋llms-full.txt（含 510(k)/聯新 50 例/90 萬 CT 量）、JSON-LD @graph（11 頁）、FAQPage（6 題）、GA4（G-8DNS20C93N）
- **效能**：PageSpeed 手機 <50→72、桌面 74→92
- **已知待辦**：CF `.html → 無擴展名` 308 規則待刪除（GSC「替代頁面/重新導向」根因——需 dashboard 操作）
