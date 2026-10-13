# v11.2.97 三語 About 文獻與 FDA 標籤更新

日期：2026-10-13（Asia/Taipei）

本輪將 2026 年 Diagnostic and Interventional Imaging 研究補入中文、英文、日文 About，統一六篇代表研究的可見清單與搜尋／AI 摘要資料。同時依使用者要求，現行公開網站與案例 PDF 的 FDA 510(k)／510k 標籤改為 FDA；既有 Pending／審查中及尚未取得美國上市許可說明保留。

## 來源與範圍

- 發布基線：`fc775fa90403148288de6dae0c9f4f7673dff248`，Cloudflare `1f1da7ff.pancadai-v11.pages.dev`。
- 六篇研究沿用文獻館已查核的引用；新增研究 DOI `10.1016/j.diii.2026.01.007`，PubMed PMID `41622045`，107(7–8):265–275（2026）。不新增研究效能或監管核准宣稱。
- About 頁前五篇研究、公司使命與創辦人介紹保持；歷史版本紀錄的旧標籤保留以維持發布紀錄。
- 僅提交限定發布清單；發布包由 commit archive 建立，保留 Pages Functions，排除私人 gas、未追蹤素材、預覽及備份。

## 本機驗證

- 全站 `verify_site.py`、JS syntax、JSON-LD、資源／i18n／SEO 驗證及 `git diff --check` 通過。
- 三語 About 1440px／390px 與六個 FDA 狀態入口共 66 項瀏覽器檢查通過；無新研究區文字溢出或頁面／資源錯誤。桌機／手機寬度研究區截圖另存備份。
- 研究區改用固定淺色底，避免既有頁面捲動夜色背景使文獻文字對比下降；修改僅套用三語 About，新樣式載入版本升至 2。
- 三語 About metadata、語言字典、AboutPage／ItemList／ScholarlyArticle、Person context／創辦人引用及六篇 DOI／PubMed 對照驗證通過。
- 114 個現行公開文字資產無 510(k)／510k 殘留；備份比對確認 FDA Pending／審查中、尚未取得美國上市許可、Breakthrough 及 TFDA 限定保留。
- PDF 維持六頁；前後抽字及版面確認限定替換，其他五頁渲染逐像素相同，第 5 頁差異限定於原法規卡片。
- 瀏覽器 QA 初次 FDA 入口檢查遇到語言自動導向及換行比對誤判；固定測試 locale／中文 query 並正規化空白後重跑六入口，18 項通過。原始及重跑報告均保留。

## 發布與同步

- 功能 commit：`882d09047af5617a49f0c9e61e024282faddcd28`，已推送 `main`；初次來源 `c55bff2b65cea49b64af9e54ccc1b5dfe010e683` 由此版的對比修正取代。
- Cloudflare Pages production：`bfa76cac-dca6-4e9f-a9f8-37d22cce1cc0`（[不可變功能版本](https://bfa76cac.pancadai-v11.pages.dev)）；Pages Functions 編譯／上傳完成。初次 `9f94b1da-4897-40fd-9b09-3773f00437bf` 已由此版取代。
- GitHub source [Deploy 38329155500](https://github.com/yangkaichun/aiservice/actions/runs/38329155500) 與 [Pages build 38329217361](https://github.com/yangkaichun/aiservice/actions/runs/38329217361) 均 success。gh-pages commit：`eeffaaac82ebd139dc7c7c1b6fe2dbe9737abc86`，提交標題完整對應功能來源 SHA。
- 四入口讀回共 112 項全通過：不可變 Pages／正式 `www.pancad.ai` 各 31 項、GitHub Pages `/new_pancadai/v11/` 與 `/v11/` 各 25 項。不可變版本、GitHub、非 HTML 資產以 SHA-256 比對；主域 HTML 因 Cloudflare 注入，改用 HTMLParser 精確核對 metadata／canonical／全部 JSON-LD，並確認六篇研究的卡片與引用。
- 正式站 66 項瀏覽器檢查全通過，三語 About 六篇研究及更新後 FDA 入口已生效；1440px／390px 研究區截圖已保存並檢視代表頁。此項為瀏覽器寬度測試。
- 新公開 PDF SHA-256：`f4cb5e7cd84ea58125bb32746132e09cf4b977cfef0c2c3706b14824e7a571bc`，四入口下載與來源相同。
- `api/rsna-config` GET 回 200／有效 siteKey；`api/rsna-demo` GET 回 405，未送出預約資料。正式主域無 noindex；CSP、Content-Signal、完整 AI 摘要 Link 及 Googlebot／OAI-SearchBot／GPTBot 可讀政策保留。
- Drive `16_Pancad.ai/V11` 的 25 個限定發布檔案已同步並與 repository 逐檔 SHA-256 相同；原始檔、截圖與 QA 保存在備份。此驗證涵蓋本機掛載的 Drive 來源。
- 完成後文件同步僅更新 CHANGELOG 與本紀錄；該次最終 commit、部署及文件讀回識別另存非公開備份 `FINAL_DELIVERY.json`，避免在公開紀錄中形成自我引用版本。


備份及 QA：repository `backups/v11_about_publications_20261013/`；正式站檢查以完成的讀回與瀏覽器報告為準。
