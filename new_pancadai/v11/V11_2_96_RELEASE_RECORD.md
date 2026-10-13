# PanCAD.ai v11.2.96 發布與搜尋可讀性紀錄

日期：2026-10-13（Asia/Taipei）。使用者明確授權「請部署，同時優化 SEO GEO AI-SEO」。

## 發布內容

本輪發布 v11.2.95 的新文獻與 6 篇總數更新，及 v11.2.96 的三語 title／description／H1／Open Graph／Twitter、正式 ScholarlyArticle、CollectionPage、ItemList、語言 BreadcrumbList 與完整六篇 AI 引用索引。sitemap 日期已依實質內容更新，AI 摘要的 URL 數量為實際 54。原有五篇研究摘要與數字維持不變。

正式論文題名與 DOI 以各 [PubMed](https://pubmed.ncbi.nlm.nih.gov/) 記錄核對；新增文獻 DOI：[10.1016/j.diii.2026.01.007](https://doi.org/10.1016/j.diii.2026.01.007)。

## 技術依據

- [Google AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)：可索引、可擷取的可見文字、內部連結與符合實際內容的結構化資料，沿用 SEO 基礎。
- [Schema.org ScholarlyArticle](https://schema.org/ScholarlyArticle)、[CollectionPage](https://schema.org/CollectionPage)、[ItemList](https://schema.org/ItemList)：區分原始學術研究、本站文獻集合頁與六篇清單。
- llms 是既有可選摘要通道，完整 DOI／PubMed 引用讓來源可追溯；本輪不宣稱已提升搜尋排名或 AI 引用率。

## 回退與驗證狀態

- 發布前 Git/GitHub main：32433cb435c2d04aaac5ab526cfb6870dc879804。
- 發布前 Cloudflare：6741b858-cd1f-494f-85b1-e5c03c93b52c，https://6741b858.pancadai-v11.pages.dev。
- 功能 commit：`36f3426b907a65dd030b3aee4a0c8896563bd1d6`，已推送 main。
- Cloudflare 功能部署：https://b39fcce6.pancadai-v11.pages.dev；Worker 編譯及 Functions bundle 上傳成功，正式主域 https://www.pancad.ai/ 讀回新版本。
- GitHub source Deploy：[38327182708](https://github.com/yangkaichun/aiservice/actions/runs/38327182708)，completed/success。
- GitHub Pages build：[38327228494](https://github.com/yangkaichun/aiservice/actions/runs/38327228494)，completed/success；gh-pages commit `eca52e60c0c26474621dab1755a6c19c3e62b5aa`。
- GitHub 鏡像 https://health.yangkaichun.net/new_pancadai/v11/ 與 https://health.yangkaichun.net/v11/ 均已讀回本次提交。
- 回退需選擇性反轉本輪文獻與搜尋資料，保留公告、Cookie、RSNA 及其後無關更新；含 Functions 的發布根目錄重發並讀回。
- 原檔與 QA 保存在 repository 外層 backups/v11_publication_release_20261013/；不隨網站發布。

## 發布後驗證

- 本機 static verifier 通過（1,914 refs）；212 項語意檢查驗證六篇真實引用、三語 metadata／字典／JSON-LD、原有內容保存、54 個 sitemap URL 及四份完整 AI 引用清單。
- 本機與正式主域各 9 組／69 項瀏覽器檢查通過；三語文獻頁分別於 1440px／390px 測試，無頁面、console 或本機資源錯誤，總數／摘要／原文連結與作者資料正常，無水平溢出。測試是 Chromium 的桌機／手機寬度，未宣稱實體手機驗收。
- 四個入口共 140 項讀回檢查通過：本次 32 檔在不可變 Pages 與 GitHub 雙路徑逐檔 SHA-256 相同；主域 HTML 以 title／description／修改日期／canonical／JSON-LD 及新文獻內容核對，非 HTML 逐檔 SHA-256 相同。
- Cloudflare／主域 RSNA 唯讀端點 config 為 200 有效 JSON、demo GET 為 405；未送出表單。
- 主域具有既有 Content-Signal、安全標頭、llms-full discovery Link，沒有 noindex；Googlebot、OAI-SearchBot、GPTBot 的 robots.txt 讀回與許可檢查均通過。不可變 Pages 快照含 Cloudflare 預設 noindex，不作正式 canonical 網址。
- 首輪 GitHub 讀回發生在 Pages build 完成前，因此為舊版；build completed/success 後重讀，四入口全部通過。初次 QA 對不可變快照套用正式網域 noindex 條件，已改為僅要求正式主域可索引，保留首輪證據。
- 正式截圖、來源 manifest、功能部署與 Actions／Pages JSON、完整讀回報告保存在 backups/v11_publication_release_20261013/。

## 來源與文件同步

- 本輪 32 個公開來源檔已同步至掛載 Drive V11，逐檔 SHA-256 相同；references/ 是既有 Git ignore 的本機參考資料，不隨網站發布。
- 本文件記錄已驗證的首次功能部署。其後僅同步本發布紀錄／CHANGELOG／製作階段紀錄時，功能不變；最後文件同步部署與 commit 另保存於非公開備份證據 JSON，避免文件識別自我引用。
