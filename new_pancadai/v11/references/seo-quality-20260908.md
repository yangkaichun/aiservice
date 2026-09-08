# 中文站 SEO／GEO／AI-SEO 品質改善 — 2026-09-08

## 範圍
19 個正式中文 HTML 頁（14 主站頁＋4 醫院資訊頁＋deep-plan/index.html）。不修改 en/、jp/、既有共用 CSS/JS；透過新增 zh-quality.css、zh-hospital.css、zh-page.js 隔離。教育頁備份副本 education 2.html 不列入正式頁面；英文案例 HTML/PDF 亦不列入中文版驗證。

## 實際修正
- 主要頁面 title、description、Open Graph 與執行期 i18n metadata 一致；移除主要頁面 keywords 堆疊。
- 醫療軟體公司使用 Organization，與醫院實體區分；合併重複公司 ID，補頁面 WebPage／MedicalWebPage／AboutPage／ContactPage／CollectionPage 與正確麵包屑。法律頁不再誤標成聯絡頁。
- FAQ 同步完整問題與答案（包含超連結文字），而非只比對題目數量。修正「人眼客觀極限」及一般風險人群常規 CT 篩檢的過度推論。
- 論文館以 ScholarlyArticle、實際可見論文標題、DOI 與 PubMed URL 描述研究。
- 深耕頁修正 canonical/OG URL；新增 schema；將「提高存活率／降低死亡率」保證式文字改為品質與流程評估，區分影像效能和存活研究終點。
- 四醫院頁補研究原文、篩檢適用範圍、維護者聲明、手機原生導覽、skip link、足夠對比度及院所穩定 ID。博田醫院與健康管理中心不再當作同義實體；臺大癌醫的檢查諮詢專線不再當成醫院總機。臺大電話分機与平日 09:00–17:00 維持，tel 連結加 ext=263356。
- 中文主站新增延伸閱讀與內容維護日期；修正 320／1024px 導覽撐寬、頁尾標題層級與觸控目標。沒有刪減手機內容。
- 手機首頁停止下載隱藏影片；桌面仍按既有機制播放。手機背景圖與高優先預載 URL 對齊。13 個下方內容圖片補 lazy／async；Logo 補尺寸。
- llms 摘要修正過期頁數文字、損壞連結、未附來源案例的療效推論，補原文與使用界線。sitemap 保持 52 個唯一 URL，只更新本輪實際修改中文頁 lastmod。

## 工具實測
- Chromium：19 頁 × 390/1440px = 38 個情境，全部無 JS pageerror、無水平溢出；每頁單一 H1，靜態與 runtime metadata 一致；有 FAQ schema 的頁面問答全文一致。
- RWD 擴充：19 頁 × 320/768/1024px = 57 個情境，修正後無水平溢出。
- 無 JavaScript：首頁、健檢頁問答可讀；博田、臺大手機原生選單展開後 10 個導覽連結可用。
- WebKit：首頁、健檢、博田、臺大 390px 無水平溢出。這是 Playwright WebKit，非真實 Safari／iPhone 裝置測試。
- 26 個中文 JSON-LD blocks 可解析；正式中文頁無重複 HTML id；本輪檢查的本地 href/src 無缺檔；en/jp 與既有 shared CSS/JS SHA-256 無變化。
- node --check js/zh-page.js 與 git diff --check 通過。

### Lighthouse 13.4.1 — 本機手機模擬
| 頁面／階段 | Performance | Accessibility | SEO | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---:|---:|
| 首頁（本輪效能修正前） | 75 | 94 | 100 | 7.3 s | 0.034 | 110 ms |
| 首頁（修正後） | 97 | 100 | 100 | 2.6 s | 0.032 | 10 ms |
| 博田（對比度修正後） | 99 | 100 | 100 | 2.2 s | 0 | 0 ms |

此處「修正前」是本輪 metadata 改完、尚未做手機 LCP 修正時的基線，不是上一版完整網站基線。分數會隨機器／網路條件變動；localhost 不含 Cloudflare edge 的壓縮與 cache headers，不能當正式站 field Core Web Vitals，亦非 Google 排名／AI 引用保證。首頁 LCP 2.6s 尚略高於 2.5s 良好門檻。

## 既有 verifier 與政策待確認
- verify_site.py 現有規則將 tel: 當缺檔、要求 zh-only 醫院頁具有不存在的 en/jp hreflang，並將 education 2.html 備份當正式頁。它的 exit=1 不等於本輪 QA 通過；以上以正確範圍與協定處理的檢查另行驗證，未宣稱舊 verifier 全綠。
- robots.txt 仍可能含 Cloudflare 管理區及站方重複群組；全站 Content-Signal 存在 ai-input=no。此次不擅自改變全域內容授權、英日版爬取政策或 WAF。
- GPTBot／ClaudeBot 為訓練相關爬蟲；OAI-SearchBot／Claude-SearchBot 才是搜尋爬蟲。不能以「9 個 Disallow」直接斷言全部 AI 搜尋被封鎖，不需要為 GEO 關閉全部安全防護。
- 先前子代理發生 HTTP 401 驗證失敗；本輪程式修改與測試由主代理實際執行，未把失敗子代理當獨立審查成功。

## 來源
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.openai.com/api/docs/bots
- https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
- https://pubmed.ncbi.nlm.nih.gov/33328124/
- https://pubmed.ncbi.nlm.nih.gov/36098642/
- https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/pancreatic-cancer-screening

## 部署與備份方式
使用者授權驗證後直接雙部署；部署後須讀回正式 www、Cloudflare hash、GitHub Pages。Drive 以 checksum 增量備份並保留 Drive-only 資料，不使用 --delete；掛載目錄 hash 相符不代表已確認遠端上傳完成。
