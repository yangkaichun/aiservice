# v12 — 版本紀錄（CHANGELOG）

> 部署：https://health.yangkaichun.net/new_pancadai/v12/（GitHub Pages，auto-sync 每 5 分鐘）
> 基於 v11.2.22（陽光旅程）複製建立；Cloudflare Pages 暫緩部署（使用者指示：v12 僅 GitHub）

## v12.0.0（2026-08-14）— 初始建立
- v11 → v12 全站複製（排除 `_gen_v11` raw 生成備份與空的 `_gen`）
- 版本標記：`?v=39` → `?v=1`（v12 新計數器，55 處）、footer `v11.2.22` → `v12.0.0`（14 處）、sitemap/robots 路徑 `v11` → `v12`
- 根目錄版本導覽頁新增 v12 卡片（「最新」徽章由 v11 移至 v12；preview 暫用 v11.jpg 佔位）
- deploy.yml 新增 v12 雙路徑（`_deploy/v12/` 頂層＋`_deploy/new_pancadai/v12/`）
- 僅部署 GitHub Pages；Cloudflare Pages 待使用者指示後再啟用（wrangler）
