# v11 RWD Layout Map

> 目標：保留桌面版完整內容與資訊層級，依平板／手機重新編排，不以刪除內容作為 RWD 手段。
> 版本：v11；實作前置規劃文件。

## 1. 設計原則

1. 同內容、同任務、不同編排。
2. 手機優先處理閱讀順序、觸控尺度、圖片裁切與效能。
3. 重要醫療數據、證據、CTA 不被動畫或卡片高度截斷。
4. 所有互動不依賴 hover，必須支援 touch、keyboard、focus。
5. RWD 與三語內容同步驗證，特別注意中文長標題、英文長字串與日文換行。
6. 背景圖可滿版，但文字與互動元件必須有可讀性安全區。

## 2. Breakpoints

| Token | 寬度 | 版型 |
|---|---:|---|
| `desktop-xl` | `>=1280px` | 完整桌面導覽、寬版內容 |
| `desktop` | `1025–1279px` | 桌面／橫向平板 |
| `tablet` | `769–1024px` | 平板直向、小筆電 |
| `mobile` | `<=768px` | 手機直向 |
| `mobile-narrow` | `<=360px` | 極窄手機壓力測試 |

實作時應集中管理 breakpoint，避免同一功能散落不同臨界值而互相覆蓋。

## 3. 共用版型

### Header

- Desktop：Logo、10 個主選單、語言切換、主要 CTA 全部保留。
- Tablet：保留 Logo、語言、CTA；主選單切換為漢堡選單。
- Mobile：Logo／語言／Menu 固定在單列；展開選單顯示完整桌面連結與 Line CTA。
- 需補齊 `aria-expanded`、`aria-controls`、`aria-hidden`、focus return、Escape 關閉與背景捲動鎖定。
- 互動目標實際尺寸以 44px 以上為主。

### Hero

- Desktop：滿版背景、標籤、主標題、副標題、雙 CTA、4 個數據卡。
- Mobile：停用影片、使用 poster；圖片／遮罩／文字自然堆疊；CTA 必須可垂直堆疊；數據卡改為 2×2。
- 不以固定 `100vh` 作為手機唯一高度；內容超出時自然延伸。
- 對 hero poster 重新檢查人物臉部與主體裁切。

### Section heading

- 共用 `.wrap`、`.sec-head`、kicker 與標題階層。
- Desktop／tablet／mobile 使用一致 spacing token，不由各頁自行猜值。
- 中文、英文、日文均允許自然換行，禁止固定高度截斷。

## 4. 內容元件 Layout Map

| 元件 | Desktop | Tablet | Mobile |
|---|---|---|---|
| Day card | 滿版橫卡、圖片左／文字玻璃卡疊加 | 橫卡、縮小文字卡 | 圖片上、文字下，自然高度 |
| Journey rail | 水平 sticky、節點文字與進度線 | 水平壓縮 | 水平可滑動、保留節點標籤、scroll-snap |
| Journey station | 滿版背景、文字疊加 | 背景加強遮罩、內容縮窄 | 圖片／文字／互動元件垂直排列，不固定幕高 |
| CT viewer | 約 930px、拖曳分割線 | 寬度流動 | 16:9 流動寬度、分割線觸控熱區 >=44px |
| Product carousel | 滿版圖、玻璃內容卡、箭頭與 dots | 同一張卡單欄化 | 圖片上／內容下；支援按鈕與 swipe；互動後暫停 autoplay |
| Stats | 4 欄 | 2 欄 | 2×2 或自然單欄；標籤可換行 |
| Publication card | 摘要、highlights、DOI／PMID、原文連結 | 內容流動 | 全內容保留；highlights 2 欄／單欄；連結可觸控 |
| Line CTA | 文字、3 功能卡、QR 並排 | 文字／功能卡縮排 | 單欄，Line 按鈕全寬，QR 放下方 |
| Footer | 4 欄 | 2×2 | 單欄或可展開群組；聯絡方式不隱藏 |

## 5. RWD 內容優先順序

### 首頁 `index.html`

1. Header／mobile menu
2. Hero／CTA／stats
3. 病患的一天 day cards
4. Journey rail／stations
5. Product evidence carousel
6. Audience cards／publications／news
7. Line CTA／footer／floating CTA

### `patient.html`

1. Patient hero
2. Journey rail／8 stations
3. CT viewer
4. What-if interaction
5. Line CTA
6. Quote／footer

### 其他內容頁

- `product.html`：產品流程、系統畫面、產品證據。
- `clinician.html`：AUC、認證、里程碑、期刊。
- `screening.html`：健檢中心流程與導入 CTA。
- `publications.html`：5 篇論文完整卡片，不截斷摘要。
- `ip.html`：專利列表可讀、可點擊、可換行。
- `education.html`：衛教內容與 FAQ 觸控操作。
- `about.html`：技術源頭、共同創辦人、E-E-A-T 資訊。
- `news.html`：新聞卡片與日期資訊。
- `contact.html`：聯絡資訊、外部表單 CTA、quiz。
- 法律／編輯頁：`privacy.html`、`terms.html`、`editorial.html` 共享 Header／Footer RWD。

## 6. 共用 CSS／JS 實作邊界

### CSS

- 建立 spacing、gutter、header height、touch target 等 token。
- 以共用 layout primitive 處理 `.wrap`、`.full-bleed`、`.grid`、`.stack`、`.cluster`。
- 補齊 `:focus-visible`、reflow、safe-area、文字換行與低階裝置降級規則。
- Mobile 取消 hover 才能取得的資訊；不以 `display:none` 隱藏桌面版重要內容。

### JavaScript

- Menu：狀態同步、focus management、Escape、scroll lock。
- Carousel：按鈕／dots／keyboard／swipe／autoplay pause／reduced motion。
- Journey rail：手機水平 scroll 與 active node 對齊。
- CT／What-if：pointer/touch/keyboard 可操作，實際熱區與狀態可被讀取。
- 所有動畫保留 `prefers-reduced-motion` 降級路徑。

## 7. 驗收矩陣

### 尺寸

`320 / 360 / 375 / 390 / 414 / 768 / 820 / 1024 / 1280 / 1440px`

每一尺寸確認：

- 無水平捲軸。
- 無文字、按鈕、圖片溢出。
- 背景與 full-bleed 區塊左右完整。
- 人物、CT 情境與主要圖像焦點沒有不合理裁切。
- 內容卡片不因固定高度被截斷。

### 內容 parity

- 桌面版所有主要段落、數據、論文摘要、CTA、Footer 聯絡資訊在手機仍存在。
- zh／en／ja 語言切換後，頁面內容、導航、title、圖片 alt 均正確。
- en／jp 實體目錄資源相對路徑不失效。

### 互動與無障礙

- Keyboard Tab／Shift+Tab／Enter／Space／Escape。
- Menu、語言選單、carousel、Journey rail、CT、What-if、quiz。
- `aria-expanded`／`aria-controls`／`aria-label` 狀態正確。
- `:focus-visible` 清楚可見。
- 觸控目標以 44×44px 為主，至少符合 WCAG 2.2 target-size 要求。
- 200% zoom／reflow 後仍可閱讀與操作。
- reduced-motion 下不依賴動畫傳達資訊。

### 效能

- Mobile Hero 不載入影片。
- 首屏圖片優先，非首屏背景延遲載入。
- 圖片具備固有尺寸或 aspect-ratio，避免 CLS。
- 手機降低粒子、sweep、backdrop-filter 負擔。
- Lighthouse Mobile 檢查 LCP／CLS／INP。

## 8. SEO／GEO／AI-SEO 與無障礙共同規格

RWD 實作不得因手機版重排而改變 Google 可抓取、理解與引用的內容。Google 的 mobile-first indexing 明確要求：手機與桌面應保有相同主要內容、metadata 與 structured data；因此本專案採「相同 DOM 內容、不同 CSS layout」為原則，不另外建立內容縮減版。

### SEO／Mobile-first

- 每頁維持唯一清楚的主要 `<h1>`，其他 section 依序使用 `<h2>`／`<h3>`，不以視覺大小取代語意層級。
- `<title>`、`meta description`、canonical、hreflang、Open Graph、robots 與頁面主要內容三語一致。
- 導覽及 CTA 使用可理解的 anchor text，避免只有「點擊這裡」或圖示連結。
- 內部連結使用可抓取的 `<a href>`，不把重要導覽只交給 JavaScript click handler。
- 行動版、桌面版及 `/en/`、`/jp/` 必須保有相同主要文字、圖片替代文字、metadata 及 JSON-LD；只改排列、欄數、互動與裝飾。
- 不用 CSS `display:none`、折疊或輪播隱藏手機版必要內容；若為真正的互動元件，初始 DOM 仍要存在且可由鍵盤／觸控取得。
- 所有 JSON-LD 必須描述頁面上對使用者可見且實際存在的內容，不新增未呈現或誇大的醫療宣稱；使用 Rich Results Test 與 URL Inspection 驗證。
- 圖片採描述性檔名、正確 `alt`、固定尺寸或 `aspect-ratio`；裝飾性圖片使用空 `alt`，不把關鍵文字只放在圖片內。

### GEO／AI-SEO

「GEO」不視為另一套可作弊的排名規則，而是依 Google AI features 官方原則，把網站做成容易被理解、引用及查證的第一手內容：

- 每個頁面先回答一個明確主題，開頭提供可獨立理解的摘要，再以 H2／H3 分段展開。
- 醫療數據、研究結果、TFDA／FDA、作者、日期與適用範圍以可選取的 HTML 文字呈現，不能只存在圖像、canvas 或動畫中。
- 對重要數據提供來源、論文、PMID／DOI 或官方佐證連結；不以關鍵字堆疊取代原創、可驗證內容。
- 建立並維護 `MedicalOrganization`、`Organization`、`MedicalDevice`、`Product`、`Service`、`Article`、`Person`、`BreadcrumbList`、`FAQPage` 等與頁面主題相符的 schema；每種 schema 只標記頁面實際可見內容。
- 文章／衛教頁補充作者、專業背景、更新日期、參考來源與編輯原則，強化醫療內容的 E-E-A-T 可查證性。
- 使用高品質且與內容相關的圖片／影片；影片不作為唯一資訊來源，提供文字標題、摘要及必要字幕。
- AI 協助產製的內容仍須人工查證、標示適當的內容來源或製作脈絡，避免大量相似頁面、低價值改寫與 scaled content abuse。
- 不新增專為 AI fan-out 或關鍵字變體而製作的薄內容頁，不承諾能保證出現在 AI Overview；以 Search Console、分析資料及人工查證持續評估。

### Accessibility／Google 可理解性

- 使用語意 HTML：`header`、`nav`、`main`、`section`、`article`、`footer`、heading hierarchy。
- 提供 skip link、可見 `:focus-visible`、鍵盤完整操作、正確 button／link 語意及圖片 `alt`。
- Mobile menu、語言選單、carousel、CT viewer、slider、FAQ 必須同步 `aria-expanded`／`aria-controls`／`aria-selected`／`aria-valuenow` 等狀態；不能只靠顏色表示狀態。
- 重要文字與背景符合 WCAG 2.2 AA 對比；文字可放大至 200% 並 reflow，不出現必須雙向捲動才能閱讀的內容。
- 主要觸控目標以 44×44px 為設計基準，至少不低於 WCAG 2.2 Target Size Minimum 的 24×24px，彼此保留足夠間距。
- 動畫、影片、粒子與自動輪播支援 `prefers-reduced-motion`；動畫不得是理解醫療數據的唯一方式。
- 互動 CT 與 What-if slider 必須提供鍵盤替代操作、可讀狀態及文字說明，不能只有拖曳手勢。

### Core Web Vitals 與可爬取性

- 以 PageSpeed Insights／Lighthouse 同時測 mobile 與 desktop，追蹤 LCP、INP、CLS、TTFB。
- 首屏 Hero 圖片設定尺寸、優先載入正確 responsive source；背景影片、粒子與 backdrop-filter 不得阻塞主要內容。
- 重要內容在初始 HTML 可取得；JavaScript 僅負責增強互動、語言切換與非必要視覺效果。
- `robots.txt`、meta robots、canonical、sitemap、hreflang、JSON-LD URL 與實際部署路徑逐一驗證，避免 RWD 改版造成索引或語言版斷鏈。
- 每次批次修改後執行 HTML 標籤平衡、JS syntax、資源路徑、i18n、JSON-LD parse、Rich Results Test 與行動版 Lighthouse。

## 9. 實作順序

1. 先盤點所有 v11 頁面共用 DOM 與目前 RWD 規則。
2. 建立共用 token、breakpoint、Header／Menu 基礎。
3. 完成首頁所有核心元件。
4. 完成 patient 互動元件。
5. 套用到 product、clinician、screening、publications、ip、education、about、news、contact 及法律頁。
6. 跑標籤／JS syntax／資源／i18n 檢查。
7. 以實機尺寸及三語完成最終驗證。

## 10. 參考規範

- Taiwan Website Accessibility Guidelines：<https://accessibility.moda.gov.tw/Accessible/Guide/68>
- W3C WCAG 2.2：<https://www.w3.org/TR/WCAG22/>
- WCAG Reflow：<https://www.w3.org/WAI/WCAG22/Understanding/reflow>
- WCAG Target Size：<https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html>
- Apple Human Interface Guidelines：<https://developer.apple.com/design/human-interface-guidelines>
- Google SEO Starter Guide：<https://developers.google.com/search/docs/fundamentals/seo-starter-guide>
- Google Mobile-first indexing best practices：<https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing>
- Google AI features and your website：<https://developers.google.com/search/docs/appearance/ai-features>
- Google AI optimization guide：<https://developers.google.com/search/docs/fundamentals/ai-optimization-guide>
- Google structured data introduction：<https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data>
- Google structured data general guidelines：<https://developers.google.com/search/docs/appearance/structured-data/sd-policies>
- Google JavaScript SEO basics：<https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics>
- Google image SEO best practices：<https://developers.google.com/search/docs/appearance/google-images>
- Google guidance on generative AI content：<https://developers.google.com/search/docs/fundamentals/using-gen-ai-content>
- PageSpeed Insights：<https://developers.google.com/speed/docs/insights/v5/about>
