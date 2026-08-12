# Remotion 影片生成提示詞 — PANCREASaver® 2026 AI 創新獎

## 影片規格

| 參數 | 值 |
|------|-----|
| 解析度 | 1920 × 1080（16:9 寬螢幕） |
| 幀率 | 30 fps |
| 總長度 | ~120 秒（2 分鐘，3600 幀） |
| 色系 | PanCAD 品牌色 #295daa（藍） + #ec7000（橘） + 白底/深藍底 |
| 字型 | 微軟正黑體 / Noto Sans TC（繁體中文） |
| 風格 | 科技感、專業醫療、乾淨白底為主 + 深藍科技風場景交替 |

---

## 場景分鏡腳本（共 8 個場景）

---

### 場景 0｜開場標題（0–4s，幀 0–120）

**視覺設計**：
- 純白背景 → 深藍色（#295daa）漸層從中央展開
- PANCREASaver® 助胰見® 大字從中央 spring 彈入
- 副標「基於邊緣運算驅動之 SaMD AI 胰臟癌偵測系統」淡入
- 底部細線浮現：2026 AI 創新獎 · 仁寶賽道

**動畫細節**：
- Logo 從 scale(0.3) spring 彈到 scale(1)，stiffness=120
- 背景漸層用 interpolate：frame 0→60，藍色從中心輻射擴散
- 副標 opacity：frame 60→100 淡入

**文字內容**：
```
PANCREASaver® 助胰見®
基於邊緣運算驅動之 SaMD AI 胰臟癌偵測系統
2026 AI 創新獎 · 仁寶賽道 · AI × 醫療照護
```

---

### 場景 1｜癌王困境（4–20s，幀 120–600）

**視覺設計**：
- 深藍背景（#0a1628）
- 左側大數字動畫：5 年存活率從 80% 快速下降到 10%
- 右側文字逐行浮現，每行間隔 0.5s

**動畫細節**：
- 「<2cm 腫瘤」→ 綠色大字「存活率 80%」→ spring 彈入
- 畫面變暗 → 紅色大字「晚期確診」→ 「存活率 <10%」
- 中間分割線（橘色 #ec7000）從上到下畫出
- 數據卡片：8 成病患確診時已屬晚期、4 成早期病灶肉眼漏診、每年 90 萬人次腹部 CT

**文字內容**：
```
小於 2 公分早期發現 → 五年存活率可達 80%
逾八成病患確診時已屬晚期 → 五年存活率低於 10%
傳統 CT 對 <2cm 腫瘤漏診率高達約 40%
臺灣每年約 90 萬人次腹部 CT —— 大量早期病灶潛藏其中
```

---

### 場景 2｜PANCREASaver 登場 — Physical AI（20–32s，幀 600–960）

**視覺設計**：
- 白色背景，中央三層架構圖從左到右逐步浮現
- 三個圓圈節點：感知層 → 決策層 → 驅動層
- 連接線用動畫繪製（橘色箭頭流動）

**動畫細節**：
- 左：「感知層」圓圈出現（frame 600–650），圖標：DICOM 影像圖示
- 中：「決策層」圓圈出現（frame 650–700），圖標：CNN + Radiomics 雙引擎
- 右：「驅動層」圓圈出現（frame 700–750），圖標：PACS 工作站警示
- 箭頭流動動畫（frame 750–900）——橘色粒子沿連接線移動
- 底部大字浮現：「AI 不止分析資料，更直接驅動設備行為」

**文字內容**：
```
感知層：CT 掃描 → DICOM 即時串流，零人工介入
決策層：CNN + Radiomics 雙引擎，數分鐘鎖定 <2cm 病灶
驅動層：觸發 PACS 警示 → 自動標記 → 優先載入 → 結構化報告
PANCREASaver® = Physical AI：感知 → 決策 → 驅動 閉環
```

---

### 場景 3｜核心數據（32–48s，幀 960–1440）

**視覺設計**：
- 白底，四個數據卡片 2×2 網格排列
- 每個卡片從下方滑入 + 數字從 0 計數到目標值

**動畫細節**：
- 卡片依次出現（間隔 0.8s）
- 數字使用計數器動畫：interpolate(frame, [start, start+30], [0, target])
- 每張卡片帶橘色頂部色條

**卡片內容**：

| 卡片 1 | 卡片 2 |
|---------|---------|
| **92.1%** | **0.95** |
| <2cm 早期腫瘤敏感度 | 全國 1,473 例 AUC |

| 卡片 3 | 卡片 4 |
|---------|---------|
| **11/12** | **300+** |
| 揪回醫師漏診病例 | 臨床輔助判讀人次 |

**文字內容**：
```
<2cm 早期腫瘤敏感度 92.1%
全國 1,473 例驗證 AUC 0.95
AI 揪回放射科醫師漏診 11/12 例（92%）
累積臨床輔助判讀 300+ 人次
```

---

### 場景 4｜權威認證（48–60s，幀 1440–1800）

**視覺設計**：
- 深藍背景
- 三個認證/獎項徽章從中央依序展開（扇形排列）
- 每個徽章帶光暈動畫

**動畫細節**：
- TFDA 許可證徽章（frame 1450）：「衛部醫器製字第007946號 臺灣首張胰臟癌 AI 醫材許可證」
- FDA 徽章（frame 1500）：「FDA Breakthrough Device Designation」
- RSNA 徽章（frame 1550）：「RSNA Margulis Award 臺灣首次獲獎」
- 底部跑馬燈式滾動：9 項國內外大獎 · 10 件發明專利 · 5 篇頂尖期刊

**文字內容**：
```
TFDA 衛部醫器製字第007946號 — 臺灣首張胰臟癌 AI 醫材許可證
美國 FDA Breakthrough Device Designation 突破性醫材認證
RSNA Alexander R. Margulis Award — 放射醫學界最高榮譽（台灣首次）
累計 9 項國內外大獎 · 台美 10 件發明專利 · 5 篇國際頂尖期刊
```

---

### 場景 5｜真實臨床案例（60–80s，幀 1800–2400）

**視覺設計**：
- 白底，左右分屏
- 左側：原始 CT 影像（模糊、無標記）
- 右側：AI 標記後影像（病灶以橘色光圈標示、箭頭指向）
- 中間分割線帶滑動動畫（從左滑到右，展示 AI 前 vs AI 後）

**動畫細節**：
- 左側出現「肉眼判讀」標籤
- 分割線從左（frame 1850）滑到右（frame 2000），揭露 AI 標記影像
- 右側出現「PANCREASaver® AI 判讀」標籤，帶橘色發光
- 下方案例文字淡入

**文字內容**：
```
案例一：70 餘歲女性，CT 肉眼未見腫瘤
→ PANCREASaver® AI 判定陽性，標示 1.8cm 早期 PDAC，手術確診

案例二：60 餘歲女性，內視鏡超音波 + 活檢均偽陰性
→ PANCREASaver® AI 精準定位 1cm 病灶，手術證實 PDAC
```

---

### 場景 6｜已落地部署（80–96s，幀 2400–2880）

**視覺設計**：
- 台灣地圖（簡潔線條風），醫院部署點以橘色光點標示
- 光點依次亮起：臺大 → 輔大 → 博田 → 聯新 → 彰基
- 每個光點亮起時，旁邊浮現醫院名稱與狀態

**動畫細節**：
- 地圖從透明淡入
- 光點依次亮起（間隔 1.2s），帶漣漪擴散效果
- 已上線的點為實心橘色，部署中的為橘色虛線圈
- 底部跑出 FDA 510(k) 訊息

**文字內容**：
```
✅ 臺大醫院總院 — 正式上線
✅ 輔大醫院聖路加健檢中心 — 正式上線（180 人次）
✅ 博田國際醫院 — 2026.06 導入
🔄 聯新國際醫院 — AI 信任中心 50 例驗測
📋 彰化基督教醫院 — 採購完成，即將導入

美國 FDA 510(k) 已於 2026 年 7 月遞交申請
```

---

### 場景 7｜結尾 — 願景與呼籲（96–120s，幀 2880–3600）

**視覺設計**：
- 從地圖場景淡出到純白背景
- 核心標語從中央彈入
- 最後回到 PANCREASaver Logo + 聯絡資訊

**動畫細節**：
- frame 2880–2950：白底浮現
- frame 2950–3100：大字「讓癌王無所遁形」spring 彈入
- frame 3100–3300：副標「每一次 CT 掃描，都是主動攔截早期病灶的契機」淡入
- frame 3300–3600：Logo + 團隊資訊 + 「2026 AI 創新獎 · 仁寶賽道」

**文字內容**：
```
讓癌王無所遁形
每一次 CT 掃描，都是主動攔截早期病灶的契機

PANCREASaver® 助胰見®
仲智數位健康股份有限公司 PanCAD.ai
kc.yang@pancad.ai
2026 AI 創新獎 · 仁寶賽道 · AI × 醫療照護
```

---

## Remotion 實作指引

### Composition 定義

```tsx
import { Composition } from 'remotion';
import { AwardVideo } from './AwardVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="PANCREASaver_Award_2026"
      component={AwardVideo}
      durationInFrames={3600}  // 120 秒 × 30fps
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
```

### 主組件結構

```tsx
// AwardVideo.tsx
import { Sequence } from 'remotion';
import { Scene0_Opening } from './scenes/Scene0_Opening';
import { Scene1_PainPoints } from './scenes/Scene1_PainPoints';
import { Scene2_PhysicalAI } from './scenes/Scene2_PhysicalAI';
import { Scene3_Metrics } from './scenes/Scene3_Metrics';
import { Scene4_Certifications } from './scenes/Scene4_Certifications';
import { Scene5_ClinicalCases } from './scenes/Scene5_ClinicalCases';
import { Scene6_Deployment } from './scenes/Scene6_Deployment';
import { Scene7_Closing } from './scenes/Scene7_Closing';

export const AwardVideo: React.FC = () => {
  return (
    <div style={{ width: 1920, height: 1080, background: '#ffffff' }}>
      <Sequence from={0} durationInFrames={120}>
        <Scene0_Opening />
      </Sequence>
      <Sequence from={120} durationInFrames={480}>
        <Scene1_PainPoints />
      </Sequence>
      <Sequence from={600} durationInFrames={360}>
        <Scene2_PhysicalAI />
      </Sequence>
      <Sequence from={960} durationInFrames={480}>
        <Scene3_Metrics />
      </Sequence>
      <Sequence from={1440} durationInFrames={360}>
        <Scene4_Certifications />
      </Sequence>
      <Sequence from={1800} durationInFrames={600}>
        <Scene5_ClinicalCases />
      </Sequence>
      <Sequence from={2400} durationInFrames={480}>
        <Scene6_Deployment />
      </Sequence>
      <Sequence from={2880} durationInFrames={720}>
        <Scene7_Closing />
      </Sequence>
    </div>
  );
};
```

### 全域樣式常數

```tsx
// styles.ts
export const COLORS = {
  brandBlue: '#295daa',
  brandOrange: '#ec7000',
  darkBg: '#0a1628',
  white: '#ffffff',
  textDark: '#1a1a2e',
  textGray: '#6b7280',
  success: '#10b981',
  danger: '#ef4444',
};

export const FONTS = {
  title: '"Noto Sans TC", "微軟正黑體", "Microsoft JhengHei", sans-serif',
  body: '"Noto Sans TC", "微軟正黑體", "Microsoft JhengHei", sans-serif',
};
```

### 關鍵動畫 helper

```tsx
// helpers.ts
import { spring, interpolate } from 'remotion';

// 數字計數器
export const countUp = (frame: number, startFrame: number, target: number, isDecimal = false) => {
  const progress = interpolate(frame, [startFrame, startFrame + 30], [0, target], {
    extrapolateRight: 'clamp',
  });
  return isDecimal ? progress.toFixed(2) : Math.round(progress);
};

// 彈簧彈入
export const springIn = (frame: number, fps: number, delay = 0) => {
  return spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 100 },
  });
};

// 淡入
export const fadeIn = (frame: number, start: number, duration = 20) => {
  return interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateRight: 'clamp',
  });
};
```

### 滑入動畫

```tsx
// 從下方滑入
export const slideUp = (frame: number, start: number, distance = 60) => {
  const opacity = interpolate(frame, [start, start + 20], [0, 1], { extrapolateRight: 'clamp' });
  const y = interpolate(frame, [start, start + 25], [distance, 0], { extrapolateRight: 'clamp' });
  return { opacity, transform: `translateY(${y}px)` };
};
```

---

## 材質需求清單

### 必須準備的圖片素材（放 `public/` 目錄）

| 檔案 | 說明 | 尺寸建議 |
|------|------|----------|
| `logo-pancad.png` | PanCAD.ai / PANCREASaver Logo（白字透明底 + 藍字白底兩版） | 400×120 |
| `ct-before-case1.png` | 案例一原始 CT 影像（去識別化） | 800×600 |
| `ct-after-case1.png` | 案例一 AI 標記後 CT 影像 | 800×600 |
| `ct-before-case2.png` | 案例二原始 CT 影像（去識別化） | 800×600 |
| `ct-after-case2.png` | 案例二 AI 標記後 CT 影像 | 800×600 |
| `badge-tfda.png` | TFDA 許可證徽章/圖示 | 200×200 |
| `badge-fda.png` | FDA Breakthrough 徽章/圖示 | 200×200 |
| `badge-rsna.png` | RSNA Margulis Award 徽章/圖示 | 200×200 |
| `taiwan-map.svg` | 台灣地圖線條（簡潔風，作為部署地圖底圖） | SVG |

### 可選音訊

| 檔案 | 說明 |
|------|------|
| `voiceover.mp3` | 中文旁白配音（約 120 秒） |
| `bgm.mp3` | 背景音樂（科技感、穩重、不搶戲） |

---

## 渲染指令

### 無音軌版本（預覽用）

```bash
cd remotion-award-video
npx remotion render PANCREASaver_Award_2026 out-preview.mp4 --codec=h264 --muted
```

### 含音軌完整版

```bash
npx remotion render PANCREASaver_Award_2026 PANCREASaver_2026AI創新獎.mp4 --codec=h264 --crf=18
```

### 僅渲染特定場景（除錯用）

```bash
npx remotion render Scene3_Metrics scene3-test.mp4 --codec=h264 --muted
```

### 單幀截圖

```bash
npx remotion still PANCREASaver_Award_2026 thumbnail.png --frame=1800
```

---

## 注意事項

1. **無音軌必須加 `--muted`**：純視覺渲染時不加會報錯
2. **CT 影像須去識別化**：所有臨床案例影像必須移除病患個資
3. **路徑避開中文**：Remotion 專案目錄不要放中文路徑下（puppeteer 問題）
4. **`staticFile()` 對應 `public/`**：所有素材放 `public/`，用 `staticFile('logo.png')` 引用
5. **用 `useMemo` 緩存**：場景中有重複計算的地方用 useMemo 避免效能問題
6. **幀數設計為 30 的倍數**：方便對齊秒數，目前每個場景都是 30fps 的整數秒
