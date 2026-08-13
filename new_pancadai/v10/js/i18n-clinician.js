/* v10 clinician 頁三語字典 */
(function () {
  window.PANCAD_I18N = window.PANCAD_I18N || {};
  var zh = {
    ph_kicker: "為醫療機構與健檢中心而設",
    ph_h1: "為您的放射科，<span class=\"hl\">點亮一顆不眠的星</span>",
    ph_sub: "在每一位放射科醫師肩上的重擔中，加入一位永遠不累、永遠警覺的 AI 夥伴。",
    v_kicker: "為您帶來的價值", v_title: "四顆星，<span class=\"hl\">照亮四個關鍵</span>",
    v1_t: "降低漏診風險", v1_d: "為＜2cm 早期病灶加上 AI 第二雙眼睛，直接回應胰臟癌漏診痛點。",
    v2_t: "加速判讀流程", v2_d: "高風險影像自動優先載入，結構化報告減少醫師文書負擔。",
    v3_t: "提升醫療品質", v3_d: "把「早期發現」變成貴院的品質亮點，病人與家屬都感受得到。",
    v4_t: "健檢差異化", v4_d: "健檢中心可將胰臟癌 AI 偵測列為旗艦項目，吸引高階受檢者。",
    d_kicker: "導入流程", d_title: "四週，<span class=\"hl\">讓 AI 上線站崗</span>",
    d1_t: "第一週 · 評估", d1_d: "環境盤點、資訊安全評估與專案規劃。",
    d2_t: "第二週 · 整合", d2_d: "與 PACS 系統對接、影像串流與警示設定。",
    d3_t: "第三週 · 驗證", d3_d: "回顧性影像驗證、與院內標準比對。",
    d4_t: "第四週 · 上線", d4_d: "正式啟用與醫事人員教育訓練。",
    wf_kicker: "臨床工作流", wf_title: "融入日常，<span class=\"hl\">不打斷任何人</span>",
    s1: "導入時間", s2: "累計判讀人次", s3: "＜2cm 病灶敏感度", s4: "揪回漏診",
    reg_kicker: "法規與認證", reg_title: "合規，<span class=\"hl\">是我們的基本盤</span>",
    reg1_t: "TFDA 醫療器材許可", reg1_d: "衛部醫器製字第 007946 號，台灣上市合規。",
    reg2_t: "FDA Breakthrough", reg2_d: "美國 FDA 突破性醫材資格，510(k) 已遞交。",
    reg3_t: "資安與隱私", reg3_d: "符合醫療影像傳輸與個資保護規範，院內部署彈性。",
    cta_title2: "為您的院所預約一場 demo？", cta_sub2: "我們的臨床團隊將親自到院示範。"
  };
  var en = {
    ph_kicker: "Built for health systems & screening centers",
    ph_h1: "Light an unwearied star <span class=\"hl\">above your radiology department</span>",
    ph_sub: "Add a tireless, always-vigilant AI partner to every radiologist's workload.",
    v_kicker: "The value we bring", v_title: "Four stars, <span class=\"hl\">four critical wins</span>",
    v1_t: "Lower missed-cancer risk", v1_d: "A second pair of AI eyes for sub-2cm lesions — directly addressing the pancreatic cancer miss rate.",
    v2_t: "Faster reading workflow", v2_d: "High-risk studies prioritized automatically; structured reports cut documentation load.",
    v3_t: "Higher quality of care", v3_d: "Early detection becomes a visible quality highlight for patients and families.",
    v4_t: "Screening differentiation", v4_d: "Position pancreatic cancer AI detection as a flagship offering for premium participants.",
    d_kicker: "Deployment", d_title: "Four weeks to <span class=\"hl\">AI on guard</span>",
    d1_t: "Week 1 · Assessment", d1_d: "Environment review, security assessment, project planning.",
    d2_t: "Week 2 · Integration", d2_d: "PACS connection, image streaming, alert configuration.",
    d3_t: "Week 3 · Validation", d3_d: "Retrospective validation against institutional standards.",
    d4_t: "Week 4 · Go-live", d4_d: "Launch and staff training.",
    wf_kicker: "Clinical workflow", wf_title: "Fits daily practice, <span class=\"hl\">interrupts no one</span>",
    s1: "Weeks to deploy", s2: "Scans reviewed", s3: "<2cm sensitivity", s4: "Missed cancers caught",
    reg_kicker: "Regulatory & certification", reg_title: "Compliance <span class=\"hl\">is our baseline</span>",
    reg1_t: "TFDA medical device license", reg1_d: "License No. 007946 — cleared for Taiwan.",
    reg2_t: "FDA Breakthrough", reg2_d: "US FDA Breakthrough Device designation; 510(k) submitted.",
    reg3_t: "Security & privacy", reg3_d: "Compliant with medical imaging and personal data standards; flexible on-prem deployment.",
    cta_title2: "Book a demo for your institution?", cta_sub2: "Our clinical team will demonstrate on-site."
  };
  var ja = {
    ph_kicker: "医療機関・健診センター向け",
    ph_h1: "放射線科に、<span class=\"hl\">眠らない星を灯す</span>",
    ph_sub: "放射線科医の負担に、疲れず常に警戒するAIパートナーを加えます。",
    v_kicker: "もたらす価値", v_title: "4つの星、<span class=\"hl\">4つの重要な成果</span>",
    v1_t: "見逃しリスク低減", v1_d: "2cm未満の病変にAIの第二の目を。膵臓がんの見逃し問題に直接応えます。",
    v2_t: "読影の高速化", v2_d: "高リスク画像を自動優先し、構造化レポートで文書負担を軽減。",
    v3_t: "医療の質向上", v3_d: "「早期発見」を貴院の品質の光に。患者と家族にも伝わります。",
    v4_t: "健診の差別化", v4_d: "膵臓がんAI検出を旗艦メニューに。ハイエンド受診者の獲得へ。",
    d_kicker: "導入フロー", d_title: "4週間で、<span class=\"hl\">AIが見張りを開始</span>",
    d1_t: "第1週 · 評価", d1_d: "環境調査、セキュリティ評価、プロジェクト計画。",
    d2_t: "第2週 · 統合", d2_d: "PACS接続、画像ストリーミング、アラート設定。",
    d3_t: "第3週 · 検証", d3_d: "回顧的検証、院内基準との比較。",
    d4_t: "第4週 · 稼働", d4_d: "本格稼働とスタッフ教育。",
    wf_kicker: "臨床ワークフロー", wf_title: "日常に溶け込み、<span class=\"hl\">誰も遮らない</span>",
    s1: "導入期間", s2: "読影累計", s3: "2cm未満の感度", s4: "見逃し発見",
    reg_kicker: "規制と認証", reg_title: "コンプライアンスが<span class=\"hl\">基本盤</span>",
    reg1_t: "TFDA医療機器許可", reg1_d: "衛部醫器製字第007946号。台湾での上市適合。",
    reg2_t: "FDA Breakthrough", reg2_d: "米国FDA画期的医療機器指定。510(k)申請済み。",
    reg3_t: "セキュリティとプライバシー", reg3_d: "医用画像・個人情報保護の基準に適合。院内導入も柔軟に。",
    cta_title2: "貴院でのデモをご予約しませんか？", cta_sub2: "臨床チームが直接デモンストレーションいたします。"
  };
  Object.assign(window.PANCAD_I18N.zh, zh);
  Object.assign(window.PANCAD_I18N.en, en);
  Object.assign(window.PANCAD_I18N.ja, ja);
})();
