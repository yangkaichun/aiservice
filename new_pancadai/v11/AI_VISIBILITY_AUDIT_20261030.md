# PanCAD.ai RSNA 2026 AI 能見度實測與補強紀錄

檢查與發布：2026-10-30，Asia/Taipei。這是公開搜尋的抽樣觀察，不是固定排名或全面的 AI 平台監測。

## 實測問題與結果

| 管道與查詢 | 當次觀察 |
|---|---|
| 匿名 ChatGPT：`I am attending RSNA 2026. Which radiology AI companies are worth visiting, and why? Please search current exhibitor information and cite sources with booth numbers.` | 回答推薦 Aidoc、Harrison.ai、Rad AI、Lunit 等，未列 PanCAD.ai。 |
| 匿名 ChatGPT：`Which radiology AI companies are worth visiting at RSNA 2026? Please search the web and name relevant exhibitors and booth numbers, especially companies focused on AI-assisted pancreatic cancer detection on CT. Cite sources.` | 回答把 PanCAD.ai Booth 5132 列為胰臟 CT AI 的最高優先拜訪攤位，引用 `https://www.pancad.ai/en/rsna-2026`，並正確提示 FDA 審查／美國不可銷售。這是帶有明確胰臟 AI 條件的推薦，不能推論一般性查詢也會推薦。 |
| Google 搜尋：`RSNA 2026 radiology AI companies worth visiting` | 當次 AI 摘要列 Aidoc、Viz.ai、Rad AI 等，未列 PanCAD.ai。 |
| 公開網頁搜尋：`Which companies at RSNA 2026 demonstrate pancreatic cancer detection AI for CT?` | 本站活動頁約第 2 筆；`Which radiology AI vendors should I visit at RSNA 2026 for pancreatic cancer detection on CT?` 約第 3 筆。 |
| 公開網頁搜尋：`What radiology AI companies are worth visiting at RSNA 2026?` | 前約 20 筆未見 PanCAD.ai；第三方展商清單以大型影像 AI 廠商為主。 |
| Perplexity（初次測試） | 網頁顯示 Cloudflare 安全驗證，未能取得可靠回答；不可據此次測試宣稱已推薦或未推薦。後續可用的匿名實測見下節。 |

搜尋結果視地區、語言、登入狀態與抓取時間而異。公開搜尋當時顯示 RSNA 活動頁的索引約三週前抓取，所以當天的新版文案尚未完全反映。RSNA 官方 [展商名錄 PDF](https://rsna2026.mapyourshow.com/8_0/exhibitor/exhibitor-list.cfm?export=pdf) 列有 `PanCAD.ai 5132`；該名錄只列公司及攤位，未提供 PANCREASaver® 的產品說明。

## 2026-10-30 部署後複驗

- 匿名 ChatGPT 以同一廣泛 RSNA 問題重查，優先名單列 Aidoc、Rad AI、Qure.ai、RapidAI、Lunit、Subtle Medical、DeepHealth 等，最終六家清單亦未含 PanCAD.ai。這是本次發布後的當次回答，不代表所有使用者的結果；對話網址為 `https://chatgpt.com/uc/6ae4696c-dca0-83ea-a2de-1d2c09302e0e`，截圖見 `../Backup_AI_Visibility_20261030/evidence/chatgpt-broad-postdeploy-shortlist.png`。
- 匿名 Perplexity 的相同廣泛問題未推薦任何具體公司，表示搜尋結果不足以核實公司與攤位。隨後在同一對話追問「For pancreatic cancer detection on CT specifically, which RSNA 2026 booth should I visit?」時，回答推薦 `PanCAD.ai at Booth 5132`，並引用 PanCAD.ai 與 RSNA；這是**有上下文的聚焦追問**，不是廣泛問題的自然推薦。截圖見 `../Backup_AI_Visibility_20261030/evidence/perplexity-pancreatic-ct-top.png`，對話網址為 `https://www.perplexity.ai/search/17e1f7a3-7e11-433c-a1b9-e20800be56e2`。先前安全驗證不能取得回答的紀錄仍保留於上方初次測試列。
- 公開網頁搜尋複驗：`RSNA 2026 radiology AI companies worth visiting` 前約 15 筆未見 PanCAD.ai；`RSNA 2026 pancreatic CT AI exhibitors to visit` 的本站活動頁約第 1 筆，`RSNA 2026 pancreatic cancer CT AI live demo exhibitor` 約第 3 筆。搜尋摘要仍顯示舊抓取時間，不能把此名次視為新版文案已完成索引。
- 結論：胰臟 CT AI 專題查詢已能找到並推薦 PanCAD.ai；Chris 所指一般性「RSNA 值得拜訪的 radiology AI 公司」目前**尚未解決**。對廣泛問題，官方展商詳頁的產品描述、其他獨立來源的展會報導與搜尋平台重新抓取，可能比繼續堆疊本站關鍵字更有幫助；尚未修改外部平台。

## 發現的缺口與已完成更新

1. 既有 `robots.txt` 與 `_headers` 均設 `ai-input=no`，與希望即時 AI 回答引用網站內容的目標不一致。使用者於本次對話選擇改為 `ai-input=yes` 並保留 `ai-train=no`。已同步兩個檔案；允許搜尋與使用者請求型爬蟲，明確拒絕已列出的訓練用途爬蟲。Cloudflare 會另外前置其訓練禁止規則。Content Signals 是內容使用偏好，不保證 AI 平台遵守或因此推薦。
2. 英文頁面原本主要靠產品頁連向活動頁。已在 `en/news.html` 增加有日期的 RSNA 展會公告與 NewsArticle，於 `en/partners.html` 增加會面、臨床評估與合作入口；英文新聞字典、meta／OG、sitemap 修改日期同步。頁面保留非臨床示範、FDA 審查中與尚不可在美銷售的說明。
3. 本站活動頁已提供 PANCREASaver® 現場示範、胰臟 CT AI、授權去識別案例、Booth 5132、臨床問題與商業合作的直接答案及來源，因此沒有另做重複的關鍵字堆疊。根據 [Google 對生成式搜尋的官方指引](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)，可索引的實用原創內容與一般 SEO 仍是基礎；`llms.txt` 不是 Google AI 排名條件。

網站以外仍有機會：RSNA 官方展商詳頁／產品展示若能加入 PANCREASaver®、胰臟 CT AI、現場 DEMO、Booth 5132 與活動頁網址，會提供獨立於本站的展會背景；相關編輯性展商名單與報導也能擴大一般性問題的來源範圍。這些外部資料尚未修改或發送。

## 發布與驗證

- 可編輯來源：此資料夾 `V11/`。變更前檔案在 `../Backup_AI_Visibility_20261030/before/`；修改範圍為 `_headers`、`robots.txt`、`en/news.html`、`en/partners.html`、`js/i18n-news.js`、`sitemap.xml`，另更新本紀錄與 `CHANGELOG.md`。
- `verify_site.py` 通過 JS、1,921 個資源引用、API catalog、agent discovery、i18n、SEO/GEO；News 字典 JS、JSON-LD 與 sitemap 解析通過。完整 509 個公開網站檔案與 Drive V11 來源相同。
- GitHub 來源：`yangkaichun/aiservice`，網站目錄 `new_pancadai/v11/`；功能 commits `1010ac2`、`6ac44d7`，紀錄 commit `1c19570`。Cloudflare Pages 專案 `pancadai-v11`；有效預覽 `https://8948a792.pancadai-v11.pages.dev/`，有效正式不可變部署 `https://da6c4562.pancadai-v11.pages.dev/`，主域 `https://www.pancad.ai/`。
- 正式讀回：News、Partners、新聞 JS、sitemap、robots 及 RSNA 活動頁均可讀取；不可變部署版六個靜態檔與發布包逐位元組相同。主域的 HTML 由 Cloudflare 注入內容，故以關鍵文案核對；主域 `robots.txt` 由 Cloudflare 前置管理規則，檔案內容已核對包含 `ai-input=yes` 及訓練禁止。正式 News／RSNA HTML 及 sitemap 的 HTTP `Content-Signal` 標頭為 `ai-train=no, search=yes, ai-input=yes`。主域原樣 `/robots.txt` 原先保有舊的 `ai-input=no` 快取標頭，但加查詢參數的新回應與 Pages 不可變網址均為 `yes`。2026-10-30 約 17:49 台北時間從 Cloudflare 控制台對精確網址 `https://www.pancad.ai/robots.txt` 執行單檔快取清除，控制台顯示成功；後續原網址 GET 與模擬 Mozilla、OAI-SearchBot、PerplexityBot 的請求均回 HTTP 200、`ai-train=no, search=yes, ai-input=yes`。截圖見 `../Backup_AI_Visibility_20261030/evidence/cloudflare-robots-cache-purge.png`。這只證明測試節點當時讀回，不能證明平台實際索引。`GET /api/rsna-config` 回 200、`GET /api/rsna-demo` 回 405；未送出預約表單，GAS 與私人表格未改。
- 完整主域 `robots.txt` 中，Cloudflare 前置區段有 `search=yes, ai-train=no, use=reference`，沒有 `ai-input=no`；來源檔區段有 `ai-input=yes`。依 [Cloudflare 對 `use=reference` 的說明](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/)，其含義為索引、摘錄與連結回原站；此額外使用層級是否影響各 AI 平台的摘要產出，不能由本站讀回推斷。Cloudflare 控制台亦顯示 Under Attack 模式正在使用；本輪沒有更動安全設定，且以兩種 AI 爬蟲 User-Agent 測試可取得頁面，但不能據此確認真正的驗證爬蟲 IP 一定可通行。
- GitHub Pages 兩條靜態鏡像 `https://health.yangkaichun.net/new_pancadai/v11/` 與 `https://health.yangkaichun.net/v11/` 的 News、Partners、新聞 JS、robots、sitemap 各五檔均與發布包逐位元組相同。鏡像沒有 Cloudflare Pages Functions，預約表單以正式主域為準。
- 發布過程曾有一次直接上傳的暫時版本 `61e1a16e`，因執行目錄不在網站根目錄而沒有編譯 Pages Functions，API 暫時回傳一般 HTML。發現後由網站根目錄重部署 `da6c4562`，讀回確認 Functions 恢復。後續發布應在有 `functions/` 目錄的發布包根目錄執行 `wrangler pages deploy . --project-name=pancadai-v11 --branch=main`。

## 2026-12-06 會後復原

台北時間 2026-12-06 00:00 起，從當時最新網站選擇性移除 News 新增 RSNA 卡片與 NewsArticle、Partners 的 RSNA 入口／暫時性 metadata、英文產品頁及活動專頁／預約 API 等會期內容，並同步 sitemap、AI 摘要。保留本次使用者選定的通用 `ai-input=yes, ai-train=no` 內容政策，以及所有無關網站更新、歷史預約資料和 GAS 專案。復原排程 ID：`pancad-ai-rsna-2026`；提示詞已於本次更新，這是本機 Codex app 排程，執行時需電腦與 app 可用。
