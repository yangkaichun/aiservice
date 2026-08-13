# v11 PLAN：陽光旅程（Sunlight Journey）

> 以 **v7 為主體**（日光系統／晨光影片／panel hero／sticky nav／真實證據子頁）
> ＋ **所有過往版本優點** ＋ **Siemens Healthineers Cancer Care 架構參考**
> 2026-08-13 提案，待使用者確認後建置

---

## 一、核心概念

**Siemens 參考站主軸：「Elevating cancer care across the entire patient journey」**
（篩檢 → 診斷 → 治療 → 存活，整段旅程串聯）

**v11 對應主軸：「陽光旅程」— 從健檢到確診，每一站都有 AI 的光。**
- v7 的日光系統（晨→午→黃昏→星空）升級為「旅程即陽光」：捲動等於沿著照護旅程前進
- 首頁導入 Siemens 式**產品／主題輪播卡** + **旅程軌 4 站**（篩檢→診斷→治療→追蹤）
- **背景圖左右滿版（edge-to-edge full-bleed）**：所有 hero／section 背景 100vw 無左右留白，內容疊置於上——同參考站視覺語言

## 二、參考站拆解（Siemens Cancer Care）

| Siemens 元素 | v11 導入 |
|---|---|
| Utility nav（MyVarian/Investors/For Patients…） | 精簡保留三語切換器（品牌不變） |
| 主選單 3 大類（About/Products/Resources） | 7 連結：患者旅程／醫療機構／健檢中心／期刊論文／智財布局／最新消息／聯絡我們 |
| Hero「A world without fear of cancer」滿版圖 | Hero「活出精彩 不胰憾」＋晨光影片滿版（左右填滿） |
| Product carousel（6 卡圖＋Learn more） | 首頁產品證據輪播 6 卡（產品／數據／論文／專利／認證／導入） |
| 全寬滿版背景圖（edge-to-edge） | **全部 hero/分隔帶背景 100vw 滿版**（本次優化重點） |
| News / Blogs 日期時間軸 | 最新消息（繼承 v7）+ 新聞樣式微調 |
| Footer mega-menu（4 欄） | 4 欄：網站導覽／產品與證據／期刊與智財／聯絡資訊 |
| Vision 頁 4 支柱（patient experience / personalized care / clinical workflows / innovation） | 受眾三分流（患者／醫療機構／健檢中心）＋旅程軌 |

## 三、資訊架構（8 頁三語 zh/en/ja）

```
v11/
├── index.html          # 滿版晨光影片 hero → 痛點vs希望 → 旅程軌4站(全寬背景)
│                       # → 產品輪播6卡(Siemens式) → 數字帶 → 受眾3卡 → 論文精選3 → 新聞 → CTA
├── patient.html        # 8 幕第一人稱旅程（繼承 v7，幕背景全寬滿版）
├── clinician.html      # AUC 捲動 + 證據 4 卡 + 認證牆 6 + 里程碑 6 + 期刊 3（繼承 v7）
├── screening.html      # 健檢中心軌（繼承 v7）
├── publications.html   # 【本次升級核心】期刊論文館：5 篇真實論文
│                       #   中/英主題 × 真實摘要 × 真實 PubMed URL 超連結
├── ip.html             # 10 件專利 + 3 保護主題（繼承 v7）
├── about.html          # 使命/里程碑/技術源頭 + zh-only 深耕計畫
├── news.html           # 6 則新聞（繼承 v7）
├── contact.html        # 表單 + 5 題 quiz（繼承 v7）
└── education.html      # 衛教知識（繼承 v7，納入導覽）
```

## 四、期刊論文館（publications.html 升級版）— 本次重點

**素材已全部查證完畢（PubMed E-utilities，2026-08-13 實抓）**，5 篇皆台大團隊
（Liu KL 劉高郎／Chen PT 陳柏廷／Liao WC 廖偉智／Wang W 王偉仲）：

| # | 期刊 | 年份 | PMID | 主題（中/英） | 關鍵數據 |
|---|---|---|---|---|---|
| 1 | The Lancet Digital Health | 2020 | 33328124 | 深度學習區分胰臟癌組織（跨種族外部驗證） | <2cm 敏感度 **92.1%**、AI vs 放射科 98.3% vs 92.9%、揪回漏診 **11/12** |
| 2 | Radiology | 2023 | 36098642 | 全國人口基礎研究：CT 深度學習偵測胰臟癌 | 全國 1,473 例、敏感度 89.7%、特異度 92.8%、**AUC 0.95** |
| 3 | Radiology: Imaging Cancer | 2021 | 34241550 | CT 影像組學特徵區分胰臟癌與正常胰臟 | 台/美雙族群驗證、AUC 0.98／0.91 |
| 4 | BMC Cancer | 2023 | 36650440 | 2D/3D 影像組學全國真實世界資料集 | 1,477 例、敏感度 91.8%、AUC 0.947 |
| 5 | J Gastroenterol Hepatol | 2021 | 33624891 | AI 在胰臟與膽道疾病的應用（綜述） | 方法學總覽 |

**每篇卡片設計（Siemens 式卡片 × v7 evidence-card 升級）：**
1. 期刊 chip：`The Lancet Digital Health · 2020`（真實）
2. 主題雙語：`data-i18n` 中文主題／英文主題——**en/ja 版只顯示英文**（文化轉譯）
3. **真實論文摘要**：中文＝原文 Abstract 之翻譯整理（頁面註明）；英文＝原文 Abstract 精簡
4. **論文 URL 超連結**：`https://pubmed.ncbi.nlm.nih.gov/<PMID>/` 真實可點、開新分頁（取代 v7 的檢索式連結，直達論文頁）
5. 關鍵數據 highlight 卡（如 `92.1% <2cm 敏感度`）
6. DOI 標註（真實，不編造）

**資料來源檔：`v11/references/pubmed_abstracts_2026.txt`**（完整摘要原文備查）

## 五、背景圖左右滿版（同參考站）— 本次優化重點

- **原則**：所有 `.page-hero`／`.journey-station`／分隔帶的背景容器改 `width:100vw; left:50%; margin-left:-50vw`（或 section 直接 100% 滿版），**左右零留白**，內容 wrap 置中疊於其上
- **安全版圖沿用**：×0.88 ffmpeg safe 圖（人物不被 nav 切）、`object-position:50% 29%`（露頭頂）——滿版化不破壞既有安全機制
- **背景池沿用**：zh/ja 7 張 sun 圖、en 30 張 intl 圖；9 秒輪換不重複（shown 計數器）
- hero 晨光影片 MP4+WebM（<1MB）繼續滿版播放
- 首頁新增 **Siemens 式全寬分隔帶**（journey 4 站各配一張滿版背景圖）

## 六、過往版本優點盤點（全部納入）

| 版本 | 優點 | v11 納入 |
|---|---|---|
| v2 | 三語 i18n、背景池、安全版圖、HD 漸進載入 | ✅ 全部繼承 |
| v6 | 旅程軌、互動 CT、What-if、AUC 捲動、認證牆、數字帶 | ✅ 全部繼承 |
| v7 | 日光系統、晨光影片、panel hero、sticky nav、粒子、背景去重 | ✅ 主體 |
| v8 | kinetic 標題、3D tilt、magnetic 按鈕、scroll beam | ✅ 揀選（kinetic＋scroll progress） |
| v9 | numpy 光影片（hope/rays/scan） | ✅ 論文館分隔帶沿用 1-2 支 |
| v10 | 真實個案章節、privacy/terms、canvas 星空 | ✅ 個案改放論文館數據卡；legal 頁納入 |

## 七、建置流程

1. `cp -r v7 v11` 為主體 → 逐頁升級（hero 滿版化、nav 加期刊論文連結、footer 加欄）
2. publications.html 重寫（5 篇完整卡片＋摘要＋PMID URL）＋ i18n-publications.js 全新字典
3. index 首頁新增產品輪播 6 卡＋旅程軌滿版分隔帶
4. CSS 升級（full-bleed 系統、輪播、論文卡）→ `?v=N` 全站 +1；footer v11.0.x
5. verify_site.py 全綠 → 三語切換驗證 → 瀏覽器實測 ≥10 次
6. sitemap/robots/manifest 更新 → deploy.yml 加 v11 雙路徑（`v11/`＋`new_pancadai/v11/`）

## 八、部署

- 正式路徑：`https://health.yangkaichun.net/new_pancadai/v11/`（雙路徑慣例：`v11/` 舊路徑同步保留）
- deploy.yml 單 bundle 新增 `v11/` 與 `new_pancadai/v11/`
- 兩階段部署驗證（workflow success → pages build → curl 全 200）
