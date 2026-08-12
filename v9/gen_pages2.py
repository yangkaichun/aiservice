#!/usr/bin/env python3
"""v9 內頁生成器 Part 2：patient / clinician / evidence / about / news / contact"""
import os
HERE = os.path.dirname(os.path.abspath(__file__))

NAV = open(os.path.join(HERE, 'product.html')).read().split('<!-- NAV -->')[1].split('</nav>')[0]
NAV = '<!-- NAV -->' + NAV + '</nav>'
FOOTER = open(os.path.join(HERE, 'product.html')).read().split('<!-- FOOTER -->')[1].split('</footer>')[0]
FOOTER = '<!-- FOOTER -->' + FOOTER + '</footer>'

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

# ============ patient.html（個案旅程 — 以個案為中心） ============
patient_body = '''
<section class="section-pad" style="background:linear-gradient(180deg,var(--night),var(--night2))">
  <div class="wrap">
    <div class="split-row">
      <div data-reveal="left">
        <span class="sec-tag" data-i18n="pt_tag">真實個案 · 已去識別化</span>
        <h2 class="sec-title" style="font-size:clamp(26px,3.6vw,42px)" data-i18n-html="pt_title">一位 60 歲女性的<span class="hl">腹部 CT</span></h2>
        <p class="sec-sub" data-i18n="pt_sub">她因例行健檢接受腹部 CT。左圖是原始影像，右圖是 PANCREASaver 判讀結果 — 橘色標記處，是 AI 在胰臟尾部發現的 1.2cm 早期病灶。</p>
        <div class="case-points">
          <div class="case-point" data-reveal style="--d:.1s"><div class="ic">🔍</div><div><b data-i18n="pp1_t">肉眼 vs AI</b><span data-i18n="pp1_d">病灶微小，常規判讀中容易被忽略</span></div></div>
          <div class="case-point" data-reveal style="--d:.2s"><div class="ic">⏱️</div><div><b data-i18n="pp2_t">關鍵時間差</b><span data-i18n="pp2_d">AI 在掃描完成後數分鐘內即完成判讀</span></div></div>
          <div class="case-point" data-reveal style="--d:.3s"><div class="ic">💛</div><div><b data-i18n="pp3_t">後續治療</b><span data-i18n="pp3_d">病灶在 <2cm 時被發現，手術成功，現已恢復正常生活</span></div></div>
        </div>
      </div>
      <div data-reveal="zoom" style="--d:.1s">
        <div class="ct-compare" id="ptCompare" aria-label="拖曳比較原始 CT 與 AI 判讀">
          <span class="cc-label org" data-i18n="cc_org">原始 CT</span>
          <span class="cc-label seg" data-i18n="cc_seg">PANCREASaver 判讀</span>
          <div class="cc-scan" aria-hidden="true"></div>
          <img src="assets/cases/ct_org_card.jpg" alt="原始腹部 CT" width="1100" height="511" loading="lazy">
          <div class="seg-layer"><img src="assets/cases/ct_seg_card.jpg" alt="PANCREASaver AI 判讀 CT" width="1100" height="511" loading="lazy"></div>
          <div class="divider" style="left:50%"><span class="handle">⇄</span></div>
          <div class="cc-reticle" aria-hidden="true"></div>
        </div>
        <p class="cc-hint" style="text-align:center;margin-top:12px;color:var(--paper-dim);font-size:13.5px" data-i18n="pt_hint">拖曳滑桿，比較原始影像與 AI 判讀</p>
      </div>
    </div>
  </div>
</section>

<section class="section-pad">
  <div class="wrap">
    <div style="text-align:center;margin-bottom:20px">
      <span class="sec-tag" style="justify-content:center" data-reveal data-i18n="ptq_tag">常見問題</span>
      <h2 class="sec-title" data-reveal style="--d:.1s" data-i18n-html="ptq_title">您可能想問的<span class="hl">問題</span></h2>
    </div>
    <div class="faq">
      <div class="faq-item" data-reveal>
        <button class="faq-q"><span data-i18n="q1_t">AI 會取代醫師嗎？</span><span class="fx">+</span></button>
        <div class="faq-a"><p data-i18n="q1_d">不會。PANCREASaver 是「輔助偵測」系統 — 最終判讀與診斷永遠由醫師決定。AI 的任務是幫醫師找到可能被忽略的病灶，讓醫師的專業發揮在最重要的地方。</p></div>
      </div>
      <div class="faq-item" data-reveal>
        <button class="faq-q"><span data-i18n="q2_t">檢查流程會變複雜嗎？</span><span class="fx">+</span></button>
        <div class="faq-a"><p data-i18n="q2_d">完全不會。病患只需照平常方式接受 CT 檢查，PANCREASaver 在背景自動運作，病患與醫師都不需要額外操作。</p></div>
      </div>
      <div class="faq-item" data-reveal>
        <button class="faq-q"><span data-i18n="q3_t">我要怎麼知道檢查醫院有沒有這套系統？</span><span class="fx">+</span></button>
        <div class="faq-a"><p data-i18n="q3_d">可以直接詢問檢查機構，或透過本網站「聯絡我們」留下資訊，我們會協助確認可提供服務的院所。</p></div>
      </div>
      <div class="faq-item" data-reveal>
        <button class="faq-q"><span data-i18n="q4_t">AI 判讀結果準確嗎？</span><span class="fx">+</span></button>
        <div class="faq-a"><p data-i18n="q4_d">&lt;2cm 病灶偵測敏感度 92.1%，全國 1,473 例驗證 AUC 0.95，並獲得 TFDA 醫療器材許可與 FDA Breakthrough 資格。所有數據均來自真實臨床研究。</p></div>
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
    <h2 data-reveal data-i18n-html="ptcta_title">早一點發現，<span class="hl">多一種可能</span>。</h2>
    <p data-reveal style="--d:.1s" data-i18n="ptcta_sub">有任何疑問，歡迎與我們聯絡。</p>
    <div class="btn-ctas" data-reveal style="--d:.2s">
      <a class="btn btn-primary" href="contact.html" data-i18n-html="ptcta_btn">預約諮詢 <span class="ico">→</span></a>
    </div>
  </div>
</section>
'''

patient_dict = '''/* v9 patient 字典 */
window.PANCAD_I18N = window.PANCAD_I18N || { zh: {}, en: {}, ja: {} };
Object.assign(window.PANCAD_I18N.zh, {
  pt_tag: '真實個案 · 已去識別化', pt_title: '一位 60 歲女性的<span class="hl">腹部 CT</span>',
  pt_sub: '她因例行健檢接受腹部 CT。左圖是原始影像，右圖是 PANCREASaver 判讀結果 — 橘色標記處，是 AI 在胰臟尾部發現的 1.2cm 早期病灶。',
  pp1_t: '肉眼 vs AI', pp1_d: '病灶微小，常規判讀中容易被忽略',
  pp2_t: '關鍵時間差', pp2_d: 'AI 在掃描完成後數分鐘內即完成判讀',
  pp3_t: '後續治療', pp3_d: '病灶在 <2cm 時被發現，手術成功，現已恢復正常生活',
  pt_hint: '拖曳滑桿，比較原始影像與 AI 判讀',
  ptq_tag: '常見問題', ptq_title: '您可能想問的<span class="hl">問題</span>',
  q1_t: 'AI 會取代醫師嗎？', q1_d: '不會。PANCREASaver 是「輔助偵測」系統 — 最終判讀與診斷永遠由醫師決定。AI 的任務是幫醫師找到可能被忽略的病灶，讓醫師的專業發揮在最重要的地方。',
  q2_t: '檢查流程會變複雜嗎？', q2_d: '完全不會。病患只需照平常方式接受 CT 檢查，PANCREASaver 在背景自動運作，病患與醫師都不需要額外操作。',
  q3_t: '我要怎麼知道檢查醫院有沒有這套系統？', q3_d: '可以直接詢問檢查機構，或透過本網站「聯絡我們」留下資訊，我們會協助確認可提供服務的院所。',
  q4_t: 'AI 判讀結果準確嗎？', q4_d: '<2cm 病灶偵測敏感度 92.1%，全國 1,473 例驗證 AUC 0.95，並獲得 TFDA 醫療器材許可與 FDA Breakthrough 資格。所有數據均來自真實臨床研究。',
  ptcta_title: '早一點發現，<span class="hl">多一種可能</span>。',
  ptcta_sub: '有任何疑問，歡迎與我們聯絡。',
  ptcta_btn: '預約諮詢 <span class="ico">→</span>',
  h_tag: '個案旅程', h_title: '每一張 CT 背後，<span class="hl">都是一個人生</span>。',
  h_sub: '以真實個案為中心 — 看看 AI 如何在數百張切片中，找到那一線生機。',
});
Object.assign(window.PANCAD_I18N.en, {
  pt_tag: 'Real case · de-identified', pt_title: 'An abdominal CT of a <span class="hl">60-year-old woman</span>',
  pt_sub: 'She had a routine screening CT. Left: the original image. Right: the PANCREASaver read — the orange mark is a 1.2cm early lesion AI found in the pancreatic tail.',
  pp1_t: 'Naked eye vs AI', pp1_d: 'A tiny lesion, easy to miss in a routine read',
  pp2_t: 'Critical head start', pp2_d: 'AI finishes reading within minutes of the scan',
  pp3_t: 'What came next', pp3_d: 'Found at <2cm, surgery was successful — she is back to normal life',
  pt_hint: 'Drag the slider to compare the original and the AI read',
  ptq_tag: 'FAQ', ptq_title: 'Questions you <span class="hl">might ask</span>',
  q1_t: 'Will AI replace doctors?', q1_d: 'No. PANCREASaver is an assistive detection system — the final read and diagnosis always remain with the physician. AI\'s job is to surface lesions that might be missed, so the doctor\'s expertise goes where it matters most.',
  q2_t: 'Does it complicate the exam?', q2_d: 'Not at all. Patients simply undergo a routine CT. PANCREASaver works silently in the background — no extra steps for patients or physicians.',
  q3_t: 'How do I know if a hospital has it?', q3_d: 'Ask the imaging facility directly, or leave your details via the Contact page — we will help confirm which sites offer the service.',
  q4_t: 'Is the AI accurate?', q4_d: '92.1% sensitivity for <2cm lesions, AUC 0.95 across 1,473 national cases, TFDA medical device license and FDA Breakthrough designation. Every number comes from real clinical research.',
  ptcta_title: 'Earlier detection, <span class="hl">more possibilities</span>.',
  ptcta_sub: 'Have questions? We\'d love to talk.',
  ptcta_btn: 'Book a consultation <span class="ico">→</span>',
  h_tag: 'Patient journey', h_title: 'Behind every CT scan, <span class="hl">a life</span>.',
  h_sub: 'Case-centered — see how AI finds that thread of hope across hundreds of slices.',
});
Object.assign(window.PANCAD_I18N.ja, {
  pt_tag: '実際の症例 · 匿名化済み', pt_title: '60代女性の<span class="hl">腹部CT</span>',
  pt_sub: '定期健診で腹部CTを受けました。左が元画像、右がPANCREASaverの読影結果 — オレンジのマークは、AIが膵尾部で見つけた1.2cmの早期病変です。',
  pp1_t: '肉眼 vs AI', pp1_d: '微細な病変は通常読影で見落とされやすい',
  pp2_t: '決定的な時間差', pp2_d: 'AIはスキャン完了後数分で読影を完了',
  pp3_t: 'その後の治療', pp3_d: '<2cmで発見、手術は成功し、現在は普通の生活に戻っています',
  pt_hint: 'スライダーをドラッグして元画像とAI読影を比較',
  ptq_tag: 'よくある質問', ptq_title: '知りたい<span class="hl">質問</span>',
  q1_t: 'AIは医師を代替しますか？', q1_d: 'いいえ。PANCREASaverは「補助検出」システムです — 最終的な読影と診断は常に医師が行います。AIの役割は見逃されがちな病変を浮かび上がらせ、医師の専門性が最も重要に働く場所を支えることです。',
  q2_t: '検査は複雑になりますか？', q2_d: 'まったくありません。患者は通常通りCTを受けるだけ。PANCREASaverはバックグラウンドで自動動作し、患者にも医師にも追加操作は不要です。',
  q3_t: 'このシステムがある病院はどうやって知れますか？', q3_d: '検査機関に直接お問い合わせいただくか、お問い合わせページからご連絡ください。対応可能な医療機関をご案内します。',
  q4_t: 'AIの精度は？', q4_d: '<2cm病変の検出感度92.1%、全国1,473例の検証AUC 0.95、TFDA医療機器認可とFDA Breakthrough指定を取得。すべて実際の臨床研究に基づいています。',
  ptcta_title: '早く見つければ、<span class="hl">可能性は広がる</span>。',
  ptcta_sub: 'ご質問があれば、お気軽にご連絡ください。',
  ptcta_btn: '相談を予約 <span class="ico">→</span>',
  h_tag: '患者の旅', h_title: 'すべてのCTの背後に、<span class="hl">一つの人生</span>。',
  h_sub: '実際の症例中心 — 数百枚のスライスの中から、AIが希望の糸を見つけるまで。',
});
'''

build_page('patient', 'PANCREASaver® 助胰見® — 個案旅程 | 仲智數位健康 PanCAD.ai',
           '以真實個案為中心：60 歲女性例行健檢 CT，AI 在胰臟尾部發現 1.2cm 早期病灶 — 早期發現，活出精彩。',
           patient_body, patient_dict,
           hero_tag='h_tag', hero_title='h_title', hero_sub='h_sub')
print('PART2 DONE')
