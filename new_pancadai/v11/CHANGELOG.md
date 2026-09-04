# v11 陽光旅程 — 版本紀錄（CHANGELOG）

> 部署：https://pancad.ai（主域）＋ https://pancadai-v11.pages.dev（Cloudflare）＋ https://health.yangkaichun.net/new_pancadai/v11/（GitHub Pages）
> 主體：v7（患者旅程＋8 幕），整合 v2-v10 優點與 Siemens Healthineers 架構參考

---

## v11.2.51（2026-09-04）— 版權符號 © 上標（全站三語，已部署）

### ✏️ 版權列
- 46 頁 footer `foot_copy` 版權列與 9 頁法律頁（privacy/terms/editorial 三語）結尾的 © 改為 `<sup>` 上標小字；© 移到 i18n span 外（避免 apply() 以字典 textContent 覆寫時失去上標），字典 `i18n-common.js` 三語 foot_copy 同步移除前綴 ©。
- 46 頁 `i18n-common.js?v=` 各自 +1（內容變更快取一致性）。

### ✅ 驗證／狀態
- DOM 驗證 zh/en/jp：span 文字＝「2026 …」且前一 sibling 為 `<sup>©</sup>`（渲染單一上標 ©）、零溢位、零 page error；check_tags 主站 16＋en 17＋jp 14 全平衡；node --check i18n-common.js ✅；本機 qwen2.5vl 檢視截圖確認 © 上標、未重複、無裁切。
- commit 8db0f77 之後新 commit；auto-sync cron 仍暫停中。

## v11.2.50（2026-09-04）— 博田／輔大 B2C 頁導覽列對齊中文版＋健檢中心頁新增導入案例區（本機，未部署）

### 🎨 導覽列（parkone-case-study.html / fju-st-lukes-case-study.html，共用 css/b2c-health.css）
- 上方 menu 由 4 連結改為與主站中文版相同的 10 連結：產品介紹／患者旅程／醫療機構／健檢中心／期刊論文／專利佈局／衛教知識／關於仲智／最新消息／聯絡我們（標籤與 href 逐項對齊 screening.html nav）；保留各頁「了解健檢方案」橘色 CTA。
- b2c-health.css：`.b2c-nav-links` gap 22→18px；連結隱藏斷點 820→1024px（≤1024 只留 logo＋CTA）；`?v` 5→6。
- 實測寬度 768／900／1024／1025／1050／1100／1280／1440 全零水平溢位；1440＋390 無 page error、最後一項按鈕完整在容器內。

### ✏️ 健檢中心頁（screening.html，zh-only）
- 頁面下方（實戰數據表格後、CTA 前）新增「導入實例」區塊：標題「博田與輔大，已把 AI 帶進高階健檢」＋兩張卡片（輔大醫院聖路加健康管理中心 15F／博田國際醫院高階健檢），各含摘要與站內連結（fju-st-lukes-case-study.html、parkone-case-study.html）。
- 依使用者決策 en／jp 版本不動（EN 版維持不公開客戶名單，en/screening.html 仍 0 處醫院名稱）。

### 📌 同批未提交變更
- b2c-health.css 字型 `Microsoft JhengHei`／`Noto Sans TC`（前批 `?v=5`，本次合併升 `?v=6`）

### ⚠️ 狀態
- 驗證：`check_tags.py` 全站 16 頁平衡 ✅；Playwright 三頁（1440／390＋寬度掃描）零溢位零 page error ✅；本機 qwen2.5vl 檢視截圖（兩頁 nav＋健檢中心導入區）版式正確 ✅
- 未 commit／push／deploy；auto-sync cron（每日 9:00）部署前需先暫停。

## v11.2.49（2026-09-03）— 依 Harrison.ai 建議深化 EN US B2B workflow / CTA / evidence（本機，未部署）

### ✏️ EN 內容與 UX
- Product hero 改為 US B2B outcome：`Find pancreatic cancer earlier. Keep your workflow unchanged.`；補 U.S. 510(k) status、`Request a clinical consultation`／`View the evidence` CTA。
- Product 新增 `Why it matters` 三卡：Surface what routine review can miss／Prioritize the cases that need a closer look／Add confidence without adding clicks。
- Product 科學指標帶補 Lancet Digital Health、Radiology 與 Regulatory source links；產品敘述改為 support / flag / decision-support 語氣，避免絕對保證。
- EN 導覽 `Health Centers` → `For Health Systems`；prominent CTA 統一為 clinical consultation。
- Clinical Evidence real-world wording 改為匿名臨床使用口徑；新增 `Scope and limitations` 證據限制區塊。
- Resources/Partners metadata 移除暗示公開客戶名單的文案；EN CSS/i18n common cache version 升版。

### ✅ 驗證／狀態
- EN 17 頁：1440/390 共 34 viewport，零水平溢位、零 page error。
- `verify_site.py`、JS syntax、EN `check_tags.py`、JSON-LD 全部通過。
- auto-sync cron 暫停中，未 commit/push/deploy；完成確認後可恢復排程。

## v11.2.48（2026-09-03）— EN SEO / AI-SEO / GEO / E-E-A-T＋sitemap（本機，未部署）

### 🔎 SEO / GEO
- EN 17 頁 metadata 英文化：移除中文 keywords/og:site_name，補 `author=PanCAD.ai`，`dateModified=2026-09-03`，修正 9 頁 twitter:image 多餘 `>`。
- EN canonical/hreflang/OG URL 統一 `https://www.pancad.ai/en/...`；保留 TFDA 官方許可證字號作可查證 identifier。
- EN JSON-LD 舊中文描述改為英文公開口徑；教育/新聞/產品語意改為英文；不公開客戶名單，創辦人學術 E-E-A-T 隸屬保留。
- 新增 `en/llms.txt`：產品、證據、法規、第三方評論、英文頁面索引與醫療免責；根 `llms.txt` 同步修正舊存活率與部署名單口徑。
- `robots.txt` Sitemap 改指向 `https://www.pancad.ai/sitemap.xml`。

### 🗺️ Sitemap
- 以實際 HTML 檔自動生成 `sitemap.xml`：46 URL＝主站 14＋EN 17＋JP 14＋deep-plan 1；46 唯一、www host、default sitemap namespace、lastmod 2026-09-03。

### ✅ 狀態
- 本機驗證完成，未 commit/push/wrangler deploy；Drive 備份另存於 `16_Pancad.ai/Backup_20260903/`。

## v11.2.47（2026-09-03）— EN 全站美式企業風 UI/UX＋客戶名匿名化＋Voices 第三方聲音＋US 統計 fact-check（本機，未部署）

### 🎨 EN 企業風改版（css/en-us.css v4；僅 en 17 頁載入，zh/jp 不受影響）
- 研究依據：Harrison.ai / Viz.ai / Qure.ai / Lunit / DeepHealth 五家（2026-09-03 逐頁研究）
- 使用者定案：US 優先、不公開客戶名單、RSNA+editor 評語當見證、科學指標帶；視覺「大幅轉向美式企業科技風（白底×深藍×大留白×極簡卡）」
- 新建 `css/en-us.css`：白底＋系統字體＋深藍墨、nav 純白＋Contact 藥丸 CTA、深藍方匡 hero（kicker #ffc46b 800 放大）、日光/光子/光影動效全關、卡片極簡（細邊淺影 r18）、白/淺灰章節節奏、頁尾 CTA 深藍滿版、PACS/cert emoji→線條 SVG、Voices 卡
- product.html（EN 落地首頁＝index meta-refresh 導向）：hero 深藍玻璃方匡＋雙 CTA、數字列暗底分隔、修 head meta bug ×3；publications/regulatory 掛載＋hero 雙 CTA＋證書牆圖標；其餘 14 en 頁掛載；patient hero 統一深藍白字；day-card/journey 玻璃白化
### ✏️ 內容誠實性（P0②）
- A/B：13 頁 JSON-LD 中文 description＋具名部署 → 英文公開口徑；publications footer／regulatory FAQ／news「Starting from NTUH」／clinician anchor「NTUH breakthrough」→ 匿名化（C 類創辦人學術隸屬保留）
- publications.html「Patent list (10)」誤植 fallback → 5 international publications（字典原正確，bake 缺口）
- US 存活率 fact-check（P0④）：三語 about／screening 舊口徑→整體約 13%、侷限期約 44%；index FAQ JSON-LD「80% / under 10%」→13% overall / 44% localized（ACS＋NCI SEER 2026-01 一致）
### 🔊 Voices from the field（P0①定案上稿，product＋clinician）
- 三卡逐字引文＋出處：Linda Moy（Radiology 主編，RSNA Margulis 2023）、Aisen & Rodrigues（Radiology editorial 2023）、Chu & Fishman（Lancet DH Comment 2020）；框架「studies behind PANCREASaver®」；Lancet CC BY-NC-ND 短引＋連結
### ✅ 驗證
- Playwright：17 頁 ×1440/390 零水平溢位、零 JS 錯誤；JSON-LD 全 parse OK；`node --check` OK
- 視覺自檢（qwen2.5vl）hero/kicker/見證卡/證書牆全數可讀無遮擋
### ⚠️ 狀態
- **未部署未 commit**（auto-sync 每日 9:00 cron 需留意）；待使用者 Safari 實機驗收 → OK 才部署

## v11.2.46（2026-09-02）— GSC「產品摘要 aggregateRating 欄位未填」修正：移除 Product/Offer/Brand schema 節點（16 頁，未部署）

### 🔧 根因
- GSC Rich Results「產品摘要」報錯「`aggregateRating` 欄位未填」（開始 2026/8/29、驗證失敗 2026/9/2；樣本：/patient、/en/terms(.html)、/contact、/publications、/ip）
- v11 全站 JSON-LD @graph 曾依 84e5647「內容型 schema 33 頁」注入 `Product`（#product）＋巢狀 `Offer`（**price 0 TWD / InStock / url→contact.html**）＋ `Brand`——無任何真實 `aggregateRating`/`review`，且醫材無零售價、$0 InStock 屬虛構商業資料 → Google Product snippets 無法呈現、回報缺 aggregateRating
- zh 子頁（patient/contact/publications/ip 等）已於 1d85d88（2026-08-29）移除 Product 節點，但 **product.html、jp/product.html、en/ 14 頁仍帶**——GSC 樣本含 zh 頁是移除前的舊爬取；本次把殘留全部清掉

### ✏️ 修改（16 檔、-514 行、零新增）
- 移除 JSON-LD `@type: Product` 節點（含巢狀 Brand/manufacturer/offers）之頁面：`product.html`、`jp/product.html`、`en/{about,clinician,contact,editorial,education,index,ip,news,patient,privacy,product,publications,screening,terms}.html`
- 保留：MedicalOrganization、Organization、WebSite、MedicalWebPage、MedicalDevice（en/index）、BreadcrumbList、Service、Article、FAQPage、Person——產品語意由 **Service + MedicalDevice 節點**承接
- 手法：`json.loads` → @graph 移除 Product → `json.dumps(ensure_ascii=False, indent=1)` 回寫（原格式化完全一致，diff 純刪除）；en/index.html 結尾 `</script>` 縮排還原
- **未來勿再對無真實用戶評價/零售價的醫療器材頁加 Product+Offer**（誠實數據紅線＋Google review 政策）

### ✅ 驗證（全在本機）
- 45 頁 63 個 ld+json 全 parse OK、零 Product 型別、零 `#product` 引用
- `check_tags.py` 三語平衡（14+17+14 頁）、`verify_site.py` JS/資源/i18n 全綠（僅 en/partners|regulatory|resources 已知誤報）
- `git diff` 16 檔、純刪除、0 新增

### ⚠️ 狀態
- **未部署**（未 commit/push/wrangler）；auto-sync cron 已暫停待使用者指示
- 部署後需在 GSC 該項目按「驗證修正」並等重新檢索（樣本中的 zh 舊頁會隨重新爬取自動清除）

## v11.2.45（2026-08-31）— 中文版口號「活出精彩，不胰憾!!」＋徽章文字深色化（本機修改紀錄）

### ✏️ 中文版 slogan：早一點發現，多一種可能。→ 活出精彩，不胰憾!!
- 使用者指定：中文版 hero 口號改為「活出精彩，不胰憾!!」；**英文版（Catch it early. Live it fully.）與日文版（一日早く見つければ、可能性は広がる。）不變**
- `index.html:376` hero 靜態 fallback：`早一點發現，／多一種可能。` → `活出精彩，／不胰憾!!`——中文版實際顯示以靜態 HTML 為準（js 字典 zh 值未覆寫 hero，改靜態才是真正生效）
- `index.html:22` og:description 開頭口號同步替換
- `manifest.webmanifest` PWA 描述同步替換（胰臟癌早期偵測 AI — 活出精彩，不胰憾!!）
- `js/i18n-index.js` zh 字典 hero_title_1/2 對齊「活出精彩，／不胰憾!!」；`?v=101→102`
- 維持原樣：CTA「活出精彩，不胰憾！」（先前已改，未指示改 !!）、contact 風險結果句「及早發現，多一種可能。」、patient meta「早期發現，多一種可能。」（屬不同句子，其他維持）

### 🎨 hero 徽章「AI 胰臟癌早期偵測」文字深色化
- `css/style.css` `.hero-badge`：文字 `color:#fff → #1a1f28`（與 .hero-title 同深色）；邊框 `rgba(255,255,255,.5) → rgba(26,31,40,.25)`（避免白框配深字）；`?v=96→97`
- 共用 CSS——三語徽章同步深色（hero 構圖相同，視覺一致）

### 📌 同批次工作樹既有未提交修改（先前 session，同批部署）
- 判讀人次 2156+ → 2000+（index.html、js/i18n-index.js、llms.txt、llms-full.txt 等，含 en/jp 對應文案）

### ⚠️ 狀態
- **未部署**（使用者偏好：明確指示才 push／部署）；footer 版本 v11.2.44 未 bump

---

## v11.2.44（2026-08-27）— 共同創辦人・語言切換 v4・GEO 全面強化（完整修改紀錄）

### 🆕 功能：about 頁「共同創辦人」區塊
- 使用者指定：圓形大頭照＋共同創辦人資訊、成就、發表文獻（期刊論文超連結）
- **區塊**：about.html「技術源頭」後、「深耕計畫」前——`#cofounders`：sec-head＋2 張 `.cf-card`（圓形照片 200px＋姓名＋職稱＋簡介＋成就）＋`.cf-pubs` 論文列表
- **照片**：`assets/cofounders/`（wang_weichung/liao_weichih 各 800px jpg＋480 webp）——廖偉智原圖 3461×4625 以人臉為中心裁 1:1（qwen2.5vl 判斷人臉 X50/Y35）＋裁切後本機視覺驗證人臉完整居中
- **王偉仲**（三區塊列表）：🔬 智慧醫療與技術創新成就（FDA 2022＋衛福部 2023／<2cm 敏感度 92.1%＋揪出 92% 病灶／PanCAD.ai 商轉）＋🏆 國內外重大獎項與榮譽（9 項列表：國科會傑出研究獎 2025、TWSIAM Fellow 2025、RSNA Margulis 2023、SNQ 銀獎 2024、台北生技金獎 2024、國家新創獎 2021-23、未來科技獎、徐有庠論文獎 2023、台大教學優良獎）＋📚 學術影響力與重要職位（100+ 論文／國科會數學學門召集人／TWSIAM 理事長／台大醫院智慧醫療中心）
- **廖偉智**（列表＋emoji 標題）：🎖️ 重大成就與貢獻（世界首創 AI 胰臟癌系統＋Discovery 報導／4 美 5 台專利＋咬口器／113 國科會傑出研究獎）＋🩺 研究與臨床專長（內視鏡技術／胰臟疾病診療／跨領域 AI）；**移除 chips**（FDA 突破性醫材認定、TFDA 007946、2156+ 人次）
- **論文超連結**：5 篇共同論文 PubMed 直連（33328124/36098642/34241550/36650440/33624891，target=_blank）
- **UI 強化**：emoji 標題＋橘色漸層線、橘點列表、獎項獨立排版、卡片 hover 浮升
- **三語**：i18n-about.js 新增 50+ 個 cf_* keys（zh/en/ja）＋en/jp bake（靜態語言化）

### 🐛 修正：語言切換系列（v1→v4，最終版）
- **v1**：絕對路徑 `/en/` 跳轉——GH Pages 子路徑（`/new_pancadai/v11/`）下 404
- **v2**：路徑感知（掃描任一段 en/jp）——修正 detect() 與 langRedirect()；17/17＋6/6 測試
- **v3**：一律導引目標語言 index（避免同頁映射 edge case）；發現並修復 **jp 目錄名 vs ja 語言碼比較 bug**（hereLang）
- **v4（最終）**：**一律導引 pancad.ai 語言首頁絕對 URL**（使用者指定）——English→`https://www.pancad.ai/en/`、日本語→`/jp/`、繁體中文→`/`；已在該語言原地；14/14 測試
- 版本：?v=91（33 頁）

### 🆕 系統：本機圖片辨識（skill `local-vision`）
- 安裝 Ollama **qwen2.5vl:7b**（主力）＋**moondream**（輕量）——vision_analyze 模型不支援圖像時的本機替代
- skill 內容：API base64 傳圖、大圖縮 ≤1280、gemma4 佔 GPU 卡 ollama→pkill 重啟、ollama CLI 傳圖無效
- 用途：創辦人照片人臉位置判斷與裁切驗證；SeedVR2（mflux-upscale-seedvr2）圖放大（450×57→1768×224 4x、2368×300）

### 🐛 修正：CF AI Scrapers 封鎖（GEO 稽核 0 分項）
- **稽核發現**：本地 robots.txt 為 Allow 但線上回 Disallow（GPTBot/ClaudeBot 等 9 個）——**Cloudflare AI Scrapers 防護在 edge 自動生成封鎖 robots.txt**（覆蓋靜態檔）＋Bot Fight Mode 擋請求
- **解決**：使用者 Dashboard 關閉 Security→Bots→Bot Fight Mode＋AI Scrapers（wrangler 無 zone 權限；已記錄 skill）
- **驗證**：robots.txt Disallow=0、Allow=13；GPTBot/ClaudeBot/Google-Extended/CCBot/PerplexityBot 全 200（含無 www、三語頁）

### 🆕 GEO/SEO 強化（稽核驅動，全站 33 頁）
- **JSON-LD 型別 8 種**：MedicalOrganization（#org 地址/電話/統編）＋**Organization（#organization）**＋WebSite＋BreadcrumbList＋MedicalWebPage＋MedicalDevice＋**Product（PANCREASaver）**＋**Service（AI 判讀服務）**
- **FAQPage**：index 三語各 7 題
- **Person×2**：about 三語（王偉仲/廖偉智——職稱/獎項/knowsAbout/照片/sameAs）
- **Article**：education/news 三語——**author=Person×2（內聯王偉仲/廖偉智，E-E-A-T）**＋publisher=Organization＋日期
- **日期標記**：33 頁 MedicalWebPage＋meta datePublished（2026-08-14）/dateModified（2026-08-27）
- **canonical**：en/jp 指向語言版（22 頁修正）＋og:locale（zh_TW/en_US/ja_JP）＋twitter:card 全站＋robots meta index,follow＋og:image 絕對 URL 修復
- **內部連結**：全站 33 頁加 `<main>` 語意標籤；首頁 main 區 12 個正文連結（quicklinks 曾加後因與頁尾重複移除）
- **作者訊號**：education/news 可見 byline（三語：作者/著者/Authors＋兩位教授署名）＋Article author Person×2
- **llms.txt**：快速事實段（92.1%/AUC 0.95/FDA/TFDA/2156+ 一行式）＋共同創辦人段＋about/sitemap 行更新
- **llms-full.txt**：「六、產學研團隊與共同創辦人」完整重寫（學歷/研究/成就/9 獎項/經歷）

### 🆕 其他
- **deep-plan 頁**：頂部加 PanCAD.ai 品牌 logo 條（pancad-ai-logo.svg，點擊回主站）
- **jp html lang**：`lang="jp"` → `lang="ja"`（標準語言代碼，kb-section 隱藏與爬蟲判定）
- **footer ver**：v11.2.42 → v11.2.44（33 頁）
- ⚠️ v11.2.43（2026-08-26）補記：jp Line 連結 lin.ee/pZJmfjl→lin.ee/nEYJoLK＋JP QR（line_qr_jp.png）；en 移除全部 Line 連結/QR/line-band；zh 不變
### 📝 當日後續修改（2026-08-27 晚間，同 v11.2.44）
#### E-E-A-T 版面與信任信號
- **footer 內容審查行**（全站 42 頁）：內容製作＋醫學審查（王偉仲/廖偉智教授團隊）＋更新日期＋認證——後移除認證（與信任條列重複）——三語
- **信任標誌**：首頁橫排 chips → **移到頁尾條列**（認證與獎項 5 項：FDA/TFDA/SNQ/RSNA/Lancet——三語標題）
- **臨床部署區**（台大/輔大/博田/聯新徽章）——曾加 grid＋標題——**後全部移除**（使用者指定）
- **版面優化**：foot-eeat 資訊卡（半透明圓角卡）、部署徽章 grid（後移除）、修復 product 舊 footer 結構（footer-legal→補 foot-eeat/社群列）
- **重複清理**：foot-social 按鈕列移除（原本 footer 已有 LINE/Email）、footer-bottom deep-plan 連結移除（欄內保留）、Email 文字加 mailto 超連結（三語）
#### SEO/GEO 報告驅動（SEOmator 89/100＋82/100）
- **H1 換行清理**（index/patient 三語——稽核 H1 含 
）
- **_headers 安全標頭**：HSTS（含 preload）＋CSP＋XCTO＋XFO＋Referrer＋Permissions（Security 6/10→10/10）
- **Organization sameAs**：全站 33 頁加 YouTube（@pancad）＋GitHub
- **llms.txt 內容治理段**：作者/同行審查/醫療免責/數據誠實＋三政策頁連結
- **screening HowTo schema**（4 週導入流程）＋**效能數據表**（92.1%/92.8%/AUC 0.95/2156+ 附 PubMed 來源）＋**疑問句標題**（三語）
- **product 文獻引用行**（Lancet DH/Radiology PubMed＋醫療器材提醒）
- **skip-link 無障礙**（全站 42 頁三語）
#### GA4 與 CSP 修復
- **CSP 擋 GA4**：connect-src 加 stats.g.doubleclick.net（GA4 之前一直收不到數據！）＋script-src 加 static.cloudflareinsights.com（CF beacon）
- **deep-plan 補 GA4**（獨立頁原本無代碼——G-8DNS20C93N）
- **無 www（pancad.ai）403**：WAF Custom Rule Skip 放行（Security→WAF→Custom rules：http.host eq "pancad.ai"→Skip）→ 200 直出
- **301 統一嘗試**：Bulk Redirects（CSV：pancad.ai/*→www/$1 301）未生效（規則 Deployed 但請求直出 200）——**採雙域名並存**（canonical 指向 www、GA4 統一收 www）——替代方案 Redirect Rules 已記錄 skill
- **GA4 ID 確認**：全站統一 G-8DNS20C93N（主控台 G-Y0D8WJM75R 非網站代碼——GA4 後台另一資源）

---


#### deep-plan 頁修復與 RWD 優化（使用者回報「跑版」）
- **跑版根因**：hero 背景圖 `image/hero-banner-ai.jpg` 404（從未存在——CF 404 fallback 回 HTML 造成混淆）＋原版**完全無手機 RWD 規則**（僅 3 個 min-width:992px）
- **修復**：hero::after 回歸原版引用（hero-banner-ai.jpg——純漸層=原版視覺；曾暫換 product-ui-demo.jpg 後依使用者「原版架構」回歸）
- **RWD 優化**：補 991/767/575 三斷點——hero 字級 clamp、padding 縮放、logo 條縮小、badge/compare 標籤縮小、按鈕手機全寬、容器 16px、背景圖手機隱藏
- **logo 條 class 化**：inline style → `.dp-logo-bar`（RWD 可控；使用者 v11.2.44 要求保留）
- **效能**：pancadai.png（1MB）→ pancadai.webp（102KB，10 倍壓縮）
- **壞連結**：`www.pancad.ai/page-3`（舊站殘留 ×2）→ mailto:info@pancad.ai
- 使用者提供原版架構（附件）diff 確認：差異僅 v11 建置改動（logo 條/mailto/TFDA 區）+RWD——非跑版來源
- 驗證：deep-plan 線上 200、hero 引用回歸、無 /en 路徑（逐一檢查）

---

## v11.2.42（2026-08-26）— 三語實體子目錄 /en/ /jp/（GSC/GA 分語言分析）
- 使用者指示：「英文版網頁放在 /en、日文版放在 /jp，方便載入 GSC 與 GA 進行詳細分析」
- **架構**：`en/`（11 頁）與 `jp/`（11 頁）實體子目錄——HTML 複製自主站，**資源共用根目錄**（`../css/` `../js/` `../assets/` `../video/` `../manifest.webmanifest` `../deep-plan/`），頁面間導覽連結保持同目錄相對（en/ 內點 nav → en/product.html）
- **i18n.js 子目錄語言優先**：`detect()` 先檢查 `location.pathname`——`/en/` 前綴強制 en、`/jp/` 強制 ja（優先於 localStorage/瀏覽器語言）→ 爬蟲與使用者預設即對應語言
- **語言切換跳轉**：`langRedirect()`——主站點 English → `/en/<同頁>`、點日本語 → `/jp/<同頁>`；en/ 點繁體中文 → 主站、jp/ 點 English → `/en/`（不再原地切換）
- **hreflang**：33 頁 head 加 4 links（zh-TW/en/ja/x-default，pancad.ai 絕對 URL，index 用目錄根慣例）
- **sitemap.xml**：12 → **34 URL**（主站 12 含 deep-plan ＋ en 11 ＋ jp 11，lastmod 2026-08-26）
- **版本**：`?v=86`、footer ver v11.2.42（33 頁）；i18n.js node --check ✓、check_tags ✓
- **GA4 不需改**：同一 GA4 ID，路徑自動區分（/en/xxx、/jp/xxx、/xxx）；GSC 可提交單一 sitemap（34 URL）或分語言過濾
- ⚠️ CF「.html → 無擴展名 308」規則對 /en/index.html 會 308 到 /en/（正常服務），GSC 舊站重新導向問題待 dashboard 刪規則

---

## v11.2.41（2026-08-26）— footer 網站導覽欄加深耕計畫連結（zh-only）
- 使用者指示：「中文版本的每一個頁面的最下方網站導覽下面都要有健康台灣深耕計畫的連結」
- 11 頁 footer「網站導覽」欄（foot_nav）最後一個連結（聯絡我們）下新增：`<a class="zh-only" href="deep-plan/index.html" target="_blank" rel="noopener" data-i18n="deep_float_t">了解健康台灣深耕計畫</a>`（index 原本已有，其餘 10 頁批次插入）
- zh-only：`html:not([lang="zh-TW"]) .zh-only{display:none !important}`——中文版顯示、en/ja 隱藏
- 版本：footer ver v11.2.38 → **v11.2.41**（11 頁）；check_tags 11/11 平衡
- ⚠️ 同批 hotfix：**`re.sub` 字串 repl 的 `\n` 陷阱**——`pat.sub("<script>\n"+embed+"\n</script>")` 中 embed 內 json.dumps 的轉義 `\n` 會被 re 模組**解碼成真實換行** → 內嵌 JSON 非法 → 瀏覽器 SyntaxError、知識庫空白。**正解：function repl（`lambda m: ...`）**，re 不對 function 回傳值做 escape 處理（詳見 SKILLS_USED 0.10）

## v11.2.40（2026-08-26）— vocus 知識庫改 room API 全量同步（20→50 篇）
- 改用 `https://api.vocus.cc/api/v2/site/rooms/{roomId}/contents?num=50&...`（roomId 由頁面 `__NEXT_DATA__` fallback key 動態解析）——取代 `__NEXT_DATA__` 內嵌列表（只載前 20 篇）
- 抓全 room/PancreasCare **50 篇**（2026-04-12 ~ 08-25、50/50 有封面、唯一 ID 驗證）
- 其餘流程不變：更新 data-pancreas-kb.json + education.html 內嵌 → sync_vocus_kb.sh（cron a2eb3965a52c 每 6h）有變化才 commit/push + CF deploy

---

## v11.2.39（2026-08-26）— vocus 知識庫自動同步鏈路補齊
- **發現**：v11.2.30 CHANGELOG 宣稱的「cron 每 6 小時自動同步（sync_vocus_kb.sh）」**從未建立**——cron 只有 sync_pancadai.sh（每 5 分鐘 git push），sync_vocus_kb.sh 不存在，方格子發文後 pancad.ai 不會同步
- **補建** `~/.hermes/scripts/sync_vocus_kb.sh`（watchdog 模式）：
  - 跑 `sync_vocus_kb.py` → 更新 `data-pancreas-kb.json`＋education.html 內嵌 `window.__KB__`
  - **articles 內容快照比對**（排除 updated_at）：無變化 → 還原 updated_at 假變更、完全靜默；有變化 → commit+push（GH Pages 自動重建）＋ `wrangler pages deploy`（CF Pages / pancad.ai 主域）
- **cron**：`a2eb3965a52c`（every 6h、no_agent、deliver=local）——方格子發文後最長 6 小時內自動上線兩站
- ⚠️ **已知限制**：vocus `__NEXT_DATA__` 只內嵌部分文章列表（實抓 20 篇 vs 頁面 articleCount 93）——超過內嵌上限的新文章可能漏抓，需後續擴充分頁 API

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
- commit a984c6c（auto-sync）；**三處全上線**：GitHub Pages（health.yangkaichun.net 雙路徑）＋ CF Pages（wrangler deploy `62acc09c`，www.pancad.ai / pancadai-v11.pages.dev 皆 v85）

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
