# PanCAD.ai RSNA 2026 能見度發布與跨電腦接手紀錄

記錄日期：2026-10-30；時區：Asia/Taipei。

## 本次使用者指示

- 發布先前已預覽的 RSNA 2026／SEO／AI-SEO／GEO 更新。
- 不更動既有網站表單、Cloudflare Pages Functions、GAS、私人預約資料表與寄信流程。
- 於 **2026-12-06 00:00 台北時間**（12 月 5 日結束後的午夜）開始復原活動前的網站展示；保留期間其他更新及歷史預約資料。
- 留下完整紀錄，供另一台電腦的 Codex 接續。

## 來源與基準

- 可編輯來源：此資料夾 `V11/`（Google Drive 同步），不是舊機器路徑。
- GitHub repository：`yangkaichun/aiservice`，網站目錄 `new_pancadai/v11/`。發布前 `main` 為 `57896305fd142469010d339352d9493048be451c`；前一個 Cloudflare 正式版本為 `1601bc14-8359-4493-b98b-00220d02fa1c`，對應網站功能 commit `5dae887a967a9b906810fe39873ad9cbc3379bc0`。
- 2026-10-27 的 v11.2.101 SEO/GEO 修改在發布前仍未部署；本次連同 2026-10-30 的 v11.2.102 RSNA 文案一起發布。`Backup_GEO_SEO_20261027/` 保存當時 repo／Drive 前後版本；`Backup_RSNA_Visibility_20261030/before/` 保存本輪九個原始檔。
- 先前 GitHub 的英文活動頁／產品頁含 2026-10-20 的 Discover 文案，Drive 版本較早。本次以使用者已預覽的 Drive V11 最新文案作為正式發布內容，並對照正式站舊版以防覆蓋無關更新。GitHub 舊 checkout 已損毀且有無關修改；本次另以 GitHub `main` 建乾淨稀疏 checkout。

## Cloudflare 發布

- 專案：`pancadai-v11`；正式主域：`https://www.pancad.ai/`。
- 發布包由 Drive V11 的公開網站檔案建立，共 509 檔、98,341,953 bytes。保留 `functions/api/rsna-config.js` 與 `functions/api/rsna-demo.js`；排除私人 `gas/`、生成檔、預覽圖、腳本與內部紀錄。`verify_site.py` 對發布包通過 JS 語法、1,919 個資源引用、API catalog、agent discovery、i18n 及 SEO/GEO 結構檢查。
- Cloudflare 預覽：`https://d4e06fb5.pancadai-v11.pages.dev/`。Pages Functions 成功編譯；八個公開檔案與發布包逐位元組相同；`GET /api/rsna-demo` 回 405。預覽環境未設 Turnstile 公開金鑰，故預覽 `/api/rsna-config` 回 503；沒有改動正式環境的金鑰或其他表單設定。
- Cloudflare 正式：`https://5fba6850.pancadai-v11.pages.dev/`，於 2026-10-30 發布。正式不可變版本與 `https://www.pancad.ai/` 各查八個入口，共 16 項均通過：活動頁、英文產品頁、兩份 AI 摘要、sitemap、表單 JS、兩個 API。不可變版本六個靜態資產逐位元組吻合；主域 HTML 有 Cloudflare 注入，以關鍵文案及法規提示比對。正式 `/api/rsna-config` 回 200 且含公開 site key，`GET /api/rsna-demo` 回 405；未送出真實或測試預約。
- Google Drive 備份 `Backup_RSNA_Visibility_20261030/` 另存公開發布檔案的 SHA-256 清單 `release_manifest.json` 及正式 Cloudflare 讀回 `production_readback.json`。
- 本次沒有修改 `js/rsna-demo.js`、兩個 Pages Functions、`gas/rsna_demo_email.gs`、`_headers`、`robots.txt` 或 Cloudflare 環境變數。表單 HTML 與 10/27 repo、Drive 及 10/30 備份的 SHA-256 均為 `37bf8bc63a28d11c5af4dd1f135b74e5a8fe0a0f93fd675b21699ce5c4cebc0a`。

## 會後復原排程

- 使用者確認目標時間：**2026-12-06 00:00 Asia/Taipei**。在目前 Codex app 查不到歷史文件所載 `rsna-2026-pancad-ai`，也沒有本機 crontab。新建 ACTIVE 心跳排程 ID：`pancad-ai-rsna-2026`。
- 排程規則：每天台北時間 00:00 執行；提示詞設有 2026-12-06 00:00 的明確時間門檻，門檻前保持安靜、不更動網站。成功復原後停用；失敗時說明原因並在隔日重試。此為 Codex 本機排程，執行時需電腦開機、ChatGPT/Codex desktop app 可運作且專案路徑可存取。
- 復原範圍：先核對當時最新網站與 GitHub／Cloudflare 版本並備份。只移除英文產品頁 RSNA 宣傳、活動頁、活動專用資產、預約入口和 Pages Functions API；同步移除 sitemap、AI 摘要及相關 metadata 的活動資訊。保留會期間新增的無關修改與其他語系內容；私人 Google Sheet、歷史預約資料及 GAS 專案保留，英文隱私頁對已保存資料的說明須保持真實。不可將整站硬重設到 2026 年 9 月活動前 commit。
- 復原完成須寫入新 commit／部署識別、正式網址讀回結果；確認新 RSNA 預約 API 停止服務、英文首頁無活動宣傳，其他主要頁正常。

## 跨電腦接續注意

- GitHub `main`、兩條 GitHub Pages 鏡像與 Cloudflare 正式站的本次公開網站檔案已同步。另一台電腦接續時，先拉取最新 `main`，再核對 Drive V11 與正式站；不要使用舊機器上已損毀的 checkout。表單僅在有 Pages Functions 的 Cloudflare 正式主域上按原流程運作，GitHub Pages 是靜態鏡像。
- 關於「world’s first」，目前網站採 `See PANCREASaver® firsthand` 與 `AI-assisted pancreatic cancer detection on CT`，沒有未限定範圍的全球第一宣稱。主視覺保留 FDA 審查中、尚未取得美國上市許可的提示。

## GitHub 同步最終補記

- 功能來源 commit：`41bcf2bc266c15724e323805e7ac64584614974f`，由 GitHub `main` 的 `57896305fd142469010d339352d9493048be451c` 建立，限定 63 個網站來源／紀錄檔；未變更 GAS、Pages Functions 或表單 JS。共 509 個發布檔案與該 commit 的對應網站檔案逐一核對 SHA-256 相同。
- GitHub source [Deploy run 41018602837](https://github.com/yangkaichun/aiservice/actions/runs/41018602837) 結果 `success`；[Pages build run 41018678551](https://github.com/yangkaichun/aiservice/actions/runs/41018678551) 結果 `success`，`gh-pages` commit `0a1aeec61582b2831d98010afc8753c070b1215f`。
- `https://health.yangkaichun.net/new_pancadai/v11/` 與 `https://health.yangkaichun.net/v11/` 各八個檔案（RSNA、產品、兩份 AI 摘要、sitemap、CSS、表單 JS、活動圖）均 HTTP 200 且與 Cloudflare 發布包逐位元組相同；核對 JSON 存於 Drive 備份 `github_readback.json`。
