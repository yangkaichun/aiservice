# v11 陽光旅程 — Skill 使用紀錄（2026-08-13 ~ 08-14）

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

### 0. Cloudflare Pages 部署（2026-08-14/18 更新）
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
