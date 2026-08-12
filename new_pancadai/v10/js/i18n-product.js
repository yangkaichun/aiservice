/* v10 product 頁三語字典 */
(function () {
  window.PANCAD_I18N = window.PANCAD_I18N || {};
  var zh = {
    ph_kicker: "全球首創全自動化胰臟癌 CT AI 輔助偵測系統",
    ph_h1: "在掃描結束前，<span class=\"hl\">AI 已交出答案</span>",
    ph_sub: "深度學習 CNN × 影像組學 Radiomics 雙引擎，融入放射科現有工作流，不改變醫師的習慣，只補上那雙「不會累的眼睛」。",
    f_kicker: "系統功能", f_title: "五道防線，<span class=\"hl\">一個都不少</span>",
    f1_t: "即時判讀", f1_d: "CT 掃描當下同步分析，數分鐘內完成全胰臟判讀，鎖定＜2cm 微小病灶。",
    f2_t: "自動標記病灶", f2_d: "以橘色警示框精準標記病灶位置與範圍，讓放射科醫師一眼鎖定。",
    f3_t: "PACS 即時警示", f3_d: "高風險影像自動優先載入並觸發警示，縮短從掃描到通知的黃金時間。",
    f4_t: "結構化報告", f4_d: "自動產出結構化判讀報告，含病灶位置、尺寸與風險評估，減少報告時間。",
    f5_t: "全自動化運作", f5_d: "無需人工操作，掃描即觸發；醫師專注判讀，AI 默默站崗。",
    f6_t: "PACS 無痛整合", f6_d: "以既有 PACS 工作流為中心設計，四週即可導入，不改變醫師日常。",
    flow_kicker: "判讀流程", flow_title: "從掃描到警示，<span class=\"hl\">只要幾分鐘</span>",
    flow1_t: "CT 掃描", flow1_d: "病患接受腹部 CT 檢查，影像即時上傳。",
    flow2_t: "AI 即時判讀", flow2_d: "PANCREASaver<sup>®</sup> 於數分鐘內完成全胰臟分析。",
    flow3_t: "自動標記 + 警示", flow3_d: "鎖定病灶、標記位置，PACS 觸發即時警示。",
    flow4_t: "醫師判讀", flow4_d: "放射科醫師確認標記，產出最終報告。",
    ui_kicker: "真實系統畫面", ui_title: "不是示意圖，<span class=\"hl\">是每天在醫院運行的系統</span>",
    ui_sub: "從 Stone Web Viewer 整合到 Bridge 登入，PANCREASaver<sup>®</sup> 已實際部署於醫學中心、區域醫院與健檢中心，累計判讀超過 300 人次。",
    ui_go: "查看科學證據", ui_shot: "PANCREASaver<sup>®</sup>",
    sys_kicker: "系統架構", sys_title: "安全、合規、<span class=\"hl\">融入現有環境</span>",
    cta_title2: "想親眼看看它怎麼運作？", cta_sub2: "預約一場現場 demo，讓 AI 哨兵為您示範。"
  };
  var en = {
    ph_kicker: "World's first fully-automated AI-assisted pancreatic cancer CT detection system",
    ph_h1: "Before the scan ends, <span class=\"hl\">AI has the answer</span>",
    ph_sub: "A dual engine of deep-learning CNN × radiomics, designed around your existing PACS workflow — it doesn't change your habits, it adds a pair of eyes that never tire.",
    f_kicker: "System capabilities", f_title: "Five lines of defense, <span class=\"hl\">none missing</span>",
    f1_t: "Real-time reading", f1_d: "Analyzes during the CT acquisition; a full pancreatic read in minutes, catching sub-2cm lesions.",
    f2_t: "Auto lesion marking", f2_d: "An orange reticle pinpoints lesion location and extent — visible at a glance.",
    f3_t: "Real-time PACS alert", f3_d: "High-risk studies are prioritized automatically; alerts trigger the care team sooner.",
    f4_t: "Structured reports", f4_d: "Auto-generates structured reads with location, size and risk — less reporting time.",
    f5_t: "Fully automated", f5_d: "No clicks required; the scan triggers the engine. Radiologists read, AI stands guard.",
    f6_t: "Seamless PACS integration", f6_d: "Built around the PACS workflow — deployed in 4 weeks without changing daily practice.",
    flow_kicker: "Reading workflow", flow_title: "From scan to alert, <span class=\"hl\">in minutes</span>",
    flow1_t: "CT scan", flow1_d: "Patient undergoes abdominal CT; images stream in.",
    flow2_t: "AI reads in real time", flow2_d: "PANCREASaver<sup>®</sup> analyzes the full pancreas within minutes.",
    flow3_t: "Auto-mark + alert", flow3_d: "Lesion locked and marked; PACS alert fires.",
    flow4_t: "Radiologist review", flow4_d: "The radiologist confirms the marks and signs the final report.",
    ui_kicker: "The real system", ui_title: "Not a mockup — <span class=\"hl\">a system running in hospitals today</span>",
    ui_sub: "From Stone Web Viewer integration to Bridge login, PANCREASaver<sup>®</sup> is deployed at medical centers, regional hospitals and screening centers — 300+ scans reviewed.",
    ui_go: "See the evidence", ui_shot: "PANCREASaver<sup>®</sup>",
    sys_kicker: "Architecture", sys_title: "Secure, compliant, <span class=\"hl\">at home in your environment</span>",
    cta_title2: "Want to see it in action?", cta_sub2: "Book a live demo — let the AI sentinel show you."
  };
  var ja = {
    ph_kicker: "世界初の全自動膵臓がんCT AI補助検出システム",
    ph_h1: "スキャンが終わる前に、<span class=\"hl\">AIは答えを出している</span>",
    ph_sub: "深層学習CNN×Radiomicsの二重エンジン。既存のPACSワークフローに溶け込み、医師の習慣を変えず、「疲れない目」を加えます。",
    f_kicker: "システム機能", f_title: "5つの防衛線、<span class=\"hl\">どれも欠かさない</span>",
    f1_t: "リアルタイム読影", f1_d: "CT撮影と同時に解析。数分で膵臓全体を読影し、2cm未満の病変を捉えます。",
    f2_t: "病変の自動マーク", f2_d: "オレンジの枠で病変の位置と範囲を正確に表示。一目で確認できます。",
    f3_t: "PACS即時アラート", f3_d: "高リスク画像を自動優先し、アラートでケアチームへ通知。",
    f4_t: "構造化レポート", f4_d: "位置・サイズ・リスク評価を含む構造化レポートを自動作成。",
    f5_t: "全自動運用", f5_d: "操作不要。スキャンがエンジンを起動し、医師は読影に集中。AIが見張ります。",
    f6_t: "PACSシームレス統合", f6_d: "既存ワークフロー中心の設計で、4週間で導入可能。",
    flow_kicker: "読影フロー", flow_title: "スキャンから警告まで、<span class=\"hl\">わずか数分</span>",
    flow1_t: "CTスキャン", flow1_d: "腹部CTを撮影し、画像を即時アップロード。",
    flow2_t: "AIリアルタイム読影", flow2_d: "PANCREASaver<sup>®</sup>が数分で膵臓全体を解析。",
    flow3_t: "自動マーク＋警告", flow3_d: "病変をロック・マークし、PACSに警告。",
    flow4_t: "医師の確認", flow4_d: "放射線科医がマークを確認し、最終レポートを確定。",
    ui_kicker: "実システム画面", ui_title: "イメージ図ではなく、<span class=\"hl\">病院で毎日動いているシステム</span>",
    ui_sub: "Stone Web Viewer統合からBridgeログインまで、医学センター・病院・健診センターで導入され、読影累計300件超。",
    ui_go: "エビデンスを見る", ui_shot: "PANCREASaver<sup>®</sup>",
    sys_kicker: "システム構成", sys_title: "安全・準拠・<span class=\"hl\">既存環境に溶け込む</span>",
    cta_title2: "実際の動きを見てみませんか？", cta_sub2: "ライブデモを予約して、AIがお見せします。"
  };
  Object.assign(window.PANCAD_I18N.zh, zh);
  Object.assign(window.PANCAD_I18N.en, en);
  Object.assign(window.PANCAD_I18N.ja, ja);
})();
