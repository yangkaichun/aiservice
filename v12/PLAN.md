# v12 PLAN：「AI 光年」（AI Light-year）— 迭代優化

> 2026-08-14 定案：v12 = v11.2.22（陽光旅程）基礎上的全面進化版。
> **v11 資料夾完全凍結不動**；所有優化只針對 new_pancadai/v12/。
> 部署：僅 GitHub Pages（health.yangkaichun.net/new_pancadai/v12/，auto-sync）；Cloudflare 暫緩。

## 核心概念

**「每一秒的 AI 判讀，都是守護生命的光年。」**
歷代敘事演進：日光系統（v7）→ 希望之光（v9）→ 希望星圖（v10）→ 陽光旅程（v11）→ **AI 光年（v12）**。
AI 在腫瘤 <2cm 時就找到它——等於把生命的光年搶回來。設計語言延續「光」家族，加入「光年航線」的動感（星軌／光速線條／銀河漸層），但以「優化」為主軸，不重做 v11 成熟架構。

## 優化主軸

### A. 教訓落實（v11 skill 累積，逐一驗證 v12 繼承）
- [ ] en 版零中文字（HTMLParser stack 檢查法）
- [ ] 全站標籤平衡（check_tags.py）
- [ ] verify_site.py 全綠
- [ ] 無 `html[lang="zh"]` 選擇器、script 鏈完整、字典行尾逗號

### B. 效能優化
- [ ] hero 關鍵資源 preload 盤點（各頁）
- [ ] 全站 `<img loading="lazy">` 盤點
- [ ] CSS 52KB 瘦身評估（死碼/合併）
- [ ] video preload 策略

### C. SEO 優化
- [ ] 全站 11 頁 JSON-LD（MedicalOrganization/WebPage/FAQPage）
- [ ] sitemap 補 product.html（現缺）
- [ ] og:image 路徑驗證（pancad.ai/assets/ 是否存在）
- [ ] meta_description 各頁三語檢查

### D. 可及性（a11y）
- [ ] skip link、nav aria、focus-visible
- [ ] reduced-motion 覆蓋完整性

### E. 設計進化（全新網站感）
- [ ] v12 主題視覺強化（光年航線元素）
- [ ] 首頁內容區塊精修
- [ ] 版號：v12.0.0 → v12.1.0（`?v=1` → `?v=2`）

## 驗證
verify_site.py + check_tags.py + 三語掃描 + 瀏覽器實測 → 部署 GitHub
