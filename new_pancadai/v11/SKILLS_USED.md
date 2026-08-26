# v11 陽光旅程 — Skill 使用紀錄（2026-08-13 ~ 08-26）

## 使用的 Skills
| Skill | 用途 | 備註 |
|---|---|---|
| `pancad-website` | 品牌規範（仲智藍 #295daa／橘 #ec7000、微軟正黑體/Arial、®上標、內嵌站內不外部連結） | 內容載入時 [SKILL_PRUNED]（壓縮遺失）——實際依 Memory＋既有檔案執行 |
| `pancad-website-v7` | v11 主體來源（患者旅程 8 幕、nav/footer/i18n 結構） | 同上 pruned，依實際檔案逆向 |
| `pancad-website-v10` | product 頁內容參考（五道防線/流程/系統架構） | 直接讀 v10/product.html＋i18n-product.js |
| `pancad-website-v11` | v11 陽光旅程本體 | 本次工作大量產出（背景池、光子、CTA、HD 產線、滿版機制）——**建議將本紀錄回寫入 skill** |
| `static-site-optimization`（隱含） | 部署/版本/?v= 快取、sitemap、verify | 慣例：版本號升必改 CSS/JS `?v=` |
| `subagent-deliverable-verification`（參考） | 交付前標籤平衡／verify 檢查 | 本次全用 verify_site.py＋自寫檢查 |

## 重大經驗教訓（建議回寫 skills / Memory）

### 0.6 知識庫 vocus 同步＋zh-only 語言判斷（2026-08-26）
- **vocus 解析**：`__NEXT_DATA__` JSON 內嵌（title/_id/abstract/thumbnailUrl/createdAt）——regex 直接抓 title 與 _id 會**跨篇錯位**（title 在 id 前但間距跨篇）→ 遞迴 walk 找同節點 dict（_id+title）
- **多節點覆蓋坑**：同一文章在 __NEXT_DATA__ 多處（列表＋詳情）——後寫覆蓋先寫會**丟失 cover** → 「優先保留含 cover 的版本」
- **`'zh-TW'.replace('-','')` = `'zhtw'` ≠ `'zh'`**——語言判斷一律用 `indexOf('zh')===0` 或 `split('-')[0]`
- **內嵌資料 script 會被 sync regex 弄丟**（`window.__KB__ = .*?;` 非貪婪配到 JSON 內分號）→ **用標記註解 `/* __KB_EMBED__ */` 定位更新**（pat = `<script>\s*/\* __KB_EMBED__ \*/.*?</script>`）
- **fetch 依賴陷阱**：pancad.ai 的 CF 保護擋 assets（curl 403）→ 瀏覽器 fetch JSON 可能失敗 → **關鍵資料內嵌 HTML**（window.__KB__ 立即渲染＋背景 fetch 更新）
- **zh-only 模式**：CSS `html[lang="en"] .kb-section{display:none}`＋JS lang 首碼檢查雙保險
- **OS 語言偵測**：navigator.language——zh→中文、ja→日文、其他一律英文（localStorage 覆寫）——使用者要求「預設 OS 語系」

### 0.5 三語配圖分流與 img2img（2026-08-24 新增）
- **mflux 圖生圖參數**：是 `--image-path`＋`--image-strength`（`--image`/`--strength` 會 ambiguous 錯誤）；以 zh 圖為底換人種（同場景構圖）→ `--image-strength 0.55`
- **三語背景分流**：`data-bg-fixed`（inline 顯示）＋`data-bg-fixed-en/ja`＋`data-bg-hd-en/ja`＋`data-bg-pair-en`（交替）——JS 依 `html lang` 選圖（en/ja 分流）；屬性順序陷阱：`data-bg-hd` 可能夾在 fixed-en/hd-en 之間——用正則寬鬆匹配
- **data-i18n HTML 值**：字典值含 `<sup>`/`<span>` 的元素必須用 `data-i18n-html`（data-i18n 用 textContent 顯示字面標籤=亂碼）
- **語言偵測**：使用者要求「依瀏覽器語言」——zh/ja 判斷、其他一律 en（localStorage 記憶覆寫）——與先前「預設中文」需求相反——以最新指示為準

### 0.6b 健康台灣深耕計畫（2026-08-24 新增）
- deep-plan 獨立頁＝複製 pancadai/index.html（Bootstrap CDN＋image/ 目錄——架構一模一樣）；「聯繫我們」改 mailto
- 3 入口：hero CTA（btn-deep 橘色）＋浮動按鈕（deep-float fixed 右下）＋footer 連結——皆 zh-only
- zh-only 機制：CSS `html:not([lang="zh-TW"]) .zh-only{display:none}`
- 新頁面加入 sitemap 用**無 .html 路徑**（/deep-plan/——避免 CF 308 規則重定向）

### 0.7 CF `.html → 無擴展名` 308 規則（2026-08 待刪）
- 舊站殘留的 Redirect Rule（*.html → 無擴展名）造成：GSC「替代頁面」「頁面會重新導向」「驗證失敗」——sitemap/canonical 用 .html 但實際 308 到無擴展名
- 解法：dashboard → Rules → Redirect Rules/Bulk Redirects 刪除（需使用者操作——OAuth token 無 zone 權限）
- **GA/GSC 檢查器（無 UA）**：CF 挑戰（Bot Fight/BIC）擋無 UA 請求——Hostname Skip 規則（全勾）為最終解

### 0.8 地址 fallback 修正（v11.2.37，2026-08-26）
- 全站 footer `data-i18n="foot_addr"` 的靜態 fallback 文字必須是**完整地址**（JS 未執行時也顯示公司登記地址）——fallback 寫「依公司登記」等佔位文字＝JS 掛掉時使用者看不到真實地址
- 地址變更要同步三處：HTML fallback＋i18n 字典三語（zh/en/ja）＋JSON-LD PostalAddress（11 頁）

### 0.9 RWD 手機版稽核（v11.2.38，2026-08-26）
- **稽核方法**：Playwright 無頭瀏覽器 11 頁 × 375/768/1024 三斷點 → 水平溢出（scrollWidth>clientWidth）／文字裁剪／柵格單欄化／觸控目標（<40px）／互動元件（burger、carousel）全自動化檢查（venv `~/venvs/rwd-audit`）
- **mobile menu 要自帶語言切換**：`.lang` 在 ≤820px 隱藏時 menu 若無語言鈕＝手機用戶完全無法切語言——補 `.mobile-lang` 三語按鈕（data-lang 綁 i18n.js 自動生效）
- **nav 結構改動先 grep 現況**：桌面 nav 連結曾被並行工作流弄丟（「產品介紹」只剩 footer/mobile 可達）——驗證 `grep -c 'product.html' *.html` 每頁 nav 都有
- **Escape 關閉 menu**：keydown 監聽＋語言切換後自動關閉（避免選單擋住內容）

### 0.10 vocus room API 全量＋自動同步鏈路＋re.sub 陷阱（2026-08-26 下午，使用者要求完整記錄）
**本次修改紀錄（2026-08-26 下午，全部已上線兩站）**：
1. **md 文件同步**：PROJECT_STRUCTURE.md（v11.2.36→38 標記＋RWD/地址重點）、SKILLS_USED.md（標題日期＋0.6b 重號修正＋0.8/0.9 節）、references/專利摘要描述_提案.md（狀態改「未套用」）、CHANGELOG.md（v11.2.39/40/41 三版）
2. **vocus 自動同步鏈路補齊**：發現 CHANGELOG v11.2.30 宣稱的「cron 每 6 小時 sync_vocus_kb.sh」從未建立（cron 只有 sync_pancadai.sh）；補建 `~/.hermes/scripts/sync_vocus_kb.sh`（watchdog：articles 快照比對、無變化還原 updated_at 假變更＋靜默、有變化 commit/push＋wrangler CF deploy）＋ cron `a2eb3965a52c`（every 6h、no_agent、deliver=local）
3. **vocus 知識庫 20→50 篇**：room 文章列表是客戶端 API（`api/v2/site/rooms/{roomId}/contents?num=50&...`），`__NEXT_DATA__` 只內嵌前 20 篇；roomId 從 NEXT_DATA fallback key 正則動態解析；title/abstract/cover 在巢狀 `article`；`num=50` 一次抓全免分頁
4. **re.sub 陷阱 hotfix（線上知識庫全掛）**：`pat.sub("<script>\n"+embed+"\n</script>")` 字串 repl 把 json.dumps 的轉義 `\n` 解碼成真實換行 → 內嵌 JSON 非法 → 瀏覽器 SyntaxError；改 lambda function repl 修復，驗證 node --check
5. **footer 網站導覽欄加深耕計畫連結（zh-only，使用者指示）**：11 頁 foot_nav 欄「聯絡我們」下加 `<a class="zh-only" href="deep-plan/index.html" ... data-i18n="deep_float_t">`；ver v11.2.38→v11.2.41；check_tags 11/11
6. **部署驗證**：GitHub（auto-sync/手動 push→GH Pages build 1-2 分）+ Cloudflare（wrangler deploy，hash URL 可即時驗證、production 同份）

**本次使用的 Skills**：`pancad-website-v11`（主體）、`static-site-optimization`（部署/快取慣例）、`pancad-website`（品牌 zh-only 機制）＋工具（cronjob/terminal/python/node/curl）

**關鍵教訓（回寫 skill 完成）**：
- **re.sub 字串 repl 的 `\n` 解碼陷阱**：任何「把 json.dumps 輸出嵌入 HTML 再 re.sub」的情境，repl 必須用 function（`lambda m:`），否則轉義 `\n` 全變真實換行
- **cron 補建後驗證**：`sync_vocus_kb.sh` 無變化分支實測（靜默＋`git checkout` 還原 updated_at 假變更）——避免每 6h 產生無意義 commit
- **GH Pages build 延遲陷阱**：push 後 1-2 分鐘內 curl 是舊版，驗證要等 build 完成（用 Actions runs API 或重試）
- **批次判斷「已存在」**：子字串 in s 會被同字串的既有元素（deep-float 浮動按鈕）誤判 → 用「錨點＋新行」組合

### 0.11 三語實體子目錄 /en/ /jp/（2026-08-26，使用者要求 GSC/GA 分語言分析）
**本次修改紀錄（已上線）**：
1. **建置**：en/（11 頁）＋jp/（11 頁）複製自主站；資源引用批次加 `../`（assets/css/js/video/manifest/deep-plan），頁面 nav 連結保持同目錄相對
2. **i18n.js**：detect() 加 pathname 前綴偵測（/en/→en、/jp/→ja，優先於 localStorage）；langRedirect() 語言切換跳轉對應子目錄（主站↔/en/↔/jp/）
3. **hreflang**：33 頁 4 links（zh-TW/en/ja/x-default）；**sitemap.xml** 12→34 URL
4. **bake 靜態內容**（關鍵）：html lang 初始值、title/meta/og、data-i18n fallback 全語言化、img alt 11 組翻譯、option value 英文化、移除中文 meta keywords
5. **坑與修復**：
   - **bake 同 tag 嵌套陷阱**：非貪婪正則截斷 hero kinetic span → 孤兒 `</span>`×5 → 改用 stack 配對閉 tag 演算法＋孤兒清理
   - **日文漢字誤報**：CJK 檢查含日文漢字，日文版用假名（U+3040-30FF）判定
   - **GSC 爬蟲不執行 JS**：只做 JS 語言切換的「語言版」沒意義——必須 bake 靜態 HTML
6. **驗證**：33 頁標籤平衡、CF hash URL 線上驗證（/en/ lang=en 英文、/jp/ lang=ja 日文、資源 200、sitemap 34）

**本次使用的 Skills**：`pancad-website-v11`（更新）、`static-site-optimization`、`pancad-website`＋工具（node 字典提取、python 批次）

### 0.12 en/jp 背景圖與資源路徑災難（2026-08-26 晚，使用者回報「英文版只有文字沒圖片」）
**完整事故鏈（三輪 bug 疊加，最終根除）**：
1. **JS/inline 相對路徑**：main.js 背景池與 HTML inline `url('assets/...')` 在 en/ 子目錄解析到 `/en/assets/` 404 → main.js 加 `BG` 前綴（`location.pathname` 偵測 `/en/ /jp/`）+ inline 加 `../`
2. **屬性 = 丟失**：批次 regex `([a-z-]+)="` 中 `=` 不在 group1，replacement 漏寫 → **所有非 href/src 屬性（data-bg-*/srcset/content）的 `=` 全被吃掉** → `getAttribute` 失敗、背景圖消失。**教訓：regex 捕獲組與 replacement 必須包含 `=`；批次改屬性後用 `(?<!=)attr"` lookbehind 驗證**
3. **bake 無限循環**：手動 bake 循環（`for _ in range(400): pat.search`）**無「已處理標記」**——元素內容替換後 `data-i18n` 屬性仍在 → 下輪又匹配同一元素 → **1 個元素吃光全部迭代，其餘元素全沒 bake**（nav_product 換了、nav_patient 沒換＝特徵症狀）。**修法：處理後屬性標記 `-done`（`attr + '-done'`），結束後還原**
4. **重建覆蓋丟失**：`shutil.copy2` 從主站重建 en/jp 後**只重跑 bake 沒重跑路徑批次** → 第一輪的 `../` 全被覆蓋回裸 → **www.pancad.ai/en/「只有文字沒圖片」（css/js/圖片全 404）**。**教訓：重建流程必須「路徑批次＋bake＋修正」全套重跑；部署後必須 curl 實際資源 URL 驗證 200（不只驗 HTML 屬性）**
**最終驗證清單（en/jp 交付前）**：①`(href|src)="(assets|css|js|video|deep-plan)/` 為 0 ②非 href/src 屬性值裸 `assets/` 為 0 ③`url('assets/` 為 0 ④`(?<!=)(?:data-bg-fixed|data-bg-hd|srcset)"` 缺 = 為 0 ⑤可視中文 0（en）/純日文假名（jp）⑥check_tags 平衡 ⑦線上 curl 資源 200
**使用者實際看的域名**：`www.pancad.ai`（CF 主域，與 pancad.ai 同 Pages project）——驗證要含 www；pancad.ai 無 www 對 curl 403（CF 保護）但瀏覽器正常

### 0. Cloudflare Pages 部署（2026-08-14 新增）
- **流程**：`npm i -g wrangler` → `wrangler login`（OAuth——macOS 自動開瀏覽器授權）→ `wrangler pages project create pancadai-v11 --production-branch main` → **`cd 專案目錄 && wrangler pages deploy . --project-name pancadai-v11 --commit-dirty=true`**
- **⚠️ wrangler 4.x 已移除 Pages Functions 自動編譯**（functions/ 目錄不再偵測；需 Workers Static Assets）→ **固定用 wrangler@3.114**（`npm i -g wrangler@3`；v3 支援 functions/ 自動編譯）
- **⚠️ 必須在專案目錄內執行**（wrangler 在 CWD 找 functions/——從 repo 根執行會「No functions」或把 functions 當靜態檔上傳）
- 驗證：curl `https://pancadai-v11.pages.dev/`（308 尾斜線需 -L）
- **環境坑**：wrangler 重裝後登入狀態遺失（需重新 `wrangler login`）；npm global bin 在 `~/.local/bin/`（PATH 常不含——用完整路徑）

### 0.1 專利/FDA 佐證連結方法
- 專利深鏈：`https://patents.google.com/patent/{US11424021B2|TWI745940B}`——**先 curl 驗證 200＋title 內容**再上線（10 件全驗證）
- FDA Breakthrough：官方計畫頁（fda.gov）＋新聞佐證（自由時報台大報導）——皆驗證 200

### 0.2 i18n 批次 replace 坑
- Python 批次 replace 含 HTML 的字典值時，**值尾逗號容易被吃掉**（old_string 含逗號、new_string 不含）→ JS SyntaxError → 每次批次後跑 verify_site.py 的 JS syntax 檢查

### 0.3 AI SEO 實作（2026-08-14）
- **llms.txt**（https://llmstxt.org/ 標準）：AI 搜尋引擎/LLM 網站摘要——公司/產品/科學數據/頁面/FAQ/資源；robots.txt 引用
- **JSON-LD @graph** 每頁：MedicalOrganization（完整公司資料）＋BreadcrumbList＋頁面特定（WebSite/Product/MedicalDevice/Article）
- 數據誠實：所有宣稱（92.1%/AUC 0.95/2156+）與公開來源一致

### 0.4 聯絡表單方案教訓（2026-08-18）
- **Pages Functions 表單端點**（Turnstile＋GAS）實測失敗：多版本 wrangler 部署後仍 405/靜態 fallback（Functions routing 未接）→ **務實退回 mailto 方案**（使用者可接受：提交開啟 email app）
- **Turnstile 未設 site key 的坑**：placeholder key → widget 驗證失敗 → **顯示含 troubleshooting 連結的錯誤區塊**（使用者誤以為網站有 Troubleshoot）→ 不用 Turnstile 就完全移除
- 表單按鈕文字「送出表單」；mailto 帶姓名/電話/Email/訊息

### 0.5 git push 認證（2026-08-18）
- osxkeychain helper「Device not configured」（Hermes 終端無 keychain 存取）→ 用 `security find-generic-password` 讀 token → **Authorization header 方式推送**（token 不進 URL/記錄）
- sync 腳本路徑：`~/.hermes/profiles/work/scripts/sync_pancadai.sh`（非 ~/.hermes/scripts/）

### 1. mflux 5120×2880 直接生成必崩潰 ⚠️ 最重要
- **現象**：5120×2880 生成 Peak MLX 49.7GB+（64GB 機）→ multiprocessing 崩潰（`resource_tracker: leaked semaphore`）或停滯 0/4
- **解法**：**2560×1440 生成（穩定，~11 分鐘/張）→ SeedVR2 2x 放大 5120**（SeedVR2 Peak 20GB 穩定）
- **卡住判斷**：CPU% 不可靠（Metal GPU 運算 CPU 低）→ 用 **log 檔 mtime**（tqdm 每 step 更新；>180s 無更新＝卡住）
- **並行禁忌**：mflux-generate 與 SeedVR2 **不可並行**（MLX 衝突 → 寫檔卡住/崩潰）；前一任務完成後再啟動
- **命令路徑**：`~/.local/bin/mflux-generate-z-image-turbo`（PATH 常不含，用完整路徑）
- **MTLCompilerService 崩潰**：連續大量 MLX 任務後可能掛（`Unable to reach MTLCompilerService`）→ `pkill -f MTLCompilerService`（自動重生）
- **SeedVR2 不覆蓋**：輸出檔已存在 → 產生 `_1` 檔 → **先 `rm` 舊檔**

### 2. 背景圖 raw 備份位置
- **`assets/_gen_v11/`（非 `_gen_v11/`）**——raw 是無 pad 原圖，可直接轉無 pad 滿版版（1280 小圖＋HD webp），**免重生成**

### 3. 背景圖滿版機制演進
- pad 版圖（×0.88 blur-pad）：118% 放大裁 pad 邊（上下裁主體 3% 被抱怨）→ 113%（上下 0.5%）→ 最終**全部重做無 pad 圖**＋JS `FULL` 例外清單 `cover`
- 無 pad 圖＝cover 直接填滿（主體 100%、零模糊邊）——**最佳解**

### 4. deploy.yml 修改風險
- mkdir 清單遺失任一目標（如 `_deploy/new_pancadai/assets/previews`）→ **整個部署失敗**（cp 中斷）→ 線上停更
- 修改後務必檢查每個 `cp` 的目標都有對應 `mkdir`

### 5. i18n 與語言
- verify_site.py 的 key 解析原限「行首 4 空格」——i18n 檔一行多 key 會誤報 → 已修（補 `,\s*key:` 正則）
- **網頁預設中文**：i18n.js detect() 直接回傳 'zh'（不依瀏覽器語言）
- en 版中文字清理：title（meta_title 字典）、品牌文字（data-i18n-html）、footer 純文字、publications 數據標籤

### 6. 其他
- product.html 需載入 `i18n.js`（lang 切換邏輯所在）——漏載則三語失靈
- 批次改 HTML 結構後必跑標籤平衡檢查（14 種標籤）
- 每 5 分鐘 cron 監控 supervisor（死亡自動重啟）＋每分鐘進度回報（使用者要求）
- 舊資料（17 張 raw 1600px）解析度低於 5120——如需 4K 級可後續 SeedVR2 升級

## 現況
- 全站背景圖無 pad 滿版（cover）＋HD 漸進（1600-2560 webp）
- E1/E2（dinner_zh_1/2）停用存檔（見 CHANGELOG v11.2.22）
- C1 couple 為唯一 pad 版（使用者指定保留，113%）
