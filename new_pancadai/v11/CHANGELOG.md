# v11 陽光旅程 — 版本紀錄（CHANGELOG）

> 部署：https://pancad.ai（主域）＋ https://pancadai-v11.pages.dev（Cloudflare）＋ https://health.yangkaichun.net/new_pancadai/v11/（GitHub Pages）
> 主體：v7（患者旅程＋8 幕），整合 v2-v10 優點與 Siemens Healthineers 架構參考

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
