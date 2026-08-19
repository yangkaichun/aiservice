# pancad.ai v6 版本紀錄（VERSIONS.md）

> 本檔記錄 v6 官網每次疊加的版本、動機、修改內容與驗證結果。
> 版本機制：每次修改 → footer 版號 `v6.0.x` ＋ CSS/JS query 升版 → 同步 GitHub → GitHub Pages 重建（約 1-2 分鐘）→ curl 驗證部署站。

---

## v6.0.29 — 旅程站全幅背景（2026-08-12）

**需求**：使用者「背景圖偏要 scale 到視窗邊緣」。

**診斷**：首頁旅程軌 5 站（篩檢→發現→診斷→治療→追蹤）原本是純奶油色漸層（`.scene.sun`），完全沒有背景圖。

**修改**：
- `css/style.css` 新增 **§29.5 `.journey-station` 全幅背景**：`.station-bg` `position:absolute; inset:0; background-size:cover; background-position:center; background-repeat:no-repeat;` ＋ Ken Burns 30s 緩慢縮放 ＋ 左側白色漸層文字保護罩（.9→.1）
- `index.html` 五站各插入 `station-bg` div，掛 `data-bg-pool`（語言圖池系統：zh/ja→台灣 sun 池、en→西歐 intl 池）
- 站內容包在 `z-index:2`（背景之上），文字可讀性不受影響
- 升版：`style.css?v=21`、footer **v6.0.29**

**驗證**：
- 部署站 5 站全部有 `data-bg-pool`＋HD webp（hero_sun_bike/bridge/coffee 等 5120×2880）
- 整頁邊緣像素掃描：10%–94% 區段左緣 11–69、右緣 12–78（>5 = 照片直達視窗邊緣）✓
- 唯一例外：hero 頂部右緣 2.1（照片天空區色彩單純，非縫）✓
- 同步 GitHub 07:27，部署站已更新

---

## 完整版本時間線（v6.0.1 → v6.0.28）

| 版本 | 內容 |
|---|---|
| v6.0.1 | 全站建置完成：7 頁三語、A×B×C（旅程 360°×證據即體驗×暖光編輯敘事） |
| v6.0.2 | `<br>` bug 修復（data-i18n→data-i18n-html）＋光影 v2 級＋數字放大/numPop＋存活率 80% vs 3% 文獻查證修正＋陽光改版（.scene.sun）＋旅程軌進度 cap |
| v6.0.3 | patient.html 晨光重設計「迎向晨光，擁抱未來」：日光色階五幕（ACT 01 06:00 晨曦 → ACT 05 17:00 金光）、金色 hero、白卡金框、太陽光暈呼吸 13s |
| v6.0.4 | 標題「每一個平凡日常，都值得被守護。」金色漸層發光字＋全頁 v2 級動畫（Ken Burns 30s/cardPop/titleSheen/numGlow/quoteBreathe） |
| v6.0.5 | 白罩優化：五幕遮罩 .95/.74/.28 → .42/.30/.14/.02、章節卡毛玻璃 blur(18px) 78% 白、hero 遮罩減淡 |
| v6.0.6 | 背景語言圖池系統上線（v3 機制移植）：74 張圖（intl 30×2＋sun 7×2）、9 秒隨機輪換、依網速漸進（1280 jpg → 5120 webp） |
| v6.0.7~13 | 光影逐步拉滿：光束 140px→220px、光斑 24–40→36–60vmin、塵光 18→24 顆/幕、呼吸光暈、卡片金邊 44→60px、太陽光暈 alpha .75→.9 |
| v6.0.14 | 光影再強化（肉眼可見級）＋**背景圖填滿視窗邊緣**：根因=parallax translateY 露邊 → 移除 parallax 只留 Ken Burns 純 scale、明確 cover+center+no-repeat、遮罩調低；滿版像素實測 act1 左39/右38 全 >6 |
| v6.0.15~17 | 數字帶三輪調整：140.8px→66.6px→**2×2 大卡**（4 欄窄卡 227px 裝不下大字；`.stats` grid 2 欄 max-width 900px）實測 108.8px |
| v6.0.18 | 7 頁加 no-cache 標頭（除錯用，後於 v6.0.27 移除） |
| v6.0.19~22 | inline clamp 雙保險→移除 numPop 動畫→`font-size:124px !important`（除錯過程） |
| v6.0.23 | **v622 數字帶徹底重寫**：全新 `.v622-grid/.v622-card/.v622-num` 類別（CSS 完全碰不到）＋100% inline style＋靜態數字（JS 掛了也顯示） |
| v6.0.24/25 | 數字定案：120→92→**84px**（line-height:1.12，卡片內留 11px 呼吸空間） |
| v6.0.26 | 背景輪換計時器疊加 bug 修復：每元素綁定 `el._bgTimer`，重設前先清除 |
| v6.0.27 | 移除 7 頁 no-cache 標頭（恢復正常快取）；驗證 9 秒輪換精確 |
| v6.0.28 | 全站背景圖升級語言圖池：5 個內頁 hero（clinician/ai_reading/gate_clinician/risk_check 等 1600px 靜態圖）全部改用 5120×2880 HD webp＋9 秒輪換；引言背景升 HD；驗證 education 左右緣色彩度 15.3/11.7 |
| **v6.0.29** | **旅程站 5 站全幅背景（本次）**：§29.5、station-bg cover 填滿、語言圖池、文字保護罩 |

---

## 關鍵決策備忘（後續版本勿倒退）

- **數字帶（v6.0.23 定案）**：`.v622-*` 全新類別＋100% inline style＋靜態數字，與舊 `.stat/.stats` 完全隔離；字級 **84px**；2×2 grid（max-width 940px）。index/clinician 兩頁共用。
- **背景填滿邊緣的技術根因**：parallax `translateY` 會露邊 → 只留 Ken Burns 純 scale；遮罩不能蓋過背景。
- **背景輪換**：語言圖池（zh/ja→sun、en→intl）、9 秒、漸進解析度（netTier）；計時器綁元素（`el._bgTimer`）防語言切換疊加。
- **no-cache 已移除**（v6.0.27）：恢復正常快取，勿再加回。
- **部署除錯優先序**：①部署站未同步 ②瀏覽器快取 ③CSS 本身。
- **驗證標準**：邊緣色彩度 >6 = 滿版；頁面亮度 200+ = 暖陽達標；PIL 為視覺驗證標準（vision 模型對截圖持續失敗）。

## 使用到的 Skills（本專案家族）

- `pancad-website-v6` — 本專案主 skill（v6 專屬設計語言/元件/驗證清單）
- `pancad-website` — 品牌紅線（仲智藍 #295daa/橘 #ec7000、微軟正黑體/Arial、® 上標、三語文化轉譯）
- `pancad-website-v3` — 背景圖池來源（hero_sun_*/hero_intl_* 74 張、5120 HD webp 規範）
- `pancad-website-v5` — v5 全息/暖光歷史與教訓（mflux `--prompt` 陷阱已補）
- `pancad-website-v4` / `popular-web-designs` — 設計語彙參考（apple/stripe 克制留白）
- `mflux-image-generation` — 本地生圖（z-image-turbo 1600×900，Nous Portal 額度不足時的替代）
- `git-auto-sync` — `sync_pancadai.sh` 部署鏈（cron 每 5 分鐘 push → GitHub Pages 重建）
- `static-site-optimization` — 靜態站維護（漸進載入、快取策略）
