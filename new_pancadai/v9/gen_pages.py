#!/usr/bin/env python3
"""v9 內頁生成器：共用 nav/footer/hero 模板 + 各頁 body 與字典"""
import os, json

HERE = os.path.dirname(os.path.abspath(__file__))

NAV = '''<!-- NAV -->
<nav class="nav" id="nav">
  <div class="wrap nav-inner">
    <a class="logo" href="index.html" aria-label="PanCAD.ai 首頁">
      <svg viewBox="0 0 220 40" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="PANCREASaver 助胰見">
        <text x="0" y="24" font-family="Arial, sans-serif" font-size="17" font-weight="bold" fill="#ffffff">PANCREASaver<sup>®</sup></text>
        <text x="0" y="37" font-family="'Microsoft JhengHei',sans-serif" font-size="11" fill="#ffd9a0">助胰見®</text>
      </svg>
    </a>
    <div class="nav-links" id="navLinks">
      <a href="product.html" data-i18n="nav_product">產品</a>
      <a href="patient.html" data-i18n="nav_patient">個案旅程</a>
      <a href="clinician.html" data-i18n="nav_clinician">醫療專業</a>
      <a href="evidence.html" data-i18n="nav_evidence">臨床證據</a>
      <a href="about.html" data-i18n="nav_about">關於我們</a>
      <a href="news.html" data-i18n="nav_news">最新消息</a>
      <a href="contact.html" data-i18n="nav_contact">聯絡我們</a>
    </div>
    <div class="nav-right">
      <div class="lang-switch">
        <button data-lang="zh" data-i18n="lang_zh">繁中</button>
        <button data-lang="en" data-i18n="lang_en">EN</button>
        <button data-lang="ja" data-i18n="lang_ja">日本語</button>
      </div>
      <button class="burger" id="burger" aria-label="Menu"><span></span><span></span><span></span></button>
    </div>
  </div>
</nav>'''

FOOTER = '''<!-- FOOTER -->
<footer class="footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="brand">
        <a class="logo" href="index.html">
          <svg viewBox="0 0 220 40" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="PANCREASaver 助胰見">
            <text x="0" y="24" font-family="Arial, sans-serif" font-size="17" font-weight="bold" fill="#ffffff">PANCREASaver<sup>®</sup></text>
            <text x="0" y="37" font-family="'Microsoft JhengHei',sans-serif" font-size="11" fill="#ffd9a0">助胰見®</text>
          </svg>
        </a>
        <p data-i18n="ft_slogan">活出精彩 不胰憾 — PANCREASaver® 助胰見®</p>
        <p data-i18n="ft_desc">仲智數位健康（PanCAD.ai）將台大團隊的 AI 影像技術商品化，打造全球首創全自動化胰臟癌 CT AI 輔助偵測系統。</p>
      </div>
      <div>
        <h4 data-i18n="ft_sitemap">網站地圖</h4>
        <a href="product.html" data-i18n="nav_product">產品</a>
        <a href="patient.html" data-i18n="nav_patient">個案旅程</a>
        <a href="clinician.html" data-i18n="nav_clinician">醫療專業</a>
        <a href="evidence.html" data-i18n="nav_evidence">臨床證據</a>
      </div>
      <div>
        <h4 data-i18n="ft_prod">產品與證據</h4>
        <a href="about.html" data-i18n="nav_about">關於我們</a>
        <a href="news.html" data-i18n="nav_news">最新消息</a>
        <a href="contact.html" data-i18n="nav_contact">聯絡我們</a>
      </div>
      <div>
        <h4 data-i18n="ft_contact">聯絡資訊</h4>
        <a href="contact.html">contact@pancad.ai</a>
        <a href="contact.html" data-i18n="ft_addr">台北市 · 仲智數位健康股份有限公司</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span data-i18n="ft_rights">© 2026 仲智數位健康股份有限公司 PanCAD.ai 版權所有</span>
      <span class="ver-badge"><span class="vdot"></span><span data-i18n="ft_ver">v9.0.0</span></span>
    </div>
  </div>
</footer>'''

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

# ============ product.html ============
product_body = '''
<section class="section-pad" style="background:linear-gradient(180deg,var(--night),var(--night2))">
  <div class="wrap">
    <span class="sec-tag" data-reveal data-i18n="p_tag">產品如何運作</span>
    <h2 class="sec-title" data-reveal style="--d:.1s" data-i18n-html="p_title">一套系統，<span class="hl">三道防線</span>。</h2>
    <p class="sec-sub" data-reveal style="--d:.15s" data-i18n="p_sub">PANCREASaver® 助胰見® 全自動化運作 — 不改變既有檢查流程，只在關鍵時刻多一雙眼睛。</p>
    <div class="features">
      <div class="feature" data-reveal style="--d:.1s">
        <div class="f-ic">🛰️</div>
        <h3 data-i18n="f1_t">即時判讀</h3>
        <p data-i18n="f1_d">CT 掃描完成即自動啟動 AI 分析，全程無需人工操作。</p>
      </div>
      <div class="feature" data-reveal style="--d:.2s">
        <div class="f-ic">🚨</div>
        <h3 data-i18n="f2_t">PACS 即時警示</h3>
        <p data-i18n="f2_d">偵測到可疑病灶立即在 PACS 工作站發出警示，臨床醫師第一時間掌握。</p>
      </div>
      <div class="feature" data-reveal style="--d:.3s">
        <div class="f-ic">🎯</div>
        <h3 data-i18n="f3_t">自動標記病灶</h3>
        <p data-i18n="f3_d">自動圈出病灶位置與範圍，協助放射科醫師聚焦判讀。</p>
      </div>
      <div class="feature" data-reveal style="--d:.15s">
        <div class="f-ic">⚡</div>
        <h3 data-i18n="f4_t">高風險優先</h3>
        <p data-i18n="f4_d">高風險影像優先載入工作清單，讓關鍵發現不被淹沒在排程中。</p>
      </div>
      <div class="feature" data-reveal style="--d:.25s">
        <div class="f-ic">📋</div>
        <h3 data-i18n="f5_t">結構化報告</h3>
        <p data-i18n="f5_d">自動產出結構化報告，減少文書負擔，加速臨床決策。</p>
      </div>
      <div class="feature" data-reveal style="--d:.35s">
        <div class="f-ic">🔒</div>
        <h3 data-i18n="f6_t">符合法規設計</h3>
        <p data-i18n="f6_d">TFDA 醫療器材許可 + FDA Breakthrough，安全與效能雙重把關。</p>
      </div>
    </div>
  </div>
</section>

<section class="section-pad">
  <div class="wrap">
    <div style="text-align:center;margin-bottom:20px">
      <span class="sec-tag" style="justify-content:center" data-reveal data-i18n="flow_tag">判讀流程</span>
      <h2 class="sec-title" data-reveal style="--d:.1s" data-i18n-html="flow_title">從掃描到報告，<span class="hl">全自動</span>。</h2>
    </div>
    <div class="steps">
      <div class="step" data-reveal style="--d:.05s"><h3 data-i18n="s1_t">CT 掃描完成</h3><p data-i18n="s1_d">病患完成腹部 CT，影像自動上傳 PACS。</p></div>
      <div class="step" data-reveal style="--d:.1s"><h3 data-i18n="s2_t">AI 背景分析</h3><p data-i18n="s2_d">PANCREASaver 自動分析全影像序列，偵測可疑病灶。</p></div>
      <div class="step" data-reveal style="--d:.15s"><h3 data-i18n="s3_t">警示與標記</h3><p data-i18n="s3_d">可疑病灶自動標記，放射科醫師工作清單即時收到警示。</p></div>
      <div class="step" data-reveal style="--d:.2s"><h3 data-i18n="s4_t">醫師確認報告</h3><p data-i18n="s4_d">放射科醫師複核 AI 結果，產出最終判讀報告。</p></div>
    </div>
  </div>
</section>

<section class="section-pad" style="background:linear-gradient(180deg,var(--night2),var(--night))">
  <div class="wrap">
    <div class="split-row">
      <div class="media" data-reveal="left">
        <img src="assets/photos/ai_reading.jpg" alt="AI 輔助判讀畫面" loading="lazy">
      </div>
      <div data-reveal="right">
        <span class="sec-tag" data-i18n="real_tag">真實系統</span>
        <h2 class="sec-title" style="font-size:clamp(26px,3.4vw,40px)" data-i18n-html="real_title">不是願景，是<span class="hl">已上線的系統</span>。</h2>
        <p class="sec-sub" data-i18n="real_sub">PANCREASaver 已在醫學中心、區域醫院與健檢中心實際部署運作，累積 300+ 人次真實判讀經驗，持續優化。</p>
        <div class="case-points">
          <div class="case-point" data-reveal style="--d:.1s"><div class="ic">🏥</div><div><b data-i18n="r1_t">臨床場域驗證</b><span data-i18n="r1_d">與一線放射科共同驗證工作流程</span></div></div>
          <div class="case-point" data-reveal style="--d:.2s"><div class="ic">📈</div><div><b data-i18n="r2_t">持續優化</b><span data-i18n="r2_d">真實案例回饋，模型持續迭代</span></div></div>
        </div>
      </div>
    </div>
  </div>
</section>
'''

product_dict = '''/* v9 product 字典 */
window.PANCAD_I18N = window.PANCAD_I18N || { zh: {}, en: {}, ja: {} };
Object.assign(window.PANCAD_I18N.zh, {
  p_tag: '產品如何運作', p_title: '一套系統，<span class="hl">三道防線</span>。',
  p_sub: 'PANCREASaver® 助胰見® 全自動化運作 — 不改變既有檢查流程，只在關鍵時刻多一雙眼睛。',
  f1_t: '即時判讀', f1_d: 'CT 掃描完成即自動啟動 AI 分析，全程無需人工操作。',
  f2_t: 'PACS 即時警示', f2_d: '偵測到可疑病灶立即在 PACS 工作站發出警示，臨床醫師第一時間掌握。',
  f3_t: '自動標記病灶', f3_d: '自動圈出病灶位置與範圍，協助放射科醫師聚焦判讀。',
  f4_t: '高風險優先', f4_d: '高風險影像優先載入工作清單，讓關鍵發現不被淹沒在排程中。',
  f5_t: '結構化報告', f5_d: '自動產出結構化報告，減少文書負擔，加速臨床決策。',
  f6_t: '符合法規設計', f6_d: 'TFDA 醫療器材許可 + FDA Breakthrough，安全與效能雙重把關。',
  flow_tag: '判讀流程', flow_title: '從掃描到報告，<span class="hl">全自動</span>。',
  s1_t: 'CT 掃描完成', s1_d: '病患完成腹部 CT，影像自動上傳 PACS。',
  s2_t: 'AI 背景分析', s2_d: 'PANCREASaver 自動分析全影像序列，偵測可疑病灶。',
  s3_t: '警示與標記', s3_d: '可疑病灶自動標記，放射科醫師工作清單即時收到警示。',
  s4_t: '醫師確認報告', s4_d: '放射科醫師複核 AI 結果，產出最終判讀報告。',
  real_tag: '真實系統', real_title: '不是願景，是<span class="hl">已上線的系統</span>。',
  real_sub: 'PANCREASaver 已在醫學中心、區域醫院與健檢中心實際部署運作，累積 300+ 人次真實判讀經驗，持續優化。',
  r1_t: '臨床場域驗證', r1_d: '與一線放射科共同驗證工作流程',
  r2_t: '持續優化', r2_d: '真實案例回饋，模型持續迭代',
  h_tag: '產品', h_title: '每一張 CT，<span class="hl">多一雙眼睛</span>。',
  h_sub: 'PANCREASaver® 助胰見® — 全球首創全自動化胰臟癌 CT AI 輔助偵測系統。',
});
Object.assign(window.PANCAD_I18N.en, {
  p_tag: 'How it works', p_title: 'One system, <span class="hl">three lines of defense</span>.',
  p_sub: 'PANCREASaver® runs fully automated — it never changes your existing workflow, it only adds a second pair of eyes at the critical moment.',
  f1_t: 'Real-time reading', f1_d: 'AI analysis starts automatically the moment a CT completes — zero manual steps.',
  f2_t: 'PACS real-time alert', f2_d: 'Suspicious findings trigger an instant alert on the PACS workstation.',
  f3_t: 'Auto lesion marking', f3_d: 'Lesions are circled automatically with location, focusing the radiologist.',
  f4_t: 'High-risk priority', f4_d: 'High-risk studies jump the queue — critical findings are never buried.',
  f5_t: 'Structured report', f5_d: 'Auto-generated structured reports cut paperwork and speed decisions.',
  f6_t: 'Regulatory by design', f6_d: 'TFDA medical device license + FDA Breakthrough designation.',
  flow_tag: 'Reading workflow', flow_title: 'From scan to report, <span class="hl">fully automated</span>.',
  s1_t: 'CT completed', s1_d: 'Patient scan completes; images upload to PACS automatically.',
  s2_t: 'AI background analysis', s2_d: 'PANCREASaver analyzes the full series for suspicious lesions.',
  s3_t: 'Alert & mark', s3_d: 'Findings auto-marked; the radiologist worklist is alerted instantly.',
  s4_t: 'Physician confirms', s4_d: 'Radiologist reviews the AI output and issues the final report.',
  real_tag: 'Real system', real_title: 'Not a vision — <span class="hl">a live system</span>.',
  real_sub: 'PANCREASaver is deployed in medical centers, regional hospitals and screening centers — 300+ real reads and counting.',
  r1_t: 'Clinical validation', r1_d: 'Workflow co-validated with frontline radiologists',
  r2_t: 'Continuous improvement', r2_d: 'Real-case feedback drives ongoing model iteration',
  h_tag: 'Product', h_title: 'Every CT scan, <span class="hl">a second pair of eyes</span>.',
  h_sub: 'PANCREASaver® — the world\'s first fully automated pancreatic cancer CT AI-assisted detection system.',
});
Object.assign(window.PANCAD_I18N.ja, {
  p_tag: '製品の仕組み', p_title: '一つのシステム、<span class="hl">三重の防御</span>。',
  p_sub: 'PANCREASaver® は完全自動で動作 — 既存の流れを変えず、重要な瞬間にだけ「第二の目」を添えます。',
  f1_t: 'リアルタイム解析', f1_d: 'CT完了と同時にAI解析が自動開始 — 操作不要。',
  f2_t: 'PACS即時警告', f2_d: '疑わしい病変を検出するとPACSワークステーションに即時警告。',
  f3_t: '自動マーキング', f3_d: '病変の位置と範囲を自動で囲み、読影医の注目をサポート。',
  f4_t: '高リスク優先', f4_d: '高リスク画像をワークリストで優先表示 — 重大な発見を見逃さない。',
  f5_t: '構造化レポート', f5_d: '構造化レポートを自動生成、文書作業を削減し意思決定を加速。',
  f6_t: '規制対応設計', f6_d: 'TFDA医療機器認可 + FDA Breakthrough指定。',
  flow_tag: '読影フロー', flow_title: 'スキャンからレポートまで、<span class="hl">完全自動</span>。',
  s1_t: 'CT完了', s1_d: '患者のCTが完了し、画像が自動でPACSへ。',
  s2_t: 'AIバックグラウンド解析', s2_d: 'PANCREASaverが全シリーズを自動解析し病変を検出。',
  s3_t: '警告とマーキング', s3_d: '病変を自動マーク、読影医のワークリストに即時通知。',
  s4_t: '医師確認', s4_d: '放射線科医がAI出力を確認し最終レポートを発行。',
  real_tag: '実際のシステム', real_title: 'ビジョンではなく、<span class="hl">稼働中のシステム</span>。',
  real_sub: '医学センター・地域病院・健診センターで実際に稼働中 — 300+ 件の実読影を重ねています。',
  r1_t: '臨床現場での検証', r1_d: '第一線の放射線科医とワークフローを共同検証',
  r2_t: '継続的改善', r2_d: '実症例フィードバックでモデルを継続更新',
  h_tag: '製品', h_title: 'すべてのCTに、<span class="hl">第二の目</span>を。',
  h_sub: 'PANCREASaver® — 世界初の全自動膵臓癌CT AI補助検出システム。',
});
'''

build_page('product', 'PANCREASaver® 助胰見® — 產品介紹 | 仲智數位健康 PanCAD.ai',
           '全球首創全自動化胰臟癌 CT AI 輔助偵測系統 — 即時判讀、PACS 警示、自動標記、結構化報告。',
           product_body, product_dict,
           hero_tag='h_tag', hero_title='h_title', hero_sub='h_sub')
print('ALL DONE')
