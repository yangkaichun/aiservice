# pancad.ai v10 網站 —「希望星圖」（Constellation of Hope）

> 狀態：**已完成建置（2026-08-12，使用者指示直接進行、不問過程）**
> 核心指令：以個案為中心 × AI 充滿希望 × 大量動態（影片/光影/粒子/捲動驅動）× 參考全球標竿

## 家族演進（V2→V9 分析）
| 版 | 概念 | v10 揚棄 / 繼承 |
|---|---|---|
| v2 | 陽光溫暖×AI | ❌ 暖陽；✅ 三語/漸進載入 |
| v3 | 一個故事兩個入口 | ✅ 個案敘事種子 |
| v4 | 先體驗再相信 | ✅ 互動 CT（真實素材） |
| v5 | 煥然一新 | ❌ 特效密度；✅ 版本徽章 |
| v6 | 勝過 Siemens | ✅ 證據互動 |
| v7 | 日光系統 | ❌ 日光物理；✅ hero 影片/捲動驅動 |
| v8 | AI 哨兵戰情室 | ❌ 警戒感；✅ 深藍底/真實 CT 對比/掃描線 |
| v9 | 黎明之光（未完成） | ✅ 黎明色系/光影片產線 |

## 全球參考（醫療 AI 影像公司 + 設計標竿）
- **Cleerly**：hero 直給產品/證據 → ✅ 首屏數據 + CT 對比
- **Viz.ai**：患者故事×臨床證據並重 → ✅ 個案第一人稱星圖
- **Paige**：以個案為中心敘事 → ✅ 兩顆真實個案星
- **Lunit/Aidoc**：數據驅動、工作流 → ✅ 數字光帶/導入流程
- **Awwwards 暗色捲動站**（singsing/variousways 語法）→ ✅ canvas 星空/極光/kinetic

## v10 概念：希望星圖
- **場景**：深藍夜空（#050b18/#0a1628）→ AI 點亮星辰 → 黎明暖光（#ffb45c/#ffd9a0）
- **主角**：真實個案（70歲 1.8cm / 60歲 1cm 漏診揪回）——每一顆星都是一個人生
- **動態系統**：canvas 星空（460 星+流星+視差）、極光分隔帶、掃描光束、捲動光柱、cursor 暖光、kinetic 逐字標題、互動 CT 拖曳、3D tilt、magnetic 按鈕、計數器、跑馬燈、reduced-motion 全關
- **三支新影片**（numpy+ffmpeg）：starry_dawn（星空黎明 hero）、aurora_hope（極光）、沿用 hope_light/rays_light/scan_beam

## 色系
夜空 #050b18 → 深藍 #0a1628 → 仲智藍 #295daa → 黎明 #ffb45c / 希望金 #ffd9a0 → 警示橘 #ec7000

## 頁面（11 頁）
index（個案電影首頁：星空 hero → 痛點vs希望 → 個案星 1 → 極光 → 個案星 2 → 數字帶 → 產品 → 受眾 → 認證 → 新聞 → CTA）
→ product / evidence / patient / clinician / screening / about / news / contact / privacy / terms

## 驗證（10+ 輪迭代）
- verify_site.py：JS OK / 251 資源 OK / i18n keys OK
- 瀏覽器 console 零錯誤（index/product/patient/evidence/contact 實測）
- 三語 zh/en/ja 全站切換 + kinetic 重建（v8 修法：kineticHtml 還原→applyAll→重建）
- 計數器 92.1%/11/12/300+/80% 全觸發、FAQ 開合、CT 拖曳自動演示、圖片零破圖
- 修復紀錄：kinetic 中文逐字拆分、kinetic×i18n 語言切換、verify_site 正則（6 空格/行內多 key/legal 共用字典）、aurora numpy sin 越界

## 預覽
`python3 -m http.server 8773`（v10 專用 port）
