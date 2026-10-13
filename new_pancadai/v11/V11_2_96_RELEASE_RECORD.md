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
- 功能與來源已準備；部署命令成功、正式網址讀回及 GitHub Actions 結果會在發布後補記。
- 回退需選擇性反轉本輪文獻與搜尋資料，保留公告、Cookie、RSNA 及其後無關更新；含 Functions 的發布根目錄重發並讀回。
- 原檔與 QA 保存在 repository 外層 backups/v11_publication_release_20261013/；不隨網站發布。
