#!/usr/bin/env python3
"""v9 內頁生成器 Part 4：about / news / contact（部署前補齊）"""
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

# ============ about.html ============
about_body = '''
<section class="section-pad" style="background:linear-gradient(180deg,var(--night),var(--night2))">
  <div class="wrap">
    <div class="split-row">
      <div data-reveal="left">
        <span class="sec-tag" data-i18n="ab_tag">我們的使命</span>
        <h2 class="sec-title" style="font-size:clamp(26px,3.6vw,42px)" data-i18n-html="ab_title">讓 AI 成為<span class="hl">每一個人</span>的健康防線。</h2>
        <p class="sec-sub" data-i18n="ab_sub">仲智數位健康股份有限公司（PanCAD.ai）由台大團隊的 AI 影像研究出發，將頂尖學術成果商品化為臨床可用的醫療器材 — 目標只有一個：讓胰臟癌不再等於絕症。</p>
        <div class="case-points">
          <div class="case-point" data-reveal style="--d:.1s"><div class="ic">🎓</div><div><b data-i18n="ab1_t">學術源頭</b><span data-i18n="ab1_d">台大王偉仲教授 × 台大醫院廖偉智教授</span></div></div>
          <div class="case-point" data-reveal style="--d:.2s"><div class="ic">🏭</div><div><b data-i18n="ab2_t">產業化</b><span data-i18n="ab2_d">技術移轉、臨床驗證、法規取證</span></div></div>
          <div class="case-point" data-reveal style="--d:.3s"><div class="ic">🌍</div><div><b data-i18n="ab3_t">全球視野</b><span data-i18n="ab3_d">FDA Breakthrough、國際期刊與獎項肯定</span></div></div>
        </div>
      </div>
      <div class="media" data-reveal="zoom" style="--d:.1s">
        <img src="assets/photos/hero_couple40.jpg" alt="希望與生活" loading="lazy">
      </div>
    </div>
  </div>
</section>

<section class="section-pad">
  <div class="wrap">
    <div style="text-align:center;margin-bottom:20px">
      <span class="sec-tag" style="justify-content:center" data-reveal data-i18n="mile_tag">里程碑</span>
      <h2 class="sec-title" data-reveal style="--d:.1s" data-i18n-html="mile_title">從實驗室到<span class="hl">臨床一線</span>。</h2>
    </div>
    <div class="timeline" style="max-width:760px;margin:0 auto">
      <div class="tl-item" data-reveal><span class="yr">2021</span><h3 data-i18n="m1_t">台大團隊啟動研究</h3><p data-i18n="m1_d">胰臟癌 CT AI 偵測技術於台大醫院展開開發與驗證。</p></div>
      <div class="tl-item" data-reveal><span class="yr">2022</span><h3 data-i18n="m2_t">仲智數位健康成立</h3><p data-i18n="m2_d">技術移轉落地，開啟產業化之路。</p></div>
      <div class="tl-item" data-reveal><span class="yr">2023</span><h3 data-i18n="m3_t">RSNA Margulis 台灣首獲</h3><p data-i18n="m3_d">於北美放射學會年會獲頒 Margulis Award — 台灣首次。</p></div>
      <div class="tl-item" data-reveal><span class="yr">2024</span><h3 data-i18n="m4_t">FDA Breakthrough + TFDA 許可</h3><p data-i18n="m4_d">取得美國 FDA 突破性醫材資格與 TFDA 醫療器材許可（衛部醫器製字第007946號）。</p></div>
      <div class="tl-item" data-reveal><span class="yr">2025</span><h3 data-i18n="m5_t">臨床部署擴大</h3><p data-i18n="m5_d">進駐醫學中心、區域醫院與健檢中心，累積 300+ 人次。</p></div>
      <div class="tl-item" data-reveal><span class="yr">2026</span><h3 data-i18n="m6_t">持續前行</h3><p data-i18n="m6_d">讓 AI 早期偵測，守護更多生命。</p></div>
    </div>
  </div>
</section>
'''

about_dict = '''/* v9 about 字典 */
window.PANCAD_I18N = window.PANCAD_I18N || { zh: {}, en: {}, ja: {} };
Object.assign(window.PANCAD_I18N.zh, {
  ab_tag: '我們的使命', ab_title: '讓 AI 成為<span class="hl">每一個人</span>的健康防線。',
  ab_sub: '仲智數位健康股份有限公司（PanCAD.ai）由台大團隊的 AI 影像研究出發，將頂尖學術成果商品化為臨床可用的醫療器材 — 目標只有一個：讓胰臟癌不再等於絕症。',
  ab1_t: '學術源頭', ab1_d: '台大王偉仲教授 × 台大醫院廖偉智教授',
  ab2_t: '產業化', ab2_d: '技術移轉、臨床驗證、法規取證',
  ab3_t: '全球視野', ab3_d: 'FDA Breakthrough、國際期刊與獎項肯定',
  mile_tag: '里程碑', mile_title: '從實驗室到<span class="hl">臨床一線</span>。',
  m1_t: '台大團隊啟動研究', m1_d: '胰臟癌 CT AI 偵測技術於台大醫院展開開發與驗證。',
  m2_t: '仲智數位健康成立', m2_d: '技術移轉落地，開啟產業化之路。',
  m3_t: 'RSNA Margulis 台灣首獲', m3_d: '於北美放射學會年會獲頒 Margulis Award — 台灣首次。',
  m4_t: 'FDA Breakthrough + TFDA 許可', m4_d: '取得美國 FDA 突破性醫材資格與 TFDA 醫療器材許可（衛部醫器製字第007946號）。',
  m5_t: '臨床部署擴大', m5_d: '進駐醫學中心、區域醫院與健檢中心，累積 300+ 人次。',
  m6_t: '持續前行', m6_d: '讓 AI 早期偵測，守護更多生命。',
  h_tag: '關於我們', h_title: '從台大實驗室，到<span class="hl">你的身邊</span>。',
  h_sub: '仲智數位健康（PanCAD.ai）— 將頂尖 AI 影像研究，變成守護生命的醫療器材。',
});
Object.assign(window.PANCAD_I18N.en, {
  ab_tag: 'Our mission', ab_title: 'Making AI a <span class="hl">health defense</span> for everyone.',
  ab_sub: 'PanCAD.ai started from NTU\'s AI imaging research and turned world-class academic results into clinical-grade medical devices — with one goal: pancreatic cancer must no longer be a death sentence.',
  ab1_t: 'Academic origin', ab1_d: 'Prof. Wang Wei-Chung (NTU) × Prof. Liao Wei-Chih (NTUH)',
  ab2_t: 'Industrialization', ab2_d: 'Technology transfer, clinical validation, regulatory clearance',
  ab3_t: 'Global vision', ab3_d: 'FDA Breakthrough, international publications and awards',
  mile_tag: 'Milestones', mile_title: 'From the lab to the <span class="hl">frontline</span>.',
  m1_t: 'NTU team launches research', m1_d: 'Pancreatic cancer CT AI detection developed and validated at NTU Hospital.',
  m2_t: 'PanCAD.ai founded', m2_d: 'Technology transfer begins the path to industrialization.',
  m3_t: 'RSNA Margulis — first for Taiwan', m3_d: 'Margulis Award at RSNA annual meeting — a first for Taiwan.',
  m4_t: 'FDA Breakthrough + TFDA license', m4_d: 'US FDA Breakthrough Device designation and TFDA medical device license (衛部醫器製字第007946號).',
  m5_t: 'Clinical deployment expands', m5_d: 'Medical centers, regional hospitals and screening centers — 300+ patients served.',
  m6_t: 'Still moving forward', m6_d: 'AI early detection, protecting more lives.',
  h_tag: 'About us', h_title: 'From the NTU lab, <span class="hl">to your side</span>.',
  h_sub: 'PanCAD.ai — turning world-class AI imaging research into life-saving medical devices.',
});
Object.assign(window.PANCAD_I18N.ja, {
  ab_tag: '私たちの使命', ab_title: 'AIを<span class="hl">すべての人</span>の健康防衛に。',
  ab_sub: 'PanCAD.aiは台湾大学チームのAI画像研究から始まり、最先端の学術成果を臨床で使える医療機器にしました — 目標はただ一つ、膵臓癌を「不治の病」ではなくすこと。',
  ab1_t: '学術の源流', ab1_d: '王偉仲教授（台湾大学）× 廖偉智教授（台大医院）',
  ab2_t: '産業化', ab2_d: '技術移転、臨床検証、規制認可',
  ab3_t: 'グローバルな視野', ab3_d: 'FDA Breakthrough、国際ジャーナルと受賞',
  mile_tag: 'マイルストーン', mile_title: '研究室から<span class="hl">臨床最前線</span>へ。',
  m1_t: '台湾大学チームが研究開始', m1_d: '膵臓癌CT AI検出技術を台大医院で開発・検証。',
  m2_t: 'PanCAD.ai設立', m2_d: '技術移転により産業化の道へ。',
  m3_t: 'RSNA Margulis 台湾初受賞', m3_d: '北米放射線学会でMargulis賞を受賞 — 台湾初。',
  m4_t: 'FDA Breakthrough + TFDA認可', m4_d: '米国FDA画期的医療機器指定とTFDA医療機器認可（衛部醫器製字第007946号）を取得。',
  m5_t: '臨床導入拡大', m5_d: '医学センター・地域病院・健診センターで累計300+人。',
  m6_t: '前進し続ける', m6_d: 'AI早期検出で、より多くの命を守る。',
  h_tag: '私たちについて', h_title: '台湾大学の研究室から、<span class="hl">あなたのそばへ</span>。',
  h_sub: 'PanCAD.ai — 世界最先端のAI画像研究を、命を守る医療機器に。',
});
'''

build_page('about', '仲智數位健康 PanCAD.ai — 關於我們 | PANCREASaver® 助胰見®',
           '從台大實驗室到臨床一線：RSNA Margulis 台灣首獲、FDA Breakthrough、TFDA 許可 — 讓 AI 成為每個人的健康防線。',
           about_body, about_dict,
           hero_tag='h_tag', hero_title='h_title', hero_sub='h_sub')

# ============ news.html ============
news_body = '''
<section class="section-pad" style="background:linear-gradient(180deg,var(--night),var(--night2))">
  <div class="wrap">
    <span class="sec-tag" data-reveal data-i18n="n_tag">最新消息</span>
    <h2 class="sec-title" data-reveal style="--d:.1s" data-i18n-html="n_title">與世界同步的<span class="hl">每一步</span>。</h2>
    <div class="news-grid">
      <div class="news-card" data-reveal style="--d:.05s">
        <span class="date">2026 · NEWS</span>
        <h3 data-i18n="n1_t">PANCREASaver 獲頒 RSNA Margulis Award — 台灣首次</h3>
        <p data-i18n="n1_d">於北美放射學會（RSNA）年會獲頒 Margulis Award，肯定胰臟癌 AI 早期偵測的突破性貢獻。</p>
        <span class="more" data-i18n="n_more">閱讀更多 →</span>
      </div>
      <div class="news-card" data-reveal style="--d:.1s">
        <span class="date">2026 · FDA</span>
        <h3 data-i18n="n2_t">獲美國 FDA Breakthrough 突破性醫材資格</h3>
        <p data-i18n="n2_d">美國 FDA 肯定 PANCREASaver 在胰臟癌早期偵測的創新潛力，加速審查與上市流程。</p>
        <span class="more" data-i18n="n_more">閱讀更多 →</span>
      </div>
      <div class="news-card" data-reveal style="--d:.15s">
        <span class="date">2026 · TFDA</span>
        <h3 data-i18n="n3_t">取得 TFDA 醫療器材許可證</h3>
        <p data-i18n="n3_d">衛部醫器製字第 007946 號 — PANCREASaver 正式取得台灣醫療器材上市許可。</p>
        <span class="more" data-i18n="n_more">閱讀更多 →</span>
      </div>
      <div class="news-card" data-reveal style="--d:.2s">
        <span class="date">2026 · 研究</span>
        <h3 data-i18n="n4_t">研究成果登上 Lancet Digital Health</h3>
        <p data-i18n="n4_d">胰臟癌 CT AI 偵測技術獲國際頂尖期刊發表，數據獲全球學界認可。</p>
        <span class="more" data-i18n="n_more">閱讀更多 →</span>
      </div>
      <div class="news-card" data-reveal style="--d:.25s">
        <span class="date">2026 · 部署</span>
        <h3 data-i18n="n5_t">臨床部署累積 300+ 人次</h3>
        <p data-i18n="n5_d">醫學中心、區域醫院與健檢中心持續導入，真實世界數據不斷累積。</p>
        <span class="more" data-i18n="n_more">閱讀更多 →</span>
      </div>
      <div class="news-card" data-reveal style="--d:.3s">
        <span class="date">2026 · 獎項</span>
        <h3 data-i18n="n6_t">SNQ 國家品質標章肯定</h3>
        <p data-i18n="n6_d">以臨床品質與安全標準獲得 SNQ 國家品質標章認證。</p>
        <span class="more" data-i18n="n_more">閱讀更多 →</span>
      </div>
    </div>
  </div>
</section>
'''

news_dict = '''/* v9 news 字典 */
window.PANCAD_I18N = window.PANCAD_I18N || { zh: {}, en: {}, ja: {} };
Object.assign(window.PANCAD_I18N.zh, {
  n_tag: '最新消息', n_title: '與世界同步的<span class="hl">每一步</span>。',
  n_more: '閱讀更多 →',
  n1_t: 'PANCREASaver 獲頒 RSNA Margulis Award — 台灣首次', n1_d: '於北美放射學會（RSNA）年會獲頒 Margulis Award，肯定胰臟癌 AI 早期偵測的突破性貢獻。',
  n2_t: '獲美國 FDA Breakthrough 突破性醫材資格', n2_d: '美國 FDA 肯定 PANCREASaver 在胰臟癌早期偵測的創新潛力，加速審查與上市流程。',
  n3_t: '取得 TFDA 醫療器材許可證', n3_d: '衛部醫器製字第 007946 號 — PANCREASaver 正式取得台灣醫療器材上市許可。',
  n4_t: '研究成果登上 Lancet Digital Health', n4_d: '胰臟癌 CT AI 偵測技術獲國際頂尖期刊發表，數據獲全球學界認可。',
  n5_t: '臨床部署累積 300+ 人次', n5_d: '醫學中心、區域醫院與健檢中心持續導入，真實世界數據不斷累積。',
  n6_t: 'SNQ 國家品質標章肯定', n6_d: '以臨床品質與安全標準獲得 SNQ 國家品質標章認證。',
  h_tag: '最新消息', h_title: '與世界同步的<span class="hl">每一步</span>。',
  h_sub: '獎項、認證、研究與部署 — 仲智數位健康的最新動態。',
});
Object.assign(window.PANCAD_I18N.en, {
  n_tag: 'News', n_title: 'Every step, <span class="hl">in sync with the world</span>.',
  n_more: 'Read more →',
  n1_t: 'PANCREASaver wins RSNA Margulis Award — first for Taiwan', n1_d: 'Margulis Award at the Radiological Society of North America (RSNA) annual meeting, honoring breakthrough contributions to AI early detection of pancreatic cancer.',
  n2_t: 'US FDA Breakthrough Device designation', n2_d: 'The FDA recognizes PANCREASaver\'s innovative potential in early pancreatic cancer detection, accelerating review and market access.',
  n3_t: 'TFDA medical device license granted', n3_d: 'License 衛部醫器製字第 007946 號 — PANCREASaver is officially licensed for sale in Taiwan.',
  n4_t: 'Research published in Lancet Digital Health', n4_d: 'Pancreatic cancer CT AI detection published in a leading international journal, validated by the global community.',
  n5_t: '300+ clinical reads and counting', n5_d: 'Medical centers, regional hospitals and screening centers keep deploying — real-world data keeps growing.',
  n6_t: 'SNQ National Quality Mark', n6_d: 'Recognized for clinical quality and safety standards with the SNQ National Quality Mark.',
  h_tag: 'News', h_title: 'Every step, <span class="hl">in sync with the world</span>.',
  h_sub: 'Awards, clearances, research and deployment — the latest from PanCAD.ai.',
});
Object.assign(window.PANCAD_I18N.ja, {
  n_tag: 'ニュース', n_title: '世界と歩調を合わせる<span class="hl">一歩一歩</span>。',
  n_more: '続きを読む →',
  n1_t: 'PANCREASaverがRSNA Margulis賞を受賞 — 台湾初', n1_d: '北米放射線学会（RSNA）年次総会でMargulis賞を受賞。膵臓癌AI早期検出への画期的な貢献が評価されました。',
  n2_t: '米国FDA Breakthrough指定を取得', n2_d: '米国FDAが膵臓癌早期検出における革新性を評価し、審査と上市を加速。',
  n3_t: 'TFDA医療機器認可を取得', n3_d: '許可番号 衛部醫器製字第 007946 号 — 台湾での販売が正式に認可。',
  n4_t: '研究成果がLancet Digital Healthに掲載', n4_d: '膵臓癌CT AI検出技術が国際的トップジャーナルに掲載され、世界の学界に認められました。',
  n5_t: '臨床導入 累計300+人', n5_d: '医学センター・地域病院・健診センターで導入が続き、実世界データが蓄積。',
  n6_t: 'SNQ国家品質マーク認定', n6_d: '臨床品質と安全基準でSNQ国家品質マークを取得。',
  h_tag: 'ニュース', h_title: '世界と歩調を合わせる<span class="hl">一歩一歩</span>。',
  h_sub: '受賞・認可・研究・導入 — PanCAD.aiの最新情報。',
});
'''

build_page('news', 'PANCREASaver® 助胰見® — 最新消息 | 仲智數位健康 PanCAD.ai',
           'RSNA Margulis 台灣首獲、FDA Breakthrough、TFDA 許可、Lancet Digital Health — 仲智數位健康的最新動態。',
           news_body, news_dict,
           hero_tag='h_tag', hero_title='h_title', hero_sub='h_sub')

# ============ contact.html ============
contact_body = '''
<section class="section-pad" style="background:linear-gradient(180deg,var(--night),var(--night2))">
  <div class="wrap">
    <div class="split-row">
      <div data-reveal="left">
        <span class="sec-tag" data-i18n="c_tag">聯絡我們</span>
        <h2 class="sec-title" style="font-size:clamp(26px,3.6vw,42px)" data-i18n-html="c_title">我們想聽聽<span class="hl">您的故事</span>。</h2>
        <p class="sec-sub" data-i18n="c_sub">無論您是患者、家屬、醫療機構或健檢中心，都歡迎與我們聯繫。我們會在 1–2 個工作天內回覆。</p>
        <div class="case-points">
          <div class="case-point" data-reveal style="--d:.1s"><div class="ic">✉️</div><div><b>Email</b><span>contact@pancad.ai</span></div></div>
          <div class="case-point" data-reveal style="--d:.2s"><div class="ic">🏢</div><div><b data-i18n="c_addr">公司地址</b><span data-i18n="c_addr_d">台北市 · 仲智數位健康股份有限公司（PanCAD.ai）</span></div></div>
          <div class="case-point" data-reveal style="--d:.3s"><div class="ic">🕐</div><div><b data-i18n="c_time">服務時間</b><span data-i18n="c_time_d">週一至週五 09:00–18:00（台灣時間）</span></div></div>
        </div>
      </div>
      <div data-reveal="right" style="--d:.1s">
        <form class="form-card" id="contactForm">
          <label data-i18n="f_name">姓名</label>
          <input type="text" name="name" required data-i18n-ph="f_name_ph" placeholder="您的姓名">
          <label data-i18n="f_email">Email</label>
          <input type="email" name="email" required data-i18n-ph="f_email_ph" placeholder="you@example.com">
          <label data-i18n="f_type">我想諮詢</label>
          <select name="type">
            <option data-i18n="f_type1">患者 / 家屬諮詢</option>
            <option data-i18n="f_type2">醫療機構合作</option>
            <option data-i18n="f_type3">健檢中心方案</option>
            <option data-i18n="f_type4">媒體 / 其他</option>
          </select>
          <label data-i18n="f_msg">訊息</label>
          <textarea name="message" required data-i18n-ph="f_msg_ph" placeholder="請告訴我們您想了解的事"></textarea>
          <button type="submit" class="btn btn-primary" data-i18n="f_send">送出訊息 <span class="ico">→</span></button>
          <p id="formOk" style="display:none;margin-top:16px;color:var(--dawn-lt);text-align:center;font-size:14.5px" data-i18n="f_ok">✅ 已收到您的訊息，我們會盡快回覆！</p>
        </form>
      </div>
    </div>
  </div>
</section>
'''

contact_dict = '''/* v9 contact 字典 */
window.PANCAD_I18N = window.PANCAD_I18N || { zh: {}, en: {}, ja: {} };
Object.assign(window.PANCAD_I18N.zh, {
  c_tag: '聯絡我們', c_title: '我們想聽聽<span class="hl">您的故事</span>。',
  c_sub: '無論您是患者、家屬、醫療機構或健檢中心，都歡迎與我們聯繫。我們會在 1–2 個工作天內回覆。',
  c_addr: '公司地址', c_addr_d: '台北市 · 仲智數位健康股份有限公司（PanCAD.ai）',
  c_time: '服務時間', c_time_d: '週一至週五 09:00–18:00（台灣時間）',
  f_name: '姓名', f_name_ph: '您的姓名',
  f_email: 'Email', f_email_ph: 'you@example.com',
  f_type: '我想諮詢',
  f_type1: '患者 / 家屬諮詢', f_type2: '醫療機構合作', f_type3: '健檢中心方案', f_type4: '媒體 / 其他',
  f_msg: '訊息', f_msg_ph: '請告訴我們您想了解的事',
  f_send: '送出訊息 <span class="ico">→</span>',
  f_ok: '✅ 已收到您的訊息，我們會盡快回覆！',
  h_tag: '聯絡我們', h_title: '讓對話，<span class="hl">開始吧</span>。',
  h_sub: '患者諮詢、機構合作、健檢導入 — 我們在線等您。',
});
Object.assign(window.PANCAD_I18N.en, {
  c_tag: 'Contact', c_title: 'We\'d love to hear <span class="hl">your story</span>.',
  c_sub: 'Whether you\'re a patient, family member, healthcare institution or screening center — reach out. We reply within 1–2 business days.',
  c_addr: 'Address', c_addr_d: 'Taipei, Taiwan · 仲智數位健康股份有限公司 (PanCAD.ai)',
  c_time: 'Hours', c_time_d: 'Mon–Fri 09:00–18:00 (Taipei time)',
  f_name: 'Name', f_name_ph: 'Your name',
  f_email: 'Email', f_email_ph: 'you@example.com',
  f_type: 'I\'m inquiring about',
  f_type1: 'Patient / family consultation', f_type2: 'Healthcare partnership', f_type3: 'Screening center program', f_type4: 'Media / other',
  f_msg: 'Message', f_msg_ph: 'Tell us what you\'d like to know',
  f_send: 'Send message <span class="ico">→</span>',
  f_ok: '✅ Message received — we\'ll get back to you soon!',
  h_tag: 'Contact', h_title: 'Let\'s start <span class="hl">the conversation</span>.',
  h_sub: 'Patient consultation, institutional partnership, screening rollout — we\'re here.',
});
Object.assign(window.PANCAD_I18N.ja, {
  c_tag: 'お問い合わせ', c_title: 'あなたの<span class="hl">お話</span>を聞かせてください。',
  c_sub: '患者様・ご家族・医療機関・健診センター、どなたでもお気軽に。1〜2営業日以内に返信します。',
  c_addr: '所在地', c_addr_d: '台北市 · 仲智數位健康股份有限公司（PanCAD.ai）',
  c_time: '受付時間', c_time_d: '月〜金 09:00–18:00（台北時間）',
  f_name: 'お名前', f_name_ph: 'お名前',
  f_email: 'Email', f_email_ph: 'you@example.com',
  f_type: 'お問い合わせ種別',
  f_type1: '患者・ご家族からの相談', f_type2: '医療機関との提携', f_type3: '健診センター向けプラン', f_type4: 'メディア・その他',
  f_msg: 'メッセージ', f_msg_ph: '知りたいことをお書きください',
  f_send: '送信 <span class="ico">→</span>',
  f_ok: '✅ メッセージを受け取りました。すぐに返信します！',
  h_tag: 'お問い合わせ', h_title: '対話を、<span class="hl">始めましょう</span>。',
  h_sub: '患者相談・機関提携・健診導入 — いつでもお待ちしています。',
});
'''

build_page('contact', '仲智數位健康 PanCAD.ai — 聯絡我們 | PANCREASaver® 助胰見®',
           '患者諮詢、醫療機構合作、健檢中心導入 — 聯絡仲智數位健康（PanCAD.ai），1–2 個工作天內回覆。',
           contact_body, contact_dict,
           hero_tag='h_tag', hero_title='h_title', hero_sub='h_sub')
print('PART4 DONE')
