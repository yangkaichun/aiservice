# v11.2.95 文獻新增與驗證紀錄

日期：2026-10-13（Asia/Taipei）。狀態：本機及掛載 Google Drive V11 來源更新；未 commit、push 或 deploy。

## 內容與來源

- 三語文獻館由 5 篇增為 6 篇；新增使用者指定的 2026 Diagnostic and Interventional Imaging 研究。
- 原始作者及題名、107(7–8):265–275、DOI 10.1016/j.diii.2026.01.007 已以 [PubMed](https://pubmed.ncbi.nlm.nih.gov/41622045/) 與 [出版社](https://www.em-consulte.com/article/1790529/artificial-intelligence-for-early-detection-of-pan) 核對。Po-Ting Chen* 保留通訊作者註記。
- 新增精簡研究摘要與繁中／日文翻譯，僅描述回溯性病例對照研究與影像範圍。完整資料見 references/publication-diii-2026.md。
- 更新直接引用文獻總數的首頁、產品、臨床證據、編輯政策及英文資源等入口；AI 摘要、meta／OG、JSON-LD 與 sitemap 同步。
- 日文文獻頁原本的聯絡／專利 fallback 更正為文獻內容。原有五篇卡片 HTML 及每語言 37 個 p1–p5 字典值與備份相同。
- llms-full.txt 中兩位作者的 5 篇通訊作者論文數屬不同指標，維持原文。

## 本輪驗證

- verify_site.py 通過：JavaScript syntax、1,914 個資源參照、API catalog、agent discovery、i18n keys 與 SEO／GEO structure。
- 三語文獻頁 HTML 標籤平衡、JSON-LD 解析、六張卡片與新增研究 11 位作者資料檢查通過；git diff --check 通過。
- Playwright：三語文獻頁各於 1440px／390px 檢查，共六組；另驗證三語產品頁的文獻總數。共 9 組、69 項檢查通過；三語文獻頁均無 page error、console error 或本機資源錯誤。
- 六組文獻頁均有六張卡片、正確總數、DOI／PubMed 連結、完整作者及期刊資料；新卡僅顯示一份對應語言摘要，無頁面或新卡文字水平溢出。
- 英文手機卡的長單字原先超過研究標籤內寬，改為 Earlier CT，完整保留「診斷前 1–12 個月」說明。
- 三語桌機／手機新卡截圖已逐一人工檢視。局部卡片截圖於捕捉期間隱藏固定 Cookie／公告控制，便於檢視卡片文字；整頁截圖保留原介面。
- 相關英文產品頁與中文版結構不同，因此英文總數檢查使用其實際 All 6 publications 連結；此 QA 校正不更動網站。

## 保存與同步

- 修改前 30 個涉及檔案的本機／Drive 版本完全相同，逐檔 SHA-256 見備份 baseline_manifest.json。
- 修改前副本、本輪後副本、QA 腳本／報告／截圖保存在 repository 的 backups/v11_publication_20261013/，及 Drive 的 Backup_Publication_20261013/。備份在網站 V11 來源外。
- 只同步本輪變更檔案；SHA-256 同步結果見備份 synchronization_manifest.json。這是掛載資料夾內容比對，未另查 Google Drive 伺服器端上傳完成狀態。
- 本機預覽：http://127.0.0.1:8139/publications.html?lang=zh#diii-2026；英文及日文分別使用 en/publications.html、jp/publications.html。
- 正式網站本輪未部署，保留既有正式版本。
