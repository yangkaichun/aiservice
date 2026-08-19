# pancad.ai 新網站

本目錄為 pancad.ai 官方網站改版開發區。

## 自動同步機制

- Hermes cron 每 5 分鐘監看本目錄，有變更即自動 `git commit + push` 到
  `github.com/yangkaichun/aiservice`（script: `~/.hermes/scripts/sync_pancadai.sh`）
- 無變更時安靜不動作；`.DS_Store` 一律排除
- 手動同步：`~/.hermes/scripts/sync_pancadai.sh`

## 相關資源

- 現行網站: https://pancad.ai （Cloudflare, 來源 `../pancadai/index.html`）
- 品牌色: 仲智藍 `#295daa` / 橘 `#ec7000`
- 字型: 中文微軟正黑體 / 英文 Arial
