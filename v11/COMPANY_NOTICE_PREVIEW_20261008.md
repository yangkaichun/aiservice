# 重要資安提醒 — 中文公告製作紀錄

## 狀態與使用者決定

2026-10-08 製作完成並經使用者明確要求「請部署」；正在發布，識別及正式站驗證見 V11_2_94_RELEASE_RECORD.md。先前 v11.2.93 許可年份與效期文字移除的正式發布不受影響。

使用者已確認：公告從正式發布時起算一個曆月；公告期間中文瀏覽器進入首頁時留在中文版。製作預覽時 enabled=false、起訖為空，僅 localhost 顯示；正式公告有效期設定為2026-10-08 14:44至2026-11-08 14:44（台北時間），enabled=true，previewOnLocalhost=false。英文與日文頁不新增公告。

## 來源與文字

來源：使用者提供的「仲智數位健康股份有限公司_重要資安提醒_合作夥伴聲明信_20261008.pdf」（1頁）。網站下載副本為 notices/company-security-notice-20261008.pdf，SHA-256：

`f67ef47b87a82d4df4641e559c9edf7e014136fdf88b8c56bea161687bf00389`

PDF 完全保留，未重輸出。完整 HTML 正文、標題、副標及署名在排除排版空白／列表編號後與來源相同，唯一明顯錯字修正：「也非常感各合作夥伴」→「也非常感謝各合作夥伴」。文件沒有內文日期，2026.10.08 標示為外層「聲明版本」，不稱作 PDF 內文發布日期。資安查核的「經初步查核」「目前並無證據」「綜合目前掌握資訊」「較符合」均保留，正式網域也不被表述為安全保證。

## 網站架構

- js/company-notice-config.js：唯一公告設定，包含識別碼、版本、啟用開關、起訖、中文版入口策略及全文/PDF路徑。
- js/company-notice.js、css/company-notice.css：獨立繁中公告；支援 zh-TW 與 zh-Hant，不依賴 main.js／i18n。原生 modal dialog，含關閉、Esc、Tab／Shift+Tab 循環與焦點返回。
- company-notice-20261008.html：完整可分享／可列印的聲明；直接進入時不自動再彈摘要，全文不依賴 JavaScript，原始 PDF 可下載。
- 20 個既有可直連中文 HTML 整合（含四個中文醫院案例、deep-plan/index.html 及仍被發布的 education 2.html）。新聲明頁合計 21 個中文頁載入設定。英文／日文、英文 Case Study、API 文檔與 preview 目錄排除。
- js/language-entry.js?v=3：使用者同意的期間限定中文瀏覽器入口；?lang=zh 保留既有明確選擇。公告停用／開始前／到期後回到既有英文／日文自動入口。
- _headers：公告設定檔 no-store；sitemap、中文 AI 摘要與 verify_site.py 的 zh-only 範圍同步。

## 顯示與到期規則

公告有效區間為 startsAt <= serverNow < endsAt。以同來源設定檔的 HEAD 回應 Date 加上 Age 校時，以 performance.now 計算頁面持續開啟時的經過時間；伺服器時間不可取得時使用裝置時鐘。載入、visibilitychange 與 BFCache pageshow 都重新檢查；持續開啟時亦計時到期，屆時關閉 modal 及公告入口。靜態鏡像／離線且無時間回應時，精確到期取決於裝置時鐘。

已閱使用獨立 sessionStorage key（公告ID＋版本＋發布起始時間）；同分頁導覽不重複，獨立新分頁會顯示。瀏覽器若複製 opener 的 sessionStorage，會繼承該分頁的已閱狀態。儲存不可用時至少保留該頁面內的已閱記憶，避免每分鐘重新彈出。

公告關閉不寫入 Cookie 選擇、不呼叫 GA；公告開啟時暫時隱藏 Cookie 控制，關閉後 Cookie 原狀恢復。未選 Cookie 時先完成 Cookie 選擇；之後公告入口在右下，可重新開啟，首頁移到既有深耕計畫 CTA 上方。全文頁不另顯示重複摘要入口。期滿保留完整聲明與 PDF 固定網址供查閱。

## 驗證

- 全文與來源 PDF 對照通過，PDF下載位元組相同。
- verify_site.py、JavaScript syntax 與 git diff --check 通過。
- 20 個既有中文直連入口皆顯示；英日入口無公告；公告期間中文首頁留在中文，到期回到既有入口。
- 桌機 1440px、手機 390px及320px、短視窗、鍵盤循環、Esc、全文導航/Back、Cookie未選/已拒絕/已接受、獨立新分頁及同分頁不重複皆通過；無 pageerror 或水平溢出。
- 開始前／開始當下／到期當下、Date＋Age、裝置時鐘錯誤、已開彈窗自動到期、背景頁恢復與 BFCache、儲存停用後計時61秒不重彈皆通過。
- 200% 等效視窗以720×500 CSS px、deviceScaleFactor=2檢查，長內容可捲動至底部。檢查範圍為本機 Chromium；不將其稱為所有瀏覽器或實機驗證。
- 全文無 JS 時可讀，下載連結仍可使用。彈窗依賴 JavaScript。

QA檔案與修改前原檔在 repository 外層的 backups/v11_company_notice_20261008/，不納入網站發布來源；目前未驗證正式部署、正式站 CDN 讀回與真實手機裝置。

## 正式發布設定與程序

本次以2026-10-08T14:44:00+08:00為啟用時刻，2026-11-08T14:44:00+08:00為到期時刻；公開上傳後在該啟用時刻顯示公告，21頁設定檔 query version 已由1升為2。Drive 與 checkout 同步。

正式聲明頁以實際發布日期加入 datePublished，更新預覽狀態及版本紀錄，再依既有明確檔案清單 commit／push／Cloudflare Pages 發布。Cloudflare 部署必須在實際 v11 bundle 目錄執行，以包含原有 functions/；不得使用先前會漏編譯 Functions 的父目錄方式。讀回正式頁、設定、PDF、Cache-Control 及現有RSNA API，完成語言入口、Cookie 與效期的正式瀏覽器檢查。

## 本機預覽

- 彈窗：http://127.0.0.1:8137/ntuh-case-study.html
- 中文首頁：http://127.0.0.1:8137/?lang=zh
- 完整聲明：http://127.0.0.1:8137/company-notice-20261008.html

若這個瀏覽器分頁已閱，可用右下「重要資安提醒」再次開啟。本公告不改動既有 Cookie 與分析選擇。
