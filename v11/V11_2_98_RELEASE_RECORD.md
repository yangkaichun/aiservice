# v11.2.98 使用規模更新

日期：2026-10-13（Asia/Taipei）

依使用者直接提供的最新統計：PANCREASaver® 研究與商業應用累計已突破 5,500 人次。網站三語使用相同範圍，並在 2026-10-13 里程碑公告及 AI 摘要標示公司累計統計。

## 範圍與基線

- 本輪基線 commit：`cb67bcd0774569528de88554361d4e8c0756da21`；Cloudflare `d24168a7.pancadai-v11.pages.dev`。
- 更新 21 個 HTML 的現行使用規模與三語六份語言字典；四份 AI 摘要、日文健檢頁 metadata／OG、21 頁相應修改日期與 sitemap 一致。首頁／新聞頁新增六張本次里程碑卡片，三語新聞頁各有對應 NewsArticle。
- 可見口徑：中文「研究與商業應用累計人次」，英文「Research & commercial use (person-visits)」，日文「研究・商用利用の累計（延べ人数）」。新統計為累計人次，不將其改寫為獨立患者數或研究樣本量。
- 帶日期的 2025.06／2026.07 新聞原值保留；六篇 ScholarlyArticle、研究樣本 1,473／1,477、敏感度／AUC、第三方 50 例、單院試行 5／10 人、25/day／650/month、FDA Pending／未核准限定均保留。停用的自增計數器維持停用。
- 抽讀兩份公開 PDF 共七頁、SVG／JSON 及圖檔 OCR，未發現本次全站累計舊值，公開 PDF／圖像不需修改。
- 編輯前 34 個涉及來源檔與 Drive 逐檔 SHA-256 相同，原檔保存於 `backups/v11_usage_5500_20261013/before/` 與 `drive_before/`。

## 驗證與發布

- 全站 static verifier／JS syntax／i18n／SEO structure、HTML 資源及 diff 檢查通過。
- 本機語意驗證 829 項全通過：59 處現行累計更新、16 處歷史文字保留、字典 keys 授權範圍、六篇論文 schema 與原研究／案例／PDF 均通過。
- 本機 21 頁 × 390px／1440px，共 42 個 viewport cases、408 項瀏覽器檢查全通過；新數字、研究與商業應用範圍、長標籤及里程碑標題無水平溢出，代表三語統計卡與公告已視覺確認。
- 首輪 preview 在並行載入時因原 HTTP server 連線佇列只有 5 而重設部分 script 請求；診斷確認共用／文獻字典 source 及串行載入均正常。另起同來源 queue_size=256 的本機 preview 重跑受影響頁面後通過，原 trace／初跑／重跑結果均保留。折疊 FAQ 於展開後檢查；既有可選 HD／4K 圖片探測 404 與實際圖片載入分別記錄。

## 正式發布與同步

- 功能 commit：`5f9d3d94265873d34f50a30b03d6f5cb13361333`，已推送 main；發佈包由該 commit archive 建立，保留 Pages Functions，排除私人 gas、未追蹤預覽／素材／備份。
- Cloudflare Pages production：`5eab6ea3-471d-4549-9368-820802415ecf`（[不可變功能版本](https://5eab6ea3.pancadai-v11.pages.dev)）；Worker 編譯及 Functions bundle 上傳完成。
- GitHub source [Deploy 38334423246](https://github.com/yangkaichun/aiservice/actions/runs/38334423246) 與 [Pages 38334470714](https://github.com/yangkaichun/aiservice/actions/runs/38334470714) 均 success。gh-pages：`221f3a2bc79a6ee9a324f6f496153905afe7a7f8`，提交標題完整對應功能來源 SHA。
- 正式站 21 頁 × 390px／1440px 共 42 cases、440 項瀏覽器檢查全通過；三語使用規模與最新公告正常，無新文字溢出或 runtime error，實際載入圖片正常。代表三語手機寬度截圖已保存與檢視。
- 四入口讀回 148 項全通過：不可變 Cloudflare／正式 www 各 40 項，GitHub Pages `/new_pancadai/v11/`／`/v11/` 各 34 項。不可變／GitHub／非 HTML 以 SHA-256 精確比對；主域因 Cloudflare 注入，核對全部 metadata／hreflang／JSON-LD 與新使用量可見區塊。
- 正式主域可索引；CSP／Content-Signal／完整 AI 摘要 Link 與 Googlebot／OAI-SearchBot／GPTBot 可讀政策保持。`api/rsna-config` GET 回 200／有效 siteKey，`api/rsna-demo` GET 回 405；未送出預約資料。
- Drive `16_Pancad.ai/V11` 的 34 個發布檔案已同步並逐檔 SHA-256 相同；驗證範圍為本機掛載的 Drive 來源。原檔與完整 QA 另存 `backups/v11_usage_5500_20261013/` 及 Drive `Backup_Usage_5500_20261013/`。
- 完成後文件同步僅更新 CHANGELOG 與本紀錄。其最終 commit／Cloudflare／GitHub 識別與文件讀回結果另存非公開備份 `FINAL_DELIVERY.json`，避免公開紀錄的自我引用版本。
