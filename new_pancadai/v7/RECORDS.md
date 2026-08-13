# PANCREASaver® 助胰見® 官網 v7 — Skills 使用與更動紀錄

> 專案：`new_pancadai/v7/`（pancad.ai 新網站）
> 核心概念：**「陽光即是敘事」（Sunlight as Interface）** — 日光系統 × 病患的一天 × 陽光證據館（A×B×C 三提案全採）
> 紀錄期間：2026-08-12
> 技術棧：零外部套件、原生捲動、三語（zh-TW / en / ja）、pancad.ai 官方 logo

---

## 一、Skills 使用紀錄

### 1. 本次建置實際載入的 Skills

| Skill | 用途 | 狀態 |
|---|---|---|
| `pancad-website-v6` | 查閱 v6 版設計語言、元件、版本慣例 | 已載入（內容曾被壓縮剪除，reload 後取用） |
| `pancad-website-v5` | 查閱 v5 版演進脈絡 | 已載入（同上） |
| `pancad-website-v2` / `v3` / `v4` | 盤點家族演進（v2→v6 設計語言與極限） | 已載入（被壓縮剪除，需 reload） |
| `pancad-website`（v1 原版） | 品牌規範、logo 來源、圖像風格提示詞 | 已載入 |
| `mflux-image-generation` | 本地生圖管線（z-image-turbo 1600×900 → SeedVR2 5120 HD → cwebp） | 已載入並實作 |
| `popular-web-designs` | 54 個真實設計系統參考 | 已載入 |
| `static-site-optimization` | 靜態站維護與優化慣例 | 已載入（內容被剪除，需 reload） |

### 2. Skills 關鍵知識取用重點

- **pancad 家族慣例**（來自 pancad-website-v2/v6）：
  - 本地架站：`python3 -m http.server 8771`（8766–8770 已佔用）
  - 正式部署：GitHub Pages（health.yangkaichun.net），cron 每 5 分鐘自動同步
  - 資源一律帶 `?v=N` 查詢參數；footer 標版本號 `v7.0.x`
  - 品牌色：仲智藍 `#295daa`、橘 `#ec7000`；中文微軟正黑體、英文 Arial
- **mflux 生圖**：`--output`（非 -o）、z-image-turbo 可出 1600×900 擬真解剖圖、SeedVR2 放大勿並行（`_tmp_hd1.jpg` 檔名衝突）
- **網站內容**：要求內嵌站內、深耕計畫 zh-only、navigator.connection 分級漸進載入

### 3. 本次對話沿用（非本輪重新載入）的家族知識

- 數據誠實原則：92.1% <2cm 敏感度、AUC 0.95、300+ 健檢人次（對外不列個別醫院）
- 10 件真實專利（US 4 件＋TW 6 件）、5 篇期刊（Lancet DH／Radiology／Imaging Cancer／BMC Cancer／JGH）、9 項獎
- 真實 logo 取得路線：Wikimedia／snq.org.tw／biodriven.taipei／官方 banner（國家新創獎官網被 Cloudflare 擋）
- PIL 在 hermes venv 壞掉 → 改用 ffmpeg／sips／numpy 做影像處理

---

## 二、版本更動紀錄（CHANGELOG）

### v7.0.1（首版建置）
- 複製 v6 資產 → `v7/assets/`（96 個資產、28M，含原版 `pancad-ai-logo.svg`、CT 真實輸出、7 張 sun＋30 張 intl 語言池）
- `gen_hero_morning.sh` 用 mflux 背景生圖（晨光夫妻圖＋多元種族圖，各 ~3 分鐘）
- 撰寫 `css/style.css`（日光系統全元件）、`js/i18n-index.js`、`js/main.js`（零套件）
- 建置 10 頁 HTML＋三語字典：index／patient／clinician／screening／education／about／news／contact／publications／ip
- ffmpeg zoompan 產出 `video/hero_morning.mp4`（382KB）＋ `.webm`（182KB），<2MB 紅線
- 靜態驗證全過；修 `rebuildKinetic` i18n 語言還原 bug

### v7.0.2（11 項優化）
- 新增 `publications.html`（5 篇真實論文＋PubMed 檢索 URL）、`ip.html`（10 件真實專利）
- 下載 6 枚官方 logo 至 `assets/logos/`
- `.page-hero.panel` 左置玻璃框（左 5%、毛玻璃 20px、暖白遮罩、深色字）
- patient kinetic 深色＋三層光暈、`.cert-logo`、`.dust-layer` 粒子
- 全內頁 hero panel 化；patient 8 幕加粒子層（8×16=128 顆）

### v7.0.3（背景不重複／安全圖／全背景粒子）
- 安全版圖 `hero_v7_morning_couple_safe.jpg`／`hero_v7_morning_intl_safe.jpg`（模糊填補＋人物 contain×0.88，1920×1080）
- 用安全圖重製 hero 影片；背景池 HD 化（en 用全 30 張 intl）
- 全站背景加粒子（index 134 顆）

### v7.0.4（官方藥科獎 logo＋透明遮罩，全站 `?v=5`）
- 取得國家藥物科技研究發展獎官方 logo：browser 直連圖 URL＋截圖＋numpy 定位＋ffmpeg crop → `nobel_med_award.png`（733×639）
- `.hero-panel` 改 `rgba(255,252,247,.58)`＋`backdrop-filter:blur(30px) saturate(160%)`

### v7.0.5（選單列獨立、不 overlap，CSS `?v=6`）
- nav 由 `fixed` 改 **`sticky`** 獨立列（background .96／scrolled .98）— 根本解決「選單遮人像」
- 背景層全部還原 `inset:0`；hero/page-hero padding 縮減補償
- 實測：navBottom 69 = heroTop 69（載入零重疊）、捲動吸頂正常

### v7.0.6（背景往下調 6%，CSS `?v=7`）
- 全站 5 個背景選擇器 `background-position:center → 50% 44%`（下移 6 個百分點）
- 實測全部 computed = `50% 44%`，console 零錯誤

### v7.0.7（背景再往下調 15%，CSS `?v=8`）
- `50% 44% → 50% 29%`（累計下移 21%）
- 實測全部 computed = `50% 29%`

### v7.0.8（病患首屏玻璃框左置 12%，CSS `?v=9`）
- patient.html 首屏（「以患者為中心／每一個平凡日常，都值得被守護。」）包進 `.hero-panel` 玻璃框
- `#patientHero .wrap{margin-left:12%}`（實測左緣距離恰好 12%）
- 手機版覆寫回 4%；`#patientHero .hero-panel{max-width:860px}`

### v7.0.9（移除文字光暈，CSS `?v=10`）
- 移除 `#patientHero h1` 與 `h1 .hl` 的三層光暈（白 20px＋白 44px＋金 90px）
- 實測 h1／hl／p／kicker text-shadow 全為 none；玻璃框 blur 維持

---

## 三、已建頁面（10 頁）

| 頁面 | 說明 |
|---|---|
| `index.html` | 首頁：晨光 hero 影片＋日光系統、病患的一天 3 幕、照護旅程 5 站、三受眾入口、30 秒自測、好消息、CTA |
| `patient.html` | 病患的一天 8 幕（含 CT 互動對比、存活率滑桿）＋玻璃框首屏 |
| `clinician.html` | 醫療機構：證據館（AUC 0.95／92.1%／法規認證）、7 枚 logo 認證牆 |
| `screening.html` | 健檢中心軌（v7 新增受眾） |
| `education.html` | 陽光學堂（衛教知識） |
| `about.html` | 關於仲智 |
| `news.html` | 最新消息 |
| `contact.html` | 聯絡我們 |
| `publications.html` | 5 篇真實國際期刊＋PubMed 檢索 |
| `ip.html` | 台美 10 件發明專利＋TFDA 證號 |

## 四、資產重點

- `assets/logos/`（7 枚）：fda-breakthrough.webp、inno_award_banner.png、nobel_med_award.png、rsna.png、snq.gif、taipei_biotech.png、tfda.png
- `video/hero_morning.mp4|.webm`（382KB／182KB，<2MB 紅線）
- 安全版背景圖 2 張（模糊填補＋人物 contain×0.88）
- `manifest.webmanifest`、`robots.txt`、`sitemap.xml`

## 五、已知限制與決策

- 國家新創獎官網被 Cloudflare 擋 → 暫用官方 banner（已向用戶說明可隨時替換）
- Google Sites 圖片簽章 URL 短時效且 curl/fetch 均被擋 → 走「直連圖 URL＋截圖＋numpy＋ffmpeg crop」繞過
- PIL 在 hermes venv 壞掉 → ffmpeg／sips／numpy 取代
- 背景位置語義：百分比 y 越小圖像越往下（露出頭頂）；兩輪累計下移 21%（50→29）
- `prefers-reduced-motion` 全關；正常快取（勿加 no-cache meta）
