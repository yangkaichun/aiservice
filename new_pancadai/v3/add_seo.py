#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""v3 SEO 批次：6 頁加入 OG / Twitter Card / canonical / JSON-LD"""
import re, json, os

V3 = '/Users/yangkaichun/Documents/GitHub/aiservice/new_pancadai/v3'
SITE = 'https://pancad.ai'

# 每頁 SEO 資料（中/英/日共用 canonical；og 用預設中文）
PAGES = {
    'index.html': {
        'title': '仲智數位健康 PanCAD.ai｜活出精彩 不胰憾 — PANCREASaver® 助胰見®',
        'desc': '仲智數位健康（PanCAD.ai）以台大團隊 AI 技術，打造全球唯一 TFDA 與 FDA 雙認證之胰臟癌 AI 輔助偵測醫材 PANCREASaver 助胰見®。活出精彩，不胰憾。',
        'img': 'assets/gate_patient.jpg',
    },
    'patient.html': {
        'title': '活出精彩 不胰憾 — 胰臟癌早期偵測旅程｜PANCREASaver® 助胰見®',
        'desc': '從日常到檢查、從發現到治療 — 跟著一段真實的旅程，看懂胰臟癌早期偵測為什麼重要。',
        'img': 'assets/hero_sun_picnic_safe.jpg',
    },
    'clinician.html': {
        'title': '醫療機構專區 — 臨床證據與導入方案｜PANCREASaver® 助胰見®',
        'desc': 'PANCREASaver® 助胰見®：<2cm 腫瘤敏感度 92.1%、全國 AUC 0.95、TFDA 與 FDA 雙認證、300+ 人次部署。',
        'img': 'assets/clinician_hero.jpg',
    },
    'about.html': {
        'title': '關於仲智數位健康 — 從台大實驗室到臨床｜PANCREASaver® 助胰見®',
        'desc': '仲智數位健康股份有限公司（PanCAD.ai）將台大團隊 AI 技術轉化為守護國人胰臟健康的醫療器材。',
        'img': 'assets/team_lab.jpg',
    },
    'news.html': {
        'title': '新聞消息 — 仲智數位健康｜PANCREASaver® 助胰見®',
        'desc': '仲智數位健康（PanCAD.ai）最新消息：專利佈局、醫療合作、病患衛教講座。',
        'img': 'assets/ai_reading.jpg',
    },
    'contact.html': {
        'title': '聯絡我們 — 仲智數位健康｜PANCREASaver® 助胰見®',
        'desc': '與仲智數位健康（PanCAD.ai）聯繫：病患諮詢、醫療機構合作、健檢中心導入。',
        'img': 'assets/ai_workstation.jpg',
    },
}

def build_meta(pagename, data):
    url = f"{SITE}/{pagename}" if pagename != 'index.html' else f"{SITE}/"
    img = f"{SITE}/{data['img']}"
    return f'''<!-- ===== SEO: Open Graph / Twitter / Canonical ===== -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="PanCAD.ai 仲智數位健康">
<meta property="og:title" content="{data['title']}">
<meta property="og:description" content="{data['desc']}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{img}">
<meta property="og:locale" content="zh_TW">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{data['title']}">
<meta name="twitter:description" content="{data['desc']}">
<meta name="twitter:image" content="{img}">
<link rel="canonical" href="{url}">
<!-- ===== END SEO ===== -->'''

# 各頁 JSON-LD
ORG_JSONLD = '''<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "MedicalOrganization",
  "name": "仲智數位健康股份有限公司",
  "alternateName": "PanCAD.ai",
  "url": "https://pancad.ai",
  "foundingDate": "2022-11-18",
  "medicalSpecialty": "Pancreatic cancer early detection",
  "description": "台灣自主研發之胰臟癌 AI 輔助偵測醫療器材 PANCREASaver 助胰見® 之開發商。"
}
</script>'''

for fn, data in PAGES.items():
    path = os.path.join(V3, fn)
    html = open(path, encoding='utf-8').read()
    if 'og:title' in html:
        print(f"SKIP (已有 OG): {fn}")
        continue
    meta_block = build_meta(fn, data)
    # 插到 </head> 前（在 i18n script 之前）
    insert_at = html.rfind('</head>')
    html = html[:insert_at] + meta_block + '\n' + html[insert_at:]
    # 非首頁加 Organization JSON-LD（首頁加完整版）
    jsonld = ORG_JSONLD
    if fn == 'index.html':
        jsonld = jsonld.replace('</script>', '''  ,
  "sameAs": ["https://www.facebook.com/pancadai", "https://www.linkedin.com/company/pancadai"]
}
</script>''')
    insert_at = html.rfind('</head>')
    html = html[:insert_at] + '\n' + jsonld + '\n' + html[insert_at:]
    open(path, 'w', encoding='utf-8').write(html)
    print(f"✅ SEO added: {fn}")

print("\n=== 完成 ===")
