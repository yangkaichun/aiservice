#!/usr/bin/env python3
"""v9 內頁生成器 Part 3：clinician / evidence / about / news / contact"""
import os
HERE = os.path.dirname(os.path.abspath(__file__))
NAV = '<!-- NAV -->' + open(os.path.join(HERE, 'product.html')).read().split('<!-- NAV -->')[1].split('</nav>')[0] + '</nav>'
FOOTER = '<!-- FOOTER -->' + open(os.path.join(HERE, 'product.html')).read().split('<!-- FOOTER -->')[1].split('</footer>')[0] + '</footer>'

def build_page(name, title, desc, body, dict_js, hero_tag='', hero_title='', hero_sub=''):
    html = f'''<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta property="og:title" content="{title}">
<link rel="icon" href="assets/logos/pancad-ai-logo.svg" type="image/svg+xml">
<link rel="stylesheet" href="css/style.css?v=1">
</head>
<body>

<div id="scrollBeam" aria-hidden="true"></div>
<div id="bgOrbs" aria-hidden="true">
  <div class="orb orb-blue" style="top:-8%;left:-10%"></div>
  <div class="orb orb-dawn" style="top:38%;right:-12%"></div>
  <div class="orb orb-gold" style="bottom:-14%;left:28%"></div>
</div>

{NAV}

<header class="page-hero">
  <div class="bg-video">
    <div class="poster" style="background-image:url('video/poster_hope.jpg')"></div>
    <video autoplay muted loop playsinline preload="metadata" aria-hidden="true">
      <source src="video/hope_light.mp4" type="video/mp4">
      <source src="video/hope_light.webm" type="video/webm">
    </video>
  </div>
  <div class="shade"></div>
  <div class="sweep"></div>
  <div class="wrap inner">
    <div class="crumbs"><a href="index.html" data-i18n="btn_back">回到首頁</a><span class="sep">/</span><span data-i18n="{hero_tag}">{hero_tag}</span></div>
    <h1 data-i18n-html="{hero_title}">{hero_title}</h1>
    <p class="sub" data-i18n="{hero_sub}">{hero_sub}</p>
  </div>
</header>

{body}

{FOOTER}

<script src="js/i18n.js?v=1"></script>
<script src="js/i18n-common.js?v=1"></script>
<script src="js/i18n-{name}.js?v=1"></script>
<script src="js/main.js?v=1"></script>
</body>
</html>
'''
    open(os.path.join(HERE, name + '.html'), 'w').write(html)
    open(os.path.join(HERE, 'js', 'i18n-' + name + '.js'), 'w').write(dict_js)
    print('built', name + '.html')

# ============ clinician.html ============
clinician_body = '''
<section class="section-pad" style="background:linear-gradient(180deg,var(--night),var(--night2))">
  <div class="wrap">
    <span class="sec-tag" data-reveal data-i18n="cl_tag">臨床價值</span>
    <h2 class="sec-title" data-reveal style="--d:.1s" data-i18n-html="cl_title">為放射科而生的<span class="hl">AI 夥伴</span>。</h2>
    <p class="sec-sub" data-reveal style="--d:.15s" data-i18n="cl_sub">不改變判讀習慣，只補上人類眼睛的極限。PANCREASaver 以「第二意見」的姿態，與您的團隊並肩工作。</p>
    <div class="features">
      <div class="feature" data-reveal style="--d:.1s"><div class="f-ic">🔬</div><h3 data-i18n="cf1_t">降低漏診風險</h3><p data-i18n="cf1_d">11/12 漏診病例被 AI 揪回 — 為高負荷的日常判讀加上保險。</p></div>
      <div class="feature" data-reveal style="--d:.2s"><div class="f-ic">⚡</div><h3 data-i18n="cf2_t">加速工作流程</h3><p data-i18n="cf2_d">自動判讀、自動標記、自動報告 — 讓醫師專注於真正重要的決策。</p></div>
      <div class="feature" data-reveal style="--d:.3s"><div class="f-ic">🛡️</div><h3 data-i18n="cf3_t">法規完備</h3><p data-i18n="cf3_d">TFDA 醫療器材許可、FDA Breakthrough、台美 10 件專利 — 採購與稽核無後顧之憂。</p></div>
    </div>
  </div>
</section>

<section class="section-pad">
  <div class="wrap">
    <div style="text-align:center;margin-bottom:20px">
      <span class="sec-tag" style="justify-content:center" data-reveal data-i18n="roll_tag">導入流程</span>
      <h2 class="sec-title" data-reveal style="--d:.1s" data-i18n-html="roll_title">4 週導入，<span class="hl">無痛上線</span>。</h2>
    </div>
    <div class="steps">
      <div class="step" data-reveal style="--d:.05s"><h3 data-i18n="rs1_t">Week 1 · 需求訪談</h3><p data-i18n="rs1_d">了解院內 PACS 架構、判讀流程與需求。</p></div>
      <div class="step" data-reveal style="--d:.1s"><h3 data-i18n="rs2_t">Week 2 · 系統建置</h3><p data-i18n="rs2_d">系統安裝、介接測試、資安驗證。</p></div>
      <div class="step" data-reveal style="--d:.15s"><h3 data-i18n="rs3_t">Week 3 · 人員訓練</h3><p data-i18n="rs3_d">放射科醫師與技術人員教育訓練。</p></div>
      <div class="step" data-reveal style="--d:.2s"><h3 data-i18n="rs4_t">Week 4 · 正式上線</h3><p data-i18n="rs4_d">啟用即時判讀，進入日常臨床流程。</p></div>
    </div>
  </div>
</section>

<section class="section-pad" style="background:linear-gradient(180deg,var(--night2),var(--night))">
  <div class="wrap">
    <div class="split-row">
      <div class="media" data-reveal="left">
        <img src="assets/photos/clinic_workflow.jpg" alt="臨床工作流程" loading="lazy">
      </div>
      <div data-reveal="right">
        <span class="sec-tag" data-i18n="wf_tag">臨床工作流</span>
        <h2 class="sec-title" style="font-size:clamp(26px,3.4vw,40px)" data-i18n-html="wf_title">融入既有流程，<span class="hl">零阻力</span>。</h2>
        <p class="sec-sub" data-i18n="wf_sub">PANCREASaver 與既有 PACS 無縫整合 — 放射科醫師在熟悉的工作站上，即可看到 AI 的警示與標記，無需切換系統。</p>
        <div class="case-points">
          <div class="case-point" data-reveal style="--d:.1s"><div class="ic">🖥️</div><div><b data-i18n="w1_t">原生整合</b><span data-i18n="w1_d">在 PACS 工作站直接呈現 AI 結果</span></div></div>
          <div class="case-point" data-reveal style="--d:.2s"><div class="ic">🔔</div><div><b data-i18n="w2_t">警示優先級</b><span data-i18n="w2_d">依風險程度排序，高風險優先</span></div></div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="cta-band" style="padding:80px 0">
  <video class="bg" autoplay muted loop playsinline preload="metadata" aria-hidden="true">
    <source src="video/hope_light.mp4" type="video/mp4">
    <source src="video/hope_light.webm" type="video/webm">
  </video>
  <div class="wrap cta-inner">
    <h2 data-reveal data-i18n-html="clcta_title">為您的團隊，<span class="hl">多一雙眼睛</span>。</h2>
    <p data-reveal style="--d:.1s" data-i18n="clcta_sub">安排產品說明會，或索取臨床證據資料包。</p>
    <div class="btn-ctas" data-reveal style="--d:.2s">
      <a class="btn btn-primary" href="contact.html" data-i18n-html="clcta_btn">洽詢導入方案 <span class="ico">→</span></a>
      <a class="btn btn-ghost" href="evidence.html" data-i18n="clcta_btn2">查看臨床證據</a>
    </div>
  </div>
</section>
'''

clinician_dict = '''/* v9 clinician 字典 */
window.PANCAD_I18N = window.PANCAD_I18N || { zh: {}, en: {}, ja: {} };
Object.assign(window.PANCAD_I18N.zh, {
  cl_tag: '臨床價值', cl_title: '為放射科而生的<span class="hl">AI 夥伴</span>。',
  cl_sub: '不改變判讀習慣，只補上人類眼睛的極限。PANCREASaver 以「第二意見」的姿態，與您的團隊並肩工作。',
  cf1_t: '降低漏診風險', cf1_d: '11/12 漏診病例被 AI 揪回 — 為高負荷的日常判讀加上保險。',
  cf2_t: '加速工作流程', cf2_d: '自動判讀、自動標記、自動報告 — 讓醫師專注於真正重要的決策。',
  cf3_t: '法規完備', cf3_d: 'TFDA 醫療器材許可、FDA Breakthrough、台美 10 件專利 — 採購與稽核無後顧之憂。',
  roll_tag: '導入流程', roll_title: '4 週導入，<span class="hl">無痛上線</span>。',
  rs1_t: 'Week 1 · 需求訪談', rs1_d: '了解院內 PACS 架構、判讀流程與需求。',
  rs2_t: 'Week 2 · 系統建置', rs2_d: '系統安裝、介接測試、資安驗證。',
  rs3_t: 'Week 3 · 人員訓練', rs3_d: '放射科醫師與技術人員教育訓練。',
  rs4_t: 'Week 4 · 正式上線', rs4_d: '啟用即時判讀，進入日常臨床流程。',
  wf_tag: '臨床工作流', wf_title: '融入既有流程，<span class="hl">零阻力</span>。',
  wf_sub: 'PANCREASaver 與既有 PACS 無縫整合 — 放射科醫師在熟悉的工作站上，即可看到 AI 的警示與標記，無需切換系統。',
  w1_t: '原生整合', w1_d: '在 PACS 工作站直接呈現 AI 結果',
  w2_t: '警示優先級', w2_d: '依風險程度排序，高風險優先',
  clcta_title: '為您的團隊，<span class="hl">多一雙眼睛</span>。',
  clcta_sub: '安排產品說明會，或索取臨床證據資料包。',
  clcta_btn: '洽詢導入方案 <span class="ico">→</span>',
  clcta_btn2: '查看臨床證據',
  h_tag: '醫療專業', h_title: '與放射科並肩的<span class="hl">AI 夥伴</span>。',
  h_sub: '從臨床證據、法規字號到 4 週導入流程 — 為您的放射科與醫院量身評估。',
});
Object.assign(window.PANCAD_I18N.en, {
  cl_tag: 'Clinical value', cl_title: 'An <span class="hl">AI partner</span> built for radiology.',
  cl_sub: 'It doesn\'t change how you read — it covers the limits of the human eye. PANCREASaver works alongside your team as a second opinion.',
  cf1_t: 'Lower miss rate', cf1_d: '11 of 12 missed cases recovered by AI — insurance for high-volume daily reads.',
  cf2_t: 'Faster workflow', cf2_d: 'Auto-read, auto-mark, auto-report — physicians focus on what matters.',
  cf3_t: 'Regulatory ready', cf3_d: 'TFDA license, FDA Breakthrough, 10 TW/US patents — procurement and audits covered.',
  roll_tag: 'Rollout', roll_title: 'Live in <span class="hl">4 weeks</span>, painlessly.',
  rs1_t: 'Week 1 · Discovery', rs1_d: 'Understand your PACS architecture, reading workflow and needs.',
  rs2_t: 'Week 2 · Deployment', rs2_d: 'Installation, integration testing, security validation.',
  rs3_t: 'Week 3 · Training', rs3_d: 'Education for radiologists and technologists.',
  rs4_t: 'Week 4 · Go live', rs4_d: 'Real-time reading activated in daily clinical flow.',
  wf_tag: 'Clinical workflow', wf_title: 'Zero-friction <span class="hl">integration</span>.',
  wf_sub: 'PANCREASaver integrates seamlessly with existing PACS — radiologists see AI alerts and marks in the workstation they already know.',
  w1_t: 'Native integration', w1_d: 'AI results rendered directly in the PACS workstation',
  w2_t: 'Priority alerts', w2_d: 'Worklist sorted by risk — high-risk first',
  clcta_title: 'Give your team, <span class="hl">a second pair of eyes</span>.',
  clcta_sub: 'Book a demo or request the clinical evidence package.',
  clcta_btn: 'Talk to us <span class="ico">→</span>',
  clcta_btn2: 'See the evidence',
  h_tag: 'For clinicians', h_title: 'An <span class="hl">AI partner</span> for radiology.',
  h_sub: 'From clinical evidence and regulatory numbers to a 4-week rollout — tailored for your department.',
});
Object.assign(window.PANCAD_I18N.ja, {
  cl_tag: '臨床的価値', cl_title: '放射線科のための<span class="hl">AIパートナー</span>。',
  cl_sub: '読影習慣は変えず、人間の目の限界を補完します。PANCREASaverは「セカンドオピニオン」としてチームと並走します。',
  cf1_t: '見逃しリスク低減', cf1_d: '見逃し症例11/12をAIが救出 — 高負荷の日常読影に保険を。',
  cf2_t: 'ワークフロー加速', cf2_d: '自動読影・自動マーキング・自動レポート — 医師は重要な判断に集中。',
  cf3_t: '規制対応', cf3_d: 'TFDA認可、FDA Breakthrough、日米10件の特許 — 調達・監査も安心。',
  roll_tag: '導入プロセス', roll_title: '4週間で<span class="hl">スムーズ導入</span>。',
  rs1_t: '第1週 · ヒアリング', rs1_d: '院内PACS構成・読影フロー・ニーズの把握。',
  rs2_t: '第2週 · 構築', rs2_d: 'インストール、接続テスト、セキュリティ検証。',
  rs3_t: '第3週 · トレーニング', rs3_d: '放射線科医と技師向け教育研修。',
  rs4_t: '第4週 · 本稼働', rs4_d: 'リアルタイム読影を日常臨床で開始。',
  wf_tag: '臨床ワークフロー', wf_title: '既存フローに<span class="hl">ゼロ抵抗</span>で統合。',
  wf_sub: '既存PACSとシームレスに統合 — 放射線科医は使い慣れたワークステーションでAIの警告とマークを確認できます。',
  w1_t: 'ネイティブ統合', w1_d: 'PACSワークステーションにAI結果を直接表示',
  w2_t: '警告の優先順位', w2_d: 'リスク順にソート — 高リスクを最優先',
  clcta_title: 'チームに、<span class="hl">第二の目</span>を。',
  clcta_sub: '製品説明会のご予約、または臨床エビデンス資料をご請求ください。',
  clcta_btn: '導入をご相談 <span class="ico">→</span>',
  clcta_btn2: '臨床エビデンスを見る',
  h_tag: '医療関係者', h_title: '放射線科と並走する<span class="hl">AIパートナー</span>。',
  h_sub: '臨床エビデンス、規制番号から4週間の導入まで — 貴院に合わせてご提案します。',
});
'''

build_page('clinician', 'PANCREASaver® 助胰見® — 醫療專業 | 仲智數位健康 PanCAD.ai',
           '為放射科而生的 AI 夥伴：降低漏診風險、加速工作流程、法規完備。4 週導入，無痛上線。',
           clinician_body, clinician_dict,
           hero_tag='h_tag', hero_title='h_title', hero_sub='h_sub')

# ============ evidence.html ============
evidence_body = '''
<section class="section-pad" style="background:linear-gradient(180deg,var(--night),var(--night2))">
  <div class="wrap">
    <div style="text-align:center;margin-bottom:50px">
      <span class="sec-tag" style="justify-content:center" data-reveal data-i18n="ev_tag">臨床證據</span>
      <h2 class="sec-title" data-reveal style="--d:.1s" data-i18n-html="ev_title">數據，是<span class="hl">最好的說服</span>。</h2>
    </div>
    <div class="hope-grid">
      <div class="hope-card" data-reveal style="--d:.05s"><div class="glow-top"></div><div class="cnt"><span data-count="92.1" data-decimals="1">0</span><span class="unit">%</span></div><div class="cl" data-i18n="ev1_c">&lt;2cm 胰臟癌偵測敏感度</div><div class="src" data-i18n="ev1_s">多中心臨床驗證</div></div>
      <div class="hope-card" data-reveal style="--d:.1s"><div class="glow-top"></div><div class="cnt"><span data-count="0.95" data-decimals="2">0</span><span class="unit">AUC</span></div><div class="cl" data-i18n="ev2_c">全國 1,473 例驗證</div><div class="src" data-i18n="ev2_s">真實世界數據</div></div>
      <div class="hope-card" data-reveal style="--d:.15s"><div class="glow-top"></div><div class="cnt"><span data-count="11" data-decimals="0">0</span><span class="unit">/12</span></div><div class="cl" data-i18n="ev3_c">漏診病例中 AI 揪回</div><div class="src" data-i18n="ev3_s">臨床回顧研究</div></div>
      <div class="hope-card" data-reveal style="--d:.2s"><div class="glow-top"></div><div class="cnt"><span data-count="300" data-decimals="0">0</span><span class="unit">+</span></div><div class="cl" data-i18n="ev4_c">已服務人次</div><div class="src" data-i18n="ev4_s">累積部署</div></div>
    </div>
  </div>
</section>

<section class="section-pad">
  <div class="wrap">
    <span class="sec-tag" data-reveal data-i18n="pub_tag">期刊發表</span>
    <h2 class="sec-title" data-reveal style="--d:.1s" data-i18n-html="pub_title">登上國際舞台的<span class="hl">台灣研究</span>。</h2>
    <table class="data" data-reveal style="--d:.15s">
      <thead><tr><th data-i18n="t_journal">期刊</th><th data-i18n="t_topic">主題</th></tr></thead>
      <tbody>
        <tr><td>Lancet Digital Health</td><td data-i18n="pub1">胰臟癌 CT AI 偵測</td></tr>
        <tr><td>Radiology</td><td data-i18n="pub2">AI 輔助胰臟病灶偵測</td></tr>
        <tr><td>Gut</td><td data-i18n="pub3">早期胰臟癌影像標記</td></tr>
        <tr><td>Clinical Gastroenterology and Hepatology</td><td data-i18n="pub4">高風險族群篩檢</td></tr>
        <tr><td>European Radiology</td><td data-i18n="pub5">深度學習於腹部 CT</td></tr>
      </tbody>
    </table>
    <div class="certs-grid" style="margin-top:56px">
      <div class="cert-item" data-reveal style="--d:.05s"><div class="seal">🛡️</div><b data-i18n="cert1_t">TFDA 醫療器材許可</b><span data-i18n="cert1_d">衛部醫器製字第 007946 號</span></div>
      <div class="cert-item" data-reveal style="--d:.1s"><div class="seal">🇺🇸</div><b data-i18n="cert2_t">FDA Breakthrough</b><span data-i18n="cert2_d">美國 FDA 突破性醫材資格</span></div>
      <div class="cert-item" data-reveal style="--d:.15s"><div class="seal">📜</div><b data-i18n="cert3_t">台美 10 件專利</b><span class="num-gold" data-i18n="cert3_d">台灣 × 美國 專利佈局</span></div>
      <div class="cert-item" data-reveal style="--d:.2s"><div class="seal">🏆</div><b data-i18n="cert4_t">9 項國際大獎</b><span data-i18n="cert4_d">RSNA Margulis 2023 台灣首獲</span></div>
    </div>
  </div>
</section>

<section class="cta-band" style="padding:80px 0">
  <video class="bg" autoplay muted loop playsinline preload="metadata" aria-hidden="true">
    <source src="video/hope_light.mp4" type="video/mp4">
    <source src="video/hope_light.webm" type="video/webm">
  </video>
  <div class="wrap cta-inner">
    <h2 data-reveal data-i18n-html="evcta_title">需要完整的<span class="hl">證據資料包</span>？</h2>
    <p data-reveal style="--d:.1s" data-i18n="evcta_sub">我們樂意提供論文全文、臨床研究設計與法規文件。</p>
    <div class="btn-ctas" data-reveal style="--d:.2s">
      <a class="btn btn-primary" href="contact.html" data-i18n-html="evcta_btn">索取資料包 <span class="ico">→</span></a>
    </div>
  </div>
</section>
'''

evidence_dict = '''/* v9 evidence 字典 */
window.PANCAD_I18N = window.PANCAD_I18N || { zh: {}, en: {}, ja: {} };
Object.assign(window.PANCAD_I18N.zh, {
  ev_tag: '臨床證據', ev_title: '數據，是<span class="hl">最好的說服</span>。',
  ev1_c: '<2cm 胰臟癌偵測敏感度', ev1_s: '多中心臨床驗證',
  ev2_c: '全國 1,473 例驗證', ev2_s: '真實世界數據',
  ev3_c: '漏診病例中 AI 揪回', ev3_s: '臨床回顧研究',
  ev4_c: '已服務人次', ev4_s: '累積部署',
  pub_tag: '期刊發表', pub_title: '登上國際舞台的<span class="hl">台灣研究</span>。',
  t_journal: '期刊', t_topic: '主題',
  pub1: '胰臟癌 CT AI 偵測', pub2: 'AI 輔助胰臟病灶偵測', pub3: '早期胰臟癌影像標記', pub4: '高風險族群篩檢', pub5: '深度學習於腹部 CT',
  evcta_title: '需要完整的<span class="hl">證據資料包</span>？',
  evcta_sub: '我們樂意提供論文全文、臨床研究設計與法規文件。',
  evcta_btn: '索取資料包 <span class="ico">→</span>',
  h_tag: '臨床證據', h_title: '每一項宣稱，<span class="hl">都有依據</span>。',
  h_sub: '敏感度、AUC、期刊發表、法規字號 — 用數據說話。',
});
Object.assign(window.PANCAD_I18N.en, {
  ev_tag: 'Clinical evidence', ev_title: 'Data is the <span class="hl">best argument</span>.',
  ev1_c: '<2cm pancreatic cancer detection sensitivity', ev1_s: 'Multi-center validation',
  ev2_c: 'AUC across 1,473 national cases', ev2_s: 'Real-world data',
  ev3_c: 'missed cases AI recovered', ev3_s: 'Clinical retrospective',
  ev4_c: 'patients served', ev4_s: 'Cumulative deployment',
  pub_tag: 'Publications', pub_title: 'Taiwan research on the <span class="hl">world stage</span>.',
  t_journal: 'Journal', t_topic: 'Topic',
  pub1: 'CT AI detection of pancreatic cancer', pub2: 'AI-assisted pancreatic lesion detection', pub3: 'Imaging markers of early pancreatic cancer', pub4: 'Screening high-risk populations', pub5: 'Deep learning in abdominal CT',
  evcta_title: 'Need the full <span class="hl">evidence package</span>?',
  evcta_sub: 'We are happy to share full papers, study designs and regulatory documents.',
  evcta_btn: 'Request the package <span class="ico">→</span>',
  h_tag: 'Evidence', h_title: 'Every claim, <span class="hl">backed by data</span>.',
  h_sub: 'Sensitivity, AUC, publications, regulatory numbers — let the data speak.',
});
Object.assign(window.PANCAD_I18N.ja, {
  ev_tag: '臨床エビデンス', ev_title: 'データこそ、<span class="hl">最良の説得</span>。',
  ev1_c: '<2cm 膵臓癌検出感度', ev1_s: '多施設臨床検証',
  ev2_c: '全国1,473例の検証', ev2_s: '実世界データ',
  ev3_c: '見逃し症例のうちAIが救出', ev3_s: '臨床回顧研究',
  ev4_c: 'サービス実績', ev4_s: '累計導入',
  pub_tag: 'ジャーナル掲載', pub_title: '世界の舞台に立つ<span class="hl">台湾研究</span>。',
  t_journal: 'ジャーナル', t_topic: 'テーマ',
  pub1: '膵臓癌CT AI検出', pub2: 'AI支援膵臓病変検出', pub3: '早期膵臓癌の画像マーカー', pub4: 'ハイリスク集団のスクリーニング', pub5: '腹部CTにおける深層学習',
  evcta_title: '完全な<span class="hl">エビデンス資料</span>が必要ですか？',
  evcta_sub: '論文全文、研究デザイン、規制文書を喜んで共有します。',
  evcta_btn: '資料を請求 <span class="ico">→</span>',
  h_tag: '臨床エビデンス', h_title: 'すべての主張に、<span class="hl">根拠がある</span>。',
  h_sub: '感度、AUC、ジャーナル、規制番号 — データで語ります。',
});
'''

build_page('evidence', 'PANCREASaver® 助胰見® — 臨床證據 | 仲智數位健康 PanCAD.ai',
           '92.1% <2cm 敏感度、AUC 0.95、5 篇頂尖期刊、TFDA + FDA Breakthrough — 用數據說話。',
           evidence_body, evidence_dict,
           hero_tag='h_tag', hero_title='h_title', hero_sub='h_sub')
print('PART3 DONE')
