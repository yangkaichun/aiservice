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
- 三語 About metadata、語言字典、AboutPage／ItemList／ScholarlyArticle、Person context／創辦人引用及六篇 DOI／PubMed 對照驗證通過。
- 113 個現行公開文字資產無 510(k)／510k 殘留；備份比對確認 FDA Pending／審查中、尚未取得美國上市許可、Breakthrough 及 TFDA 限定保留。
- PDF 維持六頁；前後抽字及版面確認限定替換，其他五頁渲染逐像素相同，第 5 頁差異限定於原法規卡片。
- 瀏覽器 QA 初次 FDA 入口檢查遇到語言自動導向及換行比對誤判；固定測試 locale／中文 query 並正規化空白後重跑六入口，18 項通過。原始及重跑報告均保留。

## 發布與同步

正式 commit、Cloudflare／GitHub Pages 部署、四入口讀回及 Drive 同步識別將於完成後記錄。

備份及 QA：repository `backups/v11_about_publications_20261013/`；正式站檢查以完成的讀回與瀏覽器報告為準。
