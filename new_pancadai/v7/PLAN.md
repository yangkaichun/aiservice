# pancad.ai v7 網站規劃 —「陽光即是敘事」總提案

> 參考標竿：Dexcom（人味×產品）、PanCAN（同病種病患教育）、Butterfly（受眾分流）、Cleerly（AI 證據+影片）、Siemens Cancer Care（克制旅程）
> 目標：比 v2–v6 都更好——**以病患為中心、溫暖且迎向陽光**，並首次引入「網站用動態影片」。
> 日期：2026-08-12 ｜ 狀態：提案階段（待使用者定案）

---

## 0. 家族演進診斷（v2 → v6 繼承什麼、揚棄什麼）

| 版本 | 核心概念 | 標誌資產 | v7 繼承 ✅ / 揚棄 ❌ |
|---|---|---|---|
| v2 | 陽光溫暖 × AI 科技融合 | 語言池背景（en 30 張多元種族 / zh-ja 7 張台灣）、三語 i18n、漸進解析度、深耕 zh-only、mflux 生圖管線 | ✅ 三語機制、語言池、深耕規則、漸進載入、生圖管線、PIL 模糊填補安全版背景 |
| v3 | 「一個故事兩個入口」雙軌 | 患者軌 6 幕 scrollytelling、醫療軌證據館、動態光影系統、互動 CT 滑桿 | ✅ 雙軌 IA、光影系統概念、CT 素材；❌ Intro 擋路 3.2s |
| v4 | 「先體驗，再相信」 | 互動 CT 首屏（split/WL/WW/自動演示）、DICOM 視覺語言 | ✅ 互動 CT 語言、病灶標註紅線 |
| v5 | 「煥然一新」A×B×C | 全息 3D 首屏、劇場式捲動、手機 App tab bar、暖光三層、92px 數字帶、原版 logo、版本號徽章 | ✅ 患者視角首屏、原生捲動、App tab、版本號、原版 logo；❌ 特效密度過高 |
| v6 | 「勝過 Siemens」 | 旅程軌 5 站、互動證據（AUC 繪製/What-if/風險自測）、衛教知識庫、克制編輯式設計、背景語言圖池全站化 | ✅ 旅程概念、證據互動、衛教生態、克制節奏、84px 數字帶 v622、全幅背景；❌ 仍是「靜態圖 + CSS 動效」，無真實動態影片 |

**v6 的三個極限（v7 必須突破）**：
1. **靜態的極限**：v6 全站沒有真實影片——所有「動」都是 CSS/Ken Burns。頂級醫療站（Cleerly/Butterfly/Dexcom）首屏已是 motion 或影片。**v7 = 首次引入「網站用動態影片」**（hero 晨光影片、產品演示短片、光粒子動畫背景），用家族已驗證的 Remotion + 台灣女聲 TTS 產線。
2. **「陽光」仍是裝飾**：v6 的暖陽是配色與背景圖；**v7 把光變成全站的物理系統——捲動即日照**（清晨→正午→黃昏→星空，天空色溫、光線角度、陰影方向全部隨捲動流動）。「迎向陽光」從一句話變成使用者親身體驗。
3. **受眾分流仍只有兩軌**：v3–v6 是「患者 / 醫療」雙軌；**v7 加入第三受眾「健檢中心」（篩檢通路）**——這是 PANCREASaver 真正落地場景（300+ 人次來自醫學中心+區域醫院+健檢中心），Butterfly「Individuals / Health Systems / Education」式清晰分流。

---

## 1. 全球參考站拆解（2026-08-12 實抓）

### 醫療 AI 影像（既有研究，v4 延續）
Rad AI / Aidoc / Lunit / Qure.ai / Gleamer / 長佳智能：共通規律＝首屏社會證明、一產品一數字、證據法規基本盤、CTA 直接對轉換；**沒人好好服務患者** → 患者軌是我們的稀缺差異化。

### 本次新增實抓（v7 專用）

| 網站 | 定位 | 值得學 | 不學 |
|---|---|---|---|
| **Dexcom**（美，連續血糖儀） | 消費級醫療器械 | **真人生活攝影當主角**（不是產品圖）；hero 輪播真人故事；「Get started」雙 CTA（患者/醫療）；產品=生活的一部分，溫暖且陽光 | 過多行銷 popup |
| **PanCAN 胰臟癌行動聯盟**（美，病患組織） | 胰臟癌病患服務 | **病患服務先行**：電話/聯絡表單/免費教育包三入口直上首屏；教育知識庫（Pancreatic Cancer 101/症狀/風險評估）結構完整；同理心 tone 與我們同病種 | 紫色沉重感（我們走陽光） |
| **Butterfly Network**（美，手持超音波） | 醫療器械+AI | **受眾三分流**（Individuals / Health Systems / Medical Education）；「With vs Without」比較塊（我們可做「有 AI vs 無 AI」）；產品第一、克制乾淨 | 表單牆過長 |
| **Cleerly**（美，心臟 AI） | 影像 AI | **hero 直接放產品影片**；臨床試驗證據圖（CREDENCE/PACIFIC AUC 曲線）放在首屏；For Patients / Providers / Payors 三入口 | 過度 B2B、患者頁獨立 |
| **Tia / Zephyr AI**（美） | 女性健康 / 精準醫療 | patient-first 文案：**用「病患體驗與結果」描述服務，不用術語**；溫暖真實攝影 | — |
| **Siemens Cancer Care**（德，v6 已拆） | 企業級照護 | 使命句、care pathway、克制留白（v6 已學） | 冰冷 B2B |

**一句話總結：v6 學了 Siemens 的「克制與旅程」；v7 學 Dexcom 的「人味」、PanCAN 的「同理心教育」、Butterfly 的「受眾分流」、Cleerly 的「影片+證據」——最後全都套上我們自己的「陽光」物理系統。**

---

## 2. 2026-27 趨勢增量（v6 之後）

1. **Scroll-driven 光線**：CSS `animation-timeline: scroll()` / `view()` 已在 2026 主流瀏覽器穩定（Chrome 115+ / Safari 26），可以零套件做「捲動驅動」的全頁色溫/光線流動——不再只靠 JS rAF 手算。
2. **網站內嵌 motion**：muted autoplay loop 的背景影片（<2MB WebM）已是醫療站標配；`prefers-reduced-motion` 關閉 + poster 首幀 + 漸進載入是紅線。
3. **內容生態持續升值**：教育庫（PanCAN 式）→ SEO 權威 + 回訪理由；v7 把 v6 衛教知識庫升級為「陽光學堂」（篩檢前/診斷後/追蹤中三階段知識）。

---

## 3. 三個設計提案

### 提案 A「日光敘事」— 光就是主軸（Sunlight as Interface）⭐ 概念首選
**核心概念：全站的光線是一套物理系統——捲動到哪裡，光就到哪裡。**
- 首屏 06:00 晨曦金 → 上午湛藍 → 正午亮白 → 下午暖橘 → 黃昏橙紫 → 結尾星空；CSS 變數（`--sky1/--sky2/--sun-alt/--light-angle`）由 scroll-driven 驅動，整頁天空漸層、光線角度、陰影方向、卡片色溫全部流動
- 「早期發現」被視覺化為「天亮之前的第一道光」：首屏標題在晨光中亮起，捲過旅程五站時天空逐漸放晴
- 病患旅程（篩檢→發現→診斷→治療→追蹤）= 一天的光路徑；結尾「追蹤與生活」= 日落後的星空與家人的燈
- Hero 背景：**動態晨光影片**（mflux 晨光圖 + Remotion 製作 16:9 慢速光線流動 loop，~1.5MB）
- 強項：把「迎向陽光」做到全球唯一；情感 × 教育 × 產品一條線
- 弱項：scroll-driven 光線需全站 token 重整（CSS 工程量大）；手機捲動驅動仍要 JS 備援

### 提案 B「病患的一天」— 第一人稱沉浸敘事（A Day in a Life）⭐ 情感首選
**核心概念：首頁 = 一位 40 歲主角「一天」的捲動電影（Dexcom × PanCAN 人味極致）。**
- 早晨出門→例行健檢→CT→AI 圈出 1.2cm→醫師確認→安心晚餐→家人團聚：8 個生活場景（mflux 擬真圖 + 動態光線），文案全部第一人稱患者視角
- 每場景右下「如果沒有 AI」分支卡（What-if 存活率敘事延續）
- 開頭 6 秒：真實短片（Remotion：晨光 + 鳥鳴感 BGM + 台灣女聲一句話「今天，只是一個平常的日子。」）
- 強項：情感共鳴最強、最「以病患為中心」；直接對齊使用者要求
- 弱項：製作量最大（需 8+ 生活圖 + 1 支短片）；患者頁與首頁易重複

### 提案 C「陽光證據館」— 信任即產品（Sunlit Evidence）⭐ 商業首選
**核心概念：Butterfly/Cleerly 式——產品為核心、受眾三分流、證據互動、影片演示。**
- 首屏：受眾分流（患者 / 醫療機構 / 健檢中心）三張大卡，各自 CTA 直達
- 互動證據：AUC 0.95 捲動繪製（v6 升級）+ <2cm 92.1% 大字報 + 台美 10 專利 + FDA/TFDA 時間軸 + 認證牆
- **產品 demo 短片**（60-90s，Remotion：CT 閱片 + AI 圈病灶 + 台灣女聲旁白）——「不是說給你聽，是放給你看」
- 健檢中心軌（新增受眾）：導入 4 步驟 + 流程圖 + 300+ 人次社會證明 + 聯絡 CTA
- 強項：轉換最強、最商業完整；對齊 300+ 人次部署事實
- 弱項：情感面較弱（需搭配 B 的病人故事區塊）

---

## 4. 建議組合

| 組合 | 內容 | 適合 |
|---|---|---|
| **A×B×C** ⭐ | 光線系統為全站底座 + 病患一天敘事做首屏/患者頁 + 受眾分流與證據館做醫療端 | **推薦**——三案互補：A 是視覺身份（全球唯一）、B 是情感核心（使用者要求）、C 是商業轉換（落地事實） |
| A×B | 日光 + 情感敘事（不做受眾三分流） | 若想聚焦「純病患導向」 |
| A×C | 日光 + 證據館（不做第一人稱電影） | 若工期緊、先求商業完整 |
| C | 純證據館 | 最快、最商業 |

**我的推薦：A×B×C 全都要——A 的光線系統是「陽光」的物理化，B 是「以病患為中心」的敘事化，C 是「醫療 AI 產品」的商業化。三者共用同一套日光設計語言，不是三件獨立的事。**

---

## 5. 技術棧（家族傳統：零外部套件）

| 項目 | 選擇 | 理由 |
|---|---|---|
| 捲動 | **原生捲動** + scroll/rAF（家族紅線：lerp 被打回過）；進階可用 CSS `animation-timeline: scroll()` + JS 備援 | v5/v6 定案，手感第一 |
| 日光系統 | CSS 變數 `--sky1/--sky2/--sun-alt/--light-angle` 由捲動進度驅動（JS 寫變數 + CSS transition 平滑） | 零套件、全站統一 |
| 動態影片 | Remotion 產線：mflux 晨光圖 + Ken Burns + 光粒子 + 可選台灣女聲 TTS → ffmpeg 壓 MP4/WebM（<2MB、loop、muted、poster 首幀、reduced-motion 停用、漸進載入） | 家族影片產線已驗證 |
| 生圖 | mflux（z-image-turbo 1600×900）→ SeedVR2 5120 HD → cwebp q80 | 本地免費 |
| 互動 CT | v4/v5/v6 資產升級（split/WL/WW/自動演示） | 不重造 |
| 證據互動 | AUC SVG stroke-dashoffset、What-if 滑桿、風險自測（v6 升級） | 不重造 |
| i18n | v2-v6 三語機制沿用（zh/en/ja、文化轉譯、深耕 zh-only） | 已跑 5 版 |
| 字型 | 微軟正黑體 / Arial（紅線） | 不變 |
| Logo | **pancad.ai 官方 logo**（v5 assets/pancad-ai-logo.svg 複製） | 使用者明確要求 |
| PWA | manifest + service worker 基本快取 | v5/v6 基礎 |
| 降級 | `prefers-reduced-motion` 全關（含影片替換為 poster） | 無障礙紅線 |
| 本地預覽 | `python3 -m http.server 8771`（8766-8770 已佔用） | 家族慣例 |
| 部署 | sync_pancadai.sh → GitHub Pages（health.yangkaichun.net）；pancad.ai 主網域另行處理 | 家族慣例 |

**效能目標**：Lighthouse ≥95、LCP < 2.5s（4G）、首屏圖片/影片漸進載入（poster/small→HD→影片）。

---

## 6. 資訊架構（7 頁 + 知識庫）

```
v7/
├── index.html      # 【日光旅程首頁】晨光影片 hero → 病患的一天（精簡版 3 幕）→ 旅程軌 5 站（光線版）→ 受眾三分流 → 數字帶 → 風險自測 → 新聞 → CTA
├── patient.html    # 【病患軌】「病患的一天」完整版：8 幕第一人稱（晨→夜，日光色階）+ 互動 CT + What-if + 病人引言
├── clinician.html  # 【醫療軌】陽光證據館：AUC/敏感度互動 + 認證牆 + 期刊 + 導入流程 + demo 短片
├── screening.html  # 【新增·健檢中心軌】篩檢通路：為何做胰臟 AI 篩檢 + 導入 4 步驟 + 流程圖 + 300+ 人次 + 聯絡 CTA
├── education.html  # 【陽光學堂】衛教知識庫升級：篩檢前/診斷後/追蹤中三階段 6-8 篇 + FAQ（PanCAN 式）
├── about.html      # 品牌/里程碑/技術源頭 + zh-only 深耕計畫
├── news.html / contact.html  # 新聞 + 聯絡（含風險自測結果頁）
├── css/style.css   # 全新單一樣式（日光系統 token：--sky1/--sky2/--sun-alt/--light-angle）
├── js/i18n.js + i18n-*.js    # 三語字典（每頁）
├── js/main.js      # 日光系統/旅程/AUC/CT/自測/影片控制/動效核心
├── video/          # 【新增】hero_light.mp4/webm、demo_product.mp4/webm（Remotion 產出）
└── assets/         # v6 繼承 + 新 mflux 生活圖/晨光圖
```

- 預覽埠：**8771**
- 上線策略：與 v6 並行（sync_pancadai.sh 自動涵蓋 v7/）

---

## 7. 製作管線（對應可用 skills）

| 需求 | Skill / 工具 | 說明 |
|---|---|---|
| 生圖（靜態） | `mflux-image-generation`（本地 z-image-turbo + SeedVR2 放大） | Nous Portal 額度不足時的唯一路徑；PIL 模糊填補安全版背景 |
| 動態影片（網站用） | `remotion` + OpenAI 台灣女聲 TTS + `ffmpeg-video-effects`（後製壓縮/loop/WebM） | 產出 <2MB loop 背景影片與 60-90s demo 短片；`pancad-shorts-video` 規範（白底/藍橘/微軟正黑體/®上標）可借用 |
| 程式碼/頁面生成 | 本體寫作（家族：複雜寫作不委派 4B 子代理） | `claude-design` 管設計流程與品味 |
| 設計語彙 | `popular-web-designs`（apple/stripe/claude/airbnb 模板） | 克制留白 × 暖光 |
| 三語 i18n | `multilingual-static-site` / `static-site-i18n` / 家族 i18n.js | 字典遺漏掃描、文化轉譯 |
| 效能/SEO/部署 | `static-site-optimization` + `git-auto-sync`（sync_pancadai.sh cron） | WebP、OG/JSON-LD、?v=N、快取策略、部署驗證 |
| QA | `dogfood`（瀏覽器探索式測試）+ browser_console | 交付前驗證 |
| 本地架站 | `python3 -m http.server 8771`（家族慣例；GitHub Pages 為正式部署） | macOS 原生、零安裝 |

---

## 8. 待確認事項（動工前）

1. **方向**：A×B×C（推薦）？A×B？A×C？C？
2. **動態影片範圍**：①hero 晨光背景影片（必做）②產品 demo 短片 60-90s（醫療軌）③病患一天開場 6s 短片（患者軌）——全做？先做 ①？
3. **健檢中心軌**：新增 screening.html 獨立頁（推薦）？還是併入 clinician.html 段落？
4. **「病患的一天」**：首頁精簡版 3 幕 + patient.html 完整 8 幕，OK？還是只放 patient.html？
5. **日光系統深度**：全站捲動光線（工程量大）？還是首屏+旅程站光線（保守）？
6. **首屏標題方向**：續用「早一點發現，多一種可能」？還是新晨光使命句？

---

## 品牌紅線（全站適用，家族延續）

- 公司全名「仲智數位健康股份有限公司」；統編 89183306。
- 產品「PANCREASaver® 助胰見®」® 上標；中文微軟正黑體、英文 Arial。
- **Logo 一律用 pancad.ai 官方 logo**（pancad-ai-logo.svg，nav/footer/manifest 同步）。
- 對外部署：不列個別醫院，統稱「醫學中心+區域醫院+健檢中心，300+ 人次」。
- 數據：92.1%（<2cm 敏感度）、AUC 0.95、TFDA 衛部醫器製字第007946號、FDA Breakthrough、台美 10 專利、5 篇期刊、9 項獎。
- 深耕計畫內嵌站內、zh-only；英/日文版隱藏入口；三語文化轉譯禁止直譯。
- 禁止自製病灶標註（v4 紅線）：AI 標註只能來自產品真實輸出。
- 2026 讀音「二零二六」；Hero 主角 40 歲上下迎向陽光；英文版背景多元種族；影片白底/淺色調、字幕 y≤950px 留 150px 安全區。
