# v11 陽光旅程 — 專案結構與本地路徑

## 本地資料夾

```
/Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v11/
```

## 目錄結構

| 路徑 | 說明 |
|---|---|
| `index.html` … `contact.html` | 11 個頁面（product/patient/clinician/screening/publications/ip/education/about/news/contact） |
| `deep-plan/` | 健康台灣深耕計畫獨立頁（zh-only） |
| `css/style.css` | 全站樣式（背景池／光子粒子／知識庫卡片等） |
| `js/` | `i18n.js`（語言偵測與切換）＋`main.js`（背景池/HD 漸進/動畫）＋`i18n-*.js` 11 個語言字典 |
| `assets/` | 背景圖池（hero_sun×17／hero_intl×30／海報／CT／晚餐）、內容圖、`data-pancreas-kb.json`（知識庫）、`停用圖檔存檔區.md` |
| `assets/_gen_v11/` | mflux 生成 raw 源圖（1600/2560 無 pad） |
| `video/` | hero 背景影片（hero_morning.mp4/webm） |
| `gas/` | `contact_email.gs`（GAS 收信程式碼備用） |
| `functions/` | （已移除——wrangler 4 不支援 Pages Functions 自動編譯） |
| `sync_vocus_kb.py` | 護胰大聯盟知識庫 vocus 抓取腳本（標題/摘要/封面/連結） |
| `CHANGELOG.md` | 版本紀錄（v11.2.x 全歷史） |
| `SKILLS_USED.md` | Skill 使用與踩坑教訓（0.1-0.6） |
| `FORM_SETUP.md` | 聯絡表單設定步驟（Turnstile+GAS 方案，已棄用改 mailto） |
| `llms.txt` | AI 搜尋引擎/LLM 網站摘要 |
| `sitemap.xml`／`robots.txt` | SEO（12 URL＋lastmod；robots 含 llms 引用） |

## 部署對應

| 平台 | URL | 同步機制 |
|---|---|---|
| **GitHub Pages** | `https://health.yangkaichun.net/new_pancadai/v11/` | auto-sync cron 每 5 分鐘（`sync_pancadai.sh`）＋deploy.yml |
| **Cloudflare Pages** | `https://pancadai-v11.pages.dev/`（主域 pancad.ai） | 手動：`cd new_pancadai/v11 && wrangler pages deploy . --project-name pancadai-v11`（**wrangler v3**） |
| **pancad.ai** | `https://pancad.ai/`（主域，CF 保護） | 綁定 CF Pages（API） |

## 關鍵機制

- **語言**：預設依 OS 語系（zh→中文、ja→日文、其他→英文）；localStorage 記憶；知識庫 zh-only
- **背景圖**：全站無 pad 滿版（cover）；語言分流（zh/ja→亞裔池、en→西歐池）；HD 漸進載入
- **知識庫**：`sync_vocus_kb.py`（cron 每 6 小時）→ `assets/data-pancreas-kb.json`＋education.html 內嵌 `window.__KB__`（`/* __KB_EMBED__ */` 標記）
- **git push**：osxkeychain 失效 → keychain token＋Authorization header 方式

---
*最後更新：2026-08-26（v11.2.36）*
