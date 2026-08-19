# v12 — 版本紀錄（CHANGELOG）

> 部署：https://health.yangkaichun.net/new_pancadai/v12/（GitHub Pages，auto-sync 每 5 分鐘）
> 基於 v11.2.22（陽光旅程）複製建立；**v11 資料夾完全凍結不動**；Cloudflare Pages 暫緩（使用者指示：v12 僅 GitHub）

## v12.1.0（2026-08-14）— AI 光年（Light-year Guard）迭代優化
- **新區塊「AI 光年守護」**（index，stats-band 後）：深藍夜航漸層＋雙光軌線動畫（lySweep）＋3 玻璃卡（60–90 秒全胰臟分析／0 次額外掃描／92.1% <2cm 敏感度）；三語 key ly_* 12 組；.ly-band 加入光子注入清單（30 顆）
- **教訓落實（v11 skill 全數驗證）**：en 字典零中文 ✓、script 鏈完整 ✓、無 html[lang="zh"] 選擇器 ✓、標籤平衡 ✓、verify_site.py 全綠 ✓
- **效能**：preload 修正（hero poster 實際用圖 safe.jpg，couple＋intl；patient 補 preload）；全站內容圖 loading="lazy"（index 9／patient 3／clinician 6，互動 CT 保留不 lazy）
- **SEO**：⚠️ 修復 og:image 全站 404（pancad.ai/assets/ 不存在 → health.yangkaichun.net/new_pancadai/v12/assets/）；sitemap 補 product.html（10→11 url）；product.html 補 canonical/og:url/og:site_name/og:locale；全站 10 頁補 WebPage JSON-LD（index 既有 MedicalOrganization）；education 加 FAQPage JSON-LD（6 題）
- **a11y**：全站 11 頁包 `<main id="main">`（nav→footer 語意化）＋ skip-link（三語 skip_link key，focus 顯示）＋ nav aria-label ＋ 全域 :focus-visible 橘 outline（§28）
- **CSS**：§28 a11y＋§29 ly-band（52KB→55KB）
- **版本**：`?v=1`→`?v=2`、footer v12.0.0→v12.1.0（upgrade_v12.py 工具化）

## v12.0.0（2026-08-14）— 初始建立
- v11 → v12 全站複製（排除 `_gen_v11` raw 生成備份與空的 `_gen`）
- 版本標記：`?v=39` → `?v=1`（v12 新計數器）、footer `v11.2.22` → `v12.0.0`、sitemap/robots 路徑 `v11` → `v12`
- 根目錄版本導覽頁新增 v12 卡片（「最新」徽章由 v11 移至 v12；preview 暫用 v11.jpg 佔位）
- deploy.yml 新增 v12 雙路徑（`_deploy/v12/` 頂層＋`_deploy/new_pancadai/v12/`）
- 清理 v11/v12 的 `.wrangler/` 帳號快取出 git（.gitignore 加 `.wrangler/`）
