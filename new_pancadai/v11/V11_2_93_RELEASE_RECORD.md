# PanCAD.ai v11.2.93 發布紀錄

日期：2026-10-08（Asia/Taipei）

## 變更與授權

使用者要求刪除指定的醫療器材許可年份及有效期限說明句，並於 2026-10-08 明確授權「請部署」。本次移除四個中文醫院案例頁的整句、英文案例頁的直接對應句，以及同案例的公開 PDF 對應句；保留許可證字號與其他既有資訊。

## 發布識別

- 變更前 Git／GitHub main：`7c24984c0a8b0e00e84526563ecd86750bbff160`。
- 變更前 Cloudflare production：`https://fd877fa4.pancadai-v11.pages.dev`，來源 `a3d2a2d1f2440c0089e3c54322601c3178417323`。發布前十個相關檔案與該來源均同雜湊。
- 功能 commit：`806ddbda703f6033c96b502fe4d00b1e3850ccfb`，已推送 GitHub main。
- 首次包含原有 Functions 且驗證通過的正式功能部署：`https://dd263315.pancadai-v11.pages.dev`；正式網域 `https://www.pancad.ai`。
- GitHub source Deploy：[37731958233](https://github.com/yangkaichun/aiservice/actions/runs/37731958233)，completed／success。
- GitHub Pages build and deployment：[37732024030](https://github.com/yangkaichun/aiservice/actions/runs/37732024030)，completed／success，gh-pages commit `8fbbd0f300206b1a3b8882716e375c3c8f0ef06b`。
- 鏡像的 `/new_pancadai/v11/` 與 `/v11/` 兩條路徑均已讀回更新。

## 檔案與 QA

- HTML：`ntuh-case-study.html`、`ntuh-cancer-case-study.html`、`fju-st-lukes-case-study.html`、`parkone-case-study.html`、`case-study/pancreasaver_case_study.html`。
- PDF：`case-study/PANCREASaver_High-End_Health_Screening_Case_Study.pdf`。新 SHA-256：`42a98ec388069fab5d4f3ff5ae347205a241c7561cf4e805cc075c094abd7c06`。
- HTML 修改日期、可見中文更新日期、sitemap／sitemap index 已同步；網站靜態 verifier、HTML parser／JSON-LD、XML 與來源副本比對通過。
- 四個中文頁的 1440px／390px 本機渲染均無水平溢出或 pageerror；英文頁及局部截圖確認刪除結果。
- PDF 仍為 6 頁，只刪除第 5 頁七個文字顯示操作符；逐頁文字差異只有指定英文句與附屬引用。第 5 頁前後 render 的原句區域外逐像素相同，Logo 與許可字號正常。
- 功能部署共 44 個公開檔案讀回：不可變 Cloudflare 與兩條 GitHub Pages 路徑全部與來源雜湊一致；主域 HTML 有既有 Cloudflare 注入，採可見內容及 PDF／JS／CSS 的一致性核對。
- 四條公開路徑的下載 PDF 雜湊均為上述新版；五頁指定句均已移除。
- 正式主域與不可變部署：`GET /api/rsna-config` 均 200 且有效設定存在，`GET /api/rsna-demo` 均維持預期 405。未送出表單。
- 05:25–05:26 UTC 再次核對博田頁的 `.html` 轉址、canonical 與新增 query 入口，全數指定句不存在；主域 HTML 回傳 `CF-Cache-Status: DYNAMIC` 與 `max-age=0, must-revalidate`。

## 發布修正與後續

第一次 Cloudflare 上傳 `https://5c4600eb.pancadai-v11.pages.dev` 從部署目錄的父層執行，Wrangler 未編譯 Functions。讀回立即發現設定 API 未返回有效 JSON，已改從實際專案根目錄重新發布為 `dd263315`，確認 Compiled Worker／Functions bundle 與兩個既有端點恢復；前者為已取代的中間部署，不作為功能發布或回退依據。

發布包由限定 commit 的 `git archive` 建立，保留 `functions/`、排除 `gas/`；未包含未追蹤的預覽、生成暫存、備份與其他本機變更。原始檔、manifest 與 QA 證據保存在 repository 的 `backups/v11_license_text_removal_20261008_131137/`，並非公開網站資產。

本紀錄標示上述功能發布；其後若只同步本紀錄與 CHANGELOG，五頁、PDF 及 Functions 的功能內容相同。需要回退時，應從當時最新版本選擇性反轉功能 commit，保留 Cookie、RSNA 及其後其他變更，並從含 Functions 的專案根目錄重新發布及讀回。
