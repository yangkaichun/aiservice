# 聯絡表單設定步驟（方案 S3：Turnstile + Pages Functions + GAS）

架構：contact.html → POST /api/contact（Pages Functions）→ GAS Web App → MailApp → info@pancad.ai
已完成：functions/contact.js、contact.html 表單＋Turnstile widget、gas/contact_email.gs

## 請完成以下 3 個步驟

### 步驟 1：部署 GAS（約 5 分鐘）
1. 開啟 https://script.google.com → 「新增專案」
2. 把 `gas/contact_email.gs` 內容**全部貼入**（覆蓋預設 Code.gs）
3. 點「部署」→「新增部署」→ 類型選 **網頁應用程式**
4. 執行身分：**我（本人）**；存取權限：**任何人（匿名）**
5. 點「部署」（首次會要求授權 MailApp——點允許）
6. **複製網頁應用程式 URL**（形如 `https://script.google.com/macros/s/XXXX/exec`）→ 提供給我

### 步驟 2：建立 Cloudflare Turnstile（約 3 分鐘）
1. 開啟 https://dash.cloudflare.com → 左側 **Turnstile** → **Add site**
2. Site name：`v11 contact form`
3. Hostname（可多個）：`pancadai-v11.pages.dev`、`health.yangkaichun.net`
4. Widget mode：**Managed**（自動人機判斷，無感）
5. 建立後取得兩把 key：
   - **Site Key**（公開，前端用）→ 提供給我（我填入 contact.html 的 TURNSTILE_SITE_KEY）
   - **Secret Key**（機密）→ 提供給我（我設定為 CF Secret，不進 git）

### 步驟 3：設定 CF Secrets（由我執行，需您的 GAS URL＋兩把 key）
```bash
wrangler pages secret put TURNSTILE_SECRET --project-name pancadai-v11
wrangler pages secret put GAS_URL --project-name pancadai-v11
```
（或 Dashboard → Pages → pancadai-v11 → Settings → Environment variables → Add secret）
然後重新部署 + 測試送出。

## 測試
1. 開啟 https://pancadai-v11.pages.dev/contact.html → 填表 → 完成 Turnstile → 送出
2. 確認 info@pancad.ai 收到信（含姓名/email/電話/類型/訊息）
3. 提交者信箱收到自動回覆
4. 測試防垃圾：不完成 Turnstile 直接送出 → 應顯示「請先完成人機驗證」

## 安全性
- Turnstile 伺服器端二次驗證（siteverify）——token 無法偽造
- 欄位伺服器端驗證＋HTML 注入剝離＋長度上限
- Secret key 存 CF Secrets（不入 git、不進前端）
- HTTPS 全程加密
